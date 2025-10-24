# 📊 Architecture MongoDB - SWIGS CMS

## Base de données : `swigs-cms`

### Collections

#### 1. **sites** (2 documents)
Stocke les informations de chaque site web.

**Champs principaux** :
- `_id` : ObjectId unique
- `name` : Nom du site (ex: "Speed-L Auto-école")
- `slug` : Identifiant URL-friendly (ex: "speed-l", "buffet")
- `domain` : Domaine principal (ex: "speedl.swigs.online")
- `description` : Description du site
- `isActive` : Boolean - site actif ou non
- `logo` : { url, alt }
- `favicon` : URL du favicon
- `theme` : { primaryColor, secondaryColor, fontFamily }
- `contact` : { email, phone, address, city, postalCode, country, whatsapp }
- `social` : { facebook, instagram, twitter, linkedin, tiktok }
- `settings` : { language, timezone }
- `domains` : Array d'objets { url, environment, isPrimary }
  - **IMPORTANT** : URLs complètes avec https:// (ex: "https://buffet-de-la-gare.swigs.online")
- `pages` : Array d'objets { value, label, _id }
- `sections` : Array (sections custom du site)
- `createdAt`, `updatedAt` : Dates ISO

**Exemple** :
```json
{
  "_id": "68fa38c3483f6dc7aa5e8c35",
  "name": "Buffet de la Gare chez Claude",
  "slug": "buffet",
  "domain": "buffet-de-la-gare.swigs.online",
  "domains": [
    {
      "url": "https://buffet-de-la-gare.swigs.online",
      "environment": "production",
      "isPrimary": true
    }
  ]
}
```

#### 2. **users**
Utilisateurs admin du CMS.

**Champs** :
- `_id` : ObjectId
- `email` : Email unique
- `password` : Hash bcrypt
- `name` : Nom complet
- `role` : "admin" | "editor" | "viewer"
- `sites` : Array d'ObjectId (sites auxquels l'user a accès)
- `isActive` : Boolean
- `lastLogin` : Date ISO
- `createdAt`, `updatedAt`

#### 3. **seos**
Métadonnées SEO par page et par site.

**Champs** :
- `_id` : ObjectId
- `site` : ObjectId (référence vers sites)
- `page` : String (ex: "home", "contact")
- `title` : Titre SEO
- `description` : Meta description
- `keywords` : Array de mots-clés
- `ogTitle`, `ogDescription` : Open Graph
- `robots` : "index,follow" | "noindex,nofollow"

#### 4. **media**
Fichiers uploadés (images, documents).

**Champs** :
- `_id` : ObjectId
- `filename` : Nom du fichier stocké
- `originalName` : Nom original
- `url` : URL complète (ex: "https://speedl.swigs.online/uploads/buffet-de-la-gare/...")
- `siteId` : ObjectId (référence vers sites)
- `mimetype` : Type MIME
- `size` : Taille en bytes
- `uploadedBy` : ObjectId (référence vers users)

**IMPORTANT** : 
- Fichiers stockés dans `/var/www/uploads/{slug}/`
- URLs doivent pointer vers `speedl.swigs.online/uploads/` (Nginx configuré)

#### 5. **courses**
Cours auto-école (spécifique Speed-L).

**Champs** :
- `_id` : ObjectId
- `site` : ObjectId (référence vers sites)
- `title` : Titre du cours
- `number` : Numéro (ex: "N°609")
- `description` : Description
- `category` : "sensibilisation" | "permis" | etc.
- `price` : { amount, currency, display }
- `duration` : String (ex: "2 soirées")
- `dates` : Array { day, date, time }
- `currentParticipants` : Number
- `status` : "active" | "full" | "cancelled"
- `order` : Number (ordre d'affichage)

#### 6. **contents**
Contenu dynamique des sections (menus, textes, etc.).

**Champs** :
- `_id` : ObjectId
- `site` : ObjectId (référence vers sites)
- `section` : String (ex: "menu", "hero", "about")
- `type` : String (type de contenu)
- `data` : Object (structure flexible selon le type)
- `order` : Number
- `isActive` : Boolean

#### 7. **contacts**
Messages de contact (actuellement vide).

---

## 🔑 Points Importants

### URLs et Domaines

1. **Champ `domain`** : Domaine SANS https:// (ex: "buffet-de-la-gare.swigs.online")
2. **Champ `domains[].url`** : URL AVEC https:// (ex: "https://buffet-de-la-gare.swigs.online")
3. **Media URLs** : Toujours pointer vers `speedl.swigs.online/uploads/{slug}/` car Nginx y est configuré

### Slugs

- **Unique par site**
- **URL-friendly** (lowercase, tirets)
- **Utilisé pour** :
  - Dossiers uploads : `/var/www/uploads/{slug}/`
  - Routes API : `/api/sites/{slug}`
  - Identification dans le code

### Relations

- `users.sites[]` → `sites._id`
- `seos.site` → `sites._id`
- `media.siteId` → `sites._id`
- `courses.site` → `sites._id`
- `contents.site` → `sites._id`

---

## 🛠️ Commandes Utiles

### Lister tous les sites
```javascript
db.sites.find({}, { name: 1, slug: 1, domain: 1, domains: 1 })
```

### Corriger une URL cassée
```javascript
db.sites.updateOne(
  { slug: 'buffet' },
  { $set: { 'domains.0.url': 'https://buffet-de-la-gare.swigs.online' } }
)
```

### Trouver les médias d'un site
```javascript
db.media.find({ siteId: ObjectId('68fa38c3483f6dc7aa5e8c35') })
```

### Nettoyer les URLs avec double https://
```javascript
db.sites.find({ "domains.url": /https:\/\/https:/ })
```

---

## 📝 État Actuel (24 Oct 2025)

### Sites
1. **Speed-L Auto-école**
   - ID: `68f2526d1787e3f19795e0f0`
   - Slug: `speed-l`
   - Domain: `speedl.swigs.online`
   - Domains: [] (vide)

2. **Buffet de la Gare chez Claude**
   - ID: `68fa38c3483f6dc7aa5e8c35`
   - Slug: `buffet`
   - Domain: `buffet-de-la-gare.swigs.online`
   - Domains: [{ url: "https://buffet-de-la-gare.swigs.online", ... }] ✅

### Utilisateurs
- 1 admin : `admin@swigs.online`

### Médias
- 2 fichiers uploadés (logos Speed-L)
- URLs pointent vers domaines des sites (à corriger vers speedl.swigs.online)

---

## ⚠️ Problèmes Connus et Solutions

### 1. Double https:// dans URLs
**Cause** : Frontend envoie URL complète, backend ajoute aussi https://
**Solution** : Backend nettoie automatiquement (commit d9a9af8)

### 2. Media URLs pointent vers mauvais domaine
**Cause** : Anciennes URLs générées avec domaine du site
**Solution** : Backend force maintenant speedl.swigs.online (commit 38b7e64)

### 3. Slug vs ID dans routes
**Cause** : Control Center utilise slug, routes attendaient ID
**Solution** : Backend accepte maintenant slug OU ID (commit 9449cdd)
