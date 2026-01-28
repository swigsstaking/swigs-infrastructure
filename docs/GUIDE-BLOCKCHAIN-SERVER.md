# Guide : Infrastructure Blockchain SWIGS

Ce guide explique l'architecture de monitoring des serveurs blockchain et comment ajouter un nouveau serveur.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RÉSEAU LOCAL                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                                           │
│  │   Raspberry Pi   │ ← Agent SWIGS (192.168.110.78)            │
│  │   (Agent)        │   - Poll les commandes depuis le CMS      │
│  └────────┬─────────┘   - Exécute via SSH sur les serveurs      │
│           │                                                      │
│           │ SSH (multi-serveur)                                  │
│           ▼                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  Serveur ETH     │  │  Serveur Gnosis  │                     │
│  │  192.168.110.64  │  │  192.168.110.XX  │                     │
│  │  (eth-docker)    │  │  (eth-docker)    │                     │
│  └──────────────────┘  └──────────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
           │
           │ HTTPS (API CMS)
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVEUR SWIGS (192.168.110.73)               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │ CMS Backend      │────▶│    MongoDB       │                  │
│  │ (port 3000)      │     │ (NodeServers,    │                  │
│  │                  │     │  Commands)       │                  │
│  └──────────────────┘     └──────────────────┘                  │
│           ▲                                                      │
│           │                                                      │
│  ┌──────────────────┐                                           │
│  │ Control Center   │ ← https://monitoring.swigs.online         │
│  │ (React App)      │                                           │
│  └──────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Flux de commandes

1. **Admin clique "Mettre à jour" ou "Version"** dans le Control Center
2. **CMS Backend** crée une commande dans MongoDB avec la config SSH du serveur cible
3. **Agent Raspberry Pi** poll les commandes toutes les 10 secondes
4. **Agent exécute** la commande via SSH sur le serveur cible
5. **Agent met à jour** le statut et la version dans MongoDB
6. **Control Center** affiche le résultat

---

## ✅ Ajouter un nouveau serveur blockchain

### Étape 1 : Ajouter le serveur dans le Control Center

1. Aller sur **https://monitoring.swigs.online** → **Selfnodes** → **Serveurs Blockchain**
2. Cliquer sur **"Ajouter"**
3. Remplir :
   - **Nom** : ex. "Validateur Gnosis"
   - **Réseau** : Gnosis, Ethereum, ou Lukso
   - **Adresse IP** : ex. 192.168.110.XX

### Étape 2 : Configurer l'accès SSH depuis le Raspberry Pi

```bash
# Se connecter au Raspberry Pi
ssh swigs@192.168.110.78

# Copier la clé SSH vers le nouveau serveur
ssh-copy-id -i ~/.ssh/id_rsa.pub swigs@192.168.110.XX

# Tester la connexion
ssh swigs@192.168.110.XX "hostname && uptime"
```

### Étape 3 : Installer eth-docker sur le serveur cible

```bash
# Se connecter au serveur cible
ssh swigs@192.168.110.XX

# Installer eth-docker dans le home directory
cd ~
git clone https://github.com/eth-educators/eth-docker.git
cd eth-docker

# Configurer le réseau (choisir Gnosis, Ethereum, etc.)
./ethd config

# Démarrer
./ethd up
```

> **Note** : Les commandes sont exécutées depuis `~/eth-docker` car `ethd` n'est pas dans le PATH pour les sessions SSH non-interactives.

### Étape 4 : Tester depuis le Raspberry Pi

```bash
# Depuis le Raspberry Pi
ssh swigs@192.168.110.XX "cd ~/eth-docker && ./ethd version"
```

### Étape 5 : Vérifier dans le Control Center

1. Cliquer sur le bouton **"Version"** à côté du serveur
2. Attendre ~10 secondes (temps de poll de l'agent)
3. La version devrait s'afficher (ex: "v2.18.0.4")

---

## 🛠️ Commandes disponibles

### Depuis le Control Center

| Bouton | Action | Commande SSH exécutée |
|--------|--------|----------------------|
| **Mettre à jour** | Met à jour eth-docker | `cd ~/eth-docker && ./ethd update && ./ethd up` |
| **Version** | Vérifie la version | `cd ~/eth-docker && ./ethd version` |

### Manuellement sur le serveur

```bash
cd ~/eth-docker

# Voir les logs
./ethd logs

# Statut des conteneurs
./ethd ps

# Mise à jour manuelle
./ethd update
./ethd up

# Arrêter
./ethd down
```

---

## 🔧 Configuration de l'agent (Raspberry Pi)

L'agent est dans `~/swigs-node-agent/` sur le Raspberry Pi.

### Fichier .env

```env
CMS_API_URL=http://192.168.110.73:3000/api
NODE_AGENT_KEY=8d33d4e3528e0c0346ee5c3b817f02dbb4179214a5fa5ff4f8fc66c20ae2ceb2
NODE_ID=692421917995954d267f616e

# Configuration SSH par défaut (utilisée si pas de serverConfig dans la commande)
REMOTE_HOST=192.168.110.64
REMOTE_PORT=22
REMOTE_USER=swigs
REMOTE_KEY_PATH=/home/swigs/.ssh/id_rsa
```

### Redémarrer l'agent

```bash
ssh swigs@192.168.110.78
pkill -f "node.*index.js"
cd ~/swigs-node-agent
nohup /snap/bin/node src/index.js > agent.log 2>&1 &
```

### Voir les logs

```bash
ssh swigs@192.168.110.78 "tail -f ~/swigs-node-agent/agent.log"
```

---

## 🔒 Prérequis serveur blockchain

### Matériel minimum

| Réseau | RAM | SSD | CPU |
|--------|-----|-----|-----|
| Ethereum | 32 GB | 2 TB NVMe | 4 cores |
| Gnosis | 16 GB | 500 GB SSD | 4 cores |
| Lukso | 16 GB | 500 GB SSD | 4 cores |

### Logiciels

```bash
# Installer Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Créer utilisateur swigs
sudo useradd -m -s /bin/bash swigs
sudo usermod -aG docker swigs
```

---

## 🔧 Dépannage

### La commande ne s'exécute pas

1. Vérifier que l'agent tourne :
   ```bash
   ssh swigs@192.168.110.78 "ps aux | grep node"
   ```

2. Vérifier les logs de l'agent :
   ```bash
   ssh swigs@192.168.110.78 "tail -50 ~/swigs-node-agent/agent.log"
   ```

3. Vérifier la connexion SSH :
   ```bash
   ssh swigs@192.168.110.78 "ssh swigs@192.168.110.XX 'hostname'"
   ```

### ethd: command not found

eth-docker n'est pas installé globalement. Installer avec :

```bash
cd /usr/share/eth-docker
sudo ./ethd install
```

### Permission denied (SSH)

Copier la clé SSH :

```bash
ssh swigs@192.168.110.78
ssh-copy-id -i ~/.ssh/id_rsa.pub swigs@192.168.110.XX
```

---

## 📞 Support

- **Documentation eth-docker** : https://eth-docker.net
- **GitHub SWIGS** : https://github.com/swigsstaking
