# Guide Complet Ansible - ShopHub E-Commerce

Guide détaillé pour déployer ShopHub sur une VM Ubuntu avec Ansible.

## 📚 Table des Matières

1. [Installation Ansible](#installation-ansible)
2. [Configuration SSH](#configuration-ssh)
3. [Configuration de l'Inventaire](#configuration-inventaire)
4. [Exécution du Playbook](#execution-playbook)
5. [Vérification du Déploiement](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Playbook Détaillé](#playbook-détaillé)

---

## 1. Installation Ansible

### Sur macOS

```bash
# Avec Homebrew
brew install ansible

# Ou avec pip
pip3 install ansible
```

### Sur Ubuntu/Debian

```bash
sudo apt update
sudo apt install ansible -y
```

### Sur Windows (WSL2)

```bash
# Dans WSL2 Ubuntu
sudo apt update
sudo apt install ansible -y
```

### Vérifier l'installation

```bash
ansible --version

# Attendu: ansible [core 2.xx.x]
```

---

## 2. Configuration SSH

### Générer une clé SSH (si nécessaire)

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Appuyez sur Entrée pour accepter le chemin par défaut (~/.ssh/id_ed25519)
```

### Copier la clé sur la VM

```bash
ssh-copy-id ubuntu@192.168.1.100
# Entrez le mot de passe de la VM
```

### Tester la connexion

```bash
ssh ubuntu@192.168.1.100
# Vous devriez vous connecter sans mot de passe
exit
```

---

## 3. Configuration de l'Inventaire

### Éditer `inventory.ini`

```ini
[ecommerce_servers]
# Remplacez par votre IP
vm-ecommerce ansible_host=192.168.1.100

[ecommerce_servers:vars]
# Adaptez selon votre configuration
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa
ansible_become=yes
ansible_become_method=sudo

# Variables de déploiement
k8s_manifests_path=/home/ubuntu/k8s
app_namespace=ecommerce
deployment_type=k3s
```

### Tester la configuration

```bash
# Ping tous les hôtes
ansible all -i inventory.ini -m ping

# Vérifier les facts
ansible ecommerce_servers -i inventory.ini -m setup -a "filter=ansible_distribution*"

# Résultat attendu:
# vm-ecommerce | SUCCESS => {
#     "ansible_facts": {
#         "ansible_distribution": "Ubuntu",
#         "ansible_distribution_release": "jammy",
#         "ansible_distribution_version": "22.04"
#     }
# }
```

---

## 4. Exécution du Playbook

### Exécution Complète

```bash
cd ansible

# Exécution standard
ansible-playbook -i inventory.ini deploy_app.yml

# Avec verbose (recommandé première fois)
ansible-playbook -i inventory.ini deploy_app.yml -v

# Dry-run (voir ce qui serait fait)
ansible-playbook -i inventory.ini deploy_app.yml --check
```

### Exécution par Étapes

```bash
# Seulement installation Docker
ansible-playbook -i inventory.ini deploy_app.yml --tags docker

# Seulement installation Kubernetes
ansible-playbook -i inventory.ini deploy_app.yml --tags kubernetes

# Seulement déploiement app
ansible-playbook -i inventory.ini deploy_app.yml --tags deploy
```

### Exécution Interactive

```bash
# Demande confirmation avant chaque tâche
ansible-playbook -i inventory.ini deploy_app.yml --step
```

---

## 5. Vérification du Déploiement

### Connexion à la VM

```bash
ssh ubuntu@192.168.1.100
```

### Vérifier Kubernetes

```bash
# Vérifier le cluster
kubectl get nodes

# Résultat attendu:
# NAME    STATUS   ROLES                  AGE   VERSION
# vm-xxx  Ready    control-plane,master   10m   v1.xx.x

# Vérifier les pods
kubectl get pods -n ecommerce

# Résultat attendu:
# NAME                                   READY   STATUS    RESTARTS   AGE
# backend-deployment-xxx                 1/1     Running   0          5m
# frontend-deployment-xxx                1/1     Running   0          5m
# postgres-deployment-xxx                1/1     Running   0          6m

# Vérifier les services
kubectl get services -n ecommerce

# Vérifier tout
kubectl get all -n ecommerce
```

### Tester l'Accès

```bash
# Sur la VM, port forward
kubectl port-forward -n ecommerce service/frontend-service 3000:3000 &

# Tester avec curl
curl http://localhost:3000

# Ou utiliser le script créé par Ansible
~/k8s/access-frontend.sh
```

### Depuis votre Machine Locale

```bash
# Option 1: SSH tunnel
ssh -L 3000:localhost:3000 ubuntu@192.168.1.100
# Puis ouvrir http://localhost:3000

# Option 2: NodePort direct
# Ouvrir http://192.168.1.100:30000
```

---

## 6. Troubleshooting

### Problème: Ansible ne peut pas se connecter

```bash
# Vérifier la connexion SSH manuelle
ssh ubuntu@192.168.1.100

# Vérifier les variables
ansible-inventory -i inventory.ini --list

# Tester avec verbose
ansible ecommerce_servers -i inventory.ini -m ping -vvv
```

**Solutions:**
- Vérifier l'IP dans inventory.ini
- Vérifier le chemin de la clé SSH
- Vérifier que l'utilisateur existe sur la VM
- Vérifier le firewall (port 22 ouvert)

### Problème: "sudo: a password is required"

Si sudo demande un mot de passe, ajoutez :

```ini
[ecommerce_servers:vars]
ansible_become_pass=votre-password-sudo
```

Ou utilisez :
```bash
ansible-playbook -i inventory.ini deploy_app.yml --ask-become-pass
```

### Problème: Installation Docker échoue

```bash
# Vérifier la connexion internet de la VM
ansible ecommerce_servers -i inventory.ini -m command -a "ping -c 3 google.com"

# Vérifier la version Ubuntu
ansible ecommerce_servers -i inventory.ini -m command -a "lsb_release -a"
```

### Problème: K3s ne démarre pas

```bash
# Se connecter à la VM
ssh ubuntu@192.168.1.100

# Vérifier le statut K3s
sudo systemctl status k3s

# Voir les logs
sudo journalctl -u k3s -n 50

# Réinstaller K3s
sudo /usr/local/bin/k3s-uninstall.sh
# Puis réexécuter le playbook
```

### Problème: Pods ne démarrent pas

```bash
# Sur la VM
kubectl get pods -n ecommerce
kubectl describe pod <pod-name> -n ecommerce
kubectl logs <pod-name> -n ecommerce

# Vérifier les images
kubectl get pods -n ecommerce -o jsonpath='{.items[*].spec.containers[*].image}'
```

### Problème: Images ne se téléchargent pas

Les manifests utilisent des images :
- `your-dockerhub-username/ecommerce-backend:latest`
- `your-dockerhub-username/ecommerce-frontend:latest`

**Solutions:**
1. Utiliser `minikube-test.yaml` qui utilise `imagePullPolicy: Never` avec images locales
2. Ou pusher vos images sur Docker Hub et modifier les manifests

---

## 7. Playbook Détaillé

### Structure des Rôles

#### install_docker
**Tâches:**
1. Update APT cache
2. Install prerequisites
3. Add Docker GPG key
4. Add Docker repository
5. Install Docker Engine
6. Start and enable Docker service
7. Add user to docker group
8. Install Docker SDK for Python
9. Verify installation

**Durée:** ~5 minutes

#### install_kubernetes
**Tâches:**
1. Check if K3s already installed
2. Download and install K3s
3. Wait for K3s to be ready
4. Create .kube directory
5. Copy kubeconfig
6. Create kubectl symlink
7. Verify cluster is operational
8. Display cluster information

**Durée:** ~3 minutes

#### deploy_app
**Tâches:**
1. Create manifests directory
2. Copy Kubernetes manifests
3. Apply namespace
4. Apply ConfigMaps
5. Apply Secrets
6. Deploy PostgreSQL
7. Wait for PostgreSQL ready
8. Deploy Backend
9. Wait for Backend ready
10. Deploy Frontend
11. Wait for Frontend ready
12. Verify all pods
13. Verify all services
14. Get NodePort
15. Test frontend access
16. Create access script
17. Display access information

**Durée:** ~5 minutes

---

## 🚀 Workflow Complet

### Première Fois

```bash
# 1. Préparer votre machine
pip install ansible

# 2. Configurer l'inventaire
cd ansible
vim inventory.ini  # Modifier l'IP

# 3. Tester la connexion
ansible ecommerce_servers -i inventory.ini -m ping

# 4. Déployer
ansible-playbook -i inventory.ini deploy_app.yml

# 5. Accéder à l'application
ssh ubuntu@192.168.1.100
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

### Mise à Jour

```bash
# 1. Modifier le code si nécessaire

# 2. Redéployer seulement l'app
ansible-playbook -i inventory.ini deploy_app.yml --tags deploy

# 3. Ou tout redéployer
ansible-playbook -i inventory.ini deploy_app.yml
```

---

## 📊 Variables d'Environnement

Le playbook utilise les variables suivantes (modifiables dans `inventory.ini`) :

```yaml
# Chemins
manifests_local_path: "../k8s"           # Chemin local des manifests
manifests_remote_path: "/home/ubuntu/k8s" # Chemin distant

# Kubernetes
namespace: "ecommerce"                    # Namespace K8s
k8s_type: "k3s"                          # Type d'installation K8s

# Connexion
ansible_user: "ubuntu"                    # Utilisateur SSH
ansible_host: "192.168.1.100"            # IP de la VM
```

---

## 🎯 Résultat Final

Après exécution réussie du playbook, vous aurez :

✅ Docker installé et configuré  
✅ K3s (Kubernetes) installé et opérationnel  
✅ Application déployée (3 pods Running)  
✅ Services créés (ClusterIP + NodePort)  
✅ PVC provisionné (1Gi)  
✅ Script d'accès créé (`~/k8s/access-frontend.sh`)  
✅ Fichier d'informations (`~/k8s/deployment_info.txt`)  
✅ Application accessible  

---

## 🎊 Conclusion

Ce playbook Ansible vous permet de déployer automatiquement ShopHub E-Commerce sur n'importe quelle VM Ubuntu en ~15 minutes, avec zéro intervention manuelle !

**Commande unique:**
```bash
ansible-playbook -i inventory.ini deploy_app.yml
```

**Résultat:** Application production-ready déployée et accessible ! 🚀

