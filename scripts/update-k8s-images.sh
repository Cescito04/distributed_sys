#!/bin/bash

# Script pour mettre à jour les images Docker dans les manifests Kubernetes
# Usage: ./scripts/update-k8s-images.sh <dockerhub-username>

set -e

if [ -z "$1" ]; then
    echo "❌ Erreur: Docker Hub username requis"
    echo "Usage: $0 <dockerhub-username>"
    exit 1
fi

DOCKERHUB_USERNAME=$1

echo "🔄 Mise à jour des manifests Kubernetes avec le username: $DOCKERHUB_USERNAME"

# Mettre à jour backend-deployment.yaml
sed -i.bak "s|image: your-dockerhub-username/ecommerce-backend:latest|image: ${DOCKERHUB_USERNAME}/ecommerce-backend:latest|g" k8s/backend-deployment.yaml

# Mettre à jour frontend-deployment.yaml
sed -i.bak "s|image: your-dockerhub-username/ecommerce-frontend:latest|image: ${DOCKERHUB_USERNAME}/ecommerce-frontend:latest|g" k8s/frontend-deployment.yaml

# Supprimer les fichiers backup
rm -f k8s/*.bak

echo "✅ Manifests mis à jour avec succès !"
echo ""
echo "Vous pouvez maintenant déployer :"
echo "  kubectl apply -f k8s/"

