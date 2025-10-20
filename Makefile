.PHONY: help build up down restart logs shell migrate makemigrations createsuperuser test clean

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construit les images Docker
	docker-compose build

up: ## Démarre les services
	docker-compose up

up-d: ## Démarre les services en arrière-plan
	docker-compose up -d

down: ## Arrête les services
	docker-compose down

down-v: ## Arrête les services et supprime les volumes
	docker-compose down -v

restart: ## Redémarre les services
	docker-compose restart

logs: ## Affiche les logs
	docker-compose logs -f

logs-backend: ## Affiche les logs du backend
	docker-compose logs -f backend

logs-db: ## Affiche les logs de la base de données
	docker-compose logs -f db

shell: ## Accède au shell Django
	docker-compose exec backend python manage.py shell

bash: ## Accède au bash du conteneur backend
	docker-compose exec backend bash

migrate: ## Applique les migrations
	docker-compose exec backend python manage.py migrate

makemigrations: ## Crée les migrations
	docker-compose exec backend python manage.py makemigrations

createsuperuser: ## Crée un superutilisateur
	docker-compose exec backend python manage.py createsuperuser

collectstatic: ## Collecte les fichiers statiques
	docker-compose exec backend python manage.py collectstatic --noinput

test: ## Lance les tests
	docker-compose exec backend python manage.py test

clean: ## Nettoie les fichiers Python
	find . -type d -name __pycache__ -exec rm -r {} +
	find . -type f -name '*.pyc' -delete
	find . -type f -name '*.pyo' -delete

ps: ## Liste les conteneurs en cours d'exécution
	docker-compose ps

rebuild: ## Reconstruit et démarre les services
	docker-compose up --build

db-shell: ## Accède au shell PostgreSQL
	docker-compose exec db psql -U postgres -d ecommerce_db

db-reset: ## Réinitialise la base de données (⚠️ ATTENTION : supprime toutes les données)
	docker-compose down -v
	docker-compose up -d db
	sleep 5
	docker-compose up -d backend

backup-db: ## Sauvegarde la base de données
	docker-compose exec -T db pg_dump -U postgres ecommerce_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restaure la base de données (utiliser: make restore-db FILE=backup.sql)
	docker-compose exec -T db psql -U postgres ecommerce_db < $(FILE)

