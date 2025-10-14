.PHONY: help deploy delete status logs build-images push-images test clean

# Default target
help:
	@echo "E-commerce Kubernetes Deployment"
	@echo "================================="
	@echo ""
	@echo "Available targets:"
	@echo "  deploy          - Deploy all resources to Kubernetes"
	@echo "  deploy-step     - Deploy step by step with waits"
	@echo "  delete          - Delete all resources"
	@echo "  status          - Show deployment status"
	@echo "  logs            - Show logs from all pods"
	@echo "  build-images    - Build Docker images"
	@echo "  push-images     - Push Docker images to registry"
	@echo "  test            - Run tests"
	@echo "  port-forward    - Port-forward frontend service"
	@echo "  scale-up        - Scale deployments to 3 replicas"
	@echo "  scale-down      - Scale deployments to 1 replica"
	@echo "  clean           - Clean up everything including PVCs"

# Deploy all resources at once
deploy:
	@echo "Deploying all resources..."
	kubectl apply -f namespace.yaml
	kubectl apply -f configmap.yaml
	kubectl apply -f secrets.yaml
	kubectl apply -f postgres-deployment.yaml
	kubectl apply -f backend-deployment.yaml
	kubectl apply -f frontend-deployment.yaml
	kubectl apply -f init-job.yaml
	@echo "Deployment complete! Run 'make status' to check"

# Deploy step by step with verification
deploy-step:
	@echo "Step 1: Creating namespace..."
	kubectl apply -f namespace.yaml
	@echo ""
	@echo "Step 2: Applying ConfigMap and Secrets..."
	kubectl apply -f configmap.yaml
	kubectl apply -f secrets.yaml
	@echo ""
	@echo "Step 3: Deploying PostgreSQL..."
	kubectl apply -f postgres-deployment.yaml
	@echo "Waiting for PostgreSQL to be ready..."
	kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s
	@echo ""
	@echo "Step 4: Running database initialization..."
	kubectl apply -f init-job.yaml
	@echo "Waiting for init job to complete..."
	kubectl wait --for=condition=complete job/backend-init-job --timeout=300s
	@echo ""
	@echo "Step 5: Deploying Backend..."
	kubectl apply -f backend-deployment.yaml
	@echo "Waiting for backend to be ready..."
	kubectl wait --for=condition=ready pod -l app=backend --timeout=120s
	@echo ""
	@echo "Step 6: Deploying Frontend..."
	kubectl apply -f frontend-deployment.yaml
	@echo ""
	@echo "Deployment complete!"

# Delete all resources
delete:
	@echo "Deleting all resources..."
	kubectl delete -f frontend-deployment.yaml --ignore-not-found=true
	kubectl delete -f backend-deployment.yaml --ignore-not-found=true
	kubectl delete -f init-job.yaml --ignore-not-found=true
	kubectl delete -f postgres-deployment.yaml --ignore-not-found=true
	kubectl delete -f secrets.yaml --ignore-not-found=true
	kubectl delete -f configmap.yaml --ignore-not-found=true
	@echo "Resources deleted"

# Show deployment status
status:
	@echo "=== Namespaces ==="
	kubectl get namespaces
	@echo ""
	@echo "=== Pods ==="
	kubectl get pods -o wide
	@echo ""
	@echo "=== Services ==="
	kubectl get svc
	@echo ""
	@echo "=== Deployments ==="
	kubectl get deployments
	@echo ""
	@echo "=== PVCs ==="
	kubectl get pvc
	@echo ""
	@echo "=== Jobs ==="
	kubectl get jobs

# Show logs from all pods
logs:
	@echo "=== Backend Logs ==="
	kubectl logs -l app=backend --tail=50
	@echo ""
	@echo "=== Frontend Logs ==="
	kubectl logs -l app=frontend --tail=50
	@echo ""
	@echo "=== PostgreSQL Logs ==="
	kubectl logs -l app=postgres --tail=50

# Build Docker images
build-images:
	@echo "Building backend image..."
	cd ../backend && docker build -t cescito04/ecommerce-backend:latest .
	@echo "Building frontend image..."
	cd ../frontend && docker build -t cescito04/ecommerce-frontend:latest .
	@echo "Images built successfully"

# Push Docker images to registry
push-images:
	@echo "Pushing backend image..."
	docker push cescito04/ecommerce-backend:latest
	@echo "Pushing frontend image..."
	docker push cescito04/ecommerce-frontend:latest
	@echo "Images pushed successfully"

# Run tests
test:
	@echo "Testing backend API..."
	kubectl port-forward service/backend-service 8000:8000 &
	sleep 5
	curl -s http://localhost:8000/api/v1/products/ | jq '.'
	pkill -f "port-forward service/backend-service"
	@echo "Tests complete"

# Port-forward frontend service
port-forward:
	@echo "Port-forwarding frontend service to localhost:3000"
	@echo "Access the application at: http://localhost:3000"
	kubectl port-forward service/frontend-service 3000:3000

# Port-forward backend service
port-forward-backend:
	@echo "Port-forwarding backend service to localhost:8000"
	@echo "Access the API at: http://localhost:8000/api/v1"
	kubectl port-forward service/backend-service 8000:8000

# Scale up deployments
scale-up:
	@echo "Scaling up deployments to 3 replicas..."
	kubectl scale deployment backend-deployment --replicas=3
	kubectl scale deployment frontend-deployment --replicas=3
	@echo "Scaled up successfully"

# Scale down deployments
scale-down:
	@echo "Scaling down deployments to 1 replica..."
	kubectl scale deployment backend-deployment --replicas=1
	kubectl scale deployment frontend-deployment --replicas=1
	@echo "Scaled down successfully"

# Clean up everything including PVCs
clean: delete
	@echo "Deleting PVCs..."
	kubectl delete pvc postgres-pvc --ignore-not-found=true
	@echo "Cleanup complete"

# Restart deployments
restart:
	@echo "Restarting deployments..."
	kubectl rollout restart deployment backend-deployment
	kubectl rollout restart deployment frontend-deployment
	@echo "Deployments restarted"

# Get minikube service URL (if using minikube)
minikube-url:
	@echo "Getting Minikube service URL..."
	minikube service frontend-service --url

# Watch pod status
watch:
	watch -n 2 kubectl get pods

# Debug backend pod
debug-backend:
	@echo "Opening shell in backend pod..."
	kubectl exec -it $(shell kubectl get pod -l app=backend -o jsonpath="{.items[0].metadata.name}") -- /bin/bash

# Debug postgres pod
debug-postgres:
	@echo "Connecting to PostgreSQL..."
	kubectl exec -it $(shell kubectl get pod -l app=postgres -o jsonpath="{.items[0].metadata.name}") -- psql -U postgres -d ecommerce_db

# Show resource usage
top:
	@echo "=== Node Resources ==="
	kubectl top nodes
	@echo ""
	@echo "=== Pod Resources ==="
	kubectl top pods

