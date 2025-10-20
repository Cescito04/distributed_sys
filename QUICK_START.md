# 🚀 Guide de Démarrage Rapide - ShopHub E-Commerce

Ce guide vous permet de démarrer l'application en quelques minutes.

---

## 📋 Prérequis

Choisissez votre méthode de déploiement :

### Pour Docker Compose (Développement)
- Docker Desktop installé et lancé
- Git installé

### Pour Kubernetes (Production/Test)
- Minikube installé
- kubectl installé
- Docker installé

---

## 🐳 Option 1 : Démarrage avec Docker Compose

**Idéal pour** : Développement local, tests rapides, démos

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys

# 2. Démarrer tous les services
docker-compose up -d

# 3. Attendre que tout démarre (environ 30 secondes)
sleep 30

# 4. Vérifier que tout fonctionne
docker-compose ps
```

### Accès

- **Frontend** : http://localhost:3000 ⭐ **Commencez ici !**
- **Backend API** : http://localhost:8000/api/v1/
- **Admin Django** : http://localhost:8000/admin

### Credentials

- **Email** : `admin@example.com`
- **Password** : `admin123`

### Commandes Utiles

```bash
# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Rebuild
docker-compose up -d --build
```

---

## ☸️ Option 2 : Démarrage avec Kubernetes (Minikube)

**Idéal pour** : Tests Kubernetes, staging, production

### Étapes Complètes

```bash
# 1. Cloner le repository
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys

# 2. Démarrer Minikube avec ressources suffisantes
minikube start --memory=4096 --cpus=2

# 3. Utiliser le Docker de Minikube
eval $(minikube docker-env)

# 4. Builder les images localement dans Minikube
docker build -f backend/Dockerfile.k8s -t ecommerce-backend:k8s ./backend
docker build -t ecommerce-frontend:latest ./frontend

# 5. Déployer sur Kubernetes
kubectl apply -f k8s/minikube-test.yaml

# 6. Attendre que tous les pods soient prêts (2-3 minutes)
kubectl wait --for=condition=ready pod --all -n ecommerce --timeout=300s

# 7. Vérifier le déploiement
kubectl get pods -n ecommerce

# 8. Port forward pour accéder au frontend
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

### Accès

- **Frontend** : http://localhost:3000
- **Backend API** : Faire un port-forward séparé
  ```bash
  kubectl port-forward -n ecommerce service/backend-service 8000:8000
  ```
  Puis http://localhost:8000/api/v1/

### Vérification

```bash
# Voir tous les pods
kubectl get pods -n ecommerce

# Résultat attendu:
# NAME                                   READY   STATUS    RESTARTS   AGE
# backend-deployment-xxx                 1/1     Running   0          2m
# frontend-deployment-xxx                1/1     Running   0          2m
# postgres-deployment-xxx                1/1     Running   0          2m

# Voir les services
kubectl get services -n ecommerce

# Voir les logs
kubectl logs -n ecommerce -l app=backend
kubectl logs -n ecommerce -l app=frontend
```

### Commandes Utiles

```bash
# Avec Makefile
cd k8s
make status           # Voir l'état
make logs-backend     # Logs backend
make logs-frontend    # Logs frontend
make port-forward     # Port forward frontend

# Arrêter et nettoyer
kubectl delete namespace ecommerce
# Ou
minikube stop
```

---

## ☸️ Option 3 : Kubernetes Production (avec Docker Hub)

**Idéal pour** : Déploiement production sur cluster réel

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys

# 2. Builder et pusher les images sur Docker Hub
./scripts/build-and-push.sh votre-username-dockerhub

# 3. Mettre à jour les manifests avec votre username
./scripts/update-k8s-images.sh votre-username-dockerhub

# 4. Déployer sur votre cluster Kubernetes
kubectl apply -f k8s/

# 5. Vérifier le déploiement
kubectl get pods -n ecommerce

# 6. Accéder au frontend
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

---

## 🧪 Tester l'Application

### 1. Page d'Accueil

Ouvrir http://localhost:3000

