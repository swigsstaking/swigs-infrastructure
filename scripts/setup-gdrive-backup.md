# 🔧 Configuration Backup Google Drive

## Prérequis

### 1. Installer rclone sur le serveur

```bash
ssh swigs@192.168.110.73

# Installer rclone
curl https://rclone.org/install.sh | sudo bash

# Vérifier l'installation
rclone version
```

### 2. Configurer Google Drive

```bash
# Lancer la configuration interactive
rclone config

# Suivre les étapes :
# 1. n (new remote)
# 2. gdrive (nom du remote)
# 3. 18 (Google Drive)
# 4. Laisser client_id vide (Entrée)
# 5. Laisser client_secret vide (Entrée)
# 6. 1 (Full access)
# 7. Laisser service_account_file vide (Entrée)
# 8. n (pas de config avancée)
# 9. n (pas d'auto config car serveur headless)
# 10. Copier le lien, l'ouvrir sur ton Mac, autoriser, copier le code
# 11. Coller le code
# 12. n (pas de shared drive)
# 13. y (confirmer)
# 14. q (quitter)
```

### 3. Tester la connexion

```bash
# Lister les fichiers Google Drive
rclone ls gdrive:

# Créer le dossier de backup
rclone mkdir gdrive:SWIGS-Backups/mongodb

# Test d'upload
echo "test" > /tmp/test.txt
rclone copy /tmp/test.txt gdrive:SWIGS-Backups/
rclone ls gdrive:SWIGS-Backups/
rm /tmp/test.txt
```

### 4. Mettre à jour le cron

```bash
# Éditer le crontab
crontab -e

# Remplacer l'ancienne ligne par :
0 3 * * * /home/swigs/scripts/backup-mongodb-gdrive.sh >> /home/swigs/backups/mongodb/backup.log 2>&1
```

### 5. Copier le nouveau script

```bash
# Depuis ton Mac
scp /Users/corentinflaction/CascadeProjects/swigs-infrastructure/scripts/backup-mongodb-gdrive.sh swigs@192.168.110.73:/home/swigs/scripts/

# Sur le serveur
chmod +x /home/swigs/scripts/backup-mongodb-gdrive.sh
```

### 6. Tester le backup complet

```bash
/home/swigs/scripts/backup-mongodb-gdrive.sh
```

## Vérification

```bash
# Vérifier les backups locaux
ls -la /home/swigs/backups/mongodb/

# Vérifier les backups Google Drive
rclone ls gdrive:SWIGS-Backups/mongodb/
```

## Notes

- **Gratuit** : Google Drive offre 15GB gratuits
- **Rétention** : 7 jours localement et sur Google Drive
- **Sécurité** : Les backups sont compressés (.tar.gz)
- **Automatique** : Cron à 3h du matin chaque jour
