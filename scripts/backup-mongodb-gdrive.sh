#!/bin/bash

# ============================================
# Script de Backup SWIGS avec Google Drive
# ============================================
# Sauvegarde quotidienne : MongoDB + Nginx configs
# Prérequis: rclone configuré avec un remote "gdrive"
# ============================================

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/swigs/backups"
DB_NAME="swigs-cms"
RETENTION_DAYS=7
GDRIVE_REMOTE="gdrive"
GDRIVE_FOLDER="SWIGS-Backups"

# Dossiers de backup
MONGO_BACKUP_DIR="$BACKUP_DIR/mongodb"
NGINX_BACKUP_DIR="$BACKUP_DIR/nginx"

# Couleurs pour les logs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

log "🔄 Démarrage du backup SWIGS..."
log "Base de données: $DB_NAME"

# Créer les dossiers de backup s'ils n'existent pas
mkdir -p "$MONGO_BACKUP_DIR"
mkdir -p "$NGINX_BACKUP_DIR"

# Vérifier que MongoDB est accessible
if ! mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
    error "MongoDB n'est pas accessible!"
    exit 1
fi

# ==========================================
# 1. BACKUP MONGODB
# ==========================================
MONGO_BACKUP_FILE="$MONGO_BACKUP_DIR/${DATE}"
log "📦 Création du backup MongoDB..."

mongodump --db="$DB_NAME" --out="$MONGO_BACKUP_FILE" --quiet

if [ $? -ne 0 ]; then
    error "Échec du mongodump!"
    exit 1
fi

# Compresser le backup MongoDB
log "🗜️ Compression du backup MongoDB..."
tar -czf "${MONGO_BACKUP_FILE}.tar.gz" -C "$MONGO_BACKUP_DIR" "${DATE}"
rm -rf "$MONGO_BACKUP_FILE"

MONGO_SIZE=$(du -h "${MONGO_BACKUP_FILE}.tar.gz" | cut -f1)
log "✅ Backup MongoDB créé: ${MONGO_BACKUP_FILE}.tar.gz ($MONGO_SIZE)"

# ==========================================
# 2. BACKUP NGINX CONFIGS
# ==========================================
NGINX_BACKUP_FILE="$NGINX_BACKUP_DIR/nginx-${DATE}.tar.gz"
log "📦 Création du backup Nginx..."

# Backup des configs Nginx (sites-available, nginx.conf)
sudo tar -czf "$NGINX_BACKUP_FILE" \
    /etc/nginx/sites-available/ \
    /etc/nginx/nginx.conf \
    2>/dev/null

if [ $? -eq 0 ]; then
    NGINX_SIZE=$(du -h "$NGINX_BACKUP_FILE" | cut -f1)
    log "✅ Backup Nginx créé: $NGINX_BACKUP_FILE ($NGINX_SIZE)"
else
    warn "Échec du backup Nginx (permissions?)"
fi

# ==========================================
# 3. UPLOAD VERS GOOGLE DRIVE
# ==========================================
if command -v rclone &> /dev/null; then
    if rclone listremotes | grep -q "^${GDRIVE_REMOTE}:"; then
        log "☁️ Upload vers Google Drive..."
        
        # Créer les dossiers distants si nécessaire
        rclone mkdir "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}/mongodb" 2>/dev/null
        rclone mkdir "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}/nginx" 2>/dev/null
        
        # Upload MongoDB
        if rclone copy "${MONGO_BACKUP_FILE}.tar.gz" "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}/mongodb/" --progress; then
            log "✅ Upload MongoDB vers Google Drive réussi!"
        else
            warn "Échec de l'upload MongoDB vers Google Drive"
        fi
        
        # Upload Nginx (si le backup existe)
        if [ -f "$NGINX_BACKUP_FILE" ]; then
            if rclone copy "$NGINX_BACKUP_FILE" "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}/nginx/" --progress; then
                log "✅ Upload Nginx vers Google Drive réussi!"
            else
                warn "Échec de l'upload Nginx vers Google Drive"
            fi
        fi
        
        # Nettoyer les vieux backups sur Google Drive (garder 7 jours)
        log "🧹 Nettoyage des anciens backups sur Google Drive..."
        rclone delete "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}/mongodb" --min-age ${RETENTION_DAYS}d 2>/dev/null
        rclone delete "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}/nginx" --min-age ${RETENTION_DAYS}d 2>/dev/null
    else
        warn "Remote rclone '$GDRIVE_REMOTE' non configuré - backup local uniquement"
    fi
else
    warn "rclone non installé - backup local uniquement"
fi

# ==========================================
# 4. NETTOYAGE LOCAL
# ==========================================
log "🧹 Nettoyage des backups locaux > $RETENTION_DAYS jours..."
find "$MONGO_BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$NGINX_BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Compter les backups restants
MONGO_COUNT=$(ls -1 "$MONGO_BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)
NGINX_COUNT=$(ls -1 "$NGINX_BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)
log "📊 Backups locaux conservés: MongoDB=$MONGO_COUNT, Nginx=$NGINX_COUNT"

log "✅ Backup SWIGS terminé avec succès!"
echo ""
