# 🚀 Guide de Déploiement Serveur SWIGS

**Documentation complète pour le déploiement et la maintenance des sites SWIGS**

---

## 📋 Table des Matières

1. [Informations Serveur](#informations-serveur)
2. [Architecture des Dossiers](#architecture-des-dossiers)
3. [Sites en Production](#sites-en-production)
4. [Commandes de Déploiement par Site](#commandes-de-déploiement-par-site)
5. [Services PM2](#services-pm2)
6. [Configuration Nginx](#configuration-nginx)
7. [CORS et Variables d'Environnement](#cors-et-variables-denvironnement)
8. [Procédures de Maintenance](#procédures-de-maintenance)

---

## 🖥️ Informations Serveur

### Serveur Principal

| Propriété | Valeur |
|-----------|--------|
| **Hostname** | `sw4c-6` |
| **IP** | `192.168.110.73` |
| **User** | `swigs` |
| **OS** | Ubuntu 22.04 LTS |
| **Connexion SSH** | `ssh swigs@192.168.110.73` |

### Services Actifs

| Service | Port | Statut |
|---------|------|--------|
| **Nginx** | 80, 443 | Actif |
| **MongoDB** | 27017 | Actif |
| **Redis** | 6379 | Actif |
| **PM2** | - | 3 processus |

---

## 📁 Architecture des Dossiers

### Dossiers Sources (Repos Git)

```
/home/swigs/
├── swigs-apps/                          # Applications principales
│   ├── swigs-cms-backend/               # ⭐ Backend API (Port 3000)
│   ├── swigs-cms-admin/                 # Admin V1
│   ├── swigs-cms-admin-v2/              # Admin V2
│   ├── swigs-monitoring-api/            # Monitoring API (Port 3001)
│   ├── swigs-monitoring-agent/          # Agent de monitoring
│   ├── swigs-control-center/            # Control Center
│   ├── swigs-website/                   # Site SWIGS principal
│   ├── buffet-de-la-gare-website/       # Site Buffet de la Gare
│   ├── agence-web-premium/              # Site Moontain Studio
│   ├── gtsalpina-website/               # Site GTS Alpina
│   ├── selfnodes-website/               # Site SelfNodes
│   └── sites/                           # Sous-dossier sites
│       ├── gitedelodze/                 # Site Gîte de Lodze
│       ├── adlr-website/                # Site ADLR
│       ├── moontain-digital/            # Moontain Digital
│       └── ...
│
├── websites/                            # Dossier alternatif
│   ├── speed-l/                         # ⚠️ Site Speed-L (chemin spécial!)
│   └── swigswebsite/                    # Backup SWIGS
```

### Dossiers de Déploiement (Builds)

```
/var/www/
├── admin/                               # Admin V1 + V2
│   └── v2/                              # Admin V2
├── monitoring/                          # Control Center
├── speed-l/                             # Site Speed-L
├── buffet-de-la-gare/                   # Site Buffet de la Gare
├── gite-lodze/                          # Site Gîte de Lodze
├── agence-web-premium/                  # Site Moontain Studio
├── moontain-digital/                    # Moontain Digital
├── gtsalpina/                           # Site GTS Alpina
├── selfnodes/                           # Site SelfNodes
├── swigswebsite/                        # Site SWIGS principal
├── control-center/                      # Control Center
├── adlr/                                # Site ADLR
└── uploads/                             # Médias (isolés par site)
    ├── speed-l/
    ├── buffet/
    ├── gite-lodze/
    ├── selfnodes/
    └── ...
```

### Configurations Nginx

```
/etc/nginx/sites-available/
├── admin                                # admin.swigs.online
├── swigs.online                         # API + Uploads
├── swigs.ch                             # Site SWIGS principal
├── speed-l.ch                           # Site Speed-L
├── buffetdelagarechezclaude.ch          # Site Buffet
├── gitedelodze.ch                       # Site Gîte de Lodze
├── moontain-digital.ch                  # Moontain Digital
├── moontain-studio.ch                   # Moontain Studio
├── gtsalpina.swigs.online               # GTS Alpina
├── selfnodes.com                        # SelfNodes
├── monitoring.swigs.online              # Control Center
└── adlr.swigs.online                    # ADLR
```

---

## 🌐 Sites en Production

### Tableau Récapitulatif

| Site | Domaine | Dossier Source | Dossier Build | Slug |
|------|---------|----------------|---------------|------|
| **SWIGS** | swigs.ch | `~/swigs-apps/swigs-website` | `/var/www/swigswebsite` | `swigs` |
| **Speed-L** | speed-l.ch | `~/websites/speed-l` ⚠️ | `/var/www/speed-l` | `speed-l` |
| **Buffet de la Gare** | buffetdelagarechezclaude.ch | `~/swigs-apps/buffet-de-la-gare-website` | `/var/www/buffet-de-la-gare` | `buffet` |
| **Gîte de Lodze** | gitedelodze.ch | `~/swigs-apps/sites/gitedelodze` | `/var/www/gite-lodze` | `gite-lodze` |
| **Moontain Studio** | moontain-studio.ch | `~/swigs-apps/agence-web-premium` | `/var/www/agence-web-premium` | `moontain-studio` |
| **Moontain Digital** | moontain-digital.ch | `~/swigs-apps/sites/moontain-digital` | `/var/www/moontain-digital` | `moontain-digital` |
| **GTS Alpina** | gtsalpina.swigs.online | `~/swigs-apps/gtsalpina-website` | `/var/www/gtsalpina` | `gtsalpina` |
| **SelfNodes** | selfnodes.com | `~/swigs-apps/selfnodes-website` | `/var/www/selfnodes` | `selfnodes` |
| **ADLR** | adlr.swigs.online | `~/swigs-apps/sites/adlr-website` | `/var/www/adlr` | `adlr` |
| **Admin** | admin.swigs.online | `~/swigs-apps/swigs-cms-admin` | `/var/www/admin` | - |
| **Admin V2** | admin.swigs.online/v2/ | `~/swigs-apps/swigs-cms-admin-v2` | `/var/www/admin/v2` | - |
| **Control Center** | monitoring.swigs.online | `~/swigs-apps/swigs-control-center` | `/var/www/monitoring` | - |

---

## 🔧 Commandes de Déploiement par Site

### ⚠️ RÈGLE IMPORTANTE

**Toujours exécuter ces commandes dans l'ordre :**
1. `git pull origin main`
2. `npm install` (si package.json modifié)
3. `npm run build`
4. `sudo cp -r dist/* /var/www/[site]/`

---

### 🔴 Backend CMS (CRITIQUE)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-cms-backend
git pull origin main
npm install
pm2 restart swigs-cms-backend
pm2 logs swigs-cms-backend --lines 50
```

**Vérification :**
```bash
curl http://localhost:3000/api/health
```

---

### 🟠 Admin V1

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-cms-admin
git pull origin main
npm install
npm run build
sudo rm -rf /var/www/admin/*
sudo cp -r dist/* /var/www/admin/
```

---

### 🟠 Admin V2

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-cms-admin-v2
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/admin/v2/
```

---

### 🟢 Site SWIGS (swigs.ch)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-website
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/swigswebsite/
```

---

### 🟢 Site Speed-L (speed-l.ch)

⚠️ **ATTENTION : Chemin différent !**

```bash
ssh swigs@192.168.110.73
cd ~/websites/speed-l              # ⚠️ PAS ~/swigs-apps/ !
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/speed-l/
```

---

### 🟢 Site Buffet de la Gare (buffetdelagarechezclaude.ch)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/buffet-de-la-gare-website
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/buffet-de-la-gare/
```

---

### 🟢 Site Gîte de Lodze (gitedelodze.ch)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/sites/gitedelodze
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/gite-lodze/
```

---

### 🟢 Site Moontain Studio (moontain-studio.ch)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/agence-web-premium
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/agence-web-premium/
```

---

### 🟢 Site GTS Alpina (gtsalpina.swigs.online)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/gtsalpina-website
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/gtsalpina/
```

---

### 🟢 Site SelfNodes (selfnodes.com)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/selfnodes-website
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/selfnodes/
```

---

### 🟢 Site ADLR (adlr.swigs.online)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/sites/adlr-website
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/adlr/
```

---

### 🟣 Control Center (monitoring.swigs.online)

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-control-center
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/monitoring/
```

---

### 🟣 Monitoring API

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-monitoring-api
git pull origin main
npm install
pm2 restart swigs-monitoring-api
pm2 logs swigs-monitoring-api --lines 20
```

---

## ⚙️ Services PM2

### Liste des Services

```bash
pm2 list
```

| ID | Nom | Port | Description |
|----|-----|------|-------------|
| 0 | `swigs-cms-backend` | 3000 | API Backend principale |
| 1 | `swigs-monitoring-api` | 3001 | API Monitoring |
| 2 | `swigs-monitoring-agent` | - | Agent de collecte métriques |

### Commandes PM2 Utiles

```bash
# Voir les logs
pm2 logs swigs-cms-backend --lines 50

# Redémarrer un service
pm2 restart swigs-cms-backend

# Voir le statut
pm2 status

# Voir les métriques
pm2 monit

# Sauvegarder la config PM2
pm2 save

# Démarrer au boot
pm2 startup
```

---

## 🌐 Configuration Nginx

### Template de Configuration Site

```nginx
server {
    server_name www.example.ch example.ch;
    root /var/www/example;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/example.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.ch/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = example.ch) {
        return 301 https://$host$request_uri;
    }
    if ($host = www.example.ch) {
        return 301 https://$host$request_uri;
    }
    server_name www.example.ch example.ch;
    listen 80;
    return 404;
}
```

### Configuration API (swigs.online)

```nginx
server {
    server_name swigs.online;
    
    # Proxy pour l'API backend
    location /api/ {
        client_max_body_size 100M;
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Servir les fichiers uploadés
    location /uploads/ {
        alias /var/www/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
}
```

### Commandes Nginx

```bash
# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo nginx -s reload

# Redémarrer Nginx
sudo systemctl restart nginx

# Voir les logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Créer un nouveau site
sudo nano /etc/nginx/sites-available/nouveau-site.ch
sudo ln -s /etc/nginx/sites-available/nouveau-site.ch /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

# SSL avec Certbot
sudo certbot --nginx -d nouveau-site.ch -d www.nouveau-site.ch
```

---

## 🔐 CORS et Variables d'Environnement

### CORS Configuration (Backend)

**Fichier :** `~/swigs-apps/swigs-cms-backend/.env`

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,https://admin.swigs.online,https://monitoring.swigs.online,https://www.speed-l.ch,https://speed-l.ch,https://buffetdelagarechezclaude.ch,https://www.buffetdelagarechezclaude.ch,https://moontain-studio.ch,https://www.moontain-studio.ch,https://www.gitedelodze.ch,https://gitedelodze.ch,https://speedl.swigs.online,https://gtsalpina.swigs.online,https://control.swigs.online,https://www.selfnodes.com,https://selfnodes.com,https://gtsalpina.ch,https://www.gtsalpina.ch,https://swigs.ch,https://www.swigs.ch,https://adlr.swigs.online
```

### ⚠️ Ajouter un Nouveau Domaine au CORS

```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-cms-backend
nano .env
# Ajouter le domaine à CORS_ORIGIN (séparé par virgule)
pm2 restart swigs-cms-backend
```

### Variables d'Environnement Sites Frontend

**Fichier :** `.env.production` (dans chaque site)

```env
VITE_API_URL=https://swigs.online/api
```

⚠️ **IMPORTANT :** Toujours utiliser `https://swigs.online/api`, jamais un autre domaine !

---

## 🛠️ Procédures de Maintenance

### Backup MongoDB

```bash
ssh swigs@192.168.110.73
mongodump --db swigs-cms --out ~/backups/$(date +%Y%m%d)
```

### Restaurer MongoDB

```bash
mongorestore --db swigs-cms ~/backups/20250128/swigs-cms
```

### Vérifier l'Espace Disque

```bash
df -h
du -sh /var/www/*
du -sh ~/swigs-apps/*
```

### Nettoyer les Logs PM2

```bash
pm2 flush
```

### Mettre à Jour Node.js

```bash
# Utiliser nvm
nvm install 20
nvm use 20
nvm alias default 20
```

### Renouveler les Certificats SSL

```bash
sudo certbot renew --dry-run  # Test
sudo certbot renew            # Renouvellement
```

---

## 🚨 Dépannage

### Site ne se met pas à jour

1. Vérifier que le build a été copié :
   ```bash
   ls -lh /var/www/[site]/assets/*.js | head -1
   ```
2. Vider le cache navigateur : `Ctrl+Shift+R`
3. Vérifier les logs Nginx :
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

### Erreur CORS

1. Vérifier que le domaine est dans `CORS_ORIGIN`
2. Redémarrer le backend :
   ```bash
   pm2 restart swigs-cms-backend
   ```

### API ne répond pas

1. Vérifier PM2 :
   ```bash
   pm2 status
   pm2 logs swigs-cms-backend --lines 50
   ```
2. Redémarrer :
   ```bash
   pm2 restart swigs-cms-backend
   ```

### Site appelle localhost au lieu de l'API

1. Vérifier `.env.production` :
   ```bash
   cat ~/swigs-apps/[site]/.env.production
   ```
2. Doit contenir : `VITE_API_URL=https://swigs.online/api`
3. Rebuild et redéployer

---

## 📝 Checklist Nouveau Site

- [ ] Créer le site dans l'Admin (slug simple)
- [ ] Cloner le repo sur le serveur
- [ ] Créer `.env.production` avec `VITE_API_URL=https://swigs.online/api`
- [ ] `npm install && npm run build`
- [ ] Créer le dossier `/var/www/[site]`
- [ ] Copier le build
- [ ] Créer la config Nginx
- [ ] Activer le site (`ln -s`)
- [ ] Tester Nginx (`nginx -t`)
- [ ] Recharger Nginx
- [ ] Générer le certificat SSL (Certbot)
- [ ] Ajouter le domaine au CORS du backend
- [ ] Redémarrer le backend
- [ ] Tester le site

---

**📝 Dernière mise à jour : Janvier 2026**
**🔒 Production - NO BREAKING CHANGES**
