# Complete Commands Reference

Comprehensive reference of ALL commands for the Distributed E-commerce System, organized by technology and use case.

## 📋 Table of Contents

- [Git Commands](#git-commands)
- [Docker Commands](#docker-commands)
- [Docker Compose Commands](#docker-compose-commands)
- [Kubernetes Commands](#kubernetes-commands)
- [Minikube Commands](#minikube-commands)
- [Database Commands](#database-commands)
- [Development Commands](#development-commands)
- [Testing Commands](#testing-commands)
- [Debugging Commands](#debugging-commands)
- [Monitoring Commands](#monitoring-commands)

---

## 🔧 Git Commands

### Repository Management
```bash
# Clone repository
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys

# Check status
git status
git log --oneline -10

# Pull latest changes
git pull origin main

# Create branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: description"

# Push changes
git push origin main
git push -u origin feature/my-feature

# View branches
git branch -a

# Merge branch
git checkout main
git merge feature/my-feature

# Stash changes
git stash
git stash pop

# View remote
git remote -v

# Update remote
git remote set-url origin https://github.com/Cescito04/distributed_sys.git
```

---

## 🐳 Docker Commands

### Image Management
```bash
# List images
docker images
docker images | grep ecommerce

# Build images
docker build -t cescito04/ecommerce-backend:latest ./backend
docker build -t cescito04/ecommerce-frontend:latest ./frontend

# Tag images
docker tag cescito04/ecommerce-backend:latest cescito04/ecommerce-backend:v1.0
docker tag cescito04/ecommerce-frontend:latest cescito04/ecommerce-frontend:v1.0

# Push to registry
docker push cescito04/ecommerce-backend:latest
docker push cescito04/ecommerce-frontend:latest

# Pull images
docker pull cescito04/ecommerce-backend:latest
docker pull cescito04/ecommerce-frontend:latest

# Remove images
docker rmi cescito04/ecommerce-backend:latest
docker rmi $(docker images -q)  # Remove all

# Remove unused images
docker image prune
docker image prune -a  # Remove all unused

# Inspect image
docker inspect cescito04/ecommerce-backend:latest
docker history cescito04/ecommerce-backend:latest
```

### Container Management
```bash
# List containers
docker ps                    # Running only
docker ps -a                # All
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Run container
docker run -d -p 8000:8000 --name backend cescito04/ecommerce-backend:latest
docker run -it cescito04/ecommerce-backend:latest /bin/bash  # Interactive

# Start/Stop containers
docker start backend
docker stop backend
docker restart backend

# Remove containers
docker rm backend
docker rm -f backend  # Force remove
docker rm $(docker ps -aq)  # Remove all

# Execute commands in container
docker exec -it backend /bin/bash
docker exec backend python manage.py migrate
docker exec backend ls -la

# View container logs
docker logs backend
docker logs -f backend  # Follow
docker logs --tail 100 backend
docker logs --since 10m backend

# Copy files
docker cp backend:/app/logs.txt ./logs.txt
docker cp ./config.yaml backend:/app/

# Inspect container
docker inspect backend
docker stats backend

# Remove stopped containers
docker container prune
```

### Network & Volume Management
```bash
# List networks
docker network ls
docker network inspect bridge

# Create network
docker network create ecommerce-network

# Remove network
docker network rm ecommerce-network
docker network prune

# List volumes
docker volume ls

# Inspect volume
docker volume inspect postgres_data

# Remove volumes
docker volume rm postgres_data
docker volume prune

# Create volume
docker volume create postgres_data
```

### System Management
```bash
# View Docker info
docker info
docker version

# System disk usage
docker system df

# Clean up everything
docker system prune
docker system prune -a
docker system prune -a --volumes

# Kill all containers
docker kill $(docker ps -q)

# Remove everything
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)
docker volume rm $(docker volume ls -q)
docker network rm $(docker network ls -q)
```

---

## 📦 Docker Compose Commands

### Basic Operations
```bash
# Start services
docker-compose up
docker-compose up -d  # Detached mode
docker-compose up -d --build  # Rebuild images

# Stop services
docker-compose stop
docker-compose down
docker-compose down -v  # Remove volumes

# Restart services
docker-compose restart
docker-compose restart backend
```

### Service Management
```bash
# View services
docker-compose ps
docker-compose ps -a

# View logs
docker-compose logs
docker-compose logs -f  # Follow
docker-compose logs -f backend
docker-compose logs --tail=100 backend

# Execute commands
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py shell
docker-compose exec backend /bin/bash
docker-compose exec -T backend python manage.py migrate  # Non-interactive

# Run one-off commands
docker-compose run backend python manage.py createsuperuser
docker-compose run --rm backend python manage.py test
```

### Build & Push
```bash
# Build services
docker-compose build
docker-compose build --no-cache
docker-compose build backend

# Pull images
docker-compose pull

# Push images
docker-compose push
```

### Configuration
```bash
# Validate configuration
docker-compose config
docker-compose config --services

# View environment
docker-compose config --env
```

### Scaling
```bash
# Scale services
docker-compose up -d --scale backend=3
docker-compose up -d --scale frontend=2
```

### Clean Up
```bash
# Stop and remove
docker-compose down
docker-compose down -v  # Include volumes
docker-compose down --rmi all  # Remove images too
docker-compose down --remove-orphans
```

---

## ☸️ Kubernetes Commands

### Cluster Management
```bash
# View cluster info
kubectl cluster-info
kubectl cluster-info dump

# Get cluster components
kubectl get componentstatuses
kubectl get cs

# View API resources
kubectl api-resources
kubectl api-versions
```

### Namespace Operations
```bash
# List namespaces
kubectl get namespaces
kubectl get ns

# Create namespace
kubectl create namespace ecommerce
kubectl apply -f namespace.yaml

# Delete namespace
kubectl delete namespace ecommerce

# Set default namespace
kubectl config set-context --current --namespace=ecommerce

# View current namespace
kubectl config view --minify | grep namespace:
```

### Pod Operations
```bash
# List pods
kubectl get pods
kubectl get pods -o wide
kubectl get pods --all-namespaces
kubectl get pods -n ecommerce
kubectl get pods -w  # Watch mode

# Filter pods
kubectl get pods -l app=backend
kubectl get pods -l app=frontend
kubectl get pods --field-selector=status.phase=Running

# Describe pod
kubectl describe pod <pod-name>
kubectl describe pods -l app=backend

# Delete pods
kubectl delete pod <pod-name>
kubectl delete pods -l app=backend
kubectl delete pod <pod-name> --grace-period=0 --force

# Execute commands in pod
kubectl exec <pod-name> -- ls -la
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec -it <pod-name> -- python manage.py shell

# Copy files
kubectl cp <pod-name>:/app/logs.txt ./logs.txt
kubectl cp ./config.yaml <pod-name>:/app/

# Port forward
kubectl port-forward <pod-name> 8000:8000
kubectl port-forward <pod-name> 8000:8000 --address='0.0.0.0'

# View pod logs
kubectl logs <pod-name>
kubectl logs -f <pod-name>  # Follow
kubectl logs --tail=100 <pod-name>
kubectl logs --since=1h <pod-name>
kubectl logs -l app=backend
kubectl logs -l app=backend --all-containers=true
kubectl logs <pod-name> -c <container-name>
kubectl logs <pod-name> --previous  # Previous crashed container

# Get pod YAML
kubectl get pod <pod-name> -o yaml
kubectl get pod <pod-name> -o json
```

### Deployment Operations
```bash
# List deployments
kubectl get deployments
kubectl get deploy
kubectl get deployments -o wide

# Create deployment
kubectl create deployment backend --image=cescito04/ecommerce-backend:latest
kubectl apply -f backend-deployment.yaml

# Describe deployment
kubectl describe deployment backend-deployment

# Edit deployment
kubectl edit deployment backend-deployment

# Delete deployment
kubectl delete deployment backend-deployment

# Scale deployment
kubectl scale deployment backend-deployment --replicas=3
kubectl scale deployment backend-deployment --replicas=5

# Autoscale
kubectl autoscale deployment backend-deployment --min=2 --max=10 --cpu-percent=80

# Update image
kubectl set image deployment/backend-deployment backend=cescito04/ecommerce-backend:v2

# Rollout operations
kubectl rollout status deployment/backend-deployment
kubectl rollout history deployment/backend-deployment
kubectl rollout undo deployment/backend-deployment
kubectl rollout undo deployment/backend-deployment --to-revision=2
kubectl rollout restart deployment/backend-deployment
kubectl rollout pause deployment/backend-deployment
kubectl rollout resume deployment/backend-deployment

# Get deployment YAML
kubectl get deployment backend-deployment -o yaml > backup.yaml
```

### Service Operations
```bash
# List services
kubectl get services
kubectl get svc
kubectl get svc -o wide

# Describe service
kubectl describe service backend-service

# Delete service
kubectl delete service backend-service

# Expose deployment
kubectl expose deployment backend-deployment --type=LoadBalancer --port=8000

# Port forward service
kubectl port-forward service/backend-service 8000:8000
kubectl port-forward service/frontend-service 3000:3000

# Get service endpoints
kubectl get endpoints
kubectl get endpoints backend-service

# Get service URL (Minikube)
minikube service backend-service --url

# Edit service
kubectl edit service backend-service
```

### ReplicaSet Operations
```bash
# List replica sets
kubectl get replicasets
kubectl get rs

# Describe replica set
kubectl describe rs <replicaset-name>

# Delete replica set
kubectl delete rs <replicaset-name>
```

### Job & CronJob Operations
```bash
# List jobs
kubectl get jobs
kubectl get cronjobs

# Create job
kubectl create job backend-init --image=cescito04/ecommerce-backend:latest
kubectl apply -f init-job.yaml

# Describe job
kubectl describe job backend-init-job

# View job logs
kubectl logs job/backend-init-job

# Delete job
kubectl delete job backend-init-job

# Delete completed jobs
kubectl delete jobs --field-selector status.successful=1
```

### ConfigMap & Secret Operations
```bash
# List ConfigMaps
kubectl get configmaps
kubectl get cm

# View ConfigMap
kubectl describe cm app-config
kubectl get cm app-config -o yaml

# Create ConfigMap
kubectl create configmap app-config --from-file=config.yaml
kubectl create configmap app-config --from-literal=KEY=value

# Delete ConfigMap
kubectl delete cm app-config

# List Secrets
kubectl get secrets

# View Secret (base64 encoded)
kubectl get secret app-secrets -o yaml
kubectl get secret app-secrets -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 --decode

# Create Secret
kubectl create secret generic app-secrets --from-literal=DB_PASSWORD=postgres

# Delete Secret
kubectl delete secret app-secrets
```

### PersistentVolume & PVC Operations
```bash
# List PVCs
kubectl get pvc
kubectl get persistentvolumeclaims

# Describe PVC
kubectl describe pvc postgres-pvc

# List PVs
kubectl get pv
kubectl get persistentvolumes

# Delete PVC
kubectl delete pvc postgres-pvc

# Get PVC info
kubectl get pvc postgres-pvc -o yaml
```

### Ingress Operations
```bash
# List ingress
kubectl get ingress
kubectl get ing

# Describe ingress
kubectl describe ingress ecommerce-ingress

# Delete ingress
kubectl delete ingress ecommerce-ingress
```

### Resource Management
```bash
# Apply resources
kubectl apply -f file.yaml
kubectl apply -f directory/
kubectl apply -f https://url/to/manifest.yaml
kubectl apply -k ./kustomize-dir

# Delete resources
kubectl delete -f file.yaml
kubectl delete -f directory/
kubectl delete all --all  # Delete all resources

# Replace resource
kubectl replace -f file.yaml
kubectl replace --force -f file.yaml

# Patch resource
kubectl patch deployment backend-deployment -p '{"spec":{"replicas":3}}'

# Edit resource
kubectl edit deployment backend-deployment
kubectl edit svc backend-service
```

### Labels & Selectors
```bash
# Add label
kubectl label pod <pod-name> env=production
kubectl label deployment backend-deployment version=v1

# Remove label
kubectl label pod <pod-name> env-

# Update label
kubectl label pod <pod-name> env=staging --overwrite

# Select by label
kubectl get pods -l app=backend
kubectl get pods -l app=backend,version=v1
kubectl get pods -l 'app in (backend,frontend)'
```

### Annotations
```bash
# Add annotation
kubectl annotate pod <pod-name> description="Backend API pod"

# Remove annotation
kubectl annotate pod <pod-name> description-
```

### Context & Configuration
```bash
# View contexts
kubectl config get-contexts
kubectl config current-context

# Switch context
kubectl config use-context minikube

# Set namespace
kubectl config set-context --current --namespace=ecommerce

# View config
kubectl config view
kubectl config view --minify
```

### Resource Monitoring
```bash
# Resource usage (requires metrics-server)
kubectl top nodes
kubectl top pods
kubectl top pod <pod-name>
kubectl top pods -l app=backend

# Describe resources
kubectl describe nodes
kubectl describe pod <pod-name>
kubectl describe deployment backend-deployment
kubectl describe service backend-service

# Get events
kubectl get events
kubectl get events --sort-by='.lastTimestamp'
kubectl get events --field-selector type=Warning
kubectl get events --watch
```

### Debug & Troubleshoot
```bash
# Get all resources
kubectl get all
kubectl get all -o wide
kubectl get all --all-namespaces

# Check pod status
kubectl get pods --show-labels
kubectl get pods -o=jsonpath='{.items[*].status.phase}'

# Check why pod is failing
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
kubectl get events | grep <pod-name>

# Debug networking
kubectl run test-pod --image=busybox --rm -it -- /bin/sh
kubectl exec -it <pod-name> -- nslookup backend-service
kubectl exec -it <pod-name> -- ping backend-service
kubectl exec -it <pod-name> -- curl http://backend-service:8000

# Port connectivity test
kubectl exec -it <pod-name> -- nc -zv postgres-service 5432
kubectl exec -it <pod-name> -- telnet backend-service 8000
```

### Advanced Operations
```bash
# Dry run
kubectl apply -f deployment.yaml --dry-run=client
kubectl apply -f deployment.yaml --dry-run=server

# Diff before applying
kubectl diff -f deployment.yaml

# Wait for condition
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s
kubectl wait --for=condition=complete job/backend-init-job --timeout=300s
kubectl wait --for=delete pod/<pod-name> --timeout=60s

# Field selectors
kubectl get pods --field-selector=status.phase=Running
kubectl get pods --field-selector=metadata.namespace=default

# Output formats
kubectl get pods -o wide
kubectl get pods -o yaml
kubectl get pods -o json
kubectl get pods -o name
kubectl get pods -o jsonpath='{.items[*].metadata.name}'

# Sorting
kubectl get pods --sort-by=.metadata.creationTimestamp
kubectl get pods --sort-by=.status.startTime

# Explain resources
kubectl explain pods
kubectl explain deployment.spec
kubectl explain service.spec.type
```

---

## 📦 Docker Compose Commands

### Project Management
```bash
# Start project
docker-compose up
docker-compose up -d
docker-compose up -d --build
docker-compose up --force-recreate
docker-compose up --no-deps backend  # Don't start dependencies

# Stop project
docker-compose stop
docker-compose down
docker-compose down -v  # Remove volumes
docker-compose down --rmi all  # Remove images
docker-compose down --remove-orphans

# Restart
docker-compose restart
docker-compose restart backend
```

### Service Operations
```bash
# View status
docker-compose ps
docker-compose ps -a
docker-compose top

# Logs
docker-compose logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs --tail=100 backend
docker-compose logs --since 30m

# Execute commands
docker-compose exec backend python manage.py migrate
docker-compose exec backend /bin/bash
docker-compose exec -T backend python manage.py migrate  # Non-interactive
docker-compose exec -u root backend /bin/bash  # As root

# Run one-time command
docker-compose run backend python manage.py createsuperuser
docker-compose run --rm backend pytest
docker-compose run --rm --no-deps backend python script.py
```

### Build & Images
```bash
# Build services
docker-compose build
docker-compose build --no-cache
docker-compose build --pull
docker-compose build backend

# Pull images
docker-compose pull

# Push images
docker-compose push
```

### Configuration
```bash
# Validate config
docker-compose config
docker-compose config -q  # Quiet mode
docker-compose config --services
docker-compose config --volumes

# Use different file
docker-compose -f docker-compose.prod.yml up
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

### Scale Services
```bash
# Scale
docker-compose up -d --scale backend=3
docker-compose up -d --scale frontend=2 --scale backend=3
```

### Events & Monitoring
```bash
# View events
docker-compose events
docker-compose events --json

# Resource usage
docker stats
```

---

## 🎯 Minikube Commands

### Cluster Management
```bash
# Start cluster
minikube start
minikube start --driver=docker
minikube start --driver=docker --memory=4096 --cpus=2
minikube start --kubernetes-version=v1.28.0

# Stop cluster
minikube stop

# Delete cluster
minikube delete
minikube delete --all

# Status
minikube status

# Get IP
minikube ip

# SSH into node
minikube ssh
minikube ssh -- docker ps
```

### Addons
```bash
# List addons
minikube addons list

# Enable addons
minikube addons enable dashboard
minikube addons enable metrics-server
minikube addons enable ingress
minikube addons enable registry

# Disable addons
minikube addons disable dashboard

# Open dashboard
minikube dashboard
minikube dashboard --url
```

### Service Access
```bash
# Access service
minikube service frontend-service
minikube service frontend-service --url
minikube service list

# Tunnel (for LoadBalancer)
minikube tunnel
```

### Docker Environment
```bash
# Use Minikube Docker
eval $(minikube docker-env)

# Undo
eval $(minikube docker-env -u)

# View environment
minikube docker-env
```

### Troubleshooting
```bash
# View logs
minikube logs
minikube logs --length=100

# Update
minikube update-check

# Config
minikube config view
minikube config set memory 4096
minikube config set cpus 2
```

---

## 🗄️ Database Commands

### PostgreSQL (Docker)
```bash
# Connect to PostgreSQL
docker-compose exec db psql -U postgres -d ecommerce_db
docker exec -it ecommerce-db psql -U postgres -d ecommerce_db

# Run SQL file
docker-compose exec -T db psql -U postgres -d ecommerce_db < schema.sql

# Backup database
docker-compose exec -T db pg_dump -U postgres ecommerce_db > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres -d ecommerce_db < backup.sql

# View databases
docker-compose exec db psql -U postgres -c "\l"

# View tables
docker-compose exec db psql -U postgres -d ecommerce_db -c "\dt"
```

### PostgreSQL (Kubernetes)
```bash
# Get PostgreSQL pod
POSTGRES_POD=$(kubectl get pod -l app=postgres -o jsonpath="{.items[0].metadata.name}")

# Connect to database
kubectl exec -it $POSTGRES_POD -- psql -U postgres -d ecommerce_db

# Run SQL command
kubectl exec -it $POSTGRES_POD -- psql -U postgres -d ecommerce_db -c "SELECT * FROM products_produit;"

# Backup
kubectl exec $POSTGRES_POD -- pg_dump -U postgres ecommerce_db > backup.sql

# Restore
kubectl exec -i $POSTGRES_POD -- psql -U postgres -d ecommerce_db < backup.sql

# View logs
kubectl logs -l app=postgres
```

### PostgreSQL Interactive Commands
```sql
-- List databases
\l

-- Connect to database
\c ecommerce_db

-- List tables
\dt

-- Describe table
\d products_produit
\d+ products_produit

-- List users
\du

-- View data
SELECT * FROM products_produit;
SELECT * FROM users_utilisateur;
SELECT COUNT(*) FROM products_produit;

-- Exit
\q
```

---

## 💻 Development Commands

### Backend (Django)
```bash
# Create Django app
python manage.py startapp myapp

# Migrations
python manage.py makemigrations
python manage.py migrate
python manage.py migrate --fake
python manage.py showmigrations
python manage.py sqlmigrate products 0001

# Create superuser
python manage.py createsuperuser
python create_superuser.py

# Django shell
python manage.py shell
python manage.py shell_plus  # If installed

# Collect static
python manage.py collectstatic
python manage.py collectstatic --noinput

# Run server
python manage.py runserver
python manage.py runserver 0.0.0.0:8000

# Check project
python manage.py check
python manage.py check --deploy

# Database operations
python manage.py dbshell
python manage.py flush
python manage.py dumpdata > data.json
python manage.py loaddata data.json

# Testing
python manage.py test
python manage.py test products
python manage.py test --keepdb
```

### Frontend (Next.js)
```bash
# Install dependencies
npm install
npm ci  # Clean install

# Development
npm run dev
npm run dev -- --port 3001

# Build
npm run build

# Production server
npm start
npm start -- --port 3001

# Linting
npm run lint
npm run lint -- --fix

# Type checking
npx tsc --noEmit

# Clean
rm -rf .next
rm -rf node_modules
npm cache clean --force

# Update dependencies
npm update
npm outdated
npm audit
npm audit fix
```

---

## 🧪 Testing Commands

### API Testing (cURL)
```bash
# Get products
curl http://localhost:8000/api/v1/products/
curl -s http://localhost:8000/api/v1/products/ | jq '.'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"admin123"}'

# Create product (with auth)
TOKEN="your-jwt-token"
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nom":"Test","description":"Test product","prix":99.99,"quantite":10}'

# Update product
curl -X PUT http://localhost:8000/api/v1/products/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nom":"Updated","description":"Updated","prix":149.99,"quantite":15}'

# Delete product
curl -X DELETE http://localhost:8000/api/v1/products/1/ \
  -H "Authorization: Bearer $TOKEN"
```

### Automated Testing
```bash
# Run API test script
./test_api.sh

# Run K8s status check
cd k8s && ./status.sh

# Run specific tests
curl -s http://localhost:8000/api/v1/products/ | jq '.count'
```

---

## 🔍 Debugging Commands

### Docker Debugging
```bash
# Inspect container
docker inspect backend
docker inspect backend | jq '.[0].NetworkSettings.Networks'

# Container processes
docker top backend

# Container stats
docker stats backend
docker stats --no-stream

# System info
docker info | grep -i storage
docker info | grep -i version

# Network debugging
docker network inspect ecommerce-network
docker exec backend ping frontend
docker exec backend curl http://frontend:3000
```

### Kubernetes Debugging
```bash
# Debug pod
kubectl debug <pod-name> -it --image=busybox
kubectl run debug-pod --image=busybox --rm -it -- /bin/sh

# Check DNS
kubectl exec -it <pod-name> -- nslookup backend-service
kubectl exec -it <pod-name> -- nslookup kubernetes.default

# Test connectivity
kubectl exec -it <pod-name> -- wget -O- http://backend-service:8000
kubectl exec -it <pod-name> -- nc -zv backend-service 8000

# View pod spec
kubectl get pod <pod-name> -o yaml | less
kubectl get pod <pod-name> -o json | jq '.status'

# Get all info
kubectl get all,cm,secret,pvc,ingress
```

---

## 📊 Monitoring Commands

### Logs
```bash
# Docker logs
docker logs -f backend
docker logs --since 10m backend
docker logs --until 10m backend
docker logs --timestamps backend

# Docker Compose logs
docker-compose logs -f --tail=100

# Kubernetes logs
kubectl logs -f <pod-name>
kubectl logs -f <pod-name> -c <container-name>
kubectl logs --since=1h <pod-name>
kubectl logs --tail=100 <pod-name>
kubectl logs -l app=backend --max-log-requests=10
```

### Metrics
```bash
# Docker stats
docker stats
docker stats --no-stream
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Kubernetes metrics
kubectl top nodes
kubectl top pods
kubectl top pods -l app=backend
kubectl top pods --containers
```

### Events
```bash
# Docker events
docker events
docker events --filter 'event=start'
docker events --filter 'container=backend'

# Kubernetes events
kubectl get events
kubectl get events -w
kubectl get events --sort-by='.lastTimestamp'
kubectl get events --field-selector type=Warning
kubectl get events --field-selector involvedObject.name=backend-deployment
```

---

## 🛠️ Utility Commands

### Port Management
```bash
# Check port usage
lsof -i :8000
lsof -i :3000
lsof -i :5432

# Kill process on port
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# List all ports
netstat -tuln
ss -tuln
```

### File Operations
```bash
# Check file permissions
ls -la Dockerfile
chmod +x script.sh

# Find files
find . -name "*.yaml"
find . -type f -name "Dockerfile"

# Search in files
grep -r "ALLOWED_HOSTS" backend/
grep -r "api.ts" frontend/src/
```

### System Commands
```bash
# Disk usage
df -h
du -sh *
du -sh backend/ frontend/ k8s/

# Memory usage
free -h
top
htop

# Processes
ps aux | grep docker
ps aux | grep kubectl
pkill -f "port-forward"
```

---

## 🚀 Complete Deployment Workflows

### Docker Compose Full Workflow
```bash
# 1. Clean start
docker-compose down -v
docker-compose up -d --build

# 2. Initialize
docker-compose exec backend python manage.py migrate
docker-compose exec backend python create_superuser.py
docker-compose exec backend python load_test_data.py

# 3. Test
./test_api.sh
curl http://localhost:8000/api/v1/products/
open http://localhost:3000

# 4. View logs
docker-compose logs -f

# 5. Stop
docker-compose down
```

### Kubernetes Full Workflow
```bash
# 1. Start Minikube
minikube start --driver=docker --memory=4096 --cpus=2

# 2. Build images
eval $(minikube docker-env)
cd backend && docker build -t cescito04/ecommerce-backend:latest .
cd ../frontend && docker build -t cescito04/ecommerce-frontend:latest .
cd ..

# 3. Deploy
cd k8s
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f postgres-deployment.yaml
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s
kubectl apply -f init-job.yaml
kubectl wait --for=condition=complete job/backend-init-job --timeout=300s
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# 4. Verify
kubectl get all
./status.sh

# 5. Access
kubectl port-forward service/frontend-service 3000:3000
kubectl port-forward service/backend-service 8000:8000

# 6. Test
curl http://localhost:8000/api/v1/products/
open http://localhost:3000

# 7. Clean up
kubectl delete -f .
minikube stop
```

### Makefile Shortcuts
```bash
# Deploy
cd k8s
make deploy-step

# Check status
make status

# View logs
make logs

# Port forward
make port-forward
make port-forward-backend

# Scale
make scale-up
make scale-down

# Debug
make debug-backend
make debug-postgres

# Monitor
make watch
make top

# Clean
make clean
```

---

## 📝 Quick Reference

### Most Used Commands

**Docker:**
```bash
docker-compose up -d --build
docker-compose logs -f
docker-compose exec backend /bin/bash
docker-compose down -v
```

**Kubernetes:**
```bash
kubectl get pods
kubectl get all
kubectl logs -l app=backend --tail=50
kubectl port-forward service/frontend-service 3000:3000
kubectl delete -f k8s/
```

**Testing:**
```bash
./test_api.sh
cd k8s && ./status.sh
curl http://localhost:8000/api/v1/products/
```

**Minikube:**
```bash
minikube start
minikube dashboard
minikube service frontend-service
minikube stop
```

---

## 🎓 Learning Commands

### Explore Kubernetes
```bash
# Get help
kubectl --help
kubectl get --help
kubectl apply --help

# Explain resources
kubectl explain pod
kubectl explain deployment.spec.template.spec.containers

# View examples
kubectl create deployment --help
kubectl expose --help
```

### Common Patterns
```bash
# Get resource names only
kubectl get pods -o name

# Extract specific field
kubectl get pod <pod-name> -o jsonpath='{.status.podIP}'
kubectl get svc -o jsonpath='{.items[*].metadata.name}'

# Filter and format
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase

# Watch resources
kubectl get pods -w
kubectl get events -w
```

---

## 🔗 Useful Aliases

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
# Kubectl aliases
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get svc'
alias kgd='kubectl get deployments'
alias kdp='kubectl describe pod'
alias kl='kubectl logs'
alias klf='kubectl logs -f'
alias kex='kubectl exec -it'
alias kpf='kubectl port-forward'
alias ka='kubectl apply -f'
alias kd='kubectl delete -f'

# Docker aliases
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dce='docker-compose exec'

# Minikube aliases
alias mk='minikube'
alias mks='minikube start'
alias mkd='minikube dashboard'
```

---

**📚 For more detailed examples and use cases, see the specific README files in each directory.**

