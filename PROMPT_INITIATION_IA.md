# 🤖 Prompt d'Initiation IA - SWIGS Infrastructure

## 🎯 Ta Mission

Tu es développeur sur **SWIGS**, un système multi-sites avec CMS centralisé. Tu crées et modifies des sites web React connectés à notre backend.

## 🚨 RÈGLE #1 : NO BREAKING CHANGES

**Nous sommes en PRODUCTION.**

✅ **TOUJOURS** :
- Tester en local avant de déployer
- Demander confirmation avant de modifier le backend/BDD
- Vérifier la compatibilité avec les sites existants

❌ **JAMAIS** :
- Modifier les routes API existantes
- Supprimer des champs de la BDD
- Déployer sans tester

## 📚 Documentation

**Lis d'abord ces fichiers dans l'ordre** :

1. **Architecture générale** :
   ```
   swigs-infrastructure/docs/INFRASTRUCTURE_COMPLETE_2025.md
   ```
   Contient : architecture, routes API, MongoDB, structure des sites.

2. **Déploiement serveur** :
   ```
   swigs-infrastructure/docs/SERVER_DEPLOYMENT_GUIDE.md
   ```
   Contient : chemins serveur, commandes de déploiement par site, CORS, Nginx.

## 🏗️ Structure Technique d'un Site

**Utilise cette structure** (référence : `speedl-website`) :

```
site-website/
├── src/
│   ├── components/
│   │   ├── Layout.jsx       # Header + Footer
│   │   ├── SEOHead.jsx      # SEO avec Helmet
│   │   └── Logo.jsx         # Logo du site
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Contact.jsx
│   ├── hooks/
│   │   ├── useSEO.js        # Hook SEO
│   │   └── useSiteInfo.js   # Hook infos site
│   └── data/
│       └── seo.json         # Généré par backend
├── .env.production          # VITE_API_URL=https://swigs.online/api
├── vite.config.js
└── tailwind.config.js
```

**⚠️ IMPORTANT** :
- **Copie la STRUCTURE technique**, PAS le design
- **Supprime les pages spécifiques** (cours, offres, etc.)
- **Change le style Tailwind** pour un design unique
- **Garde les composants techniques** (SEOHead, hooks API)

## 🔗 URLs & API

| Service | URL |
|---------|-----|
| **Admin V2** | https://admin.swigs.online/v2/ |
| **API Backend** | https://swigs.online/api |

**Routes API principales** :
```javascript
// Sites
GET  /api/public/sites/:slug
GET  /api/public/seo?siteId=xxx

// Contenu
GET  /api/public/content?siteId=xxx
POST /api/public/contact

// E-commerce
GET  /api/public/products?siteId=xxx
POST /api/public/orders
```

## 🆕 Créer un Nouveau Site

### 1. Créer le Projet

```bash
cd /Users/corentinflaction/CascadeProjects/sites
mkdir nouveau-site-website && cd nouveau-site-website

# Copier la structure de Speed-L
cp -r ../speedl-website/src ./
cp -r ../speedl-website/public ./
cp ../speedl-website/package.json ./
cp ../speedl-website/vite.config.js ./
cp ../speedl-website/tailwind.config.js ./
cp ../speedl-website/.env.example ./

# Modifier package.json
# Changer le "name" en "nouveau-site-website"

# Installer
npm install
```

### 2. Personnaliser

1. **Supprimer les pages spécifiques** (cours, offres, etc.)
2. **Créer tes propres pages** dans `src/pages/`
3. **Changer le style** dans `tailwind.config.js` (couleurs, fonts)
4. **Modifier `src/App.jsx`** : Ajouter tes routes
5. **Créer `.env.production`** :
   ```env
   VITE_API_URL=https://swigs.online/api
   ```

### 3. Tester en Local

```bash
npm run dev
# Ouvrir http://localhost:5173
```

**Vérifie** :
- ✅ Les pages se chargent
- ✅ Le SEO fonctionne (après configuration dans l'admin)
- ✅ Les formulaires fonctionnent
- ✅ Pas d'erreurs console

### 4. Configuration Admin

1. **Aller sur** : https://admin.swigs.online/v2/
2. **Se connecter** avec les identifiants fournis
3. **Créer le site** :
   - Nom : "Nouveau Site"
   - Slug : `nouveau-site` (⚠️ IMPORTANT : utilisé partout)
   - Domaine : `nouveau-site.swigs.online`
   - Type : `website` ou `ecommerce`
4. **Configurer le SEO** pour chaque page
5. **Uploader le logo**

### 5. Git

```bash
git init
git add -A
git commit -m "feat: Initial commit nouveau site"

# Créer le repo sur GitHub : swigsstaking/nouveau-site-website
git remote add origin git@github.com:swigsstaking/nouveau-site-website.git
git push -u origin main
```

### 6. Déploiement (demander confirmation)

**⚠️ NE PAS déployer sans confirmation de l'utilisateur**

Voir `SERVER_DEPLOYMENT_GUIDE.md` pour les commandes détaillées par site.

**Chemins importants sur le serveur** :

| Site | Dossier Source | Dossier Build |
|------|----------------|---------------|
| **Backend** | `~/swigs-apps/swigs-cms-backend` | - (PM2) |
| **Admin** | `~/swigs-apps/swigs-cms-admin` | `/var/www/admin` |
| **Speed-L** | `~/websites/speed-l` ⚠️ | `/var/www/speed-l` |
| **Buffet** | `~/swigs-apps/buffet-de-la-gare-website` | `/var/www/buffet-de-la-gare` |
| **Gîte de Lodze** | `~/swigs-apps/sites/gitedelodze` | `/var/www/gite-lodze` |
| **Moontain Studio** | `~/swigs-apps/agence-web-premium` | `/var/www/agence-web-premium` |
| **GTS Alpina** | `~/swigs-apps/gtsalpina-website` | `/var/www/gtsalpina` |
| **SelfNodes** | `~/swigs-apps/selfnodes-website` | `/var/www/selfnodes` |
| **SWIGS** | `~/swigs-apps/swigs-website` | `/var/www/swigswebsite` |

**Workflow de déploiement** :

```bash
# 1. SSH sur le serveur
ssh swigs@192.168.110.73

# 2. Aller dans le dossier source
cd ~/swigs-apps/[site-website]

# 3. Pull, install, build
git pull origin main
npm install
npm run build

# 4. Copier le build
sudo cp -r dist/* /var/www/[site]/

# 5. Pour un NOUVEAU site, ajouter :
# - Config Nginx
# - Certificat SSL (certbot)
# - Domaine au CORS backend
```

## 🎨 Conventions

```jsx
// Composants React
import SEOHead from '../components/SEOHead';

const MaPage = () => {
  return (
    <>
      <SEOHead page="ma-page" />
      <div className="max-w-7xl mx-auto px-4">
        {/* Contenu */}
      </div>
    </>
  );
};

// Appels API
const response = await fetch(
  `${import.meta.env.VITE_API_URL}/public/sites/${slug}`
);
```

## ✅ Checklist Avant de Commencer

- [ ] Lu `INFRASTRUCTURE_COMPLETE_2025.md`
- [ ] Compris la règle NO BREAKING CHANGES
- [ ] Compris la structure technique (SEOHead, hooks, API)

## 🆘 En Cas de Problème

**Demande confirmation** avant de :
- Modifier le backend
- Déployer en production
- Modifier la BDD

---

**📝 Version : 2.0 - Janvier 2026**
