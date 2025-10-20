# Manifests Kubernetes - ShopHub E-Commerce

Ce dossier contient tous les manifests Kubernetes pour déployer l'application e-commerce complète.

## 📁 Structure

```
k8s/
├── namespace.yaml              # Namespace 'ecommerce'
├── configmap.yaml             # Configuration non-sensible
├── secrets.yaml               # Données sensibles (passwords)
├── postgres-deployment.yaml   # PostgreSQL + PVC + Service
├── backend-deployment.yaml    # Django Backend + Service
├── frontend-deployment.yaml   # Next.js Frontend + Service
├── all-in-one.yaml           # Tous les manifests en un fichier
├── kustomization.yaml        # Configuration Kustomize
├── Makefile                  # Commandes utiles
├── KUBERNETES_SETUP.md       # Guide complet
├── QUICK_START.md            # Démarrage rapide
└── README.md                 # Ce fichier
```

## 🚀 Démarrage Rapide

### Prérequis

- Kubernetes (Minikube, K3s, ou cluster cloud)
- kubectl CLI
- Images Docker sur Docker Hub

### Déploiement en 3 étapes

```bash
# 1. Builder et pusher les images
cd ..
./scripts/build-and-push.sh votre-username-dockerhub
./scripts/update-k8s-images.sh votre-username-dockerhub

# 2. Déployer sur Kubernetes
kubectl apply -f k8s/

# 3. Accéder au frontend
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
# Puis ouvrir http://localhost:3000
```

## 📦 Ressources Kubernetes Créées

### Namespace
- **ecommerce** - Isolation des ressources

### ConfigMap
- **app-config** - Variables d'environnement non-sensibles
  - DB_HOST, DB_PORT, DB_NAME
  - DEBUG, ALLOWED_HOSTS
  - NEXT_PUBLIC_API_URL

### Secret
- **app-secrets** - Données sensibles
  - SECRET_KEY (Django)
  - DB_PASSWORD, POSTGRES_PASSWORD
  - Credentials du superutilisateur

### PostgreSQL
- **postgres-pvc** - PersistentVolumeClaim (1Gi)
- **postgres-deployment** - 1 replica
- **postgres-service** - ClusterIP (port 5432)
- Probes: liveness & readiness

### Backend Django
- **backend-deployment** - 2 replicas
- **backend-service** - ClusterIP (port 8000)
- Probes: liveness & readiness sur `/admin/login/`
- Resources: 512Mi-1Gi memory, 250m-500m CPU

### Frontend Next.js
- **frontend-deployment** - 2 replicas
- **frontend-service** - NodePort (port 3000, nodePort 30000)
- Probes: liveness & readiness sur `/`
- Resources: 256Mi-512Mi memory, 250m-500m CPU

## 🔧 Commandes Utiles

### Déploiement

```bash
# Tout déployer
kubectl apply -f k8s/

# Ou fichier par fichier (ordre recommandé)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Avec Kustomize
kubectl apply -k k8s/

# Avec Makefile
make deploy
```

### Monitoring

```bash
# Voir les pods
kubectl get pods -n ecommerce

# Voir les services
kubectl get svc -n ecommerce

# Voir tout
kubectl get all -n ecommerce

# Logs
kubectl logs -n ecommerce -l app=backend
kubectl logs -n ecommerce -l app=frontend
kubectl logs -n ecommerce -l app=postgres

# Ou avec Makefile
make status
make logs-backend
make logs-frontend
```

### Accès

```bash
# Port forwarding
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
kubectl port-forward -n ecommerce service/backend-service 8000:8000

# Minikube
minikube service frontend-service -n ecommerce

# Makefile
make port-forward
```

### Nettoyage

```bash
# Supprimer tout
kubectl delete namespace ecommerce

# Ou
kubectl delete -f k8s/

# Avec Makefile
make delete
```

## 📊 Bonnes Pratiques Implémentées

- ✅ **Namespaces** - Isolation des ressources
- ✅ **Labels** - Organisation et sélection
- ✅ **ConfigMaps/Secrets** - Séparation config/code
- ✅ **Probes** - Health checks (liveness & readiness)
- ✅ **Resource Limits** - Prévention de la surcharge
- ✅ **Multiple Replicas** - Haute disponibilité
- ✅ **Service Types** - ClusterIP interne, NodePort externe
- ✅ **PersistentVolume** - Stockage persistant
- ✅ **StorageClass** - Provisioning dynamique

## 🔐 Sécurité

### Recommandations Production

1. **Changer tous les secrets** dans `secrets.yaml`
2. **Utiliser des secrets Kubernetes natifs** encodés en base64
3. **Implémenter NetworkPolicies** pour isoler les pods
4. **Ajouter un Ingress** avec TLS pour HTTPS
5. **Utiliser RBAC** pour limiter les permissions
6. **Scanner les images** avec Trivy ou Snyk
7. **Activer Pod Security Policies**

## 📖 Documentation

- **QUICK_START.md** - Démarrage ultra-rapide
- **KUBERNETES_SETUP.md** - Guide complet détaillé

## 🎯 Types de Services

| Service | Type | Port | Accès |
|---------|------|------|-------|
| postgres-service | ClusterIP | 5432 | Interne uniquement |
| backend-service | ClusterIP | 8000 | Interne uniquement |
| frontend-service | NodePort | 3000 → 30000 | Externe |

## 🔄 Ordre de Déploiement

1. Namespace
2. ConfigMap & Secrets
3. PostgreSQL (avec PVC)
4. Backend Django
5. Frontend Next.js

**Important :** Respecter cet ordre pour éviter les erreurs de dépendances.

## 🧪 Tester sur Minikube

```bash
# Démarrer Minikube
minikube start --memory=4096 --cpus=2

# Déployer
kubectl apply -f k8s/

# Attendre que tout soit ready
kubectl wait --for=condition=ready pod --all -n ecommerce --timeout=300s

# Accéder au frontend
minikube service frontend-service -n ecommerce

# Ou
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

## 💡 Astuces

### Développement Local avec Minikube

```bash
# Utiliser les images Docker locales sans push
eval $(minikube docker-env)
docker build -t ecommerce-backend:dev backend/
docker build -t ecommerce-frontend:dev frontend/

# Modifier les deployments pour utiliser imagePullPolicy: Never
```

### Debug Rapide

```bash
# Entrer dans un pod
kubectl exec -it <pod-name> -n ecommerce -- /bin/sh

# Voir les events
kubectl get events -n ecommerce --watch

# Top des ressources
kubectl top pods -n ecommerce
```

## 🌟 Prochaines Étapes

Après déploiement réussi :

1. Configurer un Ingress Controller (NGINX)
2. Ajouter cert-manager pour SSL/TLS automatique
3. Implémenter HorizontalPodAutoscaler
4. Ajouter Prometheus et Grafana
5. Configurer des backups automatiques
6. Implémenter un CI/CD pipeline

Bon déploiement ! 🚀

