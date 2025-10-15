# Kubernetes Deployment Guide

Production-ready Kubernetes manifests for deploying the complete E-commerce application stack with Django backend, Next.js frontend, and PostgreSQL database. Tested on Minikube, K3s, and cloud providers (GKE, EKS, AKS).

## 🎯 What's Included

- **11 YAML manifests** ready to deploy
- **Automated deployment** with Makefile
- **High availability** with multiple replicas
- **Data persistence** with PersistentVolumeClaims
- **Health checks** with readiness/liveness probes
- **Auto-scaling** support
- **Complete documentation** and testing guides
- **Status checker** script for monitoring

## 📁 Files Overview

```
k8s/
├── namespace.yaml              # Namespace for isolation
├── configmap.yaml              # Application configuration
├── secrets.yaml                # Sensitive data (passwords, keys)
├── postgres-deployment.yaml    # PostgreSQL database with PVC
├── backend-deployment.yaml     # Django backend API
├── frontend-deployment.yaml    # Next.js frontend
├── init-job.yaml              # Database initialization job
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Kubernetes cluster (Minikube, K3s, or any K8s cluster)
- kubectl configured
- Docker images pushed to registry (or use local images with Minikube)

### Option 1: Deploy Everything at Once

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services
kubectl get pvc
```

### Option 2: Deploy Step by Step

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Apply ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# 3. Deploy PostgreSQL
kubectl apply -f k8s/postgres-deployment.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s

# 4. Run database initialization
kubectl apply -f k8s/init-job.yaml

# Wait for init job to complete
kubectl wait --for=condition=complete job/backend-init-job --timeout=300s

# 5. Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml

# Wait for backend to be ready
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

# 6. Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml
```

## 🔍 Verification Commands

### Check All Resources
```bash
# Get all resources
kubectl get all

# Get pods with more details
kubectl get pods -o wide

# Check pod logs
kubectl logs -l app=backend
kubectl logs -l app=frontend
kubectl logs -l app=postgres

# Describe pods for troubleshooting
kubectl describe pod -l app=backend
```

### Check Services
```bash
# Get services
kubectl get svc

# Get service endpoints
kubectl get endpoints
```

### Check Storage
```bash
# Get PersistentVolumeClaims
kubectl get pvc

# Get PersistentVolumes
kubectl get pv
```

## 🌐 Accessing the Application

### Using Minikube

```bash
# Get Minikube service URL
minikube service frontend-service --url

# Or use port-forward
kubectl port-forward service/frontend-service 3000:3000
```

Access frontend at: http://localhost:3000

### Using K3s or Other Clusters

```bash
# Port-forward frontend
kubectl port-forward service/frontend-service 3000:3000

# Port-forward backend (for direct API access)
kubectl port-forward service/backend-service 8000:8000
```

### Using LoadBalancer (Cloud Providers)

```bash
# Get external IP (may take a few minutes)
kubectl get svc frontend-service

# Access using EXTERNAL-IP:3000
```

## 🐳 Docker Images

### Building and Pushing Images

```bash
# Backend
cd backend
docker build -t cescito04/ecommerce-backend:latest .
docker push cescito04/ecommerce-backend:latest

# Frontend
cd frontend
docker build -t cescito04/ecommerce-frontend:latest .
docker push cescito04/ecommerce-frontend:latest
```

### Using Local Images with Minikube

```bash
# Use Minikube's Docker daemon
eval $(minikube docker-env)

# Build images
cd backend
docker build -t cescito04/ecommerce-backend:latest .

cd ../frontend
docker build -t cescito04/ecommerce-frontend:latest .

# Update deployment to use local images
# Set imagePullPolicy: Never in deployment files
```

## 🔧 Configuration

### Environment Variables

Edit `configmap.yaml` and `secrets.yaml` to customize:
- Database credentials
- Django secret key
- CORS settings
- API URLs

### Scaling

```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=3

# Scale frontend
kubectl scale deployment frontend-deployment --replicas=3

# Check scaling status
kubectl get pods -w
```

### Update Deployments

```bash
# Update image version
kubectl set image deployment/backend-deployment backend=cescito04/ecommerce-backend:v2

