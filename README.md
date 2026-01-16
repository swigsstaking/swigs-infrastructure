# 🛠️ SWIGS Infrastructure

Scripts de déploiement, configurations et **documentation complète** pour l'infrastructure SWIGS.

## 📋 Contenu

### 📚 Documentation

- **[Architecture Complète](docs/ARCHITECTURE.md)** - Documentation détaillée de l'architecture SWIGS
- **[Quick Start Nouveau Site](docs/QUICK_START_NEW_SITE.md)** - Guide rapide pour créer un nouveau site

### 🔧 Scripts

- **`install-server.sh`** - Installation automatique du monitoring sur un nouveau serveur
- **`setup-deploy-permissions.sh`** - Configuration des permissions de déploiement

### ⚙️ Configurations

- **`nginx-configs/`** - Configurations Nginx pour tous les services
- **`pm2-ecosystem/`** - Fichiers ecosystem PM2

## 🚀 Utilisation

### Installer le Monitoring sur un Nouveau Serveur

Remplacez `server-X` par l'ID de votre serveur (ex: server-2, server-3) :

```bash
curl -fsSL https://raw.githubusercontent.com/swigsstaking/swigs-infrastructure/main/install-server.sh -o install.sh && sudo bash install.sh server-X
```

**Exemple :**
```bash
curl -fsSL https://raw.githubusercontent.com/swigsstaking/swigs-infrastructure/main/install-server.sh -o install.sh && sudo bash install.sh server-2
```

Le script va :
- ✅ Télécharger et installer Node.js, PM2, Nginx
- ✅ Cloner le repository de monitoring
- ✅ Configurer le collecteur avec l'ID fourni
- ✅ Démarrer le service automatiquement

### Configurer les Permissions de Déploiement

```bash
bash setup-deploy-permissions.sh
```

## 📦 Architecture SWIGS

```
swigsstaking/
├── swigs-cms-admin/          # Admin multi-sites V1
├── swigs-cms-admin-v2/       # Admin multi-sites V2 (production)
├── swigs-cms-backend/        # API backend CMS + E-commerce
├── speedl-website/           # Site Speed-L
├── buffet-de-la-gare-website/  # Site Buffet de la Gare
├── selfnodes/                # Site SelfNodes (validators)
├── swigs-control-center/     # Dashboard monitoring
├── swigs-monitoring-api/     # API monitoring
├── swigs-monitoring-agent/   # Agent serveur principal
└── swigs-infrastructure/     # Scripts & configs (ce repo)
```

## 🔗 Liens

- [Admin](https://github.com/swigsstaking/swigs-cms-admin)
- [Backend](https://github.com/swigsstaking/swigs-cms-backend)
- [Speed-L](https://github.com/swigsstaking/speedl-website)
- [Control Center](https://github.com/swigsstaking/swigs-control-center)
- [Monitoring API](https://github.com/swigsstaking/swigs-monitoring-api)
- [Monitoring Agent](https://github.com/swigsstaking/swigs-monitoring-agent)
- [Server Collector](https://github.com/swigsstaking/swigs-server-collector)

## 📝 License

MIT
