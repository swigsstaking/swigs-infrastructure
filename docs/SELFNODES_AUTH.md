# 🆘 Solution au Problème d'Authentification SelfNodes

## 🎯 Diagnostic

**Le problème** : Tu cherches l'utilisateur dans la mauvaise base de données !

### ❌ Ce que tu faisais (FAUX)
- Backend utilisé : `swigs-monitoring-api` (port 3001)
- Base de données : `swigs-monitoring`
- Problème : Cette API n'a **PAS** de système d'authentification !

### ✅ Ce qu'il faut faire (CORRECT)
- Backend à utiliser : `swigs-cms-backend` (port 3000)
- Base de données : `swigs-cms`
- URL API : `https://swigs.online/api`

---

## 🏗️ Architecture SelfNodes

SelfNodes utilise **exactement la même architecture** que GTS Alpina :

```
┌─────────────────────────────────────────────────────────┐
│                    SelfNodes Frontend                    │
│                  (React + Vite)                          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ Auth + Nodes API
                       ▼
┌─────────────────────────────────────────────────────────┐
│              swigs-cms-backend (Port 3000)              │
│                                                          │
│  Routes:                                                 │
│  - POST /api/auth/login                                  │
│  - GET  /api/public/nodes                                │
│  - GET  /api/public/nodes/:id                            │
│  - POST /api/nodes (protected)                           │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB: swigs-cms                          │
│                                                          │
│  Collections:                                            │
│  - users (contient corentin@swigs.ch)                    │
│  - sites (contient selfnodes)                            │
│  - nodes (contient les validators)                       │
│  - nodeservers (serveurs de nodes)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Frontend

### Fichier `.env.local` (ou `.env`)

```bash
# API Backend CMS (PAS monitoring-api !)
VITE_API_URL=https://swigs.online/api

# OU en local
# VITE_API_URL=http://localhost:3000/api
```

### Fichier `src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://swigs.online/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// Nodes API (Public)
export const nodesAPI = {
  getAll: () => api.get('/public/nodes'),
  getById: (id) => api.get(`/public/nodes/${id}`),
};

// Nodes API (Protected - Admin)
export const nodesAdminAPI = {
  create: (data) => api.post('/nodes', data),
  update: (id, data) => api.put(`/nodes/${id}`, data),
  delete: (id) => api.delete(`/nodes/${id}`),
};
```

---

## 🔍 Vérification de la Configuration

### 1. Vérifier que le backend CMS tourne

```bash
ssh swigs@192.168.110.73
pm2 list

# Tu dois voir :
# swigs-cms-backend (port 3000) - online
```

### 2. Vérifier la base de données

```bash
# Sur le serveur
mongosh mongodb://localhost:27017/swigs-cms

# Vérifier l'utilisateur
db.users.findOne({ email: "corentin@swigs.ch" })

# Tu devrais voir un résultat avec un _id
```

### 3. Tester l'API directement

```bash
# Login
curl -X POST https://swigs.online/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"corentin@swigs.ch","password":"TON_MOT_DE_PASSE"}'

# Tu devrais recevoir un token
```

### 4. Vérifier les nodes

```bash
# Liste des nodes (public)
curl https://swigs.online/api/public/nodes

# Tu devrais voir les validators
```

---

## 📝 Routes Backend Disponibles

### Routes Publiques (pas de token)
```
GET  /api/public/nodes           # Liste des nodes
GET  /api/public/nodes/:id       # Détails d'un node
POST /api/public/contact         # Contact
```

### Routes Protégées (token requis)
```
POST   /api/nodes                # Créer un node
PUT    /api/nodes/:id            # Modifier un node
DELETE /api/nodes/:id            # Supprimer un node
GET    /api/nodes/stats          # Stats des nodes
```

### Routes Auth
```
POST /api/auth/login             # Login
POST /api/auth/register          # Register
GET  /api/auth/me                # User info
```

---

## 🐛 Debugging

### Si le token est invalide

1. **Vérifier le token dans localStorage**
   ```javascript
   console.log(localStorage.getItem('token'));
   ```

2. **Décoder le token** (sur jwt.io)
   - Copie le token
   - Colle-le sur https://jwt.io
   - Vérifie que l'`id` correspond à un utilisateur dans `swigs-cms.users`

3. **Vérifier l'utilisateur dans la DB**
   ```bash
   mongosh mongodb://localhost:27017/swigs-cms
   db.users.findOne({ _id: ObjectId("ID_DU_TOKEN") })
   ```

### Si 401 Unauthorized

1. **Le token est expiré** → Reconnecte-toi
2. **Le token est pour la mauvaise DB** → Vérifie que tu utilises bien `swigs-cms-backend`
3. **Le middleware cherche dans la mauvaise DB** → Vérifie `auth.middleware.js`

---

## ✅ Checklist de Résolution

- [ ] Frontend pointe sur `https://swigs.online/api` (pas monitoring-api)
- [ ] Le backend `swigs-cms-backend` tourne sur le port 3000
- [ ] La DB `swigs-cms` contient l'utilisateur
- [ ] Le token JWT est valide et non expiré
- [ ] Le middleware `auth.middleware.js` cherche dans `swigs-cms`
- [ ] Les routes `/api/public/nodes` fonctionnent sans token
- [ ] Les routes `/api/nodes` fonctionnent avec token

---

## 🎯 Prochaines Étapes

1. **Arrête de toucher au code** ✋
2. **Change l'URL de l'API** dans le frontend
3. **Teste le login** avec curl
4. **Vérifie que tu reçois un token valide**
5. **Utilise ce token** pour les requêtes protégées

---

## 📚 Références

- **Backend CMS** : `/home/swigs/swigs-apps/swigs-cms-backend`
- **Frontend SelfNodes** : `/var/www/selfnodes`
- **Nginx Config** : `/etc/nginx/sites-available/selfnodes.com`
- **PM2 Process** : `swigs-cms-backend` (ID 0)
- **MongoDB** : `mongodb://localhost:27017/swigs-cms`

---

## 🆘 Si ça ne marche toujours pas

Envoie-moi :
1. Le contenu de ton `.env.local`
2. Le résultat de `curl https://swigs.online/api/auth/login` avec tes credentials
3. Le token décodé sur jwt.io
4. Le résultat de `db.users.findOne({ _id: ObjectId("ID_DU_TOKEN") })`

**Bon courage ! 🚀**
