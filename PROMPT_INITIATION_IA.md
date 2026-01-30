# 🤖 Prompt d'Initiation IA - SWIGS Sites

## 🎯 Ta Mission

Tu es développeur sur **SWIGS**, un système multi-sites avec CMS centralisé. Tu crées et modifies des **sites web React** connectés à notre backend centralisé sur le serveur `.73`.

> ⚠️ Ce prompt est pour les **sites SWIGS** (frontend React connecté au CMS).
> Pour les **apps standalone** (backend séparé), voir `PROMPT_APPS_STANDALONE.md`

## 🚨 RÈGLE #1 : NO BREAKING CHANGES

**Nous sommes en PRODUCTION.**

✅ **TOUJOURS** :
- Tester en local avant de déployer
- Demander confirmation avant de modifier le backend/BDD
- Vérifier la compatibilité avec les sites existants
- Faire `git pull origin main` AVANT toute modification

❌ **JAMAIS** :
- Modifier les routes API existantes
- Supprimer des champs de la BDD
- Déployer sans tester
- Déployer sans confirmation de l'utilisateur

## 🔄 WORKFLOW OBLIGATOIRE : LOCAL → PUSH → DÉPLOIEMENT

```
1. Développer en LOCAL (npm run dev)
2. Tester les modifications
3. Demander confirmation à l'utilisateur
4. git add -A && git commit && git push
5. Demander confirmation pour déployer
6. Déployer sur le serveur
```

⚠️ **NE JAMAIS déployer directement sans passer par ce workflow !**

## 📚 Documentation

**Lis d'abord ces fichiers dans l'ordre** :

1. **Architecture générale** :
   ```
   swigs-infrastructure/docs/INFRASTRUCTURE_COMPLETE_2026.md
   ```
   Contient : architecture, routes API, MongoDB, structure des sites.

2. **Déploiement serveur** :
   ```
   swigs-infrastructure/docs/SERVER_DEPLOYMENT_GUIDE.md
   ```
   Contient : chemins serveur, commandes de déploiement par site, CORS, Nginx.

## 🏗️ Structure Technique d'un Site

**Utilise le template officiel** : `swigs-site-template`

**Chemin** : `/Users/corentinflaction/CascadeProjects/swigs-repos/swigs-site-template`

```
swigs-site-template/
├── src/
│   ├── components/
│   │   ├── Layout.jsx       # Header + Footer + Navigation
│   │   └── SEOHead.jsx      # SEO avec React Helmet
│   ├── pages/
│   │   ├── Home.jsx         # Page d'accueil (à personnaliser)
│   │   └── Contact.jsx      # Formulaire contact (fonctionnel)
│   ├── hooks/
│   │   ├── useSEO.js        # Hook SEO
│   │   ├── useSiteInfo.js   # Hook infos site (API)
│   │   └── useContact.js    # Hook formulaire contact
│   └── data/
│       └── seo.json         # Configuration SEO locale
├── .env.production          # VITE_API_URL=https://swigs.online/api
├── tailwind.config.js       # Couleurs et fonts à personnaliser
└── package.json
```

**⚠️ IMPORTANT** :
- **Copie la STRUCTURE technique**, PAS le design
- **Personnalise `tailwind.config.js`** pour un design unique
- **Garde les hooks et composants techniques** (SEOHead, useSiteInfo, useContact)
- Le template est **vierge** - crée tes propres pages

## 🔗 URLs & API

| Service | URL |
|---------|-----|
| **Admin** | https://admin.swigs.online |
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

### 1. Cloner le Template

```bash
cd /Users/corentinflaction/CascadeProjects/sites
cp -r ../swigs-repos/swigs-site-template nouveau-site-website
cd nouveau-site-website
rm -rf .git
git init
npm install
```

⚠️ **IMPORTANT** : Toujours utiliser `swigs-site-template` (template vierge officiel)

### 2. Personnaliser

1. **`package.json`** : Changer le `name`
2. **`src/data/seo.json`** : Configurer le slug (DOIT correspondre à l'Admin)
3. **`tailwind.config.js`** : Personnaliser couleurs et fonts
4. **`index.html`** : Modifier les Google Fonts si besoin
5. **`src/components/Layout.jsx`** : Adapter la navigation
6. **Créer tes pages** dans `src/pages/` et les ajouter dans `App.jsx`

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

1. **Aller sur** : https://admin.swigs.online
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

- [ ] Lu `INFRASTRUCTURE_COMPLETE_2026.md`
- [ ] Compris la règle NO BREAKING CHANGES
- [ ] Compris la structure technique (SEOHead, hooks, API)

## 🆘 En Cas de Problème

**Demande confirmation** avant de :
- Modifier le backend
- Déployer en production
- Modifier la BDD

---

## 🔗 Voir Aussi

- **Apps Standalone** : `swigs-infrastructure/PROMPT_APPS_STANDALONE.md`
- **Serveur Apps (.59)** : `swigs-infrastructure/docs/SERVER_59_APPS.md`

---

**📝 Version : 3.0 - Janvier 2026**
