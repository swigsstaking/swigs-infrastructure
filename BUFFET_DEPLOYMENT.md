# 🍽️ Déploiement Complet - Buffet de la Gare

## 📋 Ce qui a été fait

### 1. **Scripts de Déploiement**
- ✅ `fix-buffet-link.js` - Corrige le lien dans Control Center
- ✅ `update-buffet-info.js` - Met à jour téléphone, email et pages
- ✅ `create-buffet-seo.js` - Crée le SEO pour toutes les pages
- ✅ `create-buffet-menu.js` - Crée le menu complet avec tous les plats
- ✅ `fix-uploads-ssl.sh` - Corrige le problème d'upload d'images
- ✅ `deploy-buffet-complete.sh` - Script de déploiement tout-en-un

### 2. **CMS Admin**
- ✅ **MenuEditor** - Interface moderne pour gérer le menu
  - Ajout/modification/suppression de plats par catégorie
  - Upload d'images par plat
  - Gestion des allergènes et options végétariennes
  - Interface visuelle intuitive

### 3. **Données**
- ✅ **Contact**
  - Téléphone: 027 306 37 66
  - Email: info@buffetdelagarechezclaude.ch

- ✅ **Pages configurées**
  - Accueil
  - Présentation
  - Notre Carte
  - Événements
  - Galerie
  - Contact

- ✅ **Menu complet** (d'après l'image fournie)
  - 5 Entrées
  - 3 Tartes Fines
  - 6 Incontournables
  - 5 Formules Bistrot
  - 3 Desserts

- ✅ **SEO optimisé** pour toutes les pages

---

## 🚀 Déploiement sur le Serveur

### Option 1 : Déploiement Automatique (Recommandé)

```bash
# Se connecter au serveur
ssh swigs@votre-serveur

# Aller dans le dossier scripts
cd ~/swigs-apps/swigs-infrastructure/scripts

# Exécuter le script de déploiement complet
bash deploy-buffet-complete.sh
```

Ce script va :
1. ✅ Déployer le Backend CMS
2. ✅ Déployer le CMS Admin avec le nouveau MenuEditor
3. ✅ Déployer le site Buffet de la Gare
4. ✅ Corriger le lien dans Control Center
5. ✅ Mettre à jour les informations (téléphone, email, pages)
6. ✅ Créer le SEO pour toutes les pages
7. ✅ Créer le menu complet
8. ✅ Corriger le problème d'upload d'images

---

### Option 2 : Déploiement Manuel

#### Étape 1 : Déployer le code

```bash
# Backend CMS
cd ~/swigs-apps/swigs-cms-backend
git pull origin main
npm install
pm2 restart swigs-cms-backend

# CMS Admin
cd ~/swigs-apps/swigs-cms-admin
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/admin/

# Site Buffet de la Gare
cd ~/swigs-apps/buffet-de-la-gare-website
git pull origin main
npm install --legacy-peer-deps
npm run build
sudo cp -r dist/* /var/www/buffet-de-la-gare/
```

#### Étape 2 : Exécuter les scripts de configuration

```bash
cd ~/swigs-apps/swigs-infrastructure/scripts

# 1. Corriger le lien dans Control Center
node fix-buffet-link.js

# 2. Mettre à jour les informations
node update-buffet-info.js

# 3. Créer le SEO
node create-buffet-seo.js

# 4. Créer le menu
node create-buffet-menu.js

# 5. Fixer les uploads
bash fix-uploads-ssl.sh
```

---

## 🎯 Utilisation du CMS Admin

### Gérer le Menu

1. Se connecter à https://admin.swigs.online
2. Sélectionner "Buffet de la Gare" dans le sélecteur de site
3. Aller dans **Contenu**
4. Cliquer sur l'onglet **Menu**
5. Cliquer sur **Gérer le menu**

**Interface MenuEditor :**
- ✅ 5 catégories : Entrées, Tartes Fines, Incontournables, Formules Bistrot, Desserts
- ✅ Ajouter un plat par catégorie
- ✅ Modifier un plat existant
- ✅ Supprimer un plat
- ✅ Upload d'image par plat
- ✅ Gestion des allergènes
- ✅ Option végétarien

### Gérer les Événements

1. Dans **Contenu**, cliquer sur l'onglet **Événements**
2. Cliquer sur **Nouvel événement**
3. Remplir le formulaire :
   - Titre
   - Description
   - Date et heure
   - Lieu
   - Capacité
   - Prix
   - Image
   - Options (réservation requise, événement mis en avant)

