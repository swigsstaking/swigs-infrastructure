#!/bin/bash
# Script pour fixer le problème d'upload d'images (certificat SSL)

echo "🔧 Correction du problème d'upload d'images..."

# 1. Vérifier la config Nginx du CMS Admin
echo ""
echo "1. Vérification de la configuration Nginx..."
sudo cat /etc/nginx/sites-enabled/admin | grep -A 10 "location /uploads"

# 2. Ajouter la configuration si elle n'existe pas
echo ""
echo "2. Ajout de la configuration uploads dans Nginx..."

sudo tee -a /etc/nginx/sites-enabled/admin > /dev/null << 'EOF'

    # Uploads - Proxy vers le backend CMS
    location /uploads/ {
        proxy_pass http://localhost:3000/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
EOF

echo "✓ Configuration ajoutée"

# 3. Créer le dossier uploads dans le backend
echo ""
echo "3. Création du dossier uploads..."
mkdir -p ~/swigs-apps/swigs-cms-backend/uploads
sudo chown -R swigs:www-data ~/swigs-apps/swigs-cms-backend/uploads
sudo chmod -R 775 ~/swigs-apps/swigs-cms-backend/uploads
echo "✓ Dossier créé avec les bonnes permissions"

# 4. Tester et recharger Nginx
echo ""
echo "4. Test et rechargement de Nginx..."
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo nginx -s reload
    echo "✓ Nginx rechargé avec succès"
else
    echo "✗ Erreur dans la configuration Nginx"
    exit 1
fi

echo ""
echo "✅ Correction terminée !"
echo ""
echo "Les uploads devraient maintenant fonctionner via:"
echo "  https://admin.swigs.online/uploads/..."