**Vous devriez voir :**
- Navbar "ShopHub" avec logo 🛒
- Titre "Bienvenue sur ShopHub"
- Liste des produits (vide initialement)
- Footer

### 2. Créer un Compte

1. Cliquer sur **"Inscription"**
2. Remplir le formulaire
3. Vous serez automatiquement connecté

### 3. Se Connecter en Tant qu'Admin

1. Cliquer sur **"Connexion"**
2. Utiliser :
   - Email : `admin@example.com`
   - Password : `admin123`
3. Votre nom apparaîtra dans la navbar

### 4. Ajouter un Produit

1. Une fois connecté comme admin, cliquer sur **"Ajouter Produit"**
2. Remplir :
   - Nom : `MacBook Pro`
   - Description : `Ordinateur portable haute performance`
   - Prix : `2499.99`
   - Quantité : `10`
3. Cliquer sur **"Ajouter le produit"**
4. Le produit apparaîtra sur la page d'accueil

### 5. Tester l'API Directement

```bash
# Lister les produits
curl http://localhost:8000/api/v1/products/

# Se connecter et obtenir un token
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Créer un produit (avec le token)
TOKEN="votre-token-ici"
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "iPhone 15",
    "description": "Smartphone dernière génération",
    "prix": "999.99",
    "quantite": 20
  }'
```

---

## 🐛 Troubleshooting

### Docker Compose

**Problème** : Port déjà utilisé
```bash
# Changer le port dans docker-compose.yml
# Exemple : "5433:5432" au lieu de "5432:5432"
```

**Problème** : Backend ne démarre pas
```bash
# Vérifier les logs
docker-compose logs backend

# Redémarrer
docker-compose restart backend
```

**Problème** : Frontend ne se connecte pas au backend
```bash
# Vérifier que le backend est accessible
curl http://localhost:8000/api/v1/products/

# Vérifier les CORS
docker-compose logs backend | grep CORS
```

### Kubernetes

**Problème** : Pods en CrashLoopBackOff
```bash
# Voir les logs
kubectl logs -n ecommerce <pod-name>

# Décrire le pod
kubectl describe pod -n ecommerce <pod-name>
```

**Problème** : PVC Pending
```bash
# Vérifier StorageClass
kubectl get storageclass

# Minikube: activer storage provisioner
minikube addons enable storage-provisioner
```

**Problème** : ImagePullBackOff
```bash
# Si vous utilisez les images locales, vérifiez:
eval $(minikube docker-env)
docker images | grep ecommerce

# Les images doivent être présentes
```

**Problème** : Port forward ne fonctionne pas
```bash
# Vérifier que le service existe
kubectl get service -n ecommerce

# Essayer avec un port différent
kubectl port-forward -n ecommerce service/frontend-service 3001:3000
```

---

## 📊 Vérification Rapide

### Docker Compose

```bash
# Tout doit être UP
docker-compose ps

# Résultat attendu:
# NAME                 STATUS    PORTS
# ecommerce_backend    Up        0.0.0.0:8000->8000/tcp
# ecommerce_db         Up        0.0.0.0:5433->5432/tcp
# ecommerce_frontend   Up        0.0.0.0:3000->3000/tcp
```

### Kubernetes

```bash
# Tous les pods doivent être Running et Ready
kubectl get pods -n ecommerce

# Résultat attendu:
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-deployment-xxx      1/1     Running   0          2m
# frontend-deployment-xxx     1/1     Running   0          2m
# postgres-deployment-xxx     1/1     Running   0          2m
```

---

## 🎯 Prochaines Actions

Après avoir démarré l'application :

1. **Explorer l'interface**
   - Créer un compte
   - Se connecter
   - Ajouter des produits (avec compte admin)

2. **Tester l'API**
   - Consulter `/api/v1/products/`
   - Tester l'authentification JWT
   - Créer des produits via curl

3. **Accéder à Django Admin**
   - http://localhost:8000/admin
   - Gérer utilisateurs et produits

