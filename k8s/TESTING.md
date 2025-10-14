# Kubernetes Deployment Testing Guide

Complete testing guide for the E-commerce Kubernetes deployment.

## 🚀 Quick Deployment Test

### Using Makefile (Recommended)
```bash
cd k8s

# Deploy everything
make deploy-step

# Check status
make status

# Access frontend
make port-forward
```

### Manual Deployment
```bash
cd k8s

# Deploy all at once
kubectl apply -f .

# Or deploy step by step
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f postgres-deployment.yaml
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s
kubectl apply -f init-job.yaml
kubectl wait --for=condition=complete job/backend-init-job --timeout=300s
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

## 🔍 Verification Tests

### 1. Check All Pods are Running
```bash
kubectl get pods

# Expected output:
# NAME                                    READY   STATUS      RESTARTS   AGE
# backend-deployment-xxx-yyy              1/1     Running     0          2m
# backend-deployment-xxx-zzz              1/1     Running     0          2m
# backend-init-job-xxx                    0/1     Completed   0          3m
# frontend-deployment-xxx-yyy             1/1     Running     0          1m
# frontend-deployment-xxx-zzz             1/1     Running     0          1m
# postgres-deployment-xxx-yyy             1/1     Running     0          4m
```

### 2. Check Services
```bash
kubectl get svc

# Expected output:
# NAME               TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)
# backend-service    ClusterIP      10.96.xxx.xxx    <none>        8000/TCP
# frontend-service   LoadBalancer   10.96.xxx.xxx    <pending>     3000:xxxxx/TCP
# postgres-service   ClusterIP      10.96.xxx.xxx    <none>        5432/TCP
```

### 3. Check PersistentVolumeClaims
```bash
kubectl get pvc

# Expected output:
# NAME           STATUS   VOLUME                                     CAPACITY
# postgres-pvc   Bound    pvc-xxx-yyy-zzz                           1Gi
```

### 4. Verify Init Job Completed
```bash
kubectl get jobs

# Check init job logs
kubectl logs job/backend-init-job

# Should show:
# Running database migrations...
# Creating superuser...
# Loading test data...
# Initialization complete!
```

## 🧪 Functional Tests

### Test 1: Backend API Health
```bash
# Port-forward backend
kubectl port-forward service/backend-service 8000:8000 &

# Test products endpoint
curl http://localhost:8000/api/v1/products/

# Expected: JSON response with products list
# {
#   "success": true,
#   "data": [...],
#   "count": 6
# }

# Stop port-forward
pkill -f "port-forward service/backend-service"
```

### Test 2: Frontend Accessibility
```bash
# Port-forward frontend
kubectl port-forward service/frontend-service 3000:3000 &

# Test frontend (opens browser)
open http://localhost:3000

# Or test with curl
curl -I http://localhost:3000

# Expected: HTTP 200 OK

# Stop port-forward
pkill -f "port-forward service/frontend-service"
```

### Test 3: Database Connection
```bash
# Get PostgreSQL pod name
POSTGRES_POD=$(kubectl get pod -l app=postgres -o jsonpath="{.items[0].metadata.name}")

# Connect to database
kubectl exec -it $POSTGRES_POD -- psql -U postgres -d ecommerce_db

# Run test queries
\dt                                    # List tables
SELECT COUNT(*) FROM products_produit; # Count products
SELECT * FROM users_utilisateur;       # List users
\q                                     # Exit
```

### Test 4: Authentication Flow
```bash
# Port-forward backend
kubectl port-forward service/backend-service 8000:8000 &

# Test login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"admin123"}'

# Expected: JSON with tokens
# {
#   "success": true,
#   "data": {
#     "user": {...},
#     "tokens": {
#       "access": "eyJ0eXAiOiJKV1QiLCJ...",
#       "refresh": "eyJ0eXAiOiJKV1QiLCJ..."
#     }
#   }
# }

# Stop port-forward
pkill -f "port-forward service/backend-service"
```

### Test 5: Complete E2E Flow
```bash
# 1. Port-forward both services
kubectl port-forward service/backend-service 8000:8000 &
kubectl port-forward service/frontend-service 3000:3000 &

# 2. Open frontend in browser
open http://localhost:3000

# 3. Test user flow:
#    - View products list
#    - Click "Connexion"
#    - Login with: admin@ecommerce.com / admin123
#    - Click "Ajouter un produit"
#    - Create a new product
#    - Verify product appears in list

# 4. Cleanup
pkill -f "port-forward"
```

## 📊 Performance Tests

### Test Pod Scaling
```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=3

# Wait for pods
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

# Verify
kubectl get pods -l app=backend

# Scale back down
kubectl scale deployment backend-deployment --replicas=2
```

### Test Load Balancing
```bash
# Port-forward backend
kubectl port-forward service/backend-service 8000:8000 &

# Make multiple requests
for i in {1..10}; do
  curl -s http://localhost:8000/api/v1/products/ | jq -r '.count'
