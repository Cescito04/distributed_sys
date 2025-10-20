# Guide de Déploiement Kubernetes - ShopHub E-Commerce

Ce guide explique comment déployer l'application e-commerce complète sur Kubernetes.

## 📋 Prérequis

- **Kubernetes** installé (Minikube, K3s, ou cluster cloud)
- **kubectl** CLI configuré
- **Docker** pour builder les images
- **Docker Hub** account (ou autre registry)

## 🏗️ Architecture Kubernetes

```
┌─────────────────────────────────────────────────┐
│             Namespace: ecommerce                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐         ┌──────────────┐     │
│  │   Frontend   │ ←────── │   Backend    │     │
│  │   Next.js    │         │    Django    │     │
│  │  Port: 3000  │         │  Port: 8000  │     │
│  └──────────────┘         └──────────────┘     │
│       │                           │             │
│       │ NodePort (30000)          │ ClusterIP  │
│       │                           │             │
│       └───────────────────────────┼──────────┐ │
│                                   │          │ │
│                           ┌───────▼──────┐   │ │
│                           │  PostgreSQL  │   │ │
│                           │  Port: 5432  │   │ │
│                           └──────────────┘   │ │
│                                   │          │ │
│                           ┌───────▼──────┐   │ │
│                           │     PVC      │   │ │
│                           │    1 Go      │   │ │
│                           └──────────────┘   │ │
└─────────────────────────────────────────────────┘
```

## 📦 Composants Kubernetes

### Manifests créés

```
k8s/
├── namespace.yaml              # Namespace ecommerce
├── configmap.yaml             # Variables de configuration
├── secrets.yaml               # Données sensibles (passwords)
├── postgres-deployment.yaml   # PostgreSQL (PVC + Deployment + Service)
├── backend-deployment.yaml    # Backend Django (Deployment + Service)
└── frontend-deployment.yaml   # Frontend Next.js (Deployment + Service)
```

## 🚀 Étape 1 : Builder et Pusher les Images Docker

### 1.1 Backend

```bash
# Se connecter à Docker Hub
docker login

# Builder l'image backend
cd backend
docker build -t your-dockerhub-username/ecommerce-backend:latest .

# Pousser vers Docker Hub
docker push your-dockerhub-username/ecommerce-backend:latest
```

### 1.2 Frontend

```bash
# Builder l'image frontend
cd ../frontend
docker build -t your-dockerhub-username/ecommerce-frontend:latest .

# Pousser vers Docker Hub
docker push your-dockerhub-username/ecommerce-frontend:latest
```

### 1.3 Mettre à jour les manifests

Éditez les fichiers `backend-deployment.yaml` et `frontend-deployment.yaml` pour remplacer :

```yaml
image: your-dockerhub-username/ecommerce-backend:latest
# par
image: votre-vrai-username/ecommerce-backend:latest
```

## 🎯 Étape 2 : Déployer sur Kubernetes

### Option A : Avec Minikube

```bash
# Démarrer Minikube
minikube start

# Créer le namespace et les ressources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Ou tout en une fois
kubectl apply -f k8s/
```

### Option B : Avec K3s

```bash
# Installer K3s (si pas déjà fait)
curl -sfL https://get.k3s.io | sh -

# Déployer
sudo k3s kubectl apply -f k8s/

# Ou avec kubectl si configuré
kubectl apply -f k8s/
```

## 🔍 Étape 3 : Vérifier le Déploiement

### Vérifier tous les pods

```bash
kubectl get pods -n ecommerce

# Attendez que tous les pods soient "Running"
# Résultat attendu :
# NAME                                   READY   STATUS    RESTARTS   AGE
# backend-deployment-xxxxx-xxxxx         1/1     Running   0          2m
# backend-deployment-xxxxx-xxxxx         1/1     Running   0          2m
# frontend-deployment-xxxxx-xxxxx        1/1     Running   0          2m
# frontend-deployment-xxxxx-xxxxx        1/1     Running   0          2m
# postgres-deployment-xxxxx-xxxxx        1/1     Running   0          3m
```

