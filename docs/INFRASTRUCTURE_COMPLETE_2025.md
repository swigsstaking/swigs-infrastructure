# 🏗️ SWIGS Infrastructure Complète - 2025

**Documentation officielle et à jour de l'infrastructure SWIGS**

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Backend](#architecture-backend)
3. [Admin CMS](#admin-cms)
4. [Sites Web](#sites-web)
5. [E-commerce](#e-commerce)
6. [Monitoring](#monitoring)
7. [Serveur & Déploiement](#serveur--déploiement)
8. [Base de Données MongoDB](#base-de-données-mongodb)

---

## 🎯 Vue d'Ensemble

### Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│                    SWIGS Ecosystem 2025                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Site 1     │  │   Site 2     │  │   Site N     │     │
│  │  (Speed-L)   │  │  (Buffet)    │  │ (SelfNodes)  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                   ┌────────▼────────┐                       │
│                   │  CMS Backend    │                       │
│                   │  (API + E-com)  │                       │
│                   └────────┬────────┘                       │
│                            │                                │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐     │
│  │  Admin V2    │  │   MongoDB    │  │   Redis      │     │
│  │ (Dashboard)  │  │  (Database)  │  │   (Cache)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │           Monitoring System                     │       │
│  ├─────────────────────────────────────────────────┤       │
│  │  Control Center → Monitoring API → Agents       │       │
│  └─────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### URLs de Production

| Service | URL | Chemin Serveur |
|---------|-----|----------------|
| **Admin V1** | https://admin.swigs.online | `/var/www/admin` |
| **Admin V2** | https://admin.swigs.online/v2/ | `/var/www/admin/v2` |
| **Control Center** | https://monitoring.swigs.online | `/var/www/monitoring` |
| **API Backend** | https://swigs.online/api | Port 3000 (PM2) |
| **API Monitoring** | https://swigs.online/monitoring-api | Port 3001 (PM2) |
| **Speed-L** | https://speedl.swigs.online | `/var/www/speed-l` |
| **Buffet** | https://buffet-de-la-gare.swigs.online | `/var/www/buffet-de-la-gare` |
| **SelfNodes** | https://selfnodes.com | `/var/www/selfnodes` |

---

## 🔧 Architecture Backend

### Stack Technologique

| Composant | Technologies |
|-----------|-------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | MongoDB 6.0+ |
| **Cache** | Redis 7.0+ |
| **Process Manager** | PM2 |
| **Server** | Nginx + Ubuntu |

### Routes API Disponibles

#### Routes Publiques (sans authentification)

```javascript
// Sites & SEO
GET  /api/public/sites/:slug          // Infos d'un site
GET  /api/public/seo?siteId=xxx       // SEO d'un site

// Contenu dynamique
GET  /api/public/content?siteId=xxx&section=menu
GET  /api/public/courses?siteId=xxx
GET  /api/public/offers?siteId=xxx

// E-commerce
GET  /api/public/products?siteId=xxx
GET  /api/public/categories?siteId=xxx
POST /api/public/orders                // Créer une commande

// Contact
POST /api/public/contact               // Formulaire de contact

// Nodes (SelfNodes)
GET  /api/public/nodes                 // Liste des nodes
GET  /api/public/nodes/:id             // Détails d'un node
```

#### Routes Protégées (authentification requise)

```javascript
// Authentification
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/auth/logout

// Sites (Admin uniquement)
GET    /api/sites
POST   /api/sites
GET    /api/sites/:id
PUT    /api/sites/:id
DELETE /api/sites/:id

// SEO
GET    /api/seo
POST   /api/seo
PUT    /api/seo/:id
DELETE /api/seo/:id

// Médias
GET    /api/media?siteId=xxx
POST   /api/media/upload
DELETE /api/media/:id

// Contenu
GET    /api/content?siteId=xxx
POST   /api/content
PUT    /api/content/:id
DELETE /api/content/:id

// Cours (Speed-L)
GET    /api/courses?siteId=xxx
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id

// E-commerce (Admin/Editor)
GET    /api/products?siteId=xxx
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

GET    /api/categories?siteId=xxx
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

GET    /api/orders?siteId=xxx
GET    /api/orders/:id
PUT    /api/orders/:id/status
DELETE /api/orders/:id

GET    /api/customers?siteId=xxx
GET    /api/customers/:id

GET    /api/promo-codes?siteId=xxx
POST   /api/promo-codes
PUT    /api/promo-codes/:id
DELETE /api/promo-codes/:id

// Nodes (SelfNodes)
GET    /api/nodes
POST   /api/nodes
PUT    /api/nodes/:id
DELETE /api/nodes/:id

// Analytics
GET    /api/analytics/dashboard?siteId=xxx
GET    /api/analytics/orders?siteId=xxx

// Users (Admin uniquement)
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

// Webhooks
POST   /api/webhooks/stripe
POST   /api/webhooks/paypal
```

### Permissions & Rôles

| Rôle | Accès |
|------|-------|
| **admin** | Tous les sites, toutes les fonctionnalités, gestion users |
| **editor** | Sites assignés uniquement, CRUD contenu/produits, pas de settings |
| **viewer** | Lecture seule sur sites assignés |

---

## 🎨 Admin CMS

### Admin V1 vs V2

| Feature | V1 | V2 |
|---------|----|----|
| **URL** | https://admin.swigs.online | https://admin.swigs.online/v2/ |
| **UI/UX** | Ancienne | Moderne, responsive |
| **Dark Mode** | Oui | Oui (amélioré) |
| **E-commerce** | Basique | Complet |
| **Mobile** | Non | Oui |
| **Status** | Maintenance | Production |

### Fonctionnalités Admin V2

#### Dashboard
- Vue d'ensemble multi-sites
- Statistiques en temps réel
- Graphiques de performance
- Activité récente

#### Sites
- Gestion multi-sites
- Configuration SEO
- Upload médias isolés par site
- Gestion domaines multiples

#### Contenu
- Sections dynamiques (hero, about, services, etc.)
- Cours (Speed-L)
- Offres (Speed-L)
- Menu (Buffet de la Gare)
- Événements

#### E-commerce
- **Produits** : CRUD complet, variations, stock, images
- **Catégories** : Hiérarchie, images, SEO
- **Commandes** : Gestion statuts, historique, exports
- **Clients** : Profils, historique, statistiques
- **Codes Promo** : Pourcentage/fixe, dates, limites

#### Médias
- Upload par site (isolé dans `/var/www/uploads/{slug}/`)
- Gestion fichiers
- Preview images
- Suppression

#### Contacts
- Messages formulaires
- Filtres par site
- Statut (lu/non lu)

#### Paramètres (Admin uniquement)
- Configuration sites
- Intégrations (Stripe, Google OAuth, SMTP)
- Gestion utilisateurs
- Permissions

---

## 🌐 Sites Web

### Sites Actuels

#### 1. Speed-L Auto-école
- **URL** : https://speedl.swigs.online
- **Slug** : `speed-l`
- **Type** : Site vitrine + Cours
- **Features** : Cours, Offres, Bons cadeaux, Contact

#### 2. Buffet de la Gare
- **URL** : https://buffet-de-la-gare.swigs.online
- **Slug** : `buffet`
- **Type** : Site vitrine + Menu
- **Features** : Menu dynamique, Événements, Contact

#### 3. SelfNodes
- **URL** : https://selfnodes.com
- **Slug** : `selfnodes`
- **Type** : Site vitrine + Nodes
- **Features** : Validators Ethereum/Gnosis/Lukso, Monitoring, Contact

### Structure Type d'un Site

```
site-website/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Layout avec header/footer
│   │   ├── SEOHead.jsx         # Composant SEO (Helmet)
│   │   ├── Logo.jsx            # Logo du site
│   │   └── ...                 # Autres composants
│   ├── pages/
│   │   ├── Home.jsx            # Page d'accueil
│   │   ├── Contact.jsx         # Page contact
│   │   └── ...                 # Autres pages
│   ├── hooks/
│   │   ├── useSEO.js           # Hook pour SEO
│   │   ├── useSiteInfo.js      # Hook pour infos site
│   │   └── ...                 # Autres hooks
│   ├── data/
│   │   └── seo.json            # Données SEO (généré par backend)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env.production             # VITE_API_URL=https://swigs.online/api
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Template de Référence

**Utiliser `speedl-website` comme base** pour créer un nouveau site :
- Structure éprouvée
- Composants réutilisables
- Hooks SEO/SiteInfo
- Configuration Tailwind

---

## 🛒 E-commerce

### Fonctionnalités

#### Produits
- **Variations** : Taille, couleur, etc.
- **Stock** : Gestion inventaire
- **Images** : Multiple images par produit
- **SEO** : Meta title, description, keywords
- **Catégories** : Multi-catégories
- **Prix** : Prix de base + prix promo
- **Statut** : Actif/Inactif, En stock/Rupture

#### Catégories
- **Hiérarchie** : Catégories parentes/enfants
- **Images** : Image de catégorie
- **SEO** : Optimisation par catégorie
- **Ordre** : Tri personnalisé

#### Commandes
- **Statuts** : pending, processing, shipped, delivered, cancelled
- **Paiement** : Stripe, PayPal (webhooks)
- **Expédition** : Adresses, tracking
- **Historique** : Timeline des événements
- **Exports** : CSV, PDF

#### Clients
- **Profils** : Infos personnelles, adresses
- **Historique** : Toutes les commandes
- **Statistiques** : Total dépensé, nombre commandes
- **Segmentation** : Filtres avancés

#### Codes Promo
- **Types** : Pourcentage, Montant fixe
- **Conditions** : Montant minimum, produits spécifiques
- **Limites** : Nombre d'utilisations, dates validité
- **Tracking** : Utilisation en temps réel

### Intégrations Paiement

#### Stripe
- **Checkout** : Redirect vers Stripe Checkout
- **Webhooks** : `checkout.session.completed`, `payment_intent.payment_failed`
- **Configuration** : Par site (clés API dans Settings)

#### PayPal
- **Checkout** : Boutons PayPal
- **Webhooks** : `PAYMENT.CAPTURE.COMPLETED`
- **Configuration** : Par site (Client ID/Secret dans Settings)

---

## 📊 Monitoring

### Control Center

**URL** : https://monitoring.swigs.online

#### Fonctionnalités
- **Dashboard** : Vue d'ensemble tous les serveurs
- **Sites** : Métriques par site (uptime, PageSpeed, trafic)
- **Serveurs** : CPU, RAM, Disk, Network
- **Financier** : Revenus, coûts, marges par site
- **Alertes** : Notifications automatiques

### Monitoring API

**Port** : 3001
**WebSocket** : Temps réel

#### Endpoints
```javascript
GET  /api/servers                    // Liste serveurs
GET  /api/servers/:id/metrics        // Métriques serveur
GET  /api/sites                      // Liste sites monitorés
GET  /api/sites/:id/metrics          // Métriques site
POST /api/sites/:id/pagespeed        // Mesurer PageSpeed
GET  /api/financial/monthly          // Données financières
```

### Agent Monitoring

**Installé sur** : Serveur principal (192.168.110.73)

**Collecte** :
- Métriques système (CPU, RAM, Disk, Network)
- Logs Nginx (trafic, erreurs)
- Statut services (PM2, MongoDB, Redis)
- Envoi vers Monitoring API toutes les 60s

---

## 🖥️ Serveur & Déploiement

### Serveur Principal

- **Hostname** : `sw4c-6`
- **IP** : `192.168.110.73`
- **User** : `swigs`
- **OS** : Ubuntu 22.04 LTS
- **Services** : Nginx, PM2, MongoDB, Redis

### Structure Dossiers

```
/home/swigs/
├── swigs-apps/                      # Applications Node.js
│   ├── swigs-cms-backend/           # Backend API (Port 3000)
│   ├── swigs-cms-admin/             # Admin V1
│   ├── swigs-cms-admin-v2/          # Admin V2
│   ├── swigs-monitoring-api/        # Monitoring API (Port 3001)
│   ├── swigs-control-center/        # Control Center
│   ├── speedl-website/              # Site Speed-L
│   ├── buffet-de-la-gare-website/   # Site Buffet
│   └── selfnodes/                   # Site SelfNodes

/var/www/                            # Sites web (builds)
├── admin/                           # Admin V1
│   └── v2/                          # Admin V2
├── monitoring/                      # Control Center
├── speed-l/                         # Site Speed-L
├── buffet-de-la-gare/              # Site Buffet
├── selfnodes/                       # Site SelfNodes
└── uploads/                         # Médias (isolés par site)
    ├── speed-l/
    ├── buffet/
    └── selfnodes/

/etc/nginx/sites-available/          # Configs Nginx
├── admin
├── monitoring
├── speedl.swigs.online
├── buffet-de-la-gare.swigs.online
└── selfnodes.com
```

### Services PM2

```bash
pm2 list

┌─────┬──────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                 │ status  │ restart │ uptime   │
├─────┼──────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ swigs-cms-backend    │ online  │ 0       │ 30d      │
│ 1   │ swigs-monitoring-api │ online  │ 0       │ 30d      │
└─────┴──────────────────────┴─────────┴─────────┴──────────┘
```

### Ports

| Service | Port | Accès |
|---------|------|-------|
| **CMS Backend** | 3000 | localhost uniquement |
| **Monitoring API** | 3001 | localhost uniquement |
| **MongoDB** | 27017 | localhost uniquement |
| **Redis** | 6379 | localhost uniquement |
| **Nginx HTTP** | 80 | public |
| **Nginx HTTPS** | 443 | public |

### Déploiement

#### Backend CMS
```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-cms-backend
git pull origin main
npm install
pm2 restart swigs-cms-backend
pm2 logs swigs-cms-backend --lines 20
```

#### Admin V2
```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/swigs-cms-admin-v2
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/admin/v2/
```

#### Site Web
```bash
ssh swigs@192.168.110.73
cd ~/swigs-apps/speedl-website
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/speed-l/
```

---

## 🗄️ Base de Données MongoDB

### Databases

#### swigs-cms
Collections principales :
- `sites` : Informations des sites
- `users` : Utilisateurs admin
- `seos` : Métadonnées SEO par page
- `media` : Fichiers uploadés
- `contents` : Contenu dynamique
- `courses` : Cours (Speed-L)
- `offers` : Offres (Speed-L)
- `contacts` : Messages formulaires
- **E-commerce** :
  - `products` : Produits
  - `categories` : Catégories
  - `orders` : Commandes
  - `customers` : Clients
  - `promocodes` : Codes promo
- **Nodes** :
  - `nodeservers` : Serveurs de nodes
  - `nodes` : Validators

#### swigs-monitoring
Collections principales :
- `servers` : Serveurs monitorés
- `servermetrics` : Métriques serveurs
- `sites` : Sites monitorés
- `sitemetrics` : Métriques sites
- `pagespeedmetrics` : Scores PageSpeed
- `monthlyfinancials` : Données financières
- `invoices` : Factures

### Schéma Important : Sites

```javascript
{
  _id: ObjectId,
  name: String,                    // "Speed-L Auto-école"
  slug: String,                    // "speed-l" (unique, URL-friendly)
  domain: String,                  // "speedl.swigs.online"
  description: String,
  siteType: String,                // "website" | "ecommerce"
  isActive: Boolean,
  logo: { url: String, alt: String },
  favicon: String,
  theme: {
    primaryColor: String,
    secondaryColor: String,
    fontFamily: String
  },
  contact: {
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    whatsapp: String
  },
  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    tiktok: String
  },
  domains: [{
    url: String,                   // "https://speedl.swigs.online"
    environment: String,           // "production" | "staging"
    isPrimary: Boolean
  }],
  pages: [{                        // Pages custom du site
    value: String,                 // "about"
    label: String                  // "À propos"
  }],
  sections: [{                     // Sections custom du site
    value: String,                 // "pricing"
    label: String                  // "Tarifs"
  }],
  integrations: {
    stripe: {
      enabled: Boolean,
      publicKey: String,
      secretKey: String,           // Encrypted
      webhookSecret: String        // Encrypted
    },
    paypal: {
      enabled: Boolean,
      clientId: String,
      clientSecret: String         // Encrypted
    },
    googleOAuth: {
      enabled: Boolean,
      clientId: String,
      clientSecret: String         // Encrypted
    },
    smtp: {
      enabled: Boolean,
      host: String,
      port: Number,
      secure: Boolean,
      user: String,
      password: String             // Encrypted
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Commandes Utiles

```bash
# Se connecter à MongoDB
mongosh

# Utiliser la base de données
use swigs-cms

# Lister tous les sites
db.sites.find({}, { name: 1, slug: 1, domain: 1 })

# Trouver un site par slug
db.sites.findOne({ slug: "speed-l" })

# Compter les produits d'un site
db.products.countDocuments({ site: ObjectId("...") })

# Trouver les commandes en attente
db.orders.find({ status: "pending" })

# Backup
mongodump --db swigs-cms --out ~/backups/$(date +%Y%m%d)
```

---

## ⚠️ Points Critiques - NO BREAKING CHANGES

### 🚨 RÈGLES ABSOLUES

1. **JAMAIS modifier les routes API existantes** sans vérifier tous les sites qui les utilisent
2. **JAMAIS supprimer un champ de la base de données** sans migration
3. **TOUJOURS tester en local** avant de déployer en production
4. **TOUJOURS faire un backup MongoDB** avant une migration
5. **TOUJOURS vérifier les logs** après un déploiement

### Workflow de Modification Sécurisé

```bash
# 1. Développement local
cd ~/CascadeProjects/swigs-cms-backend
# ... modifications ...
npm run dev  # Tester localement

# 2. Commit avec message clair
git add -A
git commit -m "feat: Ajouter route /api/xxx (backward compatible)"
git push origin main

# 3. Backup production
ssh swigs@192.168.110.73
mongodump --db swigs-cms --out ~/backups/$(date +%Y%m%d)

# 4. Déploiement
cd ~/swigs-apps/swigs-cms-backend
git pull origin main
npm install
pm2 restart swigs-cms-backend

# 5. Vérification
pm2 logs swigs-cms-backend --lines 50
curl http://localhost:3000/api/health

# 6. Rollback si problème
git reset --hard HEAD~1
pm2 restart swigs-cms-backend
```

### Compatibilité Ascendante

**✅ BON** :
```javascript
// Ajouter un champ optionnel
const siteSchema = new mongoose.Schema({
  name: String,
  slug: String,
  newField: { type: String, default: null }  // ✅ Optionnel
});

// Ajouter une nouvelle route
router.get('/api/new-feature', handler);  // ✅ Nouvelle route
```

**❌ MAUVAIS** :
```javascript
// Supprimer un champ utilisé
const siteSchema = new mongoose.Schema({
  name: String,
  // slug: String,  // ❌ SUPPRIMÉ - sites cassés !
});

// Modifier une route existante
router.get('/api/sites', newHandler);  // ❌ Comportement changé !
```

---

## 📚 Ressources

### Repos GitHub

- [swigs-cms-backend](https://github.com/swigsstaking/swigs-cms-backend) - API Backend
- [swigs-cms-admin](https://github.com/swigsstaking/swigs-cms-admin) - Admin V1
- [swigs-cms-admin-v2](https://github.com/swigsstaking/swigs-cms-admin-v2) - Admin V2
- [speedl-website](https://github.com/swigsstaking/speedl-website) - Template de référence
- [swigs-control-center](https://github.com/swigsstaking/swigs-control-center) - Monitoring
- [swigs-monitoring-api](https://github.com/swigsstaking/swigs-monitoring-api) - API Monitoring
- [swigs-infrastructure](https://github.com/swigsstaking/swigs-infrastructure) - Scripts & Docs

### Documentation

- [Architecture Complète](./ARCHITECTURE.md)
- [Guide Création Site](./QUICK_START_NEW_SITE.md)
- [Schéma MongoDB](./MONGODB_SCHEMA.md)
- [Architecture Serveur](./SERVER_ARCHITECTURE.md)

---

**📝 Dernière mise à jour : Novembre 2025**
**🔒 Production - NO BREAKING CHANGES**