# Or edit deployment
kubectl edit deployment backend-deployment

# Rollout status
kubectl rollout status deployment/backend-deployment

# Rollback if needed
kubectl rollout undo deployment/backend-deployment
```

## 🧪 Testing

### Test Backend API
```bash
# Port-forward backend
kubectl port-forward service/backend-service 8000:8000

# Test API
curl http://localhost:8000/api/v1/products/
```

### Test Frontend
```bash
# Port-forward frontend
kubectl port-forward service/frontend-service 3000:3000

# Access in browser
open http://localhost:3000
```

### Test Database Connection
```bash
# Get PostgreSQL pod name
POSTGRES_POD=$(kubectl get pod -l app=postgres -o jsonpath="{.items[0].metadata.name}")

# Connect to PostgreSQL
kubectl exec -it $POSTGRES_POD -- psql -U postgres -d ecommerce_db

# Test queries
\dt
SELECT * FROM products_produit;
\q
```

## 📊 Monitoring

### Resource Usage
```bash
# Get resource usage
kubectl top nodes
kubectl top pods

# Describe nodes
kubectl describe nodes
```

### Logs
```bash
# Stream logs
kubectl logs -f deployment/backend-deployment
kubectl logs -f deployment/frontend-deployment

# Logs from all replicas
kubectl logs -l app=backend --all-containers=true

# Logs from specific container
kubectl logs <pod-name> -c backend
```

## 🔐 Security Considerations

### Production Deployment

1. **Use Proper Secrets Management**
   ```bash
   # Use Sealed Secrets or External Secrets Operator
   # Don't commit secrets.yaml to git
   ```

2. **Enable Network Policies**
   ```bash
   # Create network policies to restrict pod communication
   kubectl apply -f network-policies.yaml
   ```

3. **Use RBAC**
   ```bash
   # Create service accounts with minimal permissions
   kubectl apply -f rbac.yaml
   ```

4. **Enable Pod Security Standards**
   ```yaml
   # Add security context to deployments
   securityContext:
     runAsNonRoot: true
     runAsUser: 1000
   ```

5. **Use Resource Quotas**
   ```bash
   kubectl apply -f resource-quota.yaml
   ```

## 🧹 Cleanup

### Delete All Resources
```bash
# Delete all resources in default namespace
kubectl delete -f k8s/

# Or delete namespace (if using custom namespace)
kubectl delete namespace ecommerce
```

### Delete Specific Resources
```bash
# Delete deployments
kubectl delete deployment backend-deployment frontend-deployment postgres-deployment

# Delete services
kubectl delete service backend-service frontend-service postgres-service

# Delete PVC (this will delete data!)
kubectl delete pvc postgres-pvc
```

## 🐛 Troubleshooting

### Pod Not Starting
```bash
# Check pod status
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

### Service Not Accessible
```bash
# Check service
kubectl get svc
kubectl describe svc <service-name>

# Check endpoints
kubectl get endpoints <service-name>
```

### Database Connection Issues
```bash
# Check if PostgreSQL is ready
kubectl get pods -l app=postgres

# Test connection from backend pod
kubectl exec -it <backend-pod> -- nc -zv postgres-service 5432

# Check PostgreSQL logs
kubectl logs -l app=postgres
```

### Image Pull Errors
```bash
# If using private registry
kubectl create secret docker-registry regcred \
  --docker-server=<registry-url> \
  --docker-username=<username> \
  --docker-password=<password> \
  --docker-email=<email>

# Add to deployment
spec:
  template:
    spec:
      imagePullSecrets:
      - name: regcred
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [K3s Documentation](https://docs.k3s.io/)

## 🎯 Default Credentials

- **Admin Email**: admin@ecommerce.com
- **Admin Password**: admin123

## 📝 Notes

- PostgreSQL data is persisted using PersistentVolumeClaim
- Backend runs 2 replicas for high availability
- Frontend runs 2 replicas for load balancing
- All services use readiness and liveness probes
- Init job runs database migrations and creates admin user

