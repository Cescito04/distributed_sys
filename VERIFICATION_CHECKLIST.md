# Checklist de Vérification - ShopHub E-Commerce

Utilisez cette checklist pour vérifier que votre déploiement fonctionne correctement.

## 🐳 Vérification Docker Compose

### Prérequis
- [ ] Docker Desktop installé et lancé
- [ ] Git installé
- [ ] Repository cloné

### Déploiement
```bash
cd distributed_sys
docker-compose up -d
```

### Tests
- [ ] **Backend accessible** : `curl http://localhost:8000/api/v1/products/`
  - Attendu : `{"count":0,"next":null,"previous":null,"results":[]}`
  
- [ ] **Frontend accessible** : Ouvrir http://localhost:3000
  - Attendu : Page "Bienvenue sur ShopHub" affichée
  
- [ ] **Admin Django** : Ouvrir http://localhost:8000/admin
  - Login : admin@example.com / admin123
  - Attendu : Dashboard admin accessible
  
- [ ] **PostgreSQL** : `docker-compose exec db psql -U postgres -d ecommerce_db -c '\dt'`
  - Attendu : Tables Django listées

### Fonctionnalités
- [ ] Créer un compte utilisateur via /register
- [ ] Se connecter via /login
- [ ] Ajouter un produit (avec compte admin)
- [ ] Voir le produit sur la page d'accueil
- [ ] Se déconnecter

### Logs
```bash
docker-compose logs -f
# Pas d'erreurs critiques
```

---

## ☸️ Vérification Kubernetes (Minikube)

### Prérequis
- [ ] Minikube installé
- [ ] kubectl installé
- [ ] Images Docker buildées localement

### Déploiement

```bash
# 1. Démarrer Minikube
minikube start --memory=4096 --cpus=2

# 2. Builder les images
eval $(minikube docker-env)
docker build -f backend/Dockerfile.k8s -t ecommerce-backend:k8s ./backend
docker build -t ecommerce-frontend:latest ./frontend

# 3. Déployer
kubectl apply -f k8s/minikube-test.yaml
```

### Vérification des Ressources

- [ ] **Namespace créé** : `kubectl get namespace ecommerce`
  - Attendu : NAME=ecommerce, STATUS=Active
  
- [ ] **ConfigMap créé** : `kubectl get configmap -n ecommerce`
  - Attendu : app-config créé
  
- [ ] **Secrets créés** : `kubectl get secrets -n ecommerce`
  - Attendu : app-secrets créé
  
- [ ] **PVC créé et Bound** : `kubectl get pvc -n ecommerce`
  - Attendu : postgres-pvc, STATUS=Bound, CAPACITY=1Gi

### Vérification des Pods

```bash
kubectl get pods -n ecommerce
```

- [ ] **PostgreSQL** : 1/1 Running
- [ ] **Backend** : 1/1 Running
- [ ] **Frontend** : 1/1 Running

**Commande de diagnostic si problème :**
```bash
kubectl describe pod <pod-name> -n ecommerce
kubectl logs <pod-name> -n ecommerce
```

### Vérification des Services

```bash
kubectl get services -n ecommerce
```

- [ ] **postgres-service** : TYPE=ClusterIP, PORT=5432
- [ ] **backend-service** : TYPE=ClusterIP, PORT=8000
- [ ] **frontend-service** : TYPE=NodePort, PORT=3000:30000

### Tests de Connectivité

- [ ] **Frontend accessible** :
  ```bash
  kubectl port-forward -n ecommerce service/frontend-service 3000:3000
  curl http://localhost:3000
  ```
  - Attendu : HTML page ShopHub

- [ ] **Backend API accessible** :
  ```bash
  kubectl port-forward -n ecommerce service/backend-service 8000:8000
  curl http://localhost:8000/api/v1/products/
  ```
  - Attendu : JSON response

- [ ] **Backend → PostgreSQL** :
  ```bash
  kubectl exec -it -n ecommerce <backend-pod> -- nc -zv postgres-service 5432
  ```
  - Attendu : Connection successful

### Health Checks

- [ ] **Readiness Probes fonctionnelles** :
  ```bash
  kubectl get pods -n ecommerce
  # Tous doivent être READY (1/1)
  ```

- [ ] **Pas d'erreurs dans les events** :
  ```bash
  kubectl get events -n ecommerce --sort-by='.lastTimestamp' | tail -20
  # Pas de Warning ou Error récents
  ```

### Logs

- [ ] **Backend logs propres** :
  ```bash
  kubectl logs -n ecommerce -l app=backend --tail=50
  # Django server started successfully
  ```

- [ ] **Frontend logs propres** :
  ```bash
  kubectl logs -n ecommerce -l app=frontend --tail=50
  # Next.js server running
  ```

### Fonctionnalités Applicatives

Via port-forward sur http://localhost:3000 :

