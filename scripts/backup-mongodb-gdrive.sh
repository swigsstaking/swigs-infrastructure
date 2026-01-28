#!/bin/bash

# ============================================
# Script de Backup MongoDB avec Google Drive
# ============================================
# Sauvegarde quotidienne + upload vers Google Drive
# Prérequis: rclone configuré avec un remote "gdrive"
# ============================================

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/swigs/backups/mongodb"
DB_NAME="swigs-cms"
RETENTION_DAYS=7
GDRIVE_REMOTE="gdrive"
GDRIVE_FOLDER="SWIGS-Backups/mongodb"

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

log "🔄 Démarrage du backup MongoDB..."
log "Base de données: $DB_NAME"

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Vérifier que MongoDB est accessible
if ! mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
    error "MongoDB n'est pas accessible!"
    exit 1
fi

# Créer le backup
BACKUP_FILE="$BACKUP_DIR/${DATE}"
log "📦 Création du backup dans $BACKUP_FILE..."

mongodump --db="$DB_NAME" --out="$BACKUP_FILE" --quiet

if [ $? -ne 0 ]; then
    error "Échec du mongodump!"
    exit 1
fi

# Compresser le backup
log "🗜️ Compression du backup..."
tar -czf "${BACKUP_FILE}.tar.gz" -C "$BACKUP_DIR" "${DATE}"
rm -rf "$BACKUP_FILE"

BACKUP_SIZE=$(du -h "${BACKUP_FILE}.tar.gz" | cut -f1)
log "✅ Backup local créé: ${BACKUP_FILE}.tar.gz ($BACKUP_SIZE)"

# Upload vers Google Drive (si rclone est configuré)
if command -v rclone &> /dev/null; then
    if rclone listremotes | grep -q "^${GDRIVE_REMOTE}:"; then
        log "☁️ Upload vers Google Drive..."
        
        # Créer le dossier distant si nécessaire
        rclone mkdir "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}" 2>/dev/null
        
        # Upload
        if rclone copy "${BACKUP_FILE}.tar.gz" "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}/" --progress; then
            log "✅ Upload Google Drive réussi!"
            
            # Nettoyer les vieux backups sur Google Drive (garder 7 jours)
            log "🧹 Nettoyage des anciens backups sur Google Drive..."
            rclone delete "${GDRIVE_REMOTE}:${GDRIVE_FOLDER}" --min-age ${RETENTION_DAYS}d 2>/dev/null
        else
            warn "Échec de l'upload Google Drive (backup local conservé)"
        fi
    else
        warn "Remote rclone '$GDRIVE_REMOTE' non configuré - backup local uniquement"
    fi
else
    warn "rclone non installé - backup local uniquement"
fi

# Nettoyer les anciens backups locaux
log "🧹 Nettoyage des backups locaux > $RETENTION_DAYS jours..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Compter les backups restants
LOCAL_COUNT=$(ls -1 "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)
log "📊 Backups locaux conservés: $LOCAL_COUNT"

log "✅ Backup terminé avec succès!"
echo ""
