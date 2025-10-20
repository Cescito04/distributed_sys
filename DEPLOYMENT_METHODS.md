# 🚀 Méthodes de Déploiement - ShopHub E-Commerce

Ce projet supporte **3 méthodes de déploiement** différentes. Choisissez celle qui correspond à vos besoins.

---

## 📊 Comparaison Rapide

| Méthode | Complexité | Temps | Use Case | Recommandé Pour |
|---------|------------|-------|----------|-----------------|
| **Docker Compose** | ⭐ Facile | 2 min | Développement local | Débutants, dev local |
| **Kubernetes Manuel** | ⭐⭐⭐ Avancé | 10 min | Production | DevOps, staging/prod |
| **Ansible** | ⭐⭐ Moyen | 15 min | Automatisation VM | Production automatisée |

---

## 🐳 Méthode 1 : Docker Compose

### ✅ Avantages
- Ultra-rapide à démarrer
- Parfait pour le développement
- Pas besoin de connaissances Kubernetes
- Idéal pour tester rapidement

### ❌ Inconvénients
- Pas de haute disponibilité
- Pas d'auto-scaling
- Limité à une seule machine

### 🚀 Démarrage

```bash
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys
docker-compose up -d
```

**Accès:** http://localhost:3000

### 📚 Documentation
- [`QUICK_START.md`](QUICK_START.md) - Section Docker Compose
- [`README.md`](README.md#option-1--docker-compose)

---

## ☸️ Méthode 2 : Kubernetes Manuel

### ✅ Avantages
- Production-ready
- Haute disponibilité (replicas)
- Auto-healing
- Scaling horizontal facile
- Health checks avancés

### ❌ Inconvénients
- Courbe d'apprentissage
- Setup plus complexe
- Nécessite un cluster Kubernetes

### 🚀 Démarrage

#### Sur Minikube (Local)

```bash
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys

# Démarrer Minikube
minikube start --memory=4096 --cpus=2

# Builder images localement
eval $(minikube docker-env)
docker build -f backend/Dockerfile.k8s -t ecommerce-backend:k8s ./backend
docker build -t ecommerce-frontend:latest ./frontend

# Déployer
kubectl apply -f k8s/minikube-test.yaml

# Accéder
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

**Accès:** http://localhost:3000

#### Sur Cluster Cloud (GKE, EKS, AKS)

```bash
# 1. Builder et pusher images
./scripts/build-and-push.sh votre-username-dockerhub

# 2. Mettre à jour manifests
./scripts/update-k8s-images.sh votre-username-dockerhub

# 3. Déployer
kubectl apply -f k8s/

# 4. Accéder
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

### 📚 Documentation
- [`k8s/QUICK_START.md`](k8s/QUICK_START.md)
- [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md)
- [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)

---

## 🤖 Méthode 3 : Ansible (Automatisation)

### ✅ Avantages
- Déploiement 100% automatisé
- Idempotent (réexécutable sans erreur)
- Configuration as Code
- Support multi-environnements (dev/staging/prod)
- Installation complète de zéro

### ❌ Inconvénients
- Nécessite Ansible
- Nécessite une VM Ubuntu
- Temps de déploiement plus long (installation complète)

### 🚀 Démarrage

```bash
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys/ansible

# 1. Installer Ansible
pip install -r requirements.txt

# 2. Configurer inventaire
cp inventory.example.ini inventory.ini
# Éditer inventory.ini avec l'IP de votre VM

# 3. Tester connexion
ansible ecommerce_servers -i inventory.ini -m ping

# 4. Déployer TOUT automatiquement
ansible-playbook -i inventory.ini deploy_app.yml
```

**Accès:**
```bash
# Sur la VM
ssh ubuntu@VOTRE-IP
kubectl port-forward -n ecommerce service/frontend-service 3000:3000

# Ou via SSH tunnel depuis votre machine
ssh -L 3000:localhost:30000 ubuntu@VOTRE-IP
# http://localhost:3000
```

### 📚 Documentation
- [`ansible/QUICK_START_ANSIBLE.md`](ansible/QUICK_START_ANSIBLE.md)
- [`ansible/ANSIBLE_GUIDE.md`](ansible/ANSIBLE_GUIDE.md)
- [`ansible/README.md`](ansible/README.md)

---

## 🎯 Quelle Méthode Choisir ?

### Vous êtes... → Utilisez...

**Développeur débutant**
→ **Docker Compose** - Simple et rapide

**En phase de développement**
→ **Docker Compose** - Hot reload, debug facile

**DevOps préparant staging/production**
→ **Kubernetes Manuel** - Contrôle total

**SRE gérant plusieurs environnements**
→ **Ansible** - Automatisation complète

**Démo rapide pour client**
→ **Docker Compose** - Setup instantané

**Production critique avec HA**
→ **Kubernetes Manuel** - Résilience maximale

**Infrastructure as Code**
→ **Ansible** + **Kubernetes** - Best practices

---

## 📊 Comparaison Détaillée

### Temps de Déploiement

| Méthode | Installation | Déploiement | Total |
|---------|-------------|-------------|-------|
| Docker Compose | - | 2 min | **2 min** |
| K8s Minikube | 5 min | 5 min | **10 min** |
| K8s Cloud | - | 3 min | **3 min** |
| Ansible | 8 min | 7 min | **15 min** |

### Ressources Requises

| Méthode | CPU Min | RAM Min | Disque Min |
|---------|---------|---------|------------|
| Docker Compose | 2 cores | 4 GB | 10 GB |
| Kubernetes | 2 cores | 4 GB | 20 GB |
| Ansible | 2 cores | 4 GB | 20 GB |

### Niveau de Compétence

| Méthode | Niveau Requis |
|---------|---------------|
| Docker Compose | Débutant ⭐ |
| Kubernetes | Avancé ⭐⭐⭐ |
| Ansible | Intermédiaire ⭐⭐ |

---

## 🔄 Workflows Recommandés

### Workflow Développement

```
Local Dev → Docker Compose
    ↓
Tests → Docker Compose
    ↓
Code Review → Git
```

### Workflow Production

```
Dev → Docker Compose
    ↓
Build Images → Docker Hub
    ↓
Staging → Kubernetes (Ansible)
    ↓
Tests → Automated
    ↓
Production → Kubernetes (Ansible)
```

### Workflow DevOps

```
Infrastructure → Ansible (install Docker + K8s)
    ↓
Application → Ansible (deploy app)
    ↓
Monitoring → Prometheus + Grafana
    ↓
CI/CD → GitLab CI / GitHub Actions
```

---

## 🎯 Fonctionnalités par Méthode

| Fonctionnalité | Docker Compose | Kubernetes | Ansible |
|----------------|----------------|------------|---------|
| Installation automatique | ❌ | ❌ | ✅ |
| Multi-replicas | ❌ | ✅ | ✅ |
| Auto-healing | ❌ | ✅ | ✅ |
| Health checks | ✅ | ✅ | ✅ |
| Scaling | ❌ | ✅ | ✅ |
| Rollback | ❌ | ✅ | ✅ |
| Multi-env | ✅ | ✅ | ✅ |
| Idempotence | ✅ | ✅ | ✅ |
| Zero-touch deploy | ❌ | ❌ | ✅ |

---

## 📝 Instructions par Méthode

### Docker Compose

**Fichiers nécessaires:**
- `docker-compose.yml`

**Commandes:**
```bash
docker-compose up -d      # Démarrer
docker-compose down       # Arrêter
docker-compose logs -f    # Logs
```

**Documentation:** 3 fichiers

---

### Kubernetes

**Fichiers nécessaires:**
- `k8s/*.yaml` (9 manifests)
- Scripts `scripts/*.sh` (optionnels)

**Commandes:**
```bash
kubectl apply -f k8s/                    # Déployer
kubectl get pods -n ecommerce            # Vérifier
kubectl port-forward -n ecommerce ...    # Accéder
kubectl delete namespace ecommerce       # Supprimer
```

**Documentation:** 5 fichiers

---

### Ansible

**Fichiers nécessaires:**
- `ansible/deploy_app.yml` (playbook)
- `ansible/inventory.ini` (inventaire)
- `ansible/roles/*` (3 rôles)

**Commandes:**
```bash
ansible-playbook -i inventory.ini deploy_app.yml  # Déployer
ansible-playbook -i inventory.ini verify.yml      # Vérifier
ansible-playbook -i inventory.ini cleanup.yml     # Nettoyer
```

**Documentation:** 4 fichiers

---

## 🌟 Recommandations

### Pour un Projet Personnel
→ **Docker Compose** - Simple et efficace

### Pour un Projet d'Apprentissage
→ Essayez les **3 méthodes** ! Comparez et apprenez.

### Pour un Portfolio Professionnel
→ **Kubernetes** + **Ansible** - Montre expertise DevOps

### Pour Startup / PME
→ **Docker Compose** (début) puis **Kubernetes** (scaling)

### Pour Grande Entreprise
→ **Ansible** + **Kubernetes** - Automatisation totale

---

## 🎓 Parcours d'Apprentissage

### Semaine 1 : Bases
1. Déployer avec Docker Compose
2. Comprendre l'architecture
3. Tester toutes les fonctionnalités

### Semaine 2 : Kubernetes
1. Apprendre les concepts K8s
2. Déployer sur Minikube
3. Comprendre les manifests

### Semaine 3 : Automatisation
1. Apprendre Ansible basics
2. Déployer avec Ansible
3. Personnaliser les playbooks

### Semaine 4 : Production
1. Déployer sur cluster cloud
2. Configurer monitoring
3. Mettre en place CI/CD

---

## 📚 Documentation Complète

### Guides Généraux
- [`README.md`](README.md) - Documentation principale
- [`QUICK_START.md`](QUICK_START.md) - Démarrage ultra-rapide
- [`DOCS_INDEX.md`](DOCS_INDEX.md) - Index navigation

### Guides Docker
- Section Docker Compose dans [`README.md`](README.md)
- [`Makefile`](Makefile) - Commandes utiles

### Guides Kubernetes
- [`k8s/README.md`](k8s/README.md)
- [`k8s/QUICK_START.md`](k8s/QUICK_START.md)
- [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md)
- [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)

### Guides Ansible
- [`ansible/README.md`](ansible/README.md)
- [`ansible/QUICK_START_ANSIBLE.md`](ansible/QUICK_START_ANSIBLE.md)
- [`ansible/ANSIBLE_GUIDE.md`](ansible/ANSIBLE_GUIDE.md)

---

## 🎊 Conclusion

ShopHub E-Commerce est déployable de **3 façons différentes**, chacune adaptée à un cas d'usage spécifique :

1. **Docker Compose** - Rapidité et simplicité
2. **Kubernetes** - Production et scaling
3. **Ansible** - Automatisation complète

**Choisissez selon vos besoins et votre niveau d'expertise !**

Toutes les méthodes sont **testées et validées** ✅

