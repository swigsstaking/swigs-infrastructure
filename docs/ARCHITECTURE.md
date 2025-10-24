# 🏗️ Architecture SWIGS - Documentation Complète

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Technique](#architecture-technique)
3. [Créer un Nouveau Site](#créer-un-nouveau-site)
4. [Connecter au CMS](#connecter-au-cms)
5. [Ajouter au Monitoring](#ajouter-au-monitoring)
6. [Déploiement Serveur](#déploiement-serveur)
7. [Maintenance](#maintenance)

---

## 🎯 Vue d'Ensemble

SWIGS est une infrastructure multi-sites avec :
- **CMS centralisé** : Un admin pour gérer tous les sites
- **Monitoring unifié** : Un dashboard pour surveiller tous les serveurs
- **Architecture modulaire** : Chaque site est indépendant

### Composants Principaux

```
┌─────────────────────────────────────────────────────────┐
│                    SWIGS Ecosystem                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Site 1     │  │   Site 2     │  │   Site N     │ │
│  │  (Speed-L)   │  │  (Futur)     │  │  (Futur)     │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘         │
│                            │                            │
│                   ┌────────▼────────┐                   │
│                   │  CMS Backend    │                   │
│                   │  (API commune)  │                   │
│                   └────────┬────────┘                   │
│                            │                            │
│         ┌──────────────────┼──────────────────┐         │
│         │                  │                  │         │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐ │
│  │  CMS Admin   │  │   MongoDB    │  │   Redis      │ │
│  │ (Dashboard)  │  │  (Database)  │  │   (Cache)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Monitoring System                     │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  Control Center → Monitoring API → Agents       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Architecture Technique

### Stack Technologique

| Composant | Technologies |
|-----------|-------------|
| **Frontend Sites** | React + Vite + Tailwind CSS |
| **Admin Dashboard** | React + TanStack Query + Tailwind |
| **Backend API** | Node.js + Express + MongoDB + Redis |
| **Monitoring** | Node.js + Socket.IO + Recharts |
| **Serveur** | Ubuntu + Nginx + PM2 + MongoDB |

### Ports & Services

| Service | Port | URL |
|---------|------|-----|
| CMS Backend | 3000 | http://localhost:3000 |
| Monitoring API | 3001 | http://localhost:3001 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Redis | 6379 | redis://localhost:6379 |
| Nginx HTTP | 80 | - |
| Nginx HTTPS | 443 | - |

### Base de Données

**MongoDB Databases:**
- `swigs-cms` : Sites, Users, SEO, Content, Courses
- `swigs-monitoring` : Server metrics, Site metrics, Financial data

---

## 🆕 Créer un Nouveau Site

### Étape 1 : Créer le Repo GitHub

```bash
# Localement
cd ~/CascadeProjects/swigs-repos
mkdir nouveau-site-website
cd nouveau-site-website

# Initialiser le projet React + Vite
npm create vite@latest . -- --template react
npm install

# Installer les dépendances SWIGS
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Étape 2 : Structure du Projet

```
nouveau-site-website/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Layout avec header/footer
│   │   ├── SEOHead.jsx         # Composant SEO
│   │   └── Logo.jsx            # Logo du site
│   ├── pages/
│   │   ├── Home.jsx            # Page d'accueil
│   │   ├── Contact.jsx         # Page contact
│   │   └── ...                 # Autres pages
│   ├── hooks/
│   │   ├── useSEO.js           # Hook pour SEO
│   │   └── useSiteInfo.js      # Hook pour infos site
│   ├── data/
│   │   └── seo.json            # Données SEO (généré par backend)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Étape 3 : Configuration Tailwind

```js
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... vos couleurs
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    },
  },
  plugins: [],
}
```

### Étape 4 : Composants Essentiels

**SEOHead.jsx** (Copier depuis speedl-website)
```jsx
import { Helmet } from 'react-helmet-async';
import { useSEO } from '../hooks/useSEO';

const SEOHead = ({ page = 'home' }) => {
  const seo = useSEO(page);
  
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {/* ... autres meta tags */}
    </Helmet>
  );
};
```

**useSiteInfo.js**
```js
import { useState, useEffect } from 'react';
import seoData from '../data/seo.json';

export const useSiteInfo = () => {
  return seoData.site;
};
```

---

## 🔗 Connecter au CMS

### Étape 1 : Créer le Site dans l'Admin

1. Se connecter à l'admin : https://admin.swigs.online
2. Aller dans **Sites** → **Nouveau Site**
3. Remplir :
   - **Nom** : Nom du site
   - **Slug** : `nouveau-site` (utilisé dans les URLs)
   - **Domaine** : `nouveau-site.swigs.online`
   - **Description** : Description du site
   - **Logo** : Upload du logo
   - **Actif** : ✅

### Étape 2 : Configurer le SEO

1. Aller dans **SEO** → **Nouveau SEO**
2. Sélectionner le site
3. Configurer chaque page :
   - **Page** : `home`, `contact`, etc.
   - **Title** : Titre SEO
   - **Description** : Meta description
   - **Keywords** : Mots-clés
   - **OG Image** : Image pour réseaux sociaux

### Étape 3 : Générer les Données SEO

Le backend génère automatiquement `src/data/seo.json` pour chaque site.

**Manuellement :**
```bash
# Sur le serveur
cd ~/swigs-apps/swigs-cms-backend
node src/scripts/generate-seo.js
```

**Automatiquement :**
Via le bouton "Mettre à jour la DB" dans l'admin.

### Étape 4 : Récupérer les Données

Le site lit `src/data/seo.json` généré par le backend :

```js
// src/hooks/useSEO.js
import seoData from '../data/seo.json';

export const useSEO = (page = 'home') => {
  return seoData.pages[page] || {};
};
```

---

## 📊 Ajouter au Monitoring

### Étape 1 : Créer l'Entrée Site

Dans le **Control Center** :
1. Aller dans **Sites** → **Nouveau Site**
2. Remplir :
   - **Site ID** : `nouveau-site`
   - **Nom** : Nom du site
   - **Domaine** : `nouveau-site.swigs.online`
   - **Serveur** : Sélectionner le serveur

### Étape 2 : Configurer le Pricing

1. Aller dans **Sites** → **Pricing**
2. Configurer :
   - **Prix mensuel** : Prix facturé au client
   - **Coûts serveur** : Part des coûts serveur
   - **Bande passante** : Coût par GB
   - **Stockage** : Coût par GB

### Étape 3 : Monitoring Automatique

Le monitoring collecte automatiquement :
- ✅ **Métriques serveur** : CPU, RAM, Disk, Network
- ✅ **PageSpeed** : Performance du site
- ✅ **Uptime** : Disponibilité
- ✅ **Logs Nginx** : Trafic, erreurs

---

## 🚀 Déploiement Serveur

### Étape 1 : Préparer le Serveur

```bash
# Se connecter au serveur
ssh swigs@serveur

# Cloner le repo
cd ~/swigs-apps
git clone git@github.com:swigsstaking/nouveau-site-website.git

# Installer les dépendances
cd nouveau-site-website
npm install
```

### Étape 2 : Configuration Nginx

```bash
# Créer la config Nginx
sudo nano /etc/nginx/sites-available/nouveau-site.swigs.online
```

**Configuration :**
```nginx
server {
    listen 80;
    server_name nouveau-site.swigs.online;
    
    root /var/www/nouveau-site;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache statique
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Logs
    access_log /var/log/nginx/nouveau-site.access.log;
    error_log /var/log/nginx/nouveau-site.error.log;
}
```

**Activer le site :**
```bash
sudo ln -s /etc/nginx/sites-available/nouveau-site.swigs.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo nginx -s reload
```

### Étape 3 : SSL avec Certbot

```bash
sudo certbot --nginx -d nouveau-site.swigs.online
```

### Étape 4 : Déployer le Site

```bash
# Builder le site
cd ~/swigs-apps/nouveau-site-website
npm run build

# Créer le dossier web
sudo mkdir -p /var/www/nouveau-site

# Copier les fichiers
sudo cp -r dist/* /var/www/nouveau-site/

# Permissions
sudo chown -R swigs:www-data /var/www/nouveau-site
sudo chmod -R 775 /var/www/nouveau-site
```

### Étape 5 : Script de Déploiement

```bash
# Créer un script de déploiement
nano ~/swigs-apps/nouveau-site-website/deploy.sh
```

**deploy.sh :**
```bash
#!/bin/bash

echo "🚀 Déploiement nouveau-site..."

# Pull les changements
git pull origin main

# Installer les dépendances
npm install

# Builder
npm run build

# Déployer
sudo cp -r dist/* /var/www/nouveau-site/

echo "✅ Déploiement terminé !"
```

```bash
chmod +x ~/swigs-apps/nouveau-site-website/deploy.sh
```

---

## 🔄 Workflow de Développement

### Développement Local

```bash
# Cloner le repo
git clone git@github.com:swigsstaking/nouveau-site-website.git
cd nouveau-site-website

# Installer
npm install

# Lancer en dev
npm run dev

# Ouvrir http://localhost:5173
```

### Mise à Jour

```bash
# Faire les modifications
git add .
git commit -m "feat: Nouvelle fonctionnalité"
git push origin main

# Sur le serveur
ssh swigs@serveur
cd ~/swigs-apps/nouveau-site-website
./deploy.sh
```

---

## 🛠️ Maintenance

### Mettre à Jour un Site

```bash
# Sur le serveur
cd ~/swigs-apps/nouveau-site-website
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/nouveau-site/
```

### Mettre à Jour le Backend

```bash
cd ~/swigs-apps/swigs-cms-backend
git pull origin main
npm install
pm2 restart swigs-cms-backend
```

### Mettre à Jour le Monitoring

```bash
cd ~/swigs-apps/swigs-monitoring-api
git pull origin main
npm install
pm2 restart swigs-monitoring-api
```

### Logs

```bash
# Logs PM2
pm2 logs swigs-cms-backend
pm2 logs swigs-monitoring-api

# Logs Nginx
sudo tail -f /var/log/nginx/nouveau-site.access.log
sudo tail -f /var/log/nginx/nouveau-site.error.log

# Logs MongoDB
sudo journalctl -u mongod -f
```

### Backup

```bash
# Backup MongoDB
mongodump --db swigs-cms --out ~/backups/mongodb/$(date +%Y%m%d)
mongodump --db swigs-monitoring --out ~/backups/mongodb/$(date +%Y%m%d)

# Backup sites
tar -czf ~/backups/sites/$(date +%Y%m%d).tar.gz /var/www/
```

---

## 📚 Ressources

### Repos GitHub

- [swigs-cms-backend](https://github.com/swigsstaking/swigs-cms-backend)
- [swigs-cms-admin](https://github.com/swigsstaking/swigs-cms-admin)
- [speedl-website](https://github.com/swigsstaking/speedl-website) ⭐ **Template de référence**
- [swigs-control-center](https://github.com/swigsstaking/swigs-control-center)
- [swigs-monitoring-api](https://github.com/swigsstaking/swigs-monitoring-api)
- [swigs-infrastructure](https://github.com/swigsstaking/swigs-infrastructure)

### URLs Production

- **Admin** : https://admin.swigs.online
- **Control Center** : https://monitoring.swigs.online
- **Speed-L** : https://speed-l.swigs.online
- **Buffet de la Gare** : https://buffet-de-la-gare.swigs.online

### Documentation

- [Guide de Migration](../MIGRATION_GUIDE.md)
- [Scripts Infrastructure](../)

---

## 🆘 Support

En cas de problème :
1. Vérifier les logs PM2 et Nginx
2. Vérifier que MongoDB et Redis tournent
3. Vérifier les permissions des fichiers
4. Consulter cette documentation

---

**📝 Dernière mise à jour : Octobre 2025**
