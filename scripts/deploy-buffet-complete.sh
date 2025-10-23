#!/bin/bash
# Script de déploiement complet pour le Buffet de la Gare

echo "🚀 Déploiement complet du Buffet de la Gare"
echo "============================================"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Backend CMS
echo ""
echo -e "${BLUE}1. Déploiement du Backend CMS${NC}"
cd ~/swigs-apps/swigs-cms-backend
git pull origin main
npm install
pm2 restart swigs-cms-backend
echo -e "${GREEN}✓ Backend CMS déployé${NC}"

# 2. CMS Admin
echo ""
echo -e "${BLUE}2. Déploiement du CMS Admin${NC}"
cd ~/swigs-apps/swigs-cms-admin
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/admin/
echo -e "${GREEN}✓ CMS Admin déployé${NC}"

# 3. Site Buffet de la Gare
echo ""
echo -e "${BLUE}3. Déploiement du site Buffet de la Gare${NC}"
cd ~/swigs-apps/buffet-de-la-gare-website
git pull origin main
npm install --legacy-peer-deps
npm run build
sudo cp -r dist/* /var/www/buffet-de-la-gare/
echo -e "${GREEN}✓ Site Buffet de la Gare déployé${NC}"

# 4. Correction du lien dans Control Center
echo ""
echo -e "${BLUE}4. Correction du lien dans Control Center${NC}"
cd ~/swigs-apps/swigs-infrastructure/scripts
node fix-buffet-link.js
echo -e "${GREEN}✓ Lien corrigé${NC}"

# 5. Mise à jour des informations du site
echo ""
echo -e "${BLUE}5. Mise à jour des informations du site${NC}"
node update-buffet-info.js
echo -e "${GREEN}✓ Informations mises à jour${NC}"

# 6. Création du SEO
echo ""
echo -e "${BLUE}6. Création du SEO${NC}"
node create-buffet-seo.js
echo -e "${GREEN}✓ SEO créé${NC}"

# 7. Création du menu
echo ""
echo -e "${BLUE}7. Création du menu${NC}"
node create-buffet-menu.js
echo -e "${GREEN}✓ Menu créé${NC}"

# 8. Fix des uploads
echo ""
echo -e "${BLUE}8. Correction des uploads${NC}"
bash fix-uploads-ssl.sh
echo -e "${GREEN}✓ Uploads corrigés${NC}"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Déploiement complet terminé !${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Vérifiez les sites :"
echo "  - CMS Admin: https://admin.swigs.online"
echo "  - Buffet de la Gare: https://buffet-de-la-gare.swigs.online"
echo "  - Control Center: https://monitoring.swigs.online"
