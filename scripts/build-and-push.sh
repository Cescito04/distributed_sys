#!/bin/bash

# Script pour builder et pusher les images Docker vers Docker Hub
# Usage: ./scripts/build-and-push.sh <dockerhub-username> [version]

set -e

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ -z "$1" ]; then
    echo -e "${RED}❌ Erreur: Docker Hub username requis${NC}"
    echo "Usage: $0 <dockerhub-username> [version]"
    echo "Exemple: $0 myusername v1.0.0"
    exit 1
fi

DOCKERHUB_USERNAME=$1
VERSION=${2:-latest}

echo -e "${GREEN}🚀 Build et Push des images Docker${NC}"
echo "Username: $DOCKERHUB_USERNAME"
echo "Version: $VERSION"
echo ""

# Vérifier que Docker est installé et lancé
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker n'est pas démarré ou installé${NC}"
    exit 1
fi

# Se connecter à Docker Hub
echo -e "${YELLOW}🔐 Connexion à Docker Hub...${NC}"
docker login

# Builder le backend
echo -e "${GREEN}📦 Build de l'image backend...${NC}"
cd backend
docker build -t ${DOCKERHUB_USERNAME}/ecommerce-backend:${VERSION} .
docker tag ${DOCKERHUB_USERNAME}/ecommerce-backend:${VERSION} ${DOCKERHUB_USERNAME}/ecommerce-backend:latest

echo -e "${GREEN}⬆️  Push de l'image backend...${NC}"
docker push ${DOCKERHUB_USERNAME}/ecommerce-backend:${VERSION}
docker push ${DOCKERHUB_USERNAME}/ecommerce-backend:latest

# Builder le frontend
echo -e "${GREEN}📦 Build de l'image frontend...${NC}"
cd ../frontend
docker build -t ${DOCKERHUB_USERNAME}/ecommerce-frontend:${VERSION} .
docker tag ${DOCKERHUB_USERNAME}/ecommerce-frontend:${VERSION} ${DOCKERHUB_USERNAME}/ecommerce-frontend:latest

echo -e "${GREEN}⬆️  Push de l'image frontend...${NC}"
docker push ${DOCKERHUB_USERNAME}/ecommerce-frontend:${VERSION}
docker push ${DOCKERHUB_USERNAME}/ecommerce-frontend:latest

cd ..

echo ""
echo -e "${GREEN}✅ Toutes les images ont été buildées et pushées avec succès !${NC}"
echo ""
echo "Images créées :"
echo "  - ${DOCKERHUB_USERNAME}/ecommerce-backend:${VERSION}"
echo "  - ${DOCKERHUB_USERNAME}/ecommerce-backend:latest"
echo "  - ${DOCKERHUB_USERNAME}/ecommerce-frontend:${VERSION}"
echo "  - ${DOCKERHUB_USERNAME}/ecommerce-frontend:latest"
echo ""
echo -e "${YELLOW}📝 Prochaine étape :${NC}"
echo "  1. Modifier k8s/backend-deployment.yaml et k8s/frontend-deployment.yaml"
echo "  2. Remplacer 'your-dockerhub-username' par '${DOCKERHUB_USERNAME}'"
echo "  3. Déployer sur Kubernetes : kubectl apply -f k8s/"
echo ""

