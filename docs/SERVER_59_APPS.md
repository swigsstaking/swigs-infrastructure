# 🖥️ Serveur .59 - Apps & Backups

**Documentation du serveur secondaire SWIGS**

> Ce serveur héberge les **applications standalone** et les **backups** du serveur principal (.73)

---

## 📋 Informations Générales

| Élément | Valeur |
|---------|--------|
| **IP** | `192.168.110.59` |
| **Utilisateur** | `swigs` |
| **OS** | Ubuntu 22.04 LTS |
| **Rôle** | Apps standalone + Backups |

## 🔗 Connexion

```bash
ssh swigs@192.168.110.59
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Serveur .59                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Apps Standalone │  │    Backups      │                  │
│  ├─────────────────┤  ├─────────────────┤                  │
│  │ • swigs-task    │  │ • MongoDB .73   │                  │
│  │ • [future apps] │  │ • Uploads .73   │                  │
│  │                 │  │ • Configs .73   │                  │
│  └────────┬────────┘  └─────────────────┘                  │
│           │                                                 │
│  ┌────────▼────────┐  ┌─────────────────┐                  │
│  │    MongoDB      │  │     Nginx       │                  │
│  │   (local)       │  │   + SSL         │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │                    PM2                          │       │
│  │  Gestion des processus Node.js                  │       │
│  └─────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure des Dossiers

```
/home/swigs/
├── apps/                      # Applications standalone
│   ├── swigs-task/           # App de gestion de tâches
│   └── [future-app]/         # Futures applications
│
├── backups/                   # Backups du serveur .73
│   ├── mongodb/
│   │   ├── daily/            # 7 jours
│   │   ├── weekly/           # 4 semaines
│   │   └── monthly/          # 3 mois
│   ├── uploads/
│   │   ├── daily/
│   │   ├── weekly/
│   │   └── monthly/
│   └── configs/
│       └── daily/
│
└── logs/                      # Logs divers
```

---

## 🚀 Applications Déployées

### swigs-task (exemple)

| Élément | Valeur |
|---------|--------|
| **Chemin** | `~/apps/swigs-task` |
| **Port** | `3100` |
| **PM2 Name** | `swigs-task` |
| **URL** | `https://task.swigs.online` |
| **Database** | `mongodb://localhost:27017/swigs-task` |

---

## 🔧 Services Installés

### Node.js
```bash
node --version  # v20.x
npm --version   # 10.x
```

### MongoDB
```bash
# Status
sudo systemctl status mongod

# Accès
mongosh

# Voir les bases
show dbs
```

### Nginx
```bash
# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Logs
sudo tail -f /var/log/nginx/error.log
```

### PM2
```bash
# Liste des processus
pm2 list

# Logs
pm2 logs [app-name]

# Restart
pm2 restart [app-name]

# Monitoring
pm2 monit
```

### Certbot (SSL)
```bash
# Nouveau certificat
sudo certbot --nginx -d mon-app.swigs.online

# Renouvellement (automatique via cron)
sudo certbot renew --dry-run
```

---

## 📊 Ports Utilisés

| Port | Application | Status |
|------|-------------|--------|
| 22 | SSH | ✅ Actif |
| 80 | Nginx HTTP | ✅ Actif |
| 443 | Nginx HTTPS | ✅ Actif |
| 27017 | MongoDB | ✅ Actif |
| 3100 | swigs-task | ✅ Réservé |
| 3101-3199 | Apps futures | 🔓 Disponible |

**Convention** : Utiliser les ports `31XX` pour les apps standalone.

---

## 🆕 Déployer une Nouvelle App

### 1. Préparer l'app localement

```bash
# Structure minimale
mon-app/
├── server.js (ou backend/)
├── package.json
├── .env.example
└── README.md
```

### 2. Push sur GitHub

```bash
git init
git add -A
git commit -m "feat: Initial commit"
git remote add origin git@github.com:swigsstaking/mon-app.git
git push -u origin main
```

### 3. Déployer sur .59

```bash
# Connexion
ssh swigs@192.168.110.59

# Cloner
cd ~/apps
git clone git@github.com:swigsstaking/mon-app.git
cd mon-app

# Configurer
cp .env.example .env
nano .env  # Éditer les variables

# Installer
npm install

# Démarrer avec PM2
pm2 start server.js --name mon-app
pm2 save
```

