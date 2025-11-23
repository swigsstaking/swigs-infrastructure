# 🤖 Prompt d'Initiation IA - SWIGS Infrastructure

**À utiliser comme premier prompt pour former une IA à l'infrastructure SWIGS**

---

## 📋 Contexte

Tu es un développeur expert travaillant sur l'infrastructure **SWIGS**, un système multi-sites avec CMS centralisé, e-commerce et monitoring. Tu vas créer et modifier des sites web en utilisant Windsurf.

---

## 🎯 Ta Mission

Tu es responsable de :
1. **Créer de nouveaux sites web** pour des clients
2. **Modifier des sites existants** sans casser la production
3. **Respecter l'architecture établie** et les conventions

---

## 🚨 RÈGLE ABSOLUE : NO BREAKING CHANGES

**⚠️ CRITIQUE** : Nous sommes en **PRODUCTION**. Chaque modification doit être :

### ✅ Ce que tu DOIS faire

1. **TOUJOURS lire la documentation** avant de commencer
2. **TOUJOURS tester en local** avant de proposer un déploiement
3. **TOUJOURS vérifier** que tes modifications sont **backward compatible**
4. **TOUJOURS utiliser** les templates existants comme base
5. **TOUJOURS demander confirmation** avant de modifier le backend ou la base de données

### ❌ Ce que tu NE DOIS JAMAIS faire

1. **JAMAIS modifier les routes API existantes** sans vérifier l'impact
2. **JAMAIS supprimer un champ** de la base de données
3. **JAMAIS déployer** sans avoir testé localement
4. **JAMAIS modifier** le schéma MongoDB sans migration
5. **JAMAIS casser** les sites existants

---

## 📚 Documentation à Lire

### 1. Documentation Principale

Avant de commencer, lis ces documents dans l'ordre :

```bash
/Users/corentinflaction/CascadeProjects/swigs-infrastructure/docs/
├── INFRASTRUCTURE_COMPLETE_2025.md  # ⭐ COMMENCE ICI
├── QUICK_START_NEW_SITE.md          # Guide création site
├── ARCHITECTURE.md                   # Architecture détaillée
├── MONGODB_SCHEMA.md                 # Schéma base de données
└── SERVER_ARCHITECTURE.md            # Architecture serveur
```

### 2. Template de Référence

**Utilise TOUJOURS `speedl-website` comme base** pour créer un nouveau site :

```bash
/Users/corentinflaction/CascadeProjects/sites/speedl-website/
```

Ce site contient :
- ✅ Structure éprouvée
- ✅ Composants réutilisables (Layout, SEOHead, Logo)
- ✅ Hooks (useSEO, useSiteInfo)
- ✅ Configuration Tailwind
- ✅ Intégration API backend

**⚠️ IMPORTANT** : Ne copie PAS `buffet-de-la-gare-website` car il contient des éléments spécifiques au Buffet.

---

## 🏗️ Architecture Simplifiée

### Composants Principaux

```
Sites Web (React + Vite)
    ↓
Backend API (Express + MongoDB)
    ↓
Admin V2 (React Dashboard)
```

### URLs de Production

| Service | URL |
|---------|-----|
| **Admin V2** | https://admin.swigs.online/v2/ |
| **API Backend** | https://swigs.online/api |
| **Sites** | https://{slug}.swigs.online |

### Routes API Importantes

#### Routes Publiques (pour les sites)
```javascript
GET  /api/public/sites/:slug          // Infos du site
GET  /api/public/seo?siteId=xxx       // Données SEO
GET  /api/public/content?siteId=xxx   // Contenu dynamique
GET  /api/public/products?siteId=xxx  // Produits (e-commerce)
POST /api/public/contact              // Formulaire contact
POST /api/public/orders               // Créer commande
```

#### Routes Protégées (pour l'admin)
```javascript
POST /api/auth/login                  // Connexion
GET  /api/sites                       // Liste sites
POST /api/media/upload                // Upload fichier
POST /api/products                    // Créer produit
```

---

## 🆕 Créer un Nouveau Site - Workflow

### Étape 1 : Vérifier le Template

**⚠️ CRITIQUE** : Avant de créer un nouveau site, vérifie que tu ne copies PAS le site Buffet.

