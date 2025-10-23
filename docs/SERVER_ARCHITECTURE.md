# 🖥️ Architecture Serveur SWIGS

Documentation complète de l'architecture serveur et des chemins de déploiement.

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Structure des Dossiers](#structure-des-dossiers)
3. [Services PM2](#services-pm2)
4. [Configuration Nginx](#configuration-nginx)
5. [Déploiement](#déploiement)
6. [Maintenance](#maintenance)

---

## 🎯 Vue d'Ensemble

### Serveur Principal

- **Hostname** : `sw4c-6`
- **User** : `swigs`
- **OS** : Ubuntu
- **Services** : Nginx, PM2, MongoDB, Redis

### URLs de Production

| Service | URL | Chemin Serveur |
|---------|-----|----------------|
| **CMS Admin** | https://admin.swigs.online | `/var/www/admin` |
| **Control Center** | https://monitoring.swigs.online | `/var/www/monitoring` |
| **Speed-L** | https://speed-l.swigs.online | `/var/www/speed-l` |
| **Buffet de la Gare** | https://buffet-de-la-gare.swigs.online | `/var/www/buffet-de-la-gare` |

---

## 📁 Structure des Dossiers

### Applications (~/swigs-apps)

```
/home/swigs/swigs-apps/
├── swigs-cms-backend/          # Backend API (Port 3000)
├── swigs-cms-admin/            # Admin Dashboard
├── swigs-monitoring-api/       # Monitoring API (Port 3001)
├── swigs-control-center/       # Control Center Dashboard
├── speedl-website/             # Site Speed-L
├── buffet-de-la-gare-website/  # Site Buffet de la Gare
└── [autres-sites]/             # Futurs sites
```

### Sites Web (/var/www)

```
/var/www/
├── admin/                      # CMS Admin (build de swigs-cms-admin)
├── monitoring/                 # Control Center (build de swigs-control-center)
├── speed-l/                    # Site Speed-L (build de speedl-website)
├── buffet-de-la-gare/         # Site Buffet de la Gare
└── [autres-sites]/            # Futurs sites
```

### Configuration Nginx

```
/etc/nginx/
├── sites-available/
│   ├── admin                   # Config CMS Admin
│   ├── swigs-admin            # Ancienne config (à vérifier)
│   ├── monitoring             # Config Control Center
│   ├── speed-l                # Config Speed-L
│   ├── buffet-de-la-gare.swigs.online  # Config Buffet de la Gare
│   └── [autres-sites]
└── sites-enabled/
    └── [liens symboliques vers sites-available]
```

### Logs

```
/var/log/nginx/
├── admin-access.log
├── admin-error.log
├── monitoring-access.log
├── monitoring-error.log
├── speed-l.access.log
├── speed-l.error.log
├── buffet-de-la-gare.access.log
├── buffet-de-la-gare.error.log
└── [autres-sites].log
```

---

## 🔧 Services PM2

### Liste des Services

```bash
pm2 list
```

| Nom | Script | Port | Status |
|-----|--------|------|--------|
| swigs-cms-backend | ~/swigs-apps/swigs-cms-backend/src/server.js | 3000 | online |
| swigs-monitoring-api | ~/swigs-apps/swigs-monitoring-api/src/server.js | 3001 | online |

### Commandes PM2

```bash
# Voir tous les services
pm2 list

# Logs d'un service
pm2 logs swigs-cms-backend
pm2 logs swigs-monitoring-api

# Redémarrer un service
pm2 restart swigs-cms-backend
pm2 restart swigs-monitoring-api

# Arrêter/Démarrer
pm2 stop swigs-cms-backend
pm2 start swigs-cms-backend

# Sauvegarder la config PM2
pm2 save

# Recharger tous les services
pm2 reload all
```

---

## 🌐 Configuration Nginx

### CMS Admin (admin.swigs.online)

**Fichier** : `/etc/nginx/sites-available/admin`

**Chemin web** : `/var/www/admin`

**Caractéristiques** :
- Proxy vers API backend (localhost:3000)
- SPA routing (try_files vers index.html)
- Cache des assets statiques
- SSL via Let's Encrypt

**Config importante** :
```nginx
server_name admin.swigs.online;
root /var/www/admin;

location /api/ {
    proxy_pass http://localhost:3000/api/;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

### Control Center (monitoring.swigs.online)

**Fichier** : `/etc/nginx/sites-available/monitoring`

**Chemin web** : `/var/www/monitoring`

**Caractéristiques** :
- Proxy vers Monitoring API (localhost:3001)
- WebSocket support pour temps réel
- SPA routing

### Sites Web (exemple: buffet-de-la-gare.swigs.online)

**Fichier** : `/etc/nginx/sites-available/buffet-de-la-gare.swigs.online`

**Chemin web** : `/var/www/buffet-de-la-gare`

**Caractéristiques** :
- Site statique (React build)
- SPA routing
- Cache agressif des assets
- Gzip compression

---

## 🚀 Déploiement

### 1. Backend CMS

```bash
# Sur le serveur
cd ~/swigs-apps/swigs-cms-backend
git pull origin main
npm install
pm2 restart swigs-cms-backend

# Vérifier
pm2 logs swigs-cms-backend --lines 20
curl http://localhost:3000/api/health
```

### 2. CMS Admin

```bash
# Sur le serveur
cd ~/swigs-apps/swigs-cms-admin
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/admin/

# Vérifier
curl -I https://admin.swigs.online
```

### 3. Monitoring API

```bash
# Sur le serveur
cd ~/swigs-apps/swigs-monitoring-api
git pull origin main
npm install
pm2 restart swigs-monitoring-api

# Vérifier
pm2 logs swigs-monitoring-api --lines 20
curl http://localhost:3001/api/health
```

### 4. Control Center

```bash
# Sur le serveur
cd ~/swigs-apps/swigs-control-center
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/monitoring/

# Vérifier
curl -I https://monitoring.swigs.online
```

### 5. Site Web (exemple: Buffet de la Gare)

```bash
# Sur le serveur
cd ~/swigs-apps/buffet-de-la-gare-website
git pull origin main
npm install --legacy-peer-deps
npm run build
sudo cp -r dist/* /var/www/buffet-de-la-gare/

# Vérifier
curl -I https://buffet-de-la-gare.swigs.online
```

---

## 🔄 Workflow de Déploiement Complet

### Nouveau Site

1. **Développement Local**
   ```bash
   # Local
   cd ~/CascadeProjects/swigs-repos
   mkdir nouveau-site-website && cd nouveau-site-website
   # ... développement ...
   git push origin main
   ```

2. **Configuration CMS Admin**
   - Aller sur https://admin.swigs.online
   - Créer le site dans **Sites**
   - Configurer le SEO

3. **Configuration Control Center**
   - Aller sur https://monitoring.swigs.online
   - Ajouter le site au monitoring
   - Configurer le pricing

4. **Déploiement Serveur**
   ```bash
   # Sur le serveur
   cd ~/swigs-apps
   git clone git@github.com:swigsstaking/nouveau-site-website.git
   cd nouveau-site-website
   npm install
   npm run build
   
   # Nginx
   sudo nano /etc/nginx/sites-available/nouveau-site.swigs.online
   sudo ln -s /etc/nginx/sites-available/nouveau-site.swigs.online /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo nginx -s reload
   
   # Déployer
   sudo mkdir -p /var/www/nouveau-site
   sudo cp -r dist/* /var/www/nouveau-site/
   sudo chown -R swigs:www-data /var/www/nouveau-site
   sudo chmod -R 775 /var/www/nouveau-site
   
   # SSL
   sudo certbot --nginx -d nouveau-site.swigs.online
   ```

### Mise à Jour d'un Site

```bash
# Sur le serveur
cd ~/swigs-apps/[nom-du-site]
git pull origin main
npm install --legacy-peer-deps
npm run build
sudo cp -r dist/* /var/www/[nom-du-site]/
```

---

## 🛠️ Maintenance

### Vérifier l'État des Services

```bash
# PM2
pm2 status

# Nginx
sudo nginx -t
sudo systemctl status nginx

# MongoDB
sudo systemctl status mongod

# Redis
sudo systemctl status redis
```

### Logs

```bash
# PM2
pm2 logs swigs-cms-backend --lines 50
pm2 logs swigs-monitoring-api --lines 50

# Nginx
sudo tail -f /var/log/nginx/admin-access.log
sudo tail -f /var/log/nginx/admin-error.log
sudo tail -f /var/log/nginx/buffet-de-la-gare.access.log

# MongoDB
sudo journalctl -u mongod -f

# Système
sudo journalctl -f
```

### Redémarrer les Services

```bash
# Nginx
sudo nginx -s reload
sudo systemctl restart nginx

# PM2
pm2 restart all
pm2 restart swigs-cms-backend
pm2 restart swigs-monitoring-api

# MongoDB
sudo systemctl restart mongod

# Redis
sudo systemctl restart redis
```

### Permissions

```bash
# Réparer les permissions d'un site
sudo chown -R swigs:www-data /var/www/[nom-du-site]
sudo chmod -R 775 /var/www/[nom-du-site]

# Réparer les permissions des apps
sudo chown -R swigs:swigs ~/swigs-apps
```

### Espace Disque

```bash
# Vérifier l'espace
df -h

# Nettoyer les logs Nginx (garder 7 jours)
sudo find /var/log/nginx -name "*.log" -mtime +7 -delete

# Nettoyer les logs PM2
pm2 flush

# Nettoyer npm cache
npm cache clean --force
```

---

## 🔐 Sécurité

### SSL/TLS

Tous les sites utilisent Let's Encrypt via Certbot.

```bash
# Renouveler les certificats
sudo certbot renew

# Vérifier les certificats
sudo certbot certificates

# Tester le renouvellement automatique
sudo certbot renew --dry-run
```

### Firewall

```bash
# Vérifier le firewall
sudo ufw status

# Ports ouverts
# 22 (SSH)
# 80 (HTTP)
# 443 (HTTPS)
# 27017 (MongoDB - local only)
# 6379 (Redis - local only)
```

### Backup

```bash
# Backup MongoDB
mongodump --db swigs-cms --out ~/backups/mongodb/$(date +%Y%m%d)
mongodump --db swigs-monitoring --out ~/backups/mongodb/$(date +%Y%m%d)

# Backup sites
tar -czf ~/backups/sites/$(date +%Y%m%d).tar.gz /var/www/

# Backup configs Nginx
tar -czf ~/backups/nginx/$(date +%Y%m%d).tar.gz /etc/nginx/sites-available/
```

---

## 📊 Monitoring

### Métriques Serveur

Le Monitoring API collecte automatiquement :
- CPU usage
- RAM usage
- Disk usage
- Network traffic

### Métriques Sites

- Uptime (via ping)
- PageSpeed (via Lighthouse)
- Logs Nginx (trafic, erreurs)

### Alertes

Configurées dans le Control Center :
- CPU > 80%
- RAM > 80%
- Disk > 90%
- Site down

---

## 🆘 Dépannage

### Site ne se charge pas

```bash
# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/[site]-error.log

# Vérifier les permissions
ls -la /var/www/[site]

# Vérifier le build
ls -la ~/swigs-apps/[site]/dist
```

### API ne répond pas

```bash
# Vérifier PM2
pm2 status
pm2 logs swigs-cms-backend

# Vérifier le port
netstat -tulpn | grep 3000

# Redémarrer
pm2 restart swigs-cms-backend
```

### Erreur 502 Bad Gateway

```bash
# Backend down
pm2 restart swigs-cms-backend

# Vérifier la connexion
curl http://localhost:3000/api/health
```

### Erreur 404

```bash
# Vérifier la config Nginx
cat /etc/nginx/sites-enabled/[site]

# Vérifier try_files
# Doit être: try_files $uri $uri/ /index.html;
```

---

## 📚 Références

- [Architecture Complète](./ARCHITECTURE.md)
- [Guide Création Site](./QUICK_START_NEW_SITE.md)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

**📝 Dernière mise à jour : Octobre 2025**
