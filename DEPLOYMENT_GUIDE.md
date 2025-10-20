# Guide de Déploiement Complet - ShopHub E-Commerce

Ce guide vous montre comment déployer l'application avec **Docker Compose** ou **Kubernetes**.

## 📊 Comparaison Docker Compose vs Kubernetes

| Critère | Docker Compose | Kubernetes |
|---------|----------------|------------|
| **Complexité** | Simple ⭐ | Avancé ⭐⭐⭐ |
| **Idéal pour** | Développement local | Production, staging |
| **Haute disponibilité** | ❌ Non | ✅ Oui (replicas) |
| **Auto-scaling** | ❌ Non | ✅ Oui (HPA) |
| **Orchestration** | Basique | Avancée |
| **Setup** | 1 commande | Plusieurs étapes |

## 🐳 Option 1 : Docker Compose

### Avantages
-  Démarrage ultra-rapide (1 commande)
-  Parfait pour le développement
-  Facile à débugger
-  Pas besoin de registry Docker

### Commandes

```bash
# Démarrer tout
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Reconstruire
docker-compose up -d --build
```

### Quand utiliser ?
- Développement local
- Tests rapides
- Démos
- Environnement de développement personnel

## ☸️ Option 2 : Kubernetes

### Avantages
- ✅ Production-ready
- ✅ Haute disponibilité (2+ replicas)
- ✅ Auto-healing (restart automatique)
- ✅ Scaling horizontal
- ✅ Rolling updates
- ✅ Health checks avancés

### Workflow Complet

#### Étape 1 : Préparation des images

```bash
# 1. Builder les images localement
cd backend
docker build -t votre-username/ecommerce-backend:latest .

cd ../frontend
docker build -t votre-username/ecommerce-frontend:latest .

# 2. Se connecter à Docker Hub
docker login

# 3. Pusher les images
docker push votre-username/ecommerce-backend:latest
docker push votre-username/ecommerce-frontend:latest

# OU utiliser le script automatique
./scripts/build-and-push.sh votre-username
```

#### Étape 2 : Mettre à jour les manifests

```bash
# Remplacer 'your-dockerhub-username' par votre vrai username
./scripts/update-k8s-images.sh votre-username

# OU éditer manuellement
# k8s/backend-deployment.yaml - ligne avec 'image:'
# k8s/frontend-deployment.yaml - ligne avec 'image:'
```

#### Étape 3 : Déployer sur Kubernetes

```bash
# Option A : Tout en une fois
kubectl apply -f k8s/

# Option B : Avec le script
./scripts/deploy-k8s.sh

# Option C : Avec Makefile
cd k8s
make deploy

# Option D : Avec Kustomize
kubectl apply -k k8s/
```

#### Étape 4 : Vérifier le déploiement

```bash
# Voir les pods
kubectl get pods -n ecommerce

# Attendre que tous soient Running
kubectl wait --for=condition=ready pod --all -n ecommerce --timeout=300s

# Voir les services
kubectl get svc -n ecommerce
```

#### Étape 5 : Accéder à l'application

```bash
# Port forwarding (développement)
kubectl port-forward -n ecommerce service/frontend-service 3000:3000

# Minikube (local)
minikube service frontend-service -n ecommerce

# NodePort direct
# http://<NODE_IP>:30000
```

### Quand utiliser ?
- Environnement de staging
- Production
- Tests de charge
- Démonstration de compétences DevOps
- Applications critiques nécessitant HA

## 🔄 Workflow de Développement Recommandé

### Pour le développement quotidien

```bash
# Utiliser Docker Compose
docker-compose up -d

# Développer...

# Arrêter
docker-compose down
```

### Pour tester avant la production

```bash
# 1. Tester localement avec Docker Compose
docker-compose up -d
# Tester l'application...
docker-compose down

# 2. Builder les images
./scripts/build-and-push.sh votre-username v1.0.0

# 3. Déployer sur Kubernetes (Minikube pour tester)
minikube start
kubectl apply -f k8s/

# 4. Tester sur K8s
kubectl port-forward -n ecommerce service/frontend-service 3000:3000

# 5. Si OK, déployer en production
kubectl apply -f k8s/ --context=production-cluster
```

## 📋 Checklist de Déploiement

### Docker Compose
- [ ] Docker Desktop installé et lancé
- [ ] Cloner le repository
- [ ] Lancer `docker-compose up -d`
- [ ] Vérifier http://localhost:3000
- [ ] Se connecter avec admin@example.com / admin123

### Kubernetes
- [ ] Kubernetes installé (Minikube/K3s/Cloud)
- [ ] kubectl configuré
- [ ] Images Docker buildées et pushées
- [ ] Manifests mis à jour avec votre username
- [ ] StorageClass disponible (pour PVC)
- [ ] Déployer avec `kubectl apply -f k8s/`
- [ ] Vérifier les pods : `kubectl get pods -n ecommerce`
- [ ] Port forward et tester

## 🔧 Configuration des Environnements

### Développement (Docker Compose)

```yaml
# docker-compose.yml
environment:
  - DEBUG=True
  - ALLOWED_HOSTS=localhost,127.0.0.1
```

### Staging/Production (Kubernetes)

```yaml
# k8s/configmap.yaml
data:
  DEBUG: "False"
  ALLOWED_HOSTS: "backend-service,yourdomain.com"
```

## 🚀 Déploiement en Production