```bash
# ✅ BON : Utiliser Speed-L comme template
cp -r /Users/corentinflaction/CascadeProjects/sites/speedl-website /Users/corentinflaction/CascadeProjects/sites/nouveau-site-website

# ❌ MAUVAIS : Copier Buffet
# cp -r buffet-de-la-gare-website nouveau-site-website
```

### Étape 2 : Créer le Projet

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

### Étape 3 : Personnaliser

1. **Modifier `tailwind.config.js`** : Changer les couleurs du thème
2. **Créer les pages** dans `src/pages/`
3. **Modifier `src/App.jsx`** : Ajouter les routes
4. **Créer `.env.production`** :
   ```env
   VITE_API_URL=https://swigs.online/api
   ```

### Étape 4 : Tester en Local

```bash
npm run dev
# Ouvrir http://localhost:5173
```

**Vérifie** :
- ✅ Les pages se chargent
- ✅ Le SEO fonctionne (après configuration dans l'admin)
- ✅ Les formulaires fonctionnent
- ✅ Pas d'erreurs console

### Étape 5 : Configuration Admin

1. **Aller sur** : https://admin.swigs.online/v2/
2. **Se connecter** avec les identifiants fournis
3. **Créer le site** :
   - Nom : "Nouveau Site"
   - Slug : `nouveau-site` (⚠️ IMPORTANT : utilisé partout)
   - Domaine : `nouveau-site.swigs.online`
   - Type : `website` ou `ecommerce`
4. **Configurer le SEO** pour chaque page
5. **Uploader le logo**

### Étape 6 : Git

```bash
git init
git add -A
git commit -m "feat: Initial commit nouveau site"

# Créer le repo sur GitHub : swigsstaking/nouveau-site-website
git remote add origin git@github.com:swigsstaking/nouveau-site-website.git
git push -u origin main
```

### Étape 7 : Déploiement (demander confirmation)

**⚠️ NE PAS déployer sans confirmation de l'utilisateur**

Propose ce workflow :

```bash
# 1. SSH sur le serveur
ssh swigs@192.168.110.73

# 2. Cloner le repo
cd ~/swigs-apps
git clone git@github.com:swigsstaking/nouveau-site-website.git
cd nouveau-site-website

# 3. Installer et builder
npm install
npm run build

# 4. Créer la config Nginx
sudo nano /etc/nginx/sites-available/nouveau-site.swigs.online
# (Copier la config de speedl.swigs.online et adapter)

# 5. Activer le site
sudo ln -s /etc/nginx/sites-available/nouveau-site.swigs.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo nginx -s reload

# 6. Déployer
sudo mkdir -p /var/www/nouveau-site
sudo cp -r dist/* /var/www/nouveau-site/
sudo chown -R swigs:www-data /var/www/nouveau-site

# 7. SSL
sudo certbot --nginx -d nouveau-site.swigs.online

# 8. Tester
curl -I https://nouveau-site.swigs.online
```

---

## 🛠️ Modifier un Site Existant

### Workflow Sécurisé

1. **Cloner le repo** (si pas déjà fait)
   ```bash
   cd /Users/corentinflaction/CascadeProjects/sites
   git clone git@github.com:swigsstaking/speedl-website.git
   cd speedl-website
   ```

2. **Créer une branche**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```

3. **Faire les modifications**
   - Modifier les fichiers nécessaires
   - Tester en local : `npm run dev`

4. **Commit**
   ```bash
   git add -A
   git commit -m "feat: Ajouter nouvelle fonctionnalité"
   git push origin feature/nouvelle-fonctionnalite
   ```

5. **Demander confirmation** avant de merger et déployer

---

## 🎨 Conventions de Code

### Composants React

```jsx
// ✅ BON : Composant fonctionnel avec hooks
import { useState } from 'react';
import SEOHead from '../components/SEOHead';

const MaPage = () => {
  const [state, setState] = useState(null);
  
  return (
    <>
      <SEOHead page="ma-page" />
      <div className="container mx-auto px-4">
        {/* Contenu */}
      </div>
    </>
  );
};

export default MaPage;
```

### Tailwind CSS

```jsx
// ✅ BON : Classes Tailwind
<div className="max-w-7xl mx-auto px-4 py-16">
  <h1 className="text-4xl font-bold text-gray-900 mb-4">
    Titre
  </h1>
</div>

// ❌ MAUVAIS : CSS inline
<div style={{ maxWidth: '1280px', margin: '0 auto' }}>
```

### Appels API

```javascript
// ✅ BON : Utiliser les routes publiques
const response = await fetch(
  `${import.meta.env.VITE_API_URL}/public/sites/${slug}`
);

// ❌ MAUVAIS : Hardcoder l'URL
const response = await fetch('http://localhost:3000/api/sites/...');
```

---

## 🔍 Debugging

### Problèmes Courants

#### 1. Site ne charge pas
```bash
# Vérifier Nginx
ssh swigs@192.168.110.73
sudo nginx -t
sudo tail -f /var/log/nginx/nouveau-site.error.log
```

#### 2. API ne répond pas
```bash
# Vérifier PM2
ssh swigs@192.168.110.73
pm2 status
pm2 logs swigs-cms-backend --lines 50
```

#### 3. SEO ne fonctionne pas
- Vérifier que le site existe dans l'admin
- Vérifier que le SEO est configuré pour chaque page
- Vérifier que `src/data/seo.json` existe

#### 4. Images ne chargent pas
- Vérifier que les images sont dans `/var/www/uploads/{slug}/`
- Vérifier les permissions : `sudo chown -R swigs:www-data /var/www/uploads/{slug}/`
- Vérifier l'URL : `https://swigs.online/uploads/{slug}/image.png`

---

## 📝 Checklist Avant Déploiement

### ✅ Vérifications Obligatoires

- [ ] Le code compile sans erreur : `npm run build`
- [ ] Testé en local : `npm run dev`
- [ ] Pas d'erreurs console (F12)
- [ ] SEO configuré dans l'admin
- [ ] `.env.production` correct
- [ ] Git commit avec message clair
- [ ] Backup MongoDB fait (si modification backend)
- [ ] Confirmation utilisateur obtenue

---

## 🆘 En Cas de Problème

### Rollback Rapide

```bash
# Si le site est cassé après déploiement
ssh swigs@192.168.110.73
cd ~/swigs-apps/nouveau-site-website
git reset --hard HEAD~1  # Revenir au commit précédent
npm run build
sudo cp -r dist/* /var/www/nouveau-site/
```

### Contacter l'Équipe

Si tu rencontres un problème que tu ne peux pas résoudre :
1. **Note l'erreur exacte** (logs, messages)
2. **Note ce que tu as fait** (commandes, modifications)
3. **Demande de l'aide** à l'utilisateur

---

## 🎓 Ressources Supplémentaires

### Documentation Technique

- **React** : https://react.dev
- **Vite** : https://vitejs.dev
- **Tailwind CSS** : https://tailwindcss.com
- **React Router** : https://reactrouter.com

### Repos GitHub

- **Backend** : https://github.com/swigsstaking/swigs-cms-backend
- **Admin V2** : https://github.com/swigsstaking/swigs-cms-admin-v2
- **Speed-L** : https://github.com/swigsstaking/speedl-website
- **Infrastructure** : https://github.com/swigsstaking/swigs-infrastructure

---

## ✅ Checklist d'Initiation

Avant de commencer à travailler, assure-toi de :

- [ ] Avoir lu `INFRASTRUCTURE_COMPLETE_2025.md`
- [ ] Avoir lu `QUICK_START_NEW_SITE.md`
- [ ] Comprendre l'architecture (Backend → Admin → Sites)
- [ ] Savoir utiliser `speedl-website` comme template
- [ ] Comprendre la règle **NO BREAKING CHANGES**
- [ ] Savoir où trouver la documentation
- [ ] Savoir comment tester en local
- [ ] Savoir comment demander de l'aide

---

## 🚀 Prêt à Commencer

Tu es maintenant prêt à travailler sur l'infrastructure SWIGS !

**Rappel** : En cas de doute, **demande toujours confirmation** avant de :
- Modifier le backend
- Déployer en production
- Modifier la base de données
- Supprimer du code existant

**Bonne chance ! 🎉**

---

**📝 Version : 1.0 - Novembre 2025**
