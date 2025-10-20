# Mini E-Commerce Backend - Système Distribué

Backend Django pour un mini e-commerce avec PostgreSQL et Docker.

## 🚀 Fonctionnalités

- ✅ API REST avec Django REST Framework
- ✅ Base de données PostgreSQL
- ✅ Modèle Utilisateur personnalisé (email comme identifiant)
- ✅ Modèle Produit avec gestion de stock
- ✅ API versionnée (`/api/v1/`)
- ✅ Docker & Docker Compose pour déploiement facile
- ✅ Superutilisateur créé automatiquement
- ✅ Interface d'administration Django

## 📋 Prérequis

- Docker Desktop installé
- Docker Compose installé
- Git

## 🛠️ Installation et Démarrage

### 1. Cloner le projet

```bash
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys
```

### 2. Lancer le projet avec Docker Compose

```bash
docker-compose up --build
```

Cette commande va :
- Construire l'image Docker du backend
- Démarrer PostgreSQL
- Appliquer les migrations de base de données
- Créer un superutilisateur
- Démarrer le serveur Django

### 3. Accéder aux services

Une fois les conteneurs démarrés :

- **API Backend** : http://localhost:8000
- **Admin Django** : http://localhost:8000/admin
  - Email : `admin@example.com`
  - Mot de passe : `admin123`

## 📡 Endpoints API

### Produits

- **GET** `/api/v1/products/` - Liste tous les produits
- **POST** `/api/v1/products/create/` - Créer un nouveau produit
- **GET** `/api/v1/products/{id}/` - Détails d'un produit
- **PUT/PATCH** `/api/v1/products/{id}/` - Modifier un produit
- **DELETE** `/api/v1/products/{id}/` - Supprimer un produit

### Utilisateurs

- **GET** `/api/v1/users/` - Liste tous les utilisateurs

## 🧪 Tester l'API

### Exemple : Obtenir la liste des produits

```bash
curl http://localhost:8000/api/v1/products/
```

### Exemple : Créer un produit via l'admin Django

1. Accédez à http://localhost:8000/admin
2. Connectez-vous avec `admin@example.com` / `admin123`
3. Allez dans "Produits" → "Ajouter un produit"

### Exemple : Créer un produit via l'API

```bash
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "MacBook Pro",
    "description": "Ordinateur portable haute performance",
    "prix": "2499.99",
    "quantite": 10
  }'
```

## 🏗️ Structure du Projet

```
distributed_sys/
├── backend/                    # Application Django
│   ├── backend/               # Configuration du projet Django
│   │   ├── __init__.py
│   │   ├── settings.py        # Configuration (PostgreSQL, DRF, etc.)
│   │   ├── urls.py            # Routes principales
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── users/                 # App Utilisateurs
│   │   ├── models.py          # Modèle Utilisateur personnalisé
│   │   ├── serializers.py     # Serializers DRF
│   │   ├── views.py           # Vues API
│   │   ├── admin.py           # Configuration admin
│   │   └── urls.py
│   ├── products/              # App Produits
│   │   ├── models.py          # Modèle Produit
│   │   ├── serializers.py     # Serializers DRF
│   │   ├── views.py           # Vues API
│   │   ├── admin.py           # Configuration admin
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt       # Dépendances Python
│   ├── Dockerfile             # Image Docker pour le backend
│   └── entrypoint.sh          # Script de démarrage
├── docker-compose.yml         # Orchestration des services
└── README.md                  # Ce fichier
```

## 📦 Technologies Utilisées

- **Python 3.12**
- **Django 5.0.1**
- **Django REST Framework 3.14.0**
- **PostgreSQL 16**
- **Docker & Docker Compose**
- **psycopg2-binary** (driver PostgreSQL)
- **django-cors-headers** (gestion CORS)

## 🔧 Configuration

### Variables d'environnement

Les variables d'environnement sont configurées dans `docker-compose.yml` :

```yaml
environment:
  - SECRET_KEY=django-insecure-your-secret-key-here
  - DEBUG=True
  - ALLOWED_HOSTS=localhost,127.0.0.1
  - DB_NAME=ecommerce_db
  - DB_USER=postgres
  - DB_PASSWORD=postgres
  - DB_HOST=db
  - DB_PORT=5432
  - DJANGO_SUPERUSER_USERNAME=admin
  - DJANGO_SUPERUSER_EMAIL=admin@example.com
  - DJANGO_SUPERUSER_PASSWORD=admin123
```

### Modèle Utilisateur

Le modèle Utilisateur personnalisé utilise l'**email** comme identifiant au lieu du username.

**Champs :**
- `id` (auto-généré)
- `nom` (CharField)
- `email` (EmailField, unique)
- `password` (hashé automatiquement par Django)
- `is_active`, `is_staff`, `is_superuser`
- `date_joined`

### Modèle Produit

**Champs :**
- `id` (auto-généré)
- `nom` (CharField)
- `description` (TextField)
- `prix` (DecimalField)
- `quantite` (PositiveIntegerField)
- `date_creation` (auto)
- `date_modification` (auto)

## 🛑 Arrêter les services

```bash
docker-compose down
```

Pour supprimer également les volumes (base de données) :

```bash
docker-compose down -v
```

## 🔄 Reconstruire les conteneurs

Si vous modifiez le code :

```bash
docker-compose up --build
```

## 📝 Commandes utiles

### Accéder au shell Django

```bash
docker-compose exec backend python manage.py shell
```

### Créer des migrations

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### Créer un nouveau superutilisateur

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Voir les logs

```bash
docker-compose logs -f backend
```

## 🔒 Sécurité

⚠️ **Important pour la production :**

1. Changez `SECRET_KEY` dans les variables d'environnement
2. Mettez `DEBUG=False`
3. Configurez `ALLOWED_HOSTS` avec votre domaine
4. Utilisez des mots de passe forts pour PostgreSQL et le superutilisateur
5. Utilisez un serveur WSGI comme Gunicorn au lieu de `runserver`

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Mini E-Commerce Backend pour système distribué

