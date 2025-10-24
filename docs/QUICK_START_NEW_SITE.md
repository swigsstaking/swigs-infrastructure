# ⚡ Quick Start : Créer un Nouveau Site SWIGS

Guide rapide pour Claude AI ou développeurs.

---

## 🎯 Checklist Complète

### Phase 1 : Création du Projet (Local)

- [ ] Créer le repo GitHub `nouveau-site-website`
- [ ] Initialiser avec React + Vite
- [ ] Copier la structure de `speedl-website`
- [ ] Configurer Tailwind CSS
- [ ] Créer les composants de base (Layout, SEOHead, Logo)
- [ ] Créer les hooks (useSEO, useSiteInfo)
- [ ] Créer les pages (Home, Contact, etc.)
- [ ] Tester en local (`npm run dev`)
- [ ] Commit et push sur GitHub

### Phase 2 : Configuration CMS (Admin)

- [ ] Se connecter à https://admin.swigs.online
- [ ] Créer le site dans **Sites** → **Nouveau Site**
  - Nom, slug, domaine, description, logo
- [ ] Configurer le SEO dans **SEO** → **Nouveau SEO**
  - Une entrée par page (home, contact, etc.)
- [ ] Cliquer sur "Mettre à jour la DB" pour générer `seo.json`
- [ ] Vérifier que `src/data/seo.json` est créé dans le repo du site

### Phase 3 : Configuration Monitoring (Control Center)

- [ ] Se connecter à https://monitoring.swigs.online
- [ ] Créer le site dans **Sites** → **Nouveau Site**
  - Site ID, nom, domaine, serveur
- [ ] Configurer le pricing dans **Sites** → **Pricing**
  - Prix mensuel, coûts serveur, bande passante

### Phase 4 : Déploiement Serveur

- [ ] SSH sur le serveur : `ssh swigs@serveur`
- [ ] Cloner le repo : `git clone git@github.com:swigsstaking/nouveau-site-website.git`
- [ ] Installer : `cd nouveau-site-website && npm install`
- [ ] Builder : `npm run build`
- [ ] Créer config Nginx : `/etc/nginx/sites-available/nouveau-site.swigs.online`
- [ ] Activer le site : `ln -s /etc/nginx/sites-available/... /etc/nginx/sites-enabled/`
- [ ] Tester Nginx : `sudo nginx -t`
- [ ] Recharger Nginx : `sudo nginx -s reload`
- [ ] Créer dossier web : `sudo mkdir -p /var/www/nouveau-site`
- [ ] Déployer : `sudo cp -r dist/* /var/www/nouveau-site/`
- [ ] Configurer SSL : `sudo certbot --nginx -d nouveau-site.swigs.online`
- [ ] Tester le site : https://nouveau-site.swigs.online

### Phase 5 : Finalisation

- [ ] Créer script de déploiement `deploy.sh`
- [ ] Tester le workflow de mise à jour
- [ ] Vérifier les métriques dans le Control Center
- [ ] Vérifier les logs Nginx
- [ ] Documentation du projet (README.md)

---

## 📋 Commandes Rapides

### Création Projet

```bash
# Local
cd ~/CascadeProjects/swigs-repos
mkdir nouveau-site-website && cd nouveau-site-website
npm create vite@latest . -- --template react
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Copier structure depuis speedl-website
cp -r ../speedl-website/src/components ./src/
cp -r ../speedl-website/src/hooks ./src/
cp ../speedl-website/src/components/SEOHead.jsx ./src/components/
cp ../speedl-website/tailwind.config.js ./

# Git
git init
git add -A
git commit -m "Initial commit: Nouveau site"
git remote add origin git@github.com:swigsstaking/nouveau-site-website.git
git push -u origin main
```

### Déploiement Serveur

```bash
# Sur le serveur
ssh swigs@serveur

# Cloner et builder
cd ~/swigs-apps
git clone git@github.com:swigsstaking/nouveau-site-website.git
cd nouveau-site-website
npm install
npm run build

# Nginx config
sudo nano /etc/nginx/sites-available/nouveau-site.swigs.online
# (Copier config depuis speedl-website)

sudo ln -s /etc/nginx/sites-available/nouveau-site.swigs.online /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

# Déployer
sudo mkdir -p /var/www/nouveau-site
sudo cp -r dist/* /var/www/nouveau-site/
sudo chown -R swigs:www-data /var/www/nouveau-site

# SSL
sudo certbot --nginx -d nouveau-site.swigs.online
```

