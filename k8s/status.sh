#!/bin/bash

# Kubernetes Deployment Status Checker
# Shows comprehensive view of all deployed resources

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_section() {
    echo -e "${CYAN}━━━ $1 ━━━${NC}"
}

# Main
clear

print_header "📊 KUBERNETES DEPLOYMENT STATUS"

# 1. Cluster Info
print_section "1. CLUSTER INFORMATION"
kubectl cluster-info | head -2
echo ""

# 2. Nodes
print_section "2. NODES"
kubectl get nodes
echo ""

# 3. Namespaces
print_section "3. NAMESPACES"
kubectl get namespaces | grep -E "NAME|default|ecommerce"
echo ""

# 4. Pods
print_section "4. PODS STATUS"
kubectl get pods -o wide
echo ""

# Check pod health
TOTAL_PODS=$(kubectl get pods --no-headers | wc -l | tr -d ' ')
RUNNING_PODS=$(kubectl get pods --no-headers | grep -c "Running" || echo 0)
COMPLETED_PODS=$(kubectl get pods --no-headers | grep -c "Completed" || echo 0)
FAILED_PODS=$(kubectl get pods --no-headers | grep -E "Error|CrashLoop|ImagePull" | wc -l | tr -d ' ')

echo -e "${GREEN}✅ Running: $RUNNING_PODS${NC}"
echo -e "${BLUE}✓  Completed: $COMPLETED_PODS${NC}"
if [ "$FAILED_PODS" -gt 0 ]; then
    echo -e "${RED}❌ Failed: $FAILED_PODS${NC}"
fi
echo ""

# 5. Deployments
print_section "5. DEPLOYMENTS"
kubectl get deployments
echo ""

# 6. Services
print_section "6. SERVICES"
kubectl get svc
echo ""

# 7. Endpoints
print_section "7. SERVICE ENDPOINTS"
kubectl get endpoints
echo ""

# 8. PVC
print_section "8. PERSISTENT VOLUME CLAIMS"
kubectl get pvc
echo ""

# 9. Jobs
print_section "9. JOBS"
kubectl get jobs
echo ""

# 10. ConfigMaps & Secrets
print_section "10. CONFIGURATION"
kubectl get configmaps
echo ""
kubectl get secrets | grep app-secrets
echo ""

# 11. Recent Events
print_section "11. RECENT EVENTS"
kubectl get events --sort-by='.lastTimestamp' | tail -10
echo ""

# 12. Resource Usage (if metrics-server is available)
print_section "12. RESOURCE USAGE"
if kubectl top nodes &>/dev/null; then
    echo "Node Resources:"
    kubectl top nodes
    echo ""
    echo "Pod Resources:"
    kubectl top pods
else
    echo -e "${YELLOW}⚠️  Metrics server not enabled${NC}"
    echo "   Enable with: minikube addons enable metrics-server"
fi
echo ""

# 13. Application Health Check
print_section "13. APPLICATION HEALTH CHECK"

# Test backend
echo "Testing Backend API..."
kubectl port-forward service/backend-service 8000:8000 > /dev/null 2>&1 &
PF_PID=$!
sleep 2

if curl -s http://localhost:8000/api/v1/products/ | grep -q "success"; then
    PRODUCT_COUNT=$(curl -s http://localhost:8000/api/v1/products/ | jq -r '.count')
    echo -e "${GREEN}✅ Backend API: OK (${PRODUCT_COUNT} products)${NC}"
else
    echo -e "${RED}❌ Backend API: FAILED${NC}"
fi

kill $PF_PID 2>/dev/null
sleep 1

# Test frontend
echo "Testing Frontend..."
kubectl port-forward service/frontend-service 3000:3000 > /dev/null 2>&1 &
PF_PID=$!
sleep 2

if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Frontend UI: OK${NC}"
else
    echo -e "${RED}❌ Frontend UI: FAILED${NC}"
fi

kill $PF_PID 2>/dev/null
echo ""

# 14. Quick Commands
print_section "14. USEFUL COMMANDS"
echo "View logs:"
echo "  kubectl logs -l app=backend --tail=50"
echo "  kubectl logs -l app=frontend --tail=50"
echo ""
echo "Port-forward:"
echo "  kubectl port-forward service/frontend-service 3000:3000"
echo "  kubectl port-forward service/backend-service 8000:8000"
echo ""
echo "Scale:"
echo "  kubectl scale deployment backend-deployment --replicas=3"
echo ""
echo "Delete all:"
echo "  kubectl delete -f k8s/"
echo ""

print_header "✨ STATUS CHECK COMPLETE"