4. **Lire la documentation**
   - `README.md` - Documentation complète
   - `AUTHENTICATION.md` - Guide JWT
   - `API_EXAMPLES.md` - Exemples API
   - `k8s/KUBERNETES_SETUP.md` - Guide K8s détaillé

---

## 📚 Documentation Complète

| Fichier | Description |
|---------|-------------|
| `README.md` | Documentation principale du projet |
| `AUTHENTICATION.md` | Guide complet authentification JWT |
| `API_EXAMPLES.md` | Exemples d'utilisation de l'API |
| `TEST_RESULTS.md` | Résultats des tests API |
| `FRONTEND_SETUP.md` | Guide setup et développement frontend |
| `DEPLOYMENT_GUIDE.md` | Comparaison Docker Compose vs Kubernetes |
| `VERIFICATION_CHECKLIST.md` | Checklist de vérification complète |
| `PROJECT_SUMMARY.md` | Récapitulatif complet du projet |
| `k8s/KUBERNETES_SETUP.md` | Guide détaillé Kubernetes |
| `k8s/QUICK_START.md` | Démarrage rapide K8s |
| `k8s/TEST_RESULTS_K8S.md` | Résultats tests Kubernetes |

---

## 💡 Astuces

### Développement Rapide

Pour développer sans rebuild constant :

```bash
# Backend: modifier le code, le volume sync automatiquement
docker-compose restart backend

# Frontend: si vous voulez hot reload
cd frontend
npm install
npm run dev
# Puis arrêter le conteneur frontend
docker-compose stop frontend
```

### Debug Kubernetes

```bash
# Entrer dans un pod
kubectl exec -it -n ecommerce <pod-name> -- /bin/bash

# Tester la connectivité
kubectl exec -it -n ecommerce <backend-pod> -- nc -zv postgres-service 5432

# Voir les events
kubectl get events -n ecommerce --sort-by='.lastTimestamp'
```

### Makefile Magic

```bash
# Docker Compose
make help    # Voir toutes les commandes
make up      # Démarrer
make logs    # Logs
make down    # Arrêter

# Kubernetes
cd k8s
make help           # Voir toutes les commandes
make deploy         # Déployer
make status         # État
make port-forward   # Accès frontend
make delete         # Nettoyer
```

---

## ⚡ Résumé Ultra-Rapide

### Docker Compose (1 ligne)
```bash
git clone https://github.com/Cescito04/distributed_sys.git && cd distributed_sys && docker-compose up -d
```
Puis ouvrir http://localhost:3000

### Kubernetes Minikube (6 lignes)
```bash
git clone https://github.com/Cescito04/distributed_sys.git && cd distributed_sys
minikube start --memory=4096 --cpus=2
eval $(minikube docker-env)
docker build -f backend/Dockerfile.k8s -t ecommerce-backend:k8s ./backend && docker build -t ecommerce-frontend:latest ./frontend
kubectl apply -f k8s/minikube-test.yaml && sleep 120
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```
Puis ouvrir http://localhost:3000

---

## 🎯 Ce Que Vous Obtenez

✅ **Frontend Next.js** moderne et responsive  
✅ **Backend Django** avec API REST complète  
✅ **PostgreSQL** database  
✅ **Authentification JWT** fonctionnelle  
✅ **Admin Django** pour gestion  
✅ **Documentation** extensive  
✅ **Production-ready** avec Kubernetes  

---

## 📞 Besoin d'Aide ?

Consultez les guides détaillés :

- **Installation** : `README.md`
- **API** : `API_EXAMPLES.md`
- **Authentification** : `AUTHENTICATION.md`
- **Kubernetes** : `k8s/KUBERNETES_SETUP.md`
- **Problèmes** : `VERIFICATION_CHECKLIST.md`

---

## 🎊 Bon Démarrage !

Une fois l'application lancée :

1. Ouvrez http://localhost:3000
2. Créez un compte ou connectez-vous avec admin@example.com
3. Explorez l'interface
4. Ajoutez des produits (compte admin)
5. Testez l'API REST

**L'application est prête à l'emploi !** 🚀