### Vérifier les services

```bash
kubectl get services -n ecommerce

# Résultat attendu :
# NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
# backend-service    ClusterIP   10.43.x.x       <none>        8000/TCP         2m
# frontend-service   NodePort    10.43.x.x       <none>        3000:30000/TCP   2m
# postgres-service   ClusterIP   10.43.x.x       <none>        5432/TCP         3m
```

### Vérifier les PVC

```bash
kubectl get pvc -n ecommerce

# Résultat attendu :
# NAME           STATUS   VOLUME    CAPACITY   ACCESS MODES   STORAGECLASS   AGE
# postgres-pvc   Bound    pvc-xxx   1Gi        RWO            standard       3m
```

### Vérifier les logs

```bash
# Logs du backend
kubectl logs -n ecommerce -l app=backend --tail=50

# Logs du frontend
kubectl logs -n ecommerce -l app=frontend --tail=50

# Logs de PostgreSQL
kubectl logs -n ecommerce -l app=postgres --tail=50
```

## 🌐 Étape 4 : Accéder à l'Application

### Option A : Port Forwarding (Développement)

```bash
# Forward le frontend
kubectl port-forward -n ecommerce service/frontend-service 3000:3000

# Dans un autre terminal, forward le backend (optionnel)
kubectl port-forward -n ecommerce service/backend-service 8000:8000

# Accéder à l'application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### Option B : Avec Minikube

```bash
# Obtenir l'URL du service
minikube service frontend-service -n ecommerce --url

# Ou ouvrir directement dans le navigateur
minikube service frontend-service -n ecommerce
```

### Option C : NodePort Direct

```bash
# Obtenir l'IP du node
kubectl get nodes -o wide

# Le frontend est accessible sur:
# http://<NODE_IP>:30000
```

### Option D : Avec LoadBalancer (Cloud)

Si vous êtes sur un cluster cloud (GKE, EKS, AKS), modifiez `frontend-deployment.yaml` :

```yaml
spec:
  type: LoadBalancer  # Changer de NodePort à LoadBalancer
```

Puis :
```bash
kubectl get service frontend-service -n ecommerce

# Attendez que EXTERNAL-IP soit assignée
# Accédez via http://<EXTERNAL-IP>:3000
```

## 🔧 Commandes Utiles

### Gestion des Pods

```bash
# Lister tous les pods
kubectl get pods -n ecommerce

# Décrire un pod
kubectl describe pod <pod-name> -n ecommerce

# Logs d'un pod
kubectl logs <pod-name> -n ecommerce

# Logs en temps réel
kubectl logs -f <pod-name> -n ecommerce

# Entrer dans un pod
kubectl exec -it <pod-name> -n ecommerce -- /bin/sh
```

### Scaling

```bash
# Scaler le backend
kubectl scale deployment backend-deployment -n ecommerce --replicas=3

# Scaler le frontend
kubectl scale deployment frontend-deployment -n ecommerce --replicas=3
```

### Mise à jour des images

```bash
# Mettre à jour l'image du backend
kubectl set image deployment/backend-deployment \
  backend=your-dockerhub-username/ecommerce-backend:v2 \
  -n ecommerce

# Rollout status
kubectl rollout status deployment/backend-deployment -n ecommerce

# Rollback si problème
kubectl rollout undo deployment/backend-deployment -n ecommerce
```

### Gestion de la base de données

```bash
# Accéder au shell PostgreSQL
kubectl exec -it <postgres-pod-name> -n ecommerce -- psql -U postgres -d ecommerce_db

# Backup de la base
kubectl exec <postgres-pod-name> -n ecommerce -- \
  pg_dump -U postgres ecommerce_db > backup.sql

# Restore
cat backup.sql | kubectl exec -i <postgres-pod-name> -n ecommerce -- \
  psql -U postgres ecommerce_db
```

## 🧪 Tester l'Application

Une fois déployé :

```bash
# 1. Port forward le frontend
kubectl port-forward -n ecommerce service/frontend-service 3000:3000

# 2. Ouvrir dans le navigateur
open http://localhost:3000