done

# All should return the same result

# Stop port-forward
pkill -f "port-forward service/backend-service"
```

### Test Resource Usage
```bash
# Check resource usage
kubectl top nodes
kubectl top pods

# Expected: All pods should be within their resource limits
```

## 🔄 Rolling Update Test

### Test Backend Update
```bash
# Update backend image
kubectl set image deployment/backend-deployment \
  backend=cescito04/ecommerce-backend:v2

# Watch rollout
kubectl rollout status deployment/backend-deployment

# Verify update
kubectl get pods -l app=backend

# Rollback if needed
kubectl rollout undo deployment/backend-deployment
```

## 🛡️ Resilience Tests

### Test Pod Self-Healing
```bash
# Delete a backend pod
kubectl delete pod -l app=backend --force --grace-period=0

# Watch new pod creation
kubectl get pods -w

# Verify service still works
kubectl port-forward service/backend-service 8000:8000 &
curl http://localhost:8000/api/v1/products/
pkill -f "port-forward service/backend-service"
```

### Test Database Persistence
```bash
# Add a test product via API
kubectl port-forward service/backend-service 8000:8000 &

# Login and get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"admin123"}' | \
  jq -r '.data.tokens.access')

# Create product
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nom":"Test Product K8s",
    "description":"Created during K8s testing",
    "prix":99.99,
    "quantite":10
  }'

# Delete postgres pod
kubectl delete pod -l app=postgres --force --grace-period=0

# Wait for new pod
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s

# Verify product still exists
curl http://localhost:8000/api/v1/products/ | jq '.data[] | select(.nom=="Test Product K8s")'

pkill -f "port-forward service/backend-service"
```

## 🐛 Troubleshooting Tests

### Test 1: Check Pod Logs
```bash
# Backend logs
kubectl logs -l app=backend --tail=100

# Frontend logs
kubectl logs -l app=frontend --tail=100

# PostgreSQL logs
kubectl logs -l app=postgres --tail=100

# Init job logs
kubectl logs job/backend-init-job
```

### Test 2: Check Events
```bash
# Get recent events
kubectl get events --sort-by='.lastTimestamp' | head -20

# Get events for specific resource
kubectl describe pod <pod-name>
```

### Test 3: Network Connectivity
```bash
# Get backend pod
BACKEND_POD=$(kubectl get pod -l app=backend -o jsonpath="{.items[0].metadata.name}")

# Test connection to PostgreSQL
kubectl exec -it $BACKEND_POD -- nc -zv postgres-service 5432

# Expected: Connection to postgres-service 5432 port [tcp/postgresql] succeeded!

# Test DNS resolution
kubectl exec -it $BACKEND_POD -- nslookup postgres-service

# Expected: Shows postgres-service IP
```

### Test 4: Service Endpoints
```bash
# Check service endpoints
kubectl get endpoints

# Should show IPs for all services:
# NAME               ENDPOINTS
# backend-service    10.244.x.x:8000,10.244.x.y:8000
# frontend-service   10.244.x.x:3000,10.244.x.y:3000
# postgres-service   10.244.x.x:5432
```

## 📈 Monitoring Tests

### Check Readiness/Liveness Probes
```bash
# Watch pods for probe failures
kubectl get pods -w

# Describe pod to see probe status
kubectl describe pod -l app=backend | grep -A 10 "Liveness\|Readiness"
```

### Check Resource Limits
```bash
# Describe deployments
kubectl describe deployment backend-deployment | grep -A 10 "Limits\|Requests"
kubectl describe deployment frontend-deployment | grep -A 10 "Limits\|Requests"
kubectl describe deployment postgres-deployment | grep -A 10 "Limits\|Requests"
```

## ✅ Complete Test Checklist

- [ ] All pods are in Running state
- [ ] All services have endpoints
- [ ] PVC is bound
- [ ] Init job completed successfully
- [ ] Backend API responds to /api/v1/products/
- [ ] Frontend is accessible via browser
- [ ] Database contains test data
- [ ] Login works with admin credentials
- [ ] New products can be created (admin)
- [ ] Pods restart automatically when deleted
- [ ] Data persists after postgres pod restart
- [ ] Scaling works for backend and frontend
- [ ] Resource usage is within limits
- [ ] Readiness/liveness probes are healthy

## 🔚 Cleanup After Testing

```bash
# Delete all resources
make clean

# Or manually
kubectl delete -f .
kubectl delete pvc postgres-pvc
```

## 📝 Test Results Template

```
Test Date: YYYY-MM-DD
Kubernetes Version: x.xx
Test Environment: Minikube/K3s/Cloud

Deployment Status: ✅ / ❌
Pod Health: ✅ / ❌
Service Connectivity: ✅ / ❌
Database Persistence: ✅ / ❌
API Functionality: ✅ / ❌
Frontend Access: ✅ / ❌
Scaling: ✅ / ❌
Self-Healing: ✅ / ❌

Notes:
- 
```

