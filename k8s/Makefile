.PHONY: help deploy delete status logs logs-backend logs-frontend logs-db port-forward shell-backend shell-db restart clean

NAMESPACE=ecommerce

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

deploy: ## Déploie toute l'application sur Kubernetes
	@echo "🚀 Déploiement de l'application ShopHub..."
	kubectl apply -f namespace.yaml
	kubectl apply -f configmap.yaml
	kubectl apply -f secrets.yaml
	kubectl apply -f postgres-deployment.yaml
	@echo "⏳ Attente de PostgreSQL (30s)..."
	@sleep 30
	kubectl apply -f backend-deployment.yaml
	@echo "⏳ Attente du Backend (20s)..."
	@sleep 20
	kubectl apply -f frontend-deployment.yaml
	@echo "✅ Déploiement terminé !"
	@make status

status: ## Affiche l'état de tous les pods et services
	@echo "\n📊 Pods:"
	kubectl get pods -n $(NAMESPACE)
	@echo "\n🌐 Services:"
	kubectl get services -n $(NAMESPACE)
	@echo "\n💾 PersistentVolumeClaims:"
	kubectl get pvc -n $(NAMESPACE)

logs: ## Affiche les logs de tous les pods
	kubectl logs -n $(NAMESPACE) -l app=backend --tail=50
	kubectl logs -n $(NAMESPACE) -l app=frontend --tail=50
	kubectl logs -n $(NAMESPACE) -l app=postgres --tail=50

logs-backend: ## Affiche les logs du backend
	kubectl logs -n $(NAMESPACE) -l app=backend -f

logs-frontend: ## Affiche les logs du frontend
	kubectl logs -n $(NAMESPACE) -l app=frontend -f

logs-db: ## Affiche les logs de PostgreSQL
	kubectl logs -n $(NAMESPACE) -l app=postgres -f

port-forward: ## Forward le frontend sur localhost:3000
	@echo "🌐 Frontend accessible sur http://localhost:3000"
	kubectl port-forward -n $(NAMESPACE) service/frontend-service 3000:3000

port-forward-backend: ## Forward le backend sur localhost:8000
	@echo "🔧 Backend accessible sur http://localhost:8000"
	kubectl port-forward -n $(NAMESPACE) service/backend-service 8000:8000

shell-backend: ## Accède au shell d'un pod backend
	kubectl exec -it -n $(NAMESPACE) $$(kubectl get pod -n $(NAMESPACE) -l app=backend -o jsonpath='{.items[0].metadata.name}') -- /bin/bash

shell-db: ## Accède au shell PostgreSQL
	kubectl exec -it -n $(NAMESPACE) $$(kubectl get pod -n $(NAMESPACE) -l app=postgres -o jsonpath='{.items[0].metadata.name}') -- psql -U postgres -d ecommerce_db

describe-pods: ## Décrit tous les pods
	kubectl describe pods -n $(NAMESPACE)

events: ## Affiche les events récents
	kubectl get events -n $(NAMESPACE) --sort-by='.lastTimestamp' | tail -20

restart-backend: ## Redémarre les pods backend
	kubectl rollout restart deployment/backend-deployment -n $(NAMESPACE)

restart-frontend: ## Redémarre les pods frontend
	kubectl rollout restart deployment/frontend-deployment -n $(NAMESPACE)

restart: ## Redémarre tous les deployments
	kubectl rollout restart deployment -n $(NAMESPACE)

scale-backend: ## Scale le backend (usage: make scale-backend REPLICAS=3)
	kubectl scale deployment backend-deployment -n $(NAMESPACE) --replicas=$(REPLICAS)

scale-frontend: ## Scale le frontend (usage: make scale-frontend REPLICAS=3)
	kubectl scale deployment frontend-deployment -n $(NAMESPACE) --replicas=$(REPLICAS)

delete: ## Supprime toute l'application
	@echo "⚠️  Suppression de toutes les ressources..."
	kubectl delete -f frontend-deployment.yaml --ignore-not-found=true
	kubectl delete -f backend-deployment.yaml --ignore-not-found=true
	kubectl delete -f postgres-deployment.yaml --ignore-not-found=true
	kubectl delete -f secrets.yaml --ignore-not-found=true
	kubectl delete -f configmap.yaml --ignore-not-found=true
	kubectl delete -f namespace.yaml --ignore-not-found=true
	@echo "✅ Toutes les ressources supprimées"

clean: delete ## Alias pour delete

watch: ## Surveille les pods en temps réel
	watch kubectl get pods -n $(NAMESPACE)

top: ## Affiche l'utilisation des ressources
	kubectl top pods -n $(NAMESPACE)

config-view: ## Affiche les ConfigMaps et Secrets
	@echo "📋 ConfigMap:"
	kubectl get configmap app-config -n $(NAMESPACE) -o yaml
	@echo "\n🔐 Secrets (pas les valeurs):"
	kubectl get secret app-secrets -n $(NAMESPACE)

minikube-tunnel: ## Démarre le tunnel Minikube (pour LoadBalancer)
	minikube tunnel

get-frontend-url: ## Obtient l'URL du frontend (Minikube)
	@echo "Frontend URL:"
	@minikube service frontend-service -n $(NAMESPACE) --url

dashboard: ## Ouvre le dashboard Kubernetes (Minikube)
	minikube dashboard

