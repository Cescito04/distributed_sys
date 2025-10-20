# Démarrage Rapide Kubernetes

Guide ultra-rapide pour déployer ShopHub sur Kubernetes.

## ⚡ Déploiement en 5 minutes

### 1. Builder et pusher les images (première fois uniquement)

```bash
# Depuis la racine du projet
./scripts/build-and-push.sh votre-username-dockerhub
```

### 2. Mettre à jour les manifests

```bash
./scripts/update-k8s-images.sh votre-username-dockerhub
```

### 3. Déployer sur Kubernetes

```bash
# Tout déployer en une commande
kubectl apply -f k8s/

# OU utiliser le script de déploiement
./scripts/deploy-k8s.sh

# OU utiliser le Makefile
cd k8s
make deploy
```

### 4. Vérifier le déploiement

```bash
# Voir les pods
kubectl get pods -n ecommerce

# Attendre que tous soient Running (peut prendre 2-3 minutes)
```

### 5. Accéder au frontend

```bash
# Option A : Port forwarding
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
# Puis ouvrir http://localhost:3000

# Option B : Avec Minikube
minikube service frontend-service -n ecommerce

# Option C : Avec Makefile
cd k8s
make port-forward
```

## 🎯 Commandes Essentielles

```bash
# Voir tout
kubectl get all -n ecommerce

# Logs
kubectl logs -n ecommerce -l app=backend --tail=50
kubectl logs -n ecommerce -l app=frontend --tail=50

# Redémarrer
kubectl rollout restart deployment/backend-deployment -n ecommerce

# Supprimer tout
kubectl delete namespace ecommerce
```

## 🔐 Compte Admin

- Email : `admin@example.com`
- Password : `admin123`

## 🆘 Problèmes ?

### Pods en erreur ?

```bash
kubectl describe pod <pod-name> -n ecommerce
kubectl logs <pod-name> -n ecommerce
```

### Backend ne peut pas se connecter à PostgreSQL ?

```bash
# Vérifier que PostgreSQL est running
kubectl get pods -n ecommerce -l app=postgres

# Tester la connexion
kubectl exec -it -n ecommerce <backend-pod> -- nc -zv postgres-service 5432
```

### Images ne se téléchargent pas ?

Vérifiez que :
1. Les images existent sur Docker Hub
2. Les images sont publiques OU vous avez configuré imagePullSecrets
3. Le nom d'utilisateur est correct dans les manifests

## 📚 Documentation Complète

Pour plus de détails, voir `KUBERNETES_SETUP.md`