- [ ] Page d'accueil s'affiche
- [ ] Navbar visible avec logo ShopHub
- [ ] Bouton "Inscription" fonctionne
- [ ] Bouton "Connexion" fonctionne
- [ ] Login avec admin@example.com / admin123 réussit
- [ ] Nom utilisateur affiché dans navbar après login
- [ ] Page "Ajouter Produit" accessible
- [ ] Création d'un produit fonctionne (admin)
- [ ] Produit apparaît sur page d'accueil
- [ ] Déconnexion fonctionne

---

## 🔄 Tests de Résilience

### Test 1: Redémarrage de Pod

```bash
# Supprimer un pod backend
kubectl delete pod -n ecommerce -l app=backend

# Vérifier qu'un nouveau pod est créé automatiquement
kubectl get pods -n ecommerce -w
```

- [ ] Nouveau pod créé automatiquement
- [ ] Pod passe à Running en < 60s
- [ ] Application reste accessible

### Test 2: Scaling

```bash
# Augmenter les replicas
kubectl scale deployment backend-deployment -n ecommerce --replicas=2

# Vérifier
kubectl get pods -n ecommerce
```

- [ ] 2 pods backend running
- [ ] Service load balance entre les 2 pods
- [ ] Application fonctionne correctement

### Test 3: Redémarrage de PostgreSQL

```bash
kubectl delete pod -n ecommerce -l app=postgres

# Attendre recréation
sleep 30
kubectl get pods -n ecommerce
```

- [ ] Nouveau pod PostgreSQL créé
- [ ] Volume PVC réutilisé (données conservées)
- [ ] Backend se reconnecte automatiquement

---

## 🧹 Nettoyage

### Docker Compose

```bash
docker-compose down
# Supprimer aussi les volumes
docker-compose down -v
```

- [ ] Tous les conteneurs arrêtés
- [ ] Volumes supprimés (si -v utilisé)

### Kubernetes

```bash
kubectl delete namespace ecommerce
# Ou
kubectl delete -f k8s/minikube-test.yaml
```

- [ ] Namespace supprimé
- [ ] Tous les pods terminés
- [ ] PVC supprimé (données perdues)

### Minikube

```bash
minikube stop
# Ou supprimer complètement
minikube delete
```

- [ ] Cluster Minikube arrêté/supprimé

---

## 📊 Métriques de Succès

### Docker Compose
- ✅ 3 conteneurs running
- ✅ 0 erreurs dans logs
- ✅ Frontend accessible en < 30s
- ✅ Backend API répond

### Kubernetes
- ✅ 3/3 pods Ready
- ✅ 3/3 services créés
- ✅ 1/1 PVC bound
- ✅ 0 CrashLoopBackOff
- ✅ Healthchecks passing
- ✅ Application accessible

---

## ⚠️ Problèmes Courants et Solutions

### Docker Compose

**Problème:** Port already in use (5432)
```bash
# Solution: Changer le port dans docker-compose.yml
ports:
  - "5433:5432"  # Au lieu de 5432:5432
```

**Problème:** Backend ne démarre pas
```bash
# Solution: Vérifier les logs
docker-compose logs backend
# Souvent: attendre que PostgreSQL soit prêt
```

### Kubernetes

**Problème:** ImagePullBackOff
```bash
# Solution: Utiliser imagePullPolicy: Never pour images locales
# Ou s'assurer que l'image est pushée sur Docker Hub
```

**Problème:** CrashLoopBackOff
```bash
# Solution: Vérifier les logs
kubectl logs <pod-name> -n ecommerce --previous
kubectl describe pod <pod-name> -n ecommerce
```

**Problème:** Readiness probe failed (ALLOWED_HOSTS)
```bash
# Solution: Utiliser ALLOWED_HOSTS: "*" en dev
# Ou ajouter l'IP du pod/service
```

**Problème:** PVC Pending
```bash
# Solution: Vérifier StorageClass
kubectl get storageclass
# Minikube: s'assurer que storage-provisioner addon est activé
minikube addons enable storage-provisioner
```

---

## 🎯 Validation Finale

### Docker Compose ✅

- [x] Services démarrés
- [x] Frontend accessible (http://localhost:3000)
- [x] Backend API accessible (http://localhost:8000)
- [x] Admin Django accessible
- [x] Authentification fonctionnelle
- [x] CRUD produits fonctionnel

### Kubernetes ✅

- [x] Minikube démarré
- [x] Images buildées localement
- [x] Manifests appliqués sans erreur
- [x] Tous les pods Running et Ready
- [x] Services créés correctement
- [x] PVC provisionné
- [x] Frontend accessible via port-forward
- [x] Backend API répond correctement
- [x] Communication inter-pods OK
- [x] Health checks passent

---

## 📈 Prochaines Étapes

Après validation réussie :

1. [ ] Tester sur un cluster cloud (GKE, EKS, AKS)
2. [ ] Configurer un Ingress avec domaine
3. [ ] Ajouter SSL/TLS
4. [ ] Implémenter CI/CD
5. [ ] Ajouter monitoring
6. [ ] Configurer auto-scaling
7. [ ] Mettre en place backups automatiques

---

✨ **Si toutes les cases sont cochées, félicitations ! Votre application e-commerce est opérationnelle et production-ready !** ✨