### Gérer le SEO

1. Aller dans **SEO**
2. Sélectionner une page dans le menu déroulant
3. Modifier les champs :
   - Titre
   - Description
   - Mots-clés
   - Open Graph (titre, description)
   - Robots

---

## 🔍 Vérifications Post-Déploiement

### 1. Vérifier les sites

- ✅ CMS Admin : https://admin.swigs.online
- ✅ Buffet de la Gare : https://buffet-de-la-gare.swigs.online
- ✅ Control Center : https://monitoring.swigs.online

### 2. Vérifier le menu

- ✅ Aller sur https://buffet-de-la-gare.swigs.online/carte
- ✅ Vérifier que tous les plats s'affichent correctement
- ✅ Vérifier les prix

### 3. Vérifier le SEO

- ✅ Inspecter le code source de chaque page
- ✅ Vérifier les balises `<title>` et `<meta>`
- ✅ Tester avec Google Search Console

### 4. Vérifier les uploads

- ✅ Aller dans le CMS Admin
- ✅ Essayer d'uploader une image
- ✅ Vérifier qu'elle s'affiche correctement

### 5. Vérifier Control Center

- ✅ Aller sur https://monitoring.swigs.online
- ✅ Vérifier que le lien du Buffet de la Gare est correct
- ✅ Devrait être : `buffet-de-la-gare.swigs.online`

---

## 📝 Notes Importantes

### Structure du Menu

Le menu est organisé en 5 catégories :

1. **Entrées** (entrees)
2. **Les Tartes Fines du Buffet de la Gare** (tartes)
3. **Les Incontournables** (incontournables)
4. **Formules Bistrot** (formules)
5. **Desserts** (desserts)

Chaque plat contient :
- `id` : Identifiant unique
- `nom` : Nom du plat
- `prix` : Prix (ex: "36.-")
- `description` : Description (optionnel)
- `image` : URL de l'image (optionnel)
- `allergenes` : Tableau d'allergènes (ex: ["gluten", "lait"])
- `vegetarien` : Boolean

### Problème d'Upload Résolu

Le problème `ERR_CERT_COMMON_NAME_INVALID` était dû à :
- Les uploads pointaient vers `https://swigs.online/uploads/` (domaine sans certificat)
- Solution : Proxy Nginx vers le backend CMS sur `https://admin.swigs.online/uploads/`

### Contact

- **Téléphone** : 027 306 37 66
- **Email** : info@buffetdelagarechezclaude.ch
- **Adresse** : Avenue de la Gare 2, 1955 St-Pierre-de-Clages

---

## 🐛 Dépannage

### Le menu ne s'affiche pas

```bash
# Vérifier que le menu existe dans la base de données
mongosh swigs-cms
db.contents.find({ type: 'menu' }).pretty()

# Recréer le menu si nécessaire
cd ~/swigs-apps/swigs-infrastructure/scripts
node create-buffet-menu.js
```

### Les uploads ne fonctionnent pas

```bash
# Réexécuter le script de fix
cd ~/swigs-apps/swigs-infrastructure/scripts
bash fix-uploads-ssl.sh
```

### Le SEO ne s'affiche pas

```bash
# Recréer le SEO
cd ~/swigs-apps/swigs-infrastructure/scripts
node create-buffet-seo.js
```

### Le lien dans Control Center est incorrect

```bash
# Recorriger le lien
cd ~/swigs-apps/swigs-infrastructure/scripts
node fix-buffet-link.js
```

---

## ✅ Checklist Finale

- [ ] Backend CMS déployé
- [ ] CMS Admin déployé avec MenuEditor
- [ ] Site Buffet de la Gare déployé
- [ ] Lien corrigé dans Control Center
- [ ] Informations de contact mises à jour
- [ ] SEO créé pour toutes les pages
- [ ] Menu complet créé avec tous les plats
- [ ] Uploads fonctionnels
- [ ] Tests effectués sur tous les sites
- [ ] Menu visible sur le site
- [ ] SEO vérifié sur toutes les pages
- [ ] Événements testés

---

## 🎉 Résultat Final

Après le déploiement, vous aurez :

1. ✅ Un site web moderne et responsive
2. ✅ Un menu complet avec 22 plats
3. ✅ Un SEO optimisé pour toutes les pages
4. ✅ Une interface CMS intuitive pour gérer le menu
5. ✅ Une gestion des événements
6. ✅ Des uploads d'images fonctionnels
7. ✅ Un lien correct dans Control Center

**Le Buffet de la Gare est prêt ! 🍽️**