### Script de Déploiement

```bash
# ~/swigs-apps/nouveau-site-website/deploy.sh
#!/bin/bash
echo "🚀 Déploiement..."
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/nouveau-site/
echo "✅ Terminé !"
```

```bash
chmod +x deploy.sh
```

---

## 🔗 Connexions Importantes

### Backend CMS

**URL API** : `http://localhost:3000/api`

**Endpoints utilisés par les sites** :
- `GET /api/sites?slug=nouveau-site` - Infos du site
- `GET /api/seo?site=nouveau-site` - Données SEO
- `POST /api/contact` - Formulaire de contact
- `GET /api/courses?siteId=xxx` - Cours (si applicable)

### Monitoring API

**URL API** : `http://localhost:3001/api`

**Endpoints** :
- `GET /api/sites` - Liste des sites monitorés
- `GET /api/sites/:siteId` - Détails d'un site
- `POST /api/sites/:siteId/pagespeed` - Mesurer PageSpeed

### Fichiers Générés

Le backend génère automatiquement :
- `src/data/seo.json` - Données SEO du site

**Structure seo.json** :
```json
{
  "site": {
    "name": "Nouveau Site",
    "slug": "nouveau-site",
    "domain": "nouveau-site.swigs.online",
    "description": "Description"
  },
  "pages": {
    "home": {
      "title": "Accueil - Nouveau Site",
      "description": "Description de la page d'accueil",
      "keywords": ["mot1", "mot2"],
      "ogTitle": "Accueil",
      "ogDescription": "Description OG",
      "ogImage": "https://...",
      "canonical": "https://nouveau-site.swigs.online"
    }
  },
  "global": {
    "siteName": "Nouveau Site",
    "siteUrl": "https://nouveau-site.swigs.online",
    "logo": "https://...",
    "language": "fr",
    "social": {
      "facebook": "...",
      "instagram": "..."
    }
  }
}
```

---

## 🎨 Template de Base

### src/App.jsx

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
```

### src/components/Layout.jsx

```jsx
import { Link } from 'react-router-dom';
import { useSiteInfo } from '../hooks/useSiteInfo';
import Logo from './Logo';

const Layout = ({ children }) => {
  const siteInfo = useSiteInfo();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Logo />
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-primary-600">Accueil</Link>
              <Link to="/contact" className="hover:text-primary-600">Contact</Link>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 {siteInfo.name}. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
```

### src/pages/Home.jsx

```jsx
import SEOHead from '../components/SEOHead';
import { useSiteInfo } from '../hooks/useSiteInfo';

const Home = () => {
  const siteInfo = useSiteInfo();
  
  return (
    <>
      <SEOHead page="home" />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenue sur {siteInfo.name}
        </h1>
        <p className="text-xl text-gray-600">
          {siteInfo.description}
        </p>
      </div>
    </>
  );
};

export default Home;
```

---

## 🚨 Points d'Attention

### ⚠️ Erreurs Courantes

1. **SEO non généré** : Cliquer sur "Mettre à jour la DB" dans l'admin
2. **404 sur routes** : Vérifier `try_files` dans Nginx
3. **CORS errors** : Vérifier que le backend autorise le domaine
4. **SSL non configuré** : Lancer `certbot --nginx`
5. **Permissions** : `sudo chown -R swigs:www-data /var/www/nouveau-site`

### ✅ Vérifications

```bash
# Backend fonctionne
curl http://localhost:3000/api/health

# Monitoring fonctionne
curl http://localhost:3001/api/health

# Nginx config valide
sudo nginx -t

# Site accessible
curl -I https://nouveau-site.swigs.online

# Logs
pm2 logs swigs-cms-backend --lines 20
sudo tail -f /var/log/nginx/nouveau-site.access.log
```

---

## 📚 Références

- [Architecture Complète](./ARCHITECTURE.md)
- [speedl-website](https://github.com/swigsstaking/speedl-website) - Template de référence
- [swigs-cms-backend](https://github.com/swigsstaking/swigs-cms-backend) - API Backend
- [swigs-infrastructure](https://github.com/swigsstaking/swigs-infrastructure) - Scripts

---

**⏱️ Temps estimé : 2-3 heures pour un nouveau site complet**