# 3. Se connecter avec le compte admin
# Email: admin@example.com
# Password: admin123

# 4. Ajouter des produits via l'interface
```

## 🛠️ Debugging

### Pod ne démarre pas

```bash
# Voir les events
kubectl get events -n ecommerce --sort-by='.lastTimestamp'

# Décrire le pod
kubectl describe pod <pod-name> -n ecommerce

# Voir les logs
kubectl logs <pod-name> -n ecommerce
```

### Erreurs de connexion backend → PostgreSQL

```bash
# Vérifier que PostgreSQL est ready
kubectl get pods -n ecommerce -l app=postgres

# Vérifier les logs du backend
kubectl logs -n ecommerce -l app=backend --tail=100

# Tester la connexion depuis le backend pod
kubectl exec -it <backend-pod> -n ecommerce -- \
  nc -zv postgres-service 5432
```

### Images ne se téléchargent pas

```bash
# Vérifier imagePullPolicy
kubectl describe pod <pod-name> -n ecommerce | grep Image

# Si private registry, créer un imagePullSecret
kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email \
  -n ecommerce

# Puis ajouter dans le deployment:
# spec.template.spec.imagePullSecrets:
# - name: regcred
```

## 🔄 Mettre à Jour la Configuration

### Modifier les ConfigMaps

```bash
# Éditer le ConfigMap
kubectl edit configmap app-config -n ecommerce

# Ou modifier le fichier et réappliquer
kubectl apply -f k8s/configmap.yaml

# Redémarrer les pods pour prendre en compte
kubectl rollout restart deployment/backend-deployment -n ecommerce
```

### Modifier les Secrets

```bash
# Éditer le Secret
kubectl edit secret app-secrets -n ecommerce

# Ou réappliquer
kubectl apply -f k8s/secrets.yaml

# Redémarrer les pods
kubectl rollout restart deployment/backend-deployment -n ecommerce
```

## 🗑️ Nettoyer les Ressources

```bash
# Supprimer tout le namespace (⚠️ supprime toutes les données)
kubectl delete namespace ecommerce

# Ou supprimer ressource par ressource
kubectl delete -f k8s/frontend-deployment.yaml
kubectl delete -f k8s/backend-deployment.yaml
kubectl delete -f k8s/postgres-deployment.yaml
kubectl delete -f k8s/configmap.yaml
kubectl delete -f k8s/secrets.yaml
kubectl delete -f k8s/namespace.yaml
```

## 🎯 Production Checklist

Avant de déployer en production :

- [ ] Changer `SECRET_KEY` dans les secrets
- [ ] Utiliser des mots de passe forts pour PostgreSQL et admin
- [ ] Mettre `DEBUG=False` dans le ConfigMap
- [ ] Configurer `ALLOWED_HOSTS` correctement
- [ ] Utiliser un LoadBalancer pour le frontend
- [ ] Configurer un Ingress avec HTTPS
- [ ] Ajouter des Resource Limits appropriés
- [ ] Configurer des backups automatiques pour PostgreSQL
- [ ] Implémenter un système de monitoring (Prometheus/Grafana)
- [ ] Ajouter des NetworkPolicies pour la sécurité

## 🔐 Sécurité

### Créer un Ingress avec TLS

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  namespace: ecommerce
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - shophub.example.com
    secretName: shophub-tls
  rules:
  - host: shophub.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 3000
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8000
```

### NetworkPolicy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: postgres-network-policy
  namespace: ecommerce
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: backend
    ports:
    - protocol: TCP
      port: 5432
```

## 📊 Monitoring

### HorizontalPodAutoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: ecommerce
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 🔄 Workflow de Déploiement

### Déploiement Initial

```bash
# 1. Builder et pusher les images
./scripts/build-and-push.sh

# 2. Créer le namespace
kubectl apply -f k8s/namespace.yaml

# 3. Créer les configs et secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# 4. Déployer PostgreSQL d'abord
kubectl apply -f k8s/postgres-deployment.yaml

