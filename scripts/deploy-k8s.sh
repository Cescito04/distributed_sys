#!/bin/bash

# Script de déploiement complet sur Kubernetes
# Usage: ./scripts/deploy-k8s.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Déploiement de ShopHub sur Kubernetes${NC}"
echo ""

# Vérifier que kubectl est installé
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl n'est pas installé"
    exit 1
fi

# Créer le namespace
echo -e "${YELLOW}📁 Création du namespace...${NC}"
kubectl apply -f k8s/namespace.yaml

# Créer les ConfigMaps et Secrets
echo -e "${YELLOW}⚙️  Application des ConfigMaps et Secrets...${NC}"
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Déployer PostgreSQL
echo -e "${YELLOW}🐘 Déploiement de PostgreSQL...${NC}"
kubectl apply -f k8s/postgres-deployment.yaml

# Attendre que PostgreSQL soit prêt
echo -e "${YELLOW}⏳ Attente que PostgreSQL soit prêt...${NC}"
kubectl wait --for=condition=ready pod -l app=postgres -n ecommerce --timeout=120s || true
sleep 10

# Déployer le Backend
echo -e "${YELLOW}🔧 Déploiement du Backend Django...${NC}"
kubectl apply -f k8s/backend-deployment.yaml

# Attendre que le Backend soit prêt
echo -e "${YELLOW}⏳ Attente que le Backend soit prêt...${NC}"
kubectl wait --for=condition=ready pod -l app=backend -n ecommerce --timeout=180s || true
sleep 5

# Déployer le Frontend
echo -e "${YELLOW}🎨 Déploiement du Frontend Next.js...${NC}"
kubectl apply -f k8s/frontend-deployment.yaml

echo ""
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""
echo "📊 Vérifier l'état des pods :"
echo "  kubectl get pods -n ecommerce"
echo ""
echo "🌐 Accéder au frontend :"
echo "  kubectl port-forward -n ecommerce service/frontend-service 3000:3000"
echo "  Puis ouvrir http://localhost:3000"
echo ""
echo "🔍 Voir les logs :"
echo "  kubectl logs -n ecommerce -l app=backend --tail=50"
echo "  kubectl logs -n ecommerce -l app=frontend --tail=50"
echo ""

