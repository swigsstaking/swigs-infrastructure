# 🤖 Prompt d'Initiation IA - Apps Standalone

## 🎯 Ta Mission

Tu es développeur sur une **application standalone** qui sera déployée sur le serveur `.59` (serveur de backup/apps). Ces apps ont leur **propre backend** et ne sont **pas connectées au CMS SWIGS**.

> ⚠️ Ce prompt est pour les **apps standalone** (backend séparé).
> Pour les **sites SWIGS** (frontend connecté au CMS), voir `PROMPT_INITIATION_IA.md`

## 🏗️ Architecture des Serveurs

```
┌─────────────────────────────────────────────────────────────┐
│                    SWIGS Infrastructure                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │   Serveur .73        │    │   Serveur .59        │      │
│  │   (CMS Principal)    │    │   (Apps & Backups)   │      │
│  ├──────────────────────┤    ├──────────────────────┤      │
│  │ • swigs-cms-backend  │    │ • Apps standalone    │      │
│  │ • Sites SWIGS        │    │ • Backups .73        │      │
│  │ • Admin CMS          │    │ • MongoDB local      │      │
│  │ • MongoDB principal  │    │ • Nginx              │      │
│  │ • Redis              │    │                      │      │
│  └──────────────────────┘    └──────────────────────┘      │
│                                                             │
│         192.168.110.73              192.168.110.59          │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Documentation

**Lis d'abord** :
```
swigs-infrastructure/docs/SERVER_59_APPS.md
```

## 🚨 RÈGLES

✅ **TOUJOURS** :
- Tester en local avant de déployer
- Utiliser PM2 pour les processus Node.js
- Configurer Nginx + SSL (Let's Encrypt)
- Stocker les secrets dans `.env` (jamais dans le code)

❌ **JAMAIS** :
- Déployer sans tester
- Hardcoder des credentials
- Utiliser des ports déjà pris

## 📁 Structure Recommandée

### Backend Node.js (Express)

```
mon-app/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── services/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/              # Optionnel (React/Vue/etc.)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Variables d'environnement (.env.example)

```env
# Server
NODE_ENV=development
PORT=3XXX

# Database (MongoDB local sur .59)
MONGODB_URI=mongodb://localhost:27017/mon-app

# JWT (si authentification)
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# SMTP (optionnel - utiliser les credentials SWIGS)
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=mail@swigs.online
SMTP_PASS=xxx
```

## 🔗 Connexion au Serveur .59

```bash
ssh swigs@192.168.110.59
```

**Chemins importants** :
| Élément | Chemin |
|---------|--------|
| Apps | `~/apps/` |
| Backups .73 | `~/backups/` |
| Nginx configs | `/etc/nginx/sites-available/` |
| PM2 logs | `~/.pm2/logs/` |

## 🆕 Créer une Nouvelle App

### 1. Développer en Local

```bash
mkdir mon-app && cd mon-app
npm init -y
npm install express mongoose dotenv cors helmet
```

### 2. Structure Minimale

```javascript
// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
// app.use('/api/xxx', xxxRoutes);

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Git & Push

```bash
git init
git add -A
git commit -m "feat: Initial commit"
git remote add origin git@github.com:swigsstaking/mon-app.git
git push -u origin main
```

### 4. Déploiement sur .59

```bash
# SSH sur le serveur
ssh swigs@192.168.110.59

# Cloner l'app
cd ~/apps
git clone git@github.com:swigsstaking/mon-app.git
cd mon-app

# Configurer
cp .env.example .env
nano .env  # Configurer les variables

# Installer et démarrer
npm install
pm2 start server.js --name mon-app
pm2 save
```

### 5. Nginx + SSL

```bash
# Créer config Nginx
sudo nano /etc/nginx/sites-available/mon-app.swigs.online
```

```nginx
server {
    listen 80;
    server_name mon-app.swigs.online;

    location / {
        proxy_pass http://localhost:3XXX;
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
# Activer et tester
sudo ln -s /etc/nginx/sites-available/mon-app.swigs.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d mon-app.swigs.online
```

## 🔄 Mise à Jour d'une App

```bash
ssh swigs@192.168.110.59
cd ~/apps/mon-app
git pull origin main
npm install
pm2 restart mon-app
```

## 📊 Commandes PM2 Utiles

```bash
pm2 list                    # Liste des processus
pm2 logs mon-app            # Voir les logs
pm2 restart mon-app         # Redémarrer
pm2 stop mon-app            # Arrêter
pm2 delete mon-app          # Supprimer
pm2 monit                   # Monitoring temps réel
```

## 🗄️ MongoDB sur .59

Le serveur .59 a sa propre instance MongoDB pour les apps standalone.

```bash
# Accéder à MongoDB
mongosh

# Créer une base
use mon-app

# Voir les bases
show dbs
```

## ✅ Checklist Nouvelle App

- [ ] Code testé en local
- [ ] `.env.example` créé avec toutes les variables
- [ ] `README.md` avec instructions
- [ ] Git push sur GitHub
- [ ] Cloner sur .59
- [ ] `.env` configuré sur le serveur
- [ ] PM2 démarré et sauvegardé
- [ ] Nginx configuré
- [ ] SSL activé (certbot)
- [ ] Test de l'URL publique

## 🆘 En Cas de Problème

```bash
# Voir les logs PM2
pm2 logs mon-app --lines 100

# Vérifier Nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log

# Vérifier MongoDB
sudo systemctl status mongod
```

---

**📝 Version : 1.0 - Janvier 2026**