### Checklist Sécurité

- [ ] Changer SECRET_KEY
- [ ] Mots de passe forts pour PostgreSQL et admin
- [ ] DEBUG=False
- [ ] ALLOWED_HOSTS configuré correctement
- [ ] Images scannées pour vulnérabilités
- [ ] HTTPS activé (Ingress + TLS)
- [ ] Backups PostgreSQL configurés
- [ ] Monitoring en place (Prometheus/Grafana)
- [ ] Resource limits appropriés
- [ ] NetworkPolicies configurées

### Commandes Production

```bash
# 1. Builder avec tag de version
./scripts/build-and-push.sh votre-username v1.0.0

# 2. Mettre à jour les manifests
sed -i 's/:latest/:v1.0.0/g' k8s/*-deployment.yaml

# 3. Déployer
kubectl apply -f k8s/ --context=production

# 4. Vérifier
kubectl get pods -n ecommerce --context=production

# 5. Rollback si problème
kubectl rollout undo deployment/backend-deployment -n ecommerce
```

## 📊 Monitoring et Logs

### Docker Compose

```bash
# Logs temps réel
docker-compose logs -f

# Logs backend uniquement
docker-compose logs -f backend

# Logs avec timestamps
docker-compose logs -f --timestamps

# Dernières 100 lignes
docker-compose logs --tail=100
```

### Kubernetes

```bash
# Logs backend
kubectl logs -n ecommerce -l app=backend --tail=100

# Logs temps réel
kubectl logs -n ecommerce -l app=backend -f

# Logs d'un pod spécifique
kubectl logs -n ecommerce <pod-name>

# Events
kubectl get events -n ecommerce --watch
```

## 🐛 Debugging

### Docker Compose

```bash
# Entrer dans un conteneur
docker-compose exec backend bash
docker-compose exec frontend sh

# Vérifier les réseaux
docker network ls
docker network inspect distributed_sys_default

# Reconstruire une seule image
docker-compose build backend
docker-compose up -d backend
```

### Kubernetes

```bash
# Décrire un pod
kubectl describe pod <pod-name> -n ecommerce

# Entrer dans un pod
kubectl exec -it <pod-name> -n ecommerce -- /bin/bash

# Tester la connectivité
kubectl run -it --rm debug --image=busybox -n ecommerce -- sh
# Dans le pod:
wget -O- http://backend-service:8000/admin/login/

# Voir les events
kubectl get events -n ecommerce --sort-by='.lastTimestamp'
```

## 🔄 Mise à Jour de l'Application

### Docker Compose

```bash
# Récupérer les dernières modifications
git pull

# Reconstruire et redémarrer
docker-compose up -d --build

# Ou juste un service
docker-compose up -d --build backend
```

### Kubernetes

```bash
# 1. Builder nouvelle version
./scripts/build-and-push.sh votre-username v1.1.0

# 2. Mettre à jour le deployment
kubectl set image deployment/backend-deployment \
  backend=votre-username/ecommerce-backend:v1.1.0 \
  -n ecommerce

# 3. Suivre le rollout
kubectl rollout status deployment/backend-deployment -n ecommerce

# 4. Rollback si problème
kubectl rollout undo deployment/backend-deployment -n ecommerce
```

## 💾 Backups

### Docker Compose

```bash
# Backup PostgreSQL
docker-compose exec db pg_dump -U postgres ecommerce_db > backup.sql

# Restore
cat backup.sql | docker-compose exec -T db psql -U postgres ecommerce_db
```

### Kubernetes

```bash
# Backup
kubectl exec <postgres-pod> -n ecommerce -- \
  pg_dump -U postgres ecommerce_db > backup.sql

# Restore
cat backup.sql | kubectl exec -i <postgres-pod> -n ecommerce -- \
  psql -U postgres ecommerce_db
```

## 📚 Ressources Utiles

### Docker
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Kubernetes
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Minikube Guide](https://minikube.sigs.k8s.io/docs/start/)

### Nos Guides
- [`k8s/QUICK_START.md`](k8s/QUICK_START.md) - Démarrage rapide K8s
- [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md) - Guide complet K8s
- [`FRONTEND_SETUP.md`](FRONTEND_SETUP.md) - Guide frontend
- [`AUTHENTICATION.md`](AUTHENTICATION.md) - Guide authentification

## 🎓 Concepts Kubernetes Utilisés

1. **Namespace** - Isolation logique
2. **Deployments** - Gestion des pods et replicas
3. **Services** - Exposition réseau (ClusterIP, NodePort)
4. **ConfigMaps** - Configuration non-sensible
5. **Secrets** - Données sensibles
6. **PersistentVolumeClaim** - Stockage persistant
7. **Probes** - Health checks (liveness, readiness)
8. **Resource Limits** - Quotas CPU/mémoire
9. **Labels & Selectors** - Organisation des ressources

## 🏆 Résumé

**Pour démarrer rapidement en local :**
```bash
docker-compose up -d
```

**Pour déployer en production :**
```bash
./scripts/build-and-push.sh votre-username
./scripts/update-k8s-images.sh votre-username
kubectl apply -f k8s/
```

**Accéder à l'application :**
- Docker Compose : http://localhost:3000
- Kubernetes : `kubectl port-forward -n ecommerce service/frontend-service 3000:3000`

**Compte admin :**
- Email : admin@example.com
- Password : admin123

Bon déploiement ! 🚀