### 4. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/mon-app.swigs.online
```

```nginx
server {
    listen 80;
    server_name mon-app.swigs.online;

    location / {
        proxy_pass http://localhost:31XX;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer
sudo ln -s /etc/nginx/sites-available/mon-app.swigs.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL avec Certbot

```bash
sudo certbot --nginx -d mon-app.swigs.online
```

### 6. Vérifier

```bash
# Test local
curl http://localhost:31XX/api/health

# Test public
curl https://mon-app.swigs.online/api/health
```

---

## 🔄 Mise à Jour d'une App

```bash
ssh swigs@192.168.110.59
cd ~/apps/mon-app
git pull origin main
npm install
pm2 restart mon-app
```

---

## 💾 Système de Backups

Le serveur .59 reçoit les backups du serveur .73 chaque nuit à 3h.

### Contenu des Backups

| Type | Fréquence | Rétention |
|------|-----------|-----------|
| **MongoDB** | Quotidien | 7 jours |
| **MongoDB** | Hebdo (dimanche) | 4 semaines |
| **MongoDB** | Mensuel (1er) | 3 mois |
| **Uploads** | Quotidien (rsync) | Miroir |
| **Configs** | Quotidien | 7 jours |

### Vérifier les Backups

```bash
# Taille totale
du -sh ~/backups/

# Derniers backups MongoDB
ls -la ~/backups/mongodb/daily/

# Derniers backups configs
ls -la ~/backups/configs/daily/
```

### Restaurer un Backup MongoDB

```bash
# Décompresser
cd ~/backups/mongodb/daily/
tar -xzf mongodump-YYYY-MM-DD_HH-MM-SS.tar.gz

# Restaurer
mongorestore --db swigs-cms mongodump-YYYY-MM-DD_HH-MM-SS/swigs-cms/
```

---

## 🗄️ MongoDB Local

Le serveur .59 a sa propre instance MongoDB pour les apps standalone.

### Créer une Base pour une App

```bash
mongosh

# Créer/utiliser une base
use mon-app

# Créer un utilisateur (optionnel)
db.createUser({
  user: "mon-app",
  pwd: "password-secure",
  roles: [{ role: "readWrite", db: "mon-app" }]
})
```

### Backup Manuel

```bash
mongodump --db mon-app --out ~/backups/apps/
```

---

## 📧 Configuration SMTP

Pour les apps qui envoient des emails, utiliser les credentials SWIGS :

```env
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mail@swigs.online
SMTP_PASS=Swigs.online1
```

---

## 🔐 Sécurité

### Firewall (UFW)

```bash
sudo ufw status

# Ports ouverts :
# 22 (SSH)
# 80 (HTTP)
# 443 (HTTPS)
```

### Fail2ban

```bash
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

---

## 📊 Monitoring

### Ressources Système

```bash
# CPU et RAM
htop

# Disque
df -h

# Processus Node
pm2 monit
```

### Logs

```bash
# PM2
pm2 logs

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB
sudo tail -f /var/log/mongodb/mongod.log
```

---

## 🆘 Dépannage

### App ne démarre pas

```bash
# Vérifier les logs
pm2 logs mon-app --lines 100

# Vérifier le port
lsof -i :31XX

# Redémarrer
pm2 restart mon-app
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que l'app tourne
pm2 list

# Vérifier le port dans Nginx
cat /etc/nginx/sites-available/mon-app.swigs.online | grep proxy_pass

# Tester localement
curl http://localhost:31XX/api/health
```

### MongoDB ne répond pas

```bash
# Status
sudo systemctl status mongod

# Redémarrer
sudo systemctl restart mongod

# Logs
sudo tail -f /var/log/mongodb/mongod.log
```

---

## ✅ Checklist Nouvelle App

- [ ] Code testé en local
- [ ] `.env.example` créé
- [ ] Push sur GitHub
- [ ] Cloner sur .59 dans `~/apps/`
- [ ] `.env` configuré
- [ ] `npm install`
- [ ] PM2 démarré (`pm2 start`)
- [ ] PM2 sauvegardé (`pm2 save`)
- [ ] Nginx configuré
- [ ] Nginx activé (symlink)
- [ ] SSL activé (certbot)
- [ ] Test URL publique

---

**📝 Version : 1.0 - Janvier 2026**