# 5. Attendre que PostgreSQL soit ready
kubectl wait --for=condition=ready pod -l app=postgres -n ecommerce --timeout=120s

# 6. Déployer le backend
kubectl apply -f k8s/backend-deployment.yaml

# 7. Attendre que le backend soit ready
kubectl wait --for=condition=ready pod -l app=backend -n ecommerce --timeout=120s

# 8. Déployer le frontend
kubectl apply -f k8s/frontend-deployment.yaml
```

### Mise à Jour Continue

```bash
# 1. Builder nouvelle version
docker build -t your-dockerhub-username/ecommerce-backend:v2 .
docker push your-dockerhub-username/ecommerce-backend:v2

# 2. Mettre à jour le deployment
kubectl set image deployment/backend-deployment \
  backend=your-dockerhub-username/ecommerce-backend:v2 \
  -n ecommerce

# 3. Vérifier le rollout
kubectl rollout status deployment/backend-deployment -n ecommerce
```

## 📝 Commandes de Diagnostic

```bash
# Voir l'état général
kubectl get all -n ecommerce

# Voir les events récents
kubectl get events -n ecommerce --sort-by='.lastTimestamp' | tail -20

# Tester la connectivité
kubectl run -it --rm debug --image=busybox -n ecommerce -- sh
# Puis dans le pod:
# wget -O- http://backend-service:8000/admin/login/
# wget -O- http://frontend-service:3000

# Dashboard Kubernetes (Minikube)
minikube dashboard
```

## 🎓 Concepts Kubernetes Utilisés

### 1. **Namespace**
- Isolation logique des ressources
- Permet de séparer les environnements (dev, staging, prod)

### 2. **ConfigMap & Secrets**
- **ConfigMap** : Configurations non-sensibles
- **Secrets** : Données sensibles (passwords, keys)
- Injectées comme variables d'environnement

### 3. **PersistentVolumeClaim (PVC)**
- Stockage persistant pour PostgreSQL
- Survit aux redémarrages de pods
- 1Go alloué

### 4. **Deployments**
- Gère les ReplicaSets
- Rollouts et rollbacks automatiques
- 2 replicas pour backend et frontend (HA)

### 5. **Services**
- **ClusterIP** : Accès interne uniquement (backend, postgres)
- **NodePort** : Accès externe via port du node (frontend)
- Load balancing automatique entre les pods

### 6. **Probes**
- **Liveness** : Redémarre le pod si non-responsive
- **Readiness** : Ne route pas de trafic si pas prêt

## 📈 Métriques et Observabilité

### Installer Metrics Server

```bash
# Minikube
minikube addons enable metrics-server

# K3s (généralement déjà installé)

# Voir l'utilisation des ressources
kubectl top nodes
kubectl top pods -n ecommerce
```

## 🚀 Améliorations Futures

- [ ] Implémenter un Ingress Controller (NGINX)
- [ ] Ajouter SSL/TLS avec cert-manager
- [ ] Configurer HorizontalPodAutoscaler
- [ ] Implémenter des NetworkPolicies
- [ ] Ajouter Prometheus & Grafana pour monitoring
- [ ] Configurer des backups automatiques PostgreSQL
- [ ] Implémenter un CI/CD (GitLab CI, GitHub Actions)
- [ ] Ajouter des health checks avancés

## 🆘 Support

### Ressources utiles

- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [K3s Documentation](https://docs.k3s.io/)

### Problèmes courants

**Pod en CrashLoopBackOff:**
```bash
kubectl logs <pod-name> -n ecommerce --previous
```

**ImagePullBackOff:**
- Vérifier que l'image existe sur Docker Hub
- Vérifier que l'image est publique ou que vous avez un imagePullSecret

**Pending PVC:**
- Vérifier qu'un StorageClass existe : `kubectl get storageclass`
- Sur Minikube : `minikube addons enable storage-provisioner`

## 🎉 Succès !

Si tous les pods sont `Running` et que vous pouvez accéder au frontend sur http://localhost:3000 (via port-forward), félicitations ! Votre application e-commerce est déployée sur Kubernetes ! 🚀

