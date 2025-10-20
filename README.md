# Mini E-Commerce Full-Stack - Système Distribué

Application e-commerce complète avec backend Django, frontend Next.js, PostgreSQL et Docker.

## 🚀 Fonctionnalités

### Backend (Django)
- ✅ API REST avec Django REST Framework
- ✅ Base de données PostgreSQL
- ✅ Modèle Utilisateur personnalisé (email comme identifiant)
- ✅ Modèle Produit avec gestion de stock
- ✅ API versionnée (`/api/v1/`)
- ✅ Authentification JWT
- ✅ Permissions par rôle (admin/user)
- ✅ Superutilisateur créé automatiquement
- ✅ Interface d'administration Django

### Frontend (Next.js)
- ✅ Interface utilisateur moderne et responsive
- ✅ Liste des produits avec design professionnel
- ✅ Système d'authentification (login/register)
- ✅ Ajout de produits (admin uniquement)
- ✅ Styled avec Tailwind CSS
- ✅ TypeScript pour la sécurité des types
- ✅ Gestion des erreurs et états de chargement

### Infrastructure
- ✅ Docker & Docker Compose pour déploiement facile
- ✅ Architecture microservices (Frontend, Backend, Database)
- ✅ Configuration CORS pour communication frontend-backend

## 📋 Prérequis

### Pour Docker Compose
- Docker Desktop installé
- Docker Compose installé
- Git

### Pour Kubernetes
- Minikube ou cluster Kubernetes
- kubectl CLI
- Docker pour builder les images

## 🚀 Démarrage Rapide

> **💡 Conseil** : Consultez [`QUICK_START.md`](QUICK_START.md) pour un guide ultra-rapide !
> 
> **📚 Index** : Consultez [`DOCS_INDEX.md`](DOCS_INDEX.md) pour naviguer dans toute la documentation !

## 🛠️ Installation et Démarrage

### Option 1 : Docker Compose (Recommandé pour le développement)

#### 1. Cloner le projet

```bash
git clone https://github.com/Cescito04/distributed_sys.git
cd distributed_sys
```

#### 2. Lancer avec Docker Compose

```bash
docker-compose up --build -d
```

Cette commande va :
- Construire les images Docker du backend et frontend
- Démarrer PostgreSQL
- Appliquer les migrations de base de données
- Créer un superutilisateur
- Démarrer tous les services

### Option 2 : Kubernetes (Recommandé pour la production)

#### 1. Builder et pusher les images

```bash
./scripts/build-and-push.sh votre-username-dockerhub
./scripts/update-k8s-images.sh votre-username-dockerhub
```

#### 2. Déployer sur Kubernetes

```bash
# Déployer tout
kubectl apply -f k8s/

# OU utiliser le script
./scripts/deploy-k8s.sh

# OU avec Makefile
cd k8s && make deploy
```

Voir le guide complet : [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md)

### 3. Accéder aux services

#### Avec Docker Compose

Une fois les conteneurs démarrés :

- **Frontend Next.js** : http://localhost:3000 ⭐ **Commencez ici !**
- **API Backend** : http://localhost:8000
- **Admin Django** : http://localhost:8000/admin
  - Email : `admin@example.com`
  - Mot de passe : `admin123`
- **Base de données PostgreSQL** : localhost:5433

#### Avec Kubernetes

```bash
# Port forward le frontend
kubectl port-forward -n ecommerce service/frontend-service 3000:3000

# Accéder au frontend
# http://localhost:3000

# Port forward le backend (optionnel)
kubectl port-forward -n ecommerce service/backend-service 8000:8000
```

## 📡 Endpoints API

### Authentification

- **POST** `/api/v1/auth/login/` - Connexion (retourne JWT tokens)
- **POST** `/api/v1/auth/refresh/` - Rafraîchir le token

### Utilisateurs

- **GET** `/api/v1/users/` - Liste tous les utilisateurs (authentifié)
- **POST** `/api/v1/users/create/` - Inscription (public)
- **GET** `/api/v1/users/me/` - Profil utilisateur (authentifié)
- **GET** `/api/v1/users/{id}/` - Détails utilisateur (admin)

### Produits

- **GET** `/api/v1/products/` - Liste tous les produits (public)
- **POST** `/api/v1/products/create/` - Créer un nouveau produit (admin)
- **GET** `/api/v1/products/{id}/` - Détails d'un produit (public)
- **PUT/PATCH** `/api/v1/products/{id}/` - Modifier un produit (admin)
- **DELETE** `/api/v1/products/{id}/` - Supprimer un produit (admin)

## 🧪 Tester l'application

### Option 1 : Via le Frontend (Recommandé)

1. Ouvrir http://localhost:3000
2. Consulter la liste des produits
3. Cliquer sur "Connexion" et utiliser :
   - Email : `admin@example.com`
   - Mot de passe : `admin123`
4. Cliquer sur "Ajouter Produit" et remplir le formulaire
5. Le produit apparaîtra sur la page d'accueil

### Option 2 : Via l'API directement

```bash
# 1. Se connecter et obtenir le token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}' \
  | grep -o '"access":"[^"]*"' | cut -d'"' -f4)

# 2. Créer un produit
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "MacBook Pro",
    "description": "Ordinateur portable haute performance",
    "prix": "2499.99",
    "quantite": 10
  }'

# 3. Voir tous les produits
curl http://localhost:8000/api/v1/products/
```

### Option 3 : Via Django Admin

1. Accédez à http://localhost:8000/admin
2. Connectez-vous avec `admin@example.com` / `admin123`
3. Allez dans "Produits" → "Ajouter un produit"

## 🏗️ Structure du Projet

```
distributed_sys/
├── backend/                    # Application Django
│   ├── backend/               # Configuration du projet Django
│   │   ├── settings.py        # Configuration (PostgreSQL, DRF, JWT, CORS)
│   │   └── urls.py            # Routes principales API
│   ├── users/                 # App Utilisateurs
│   │   ├── models.py          # Modèle Utilisateur personnalisé
│   │   ├── serializers.py     # Serializers DRF
│   │   ├── views.py           # Vues API (auth, CRUD users)
│   │   └── urls.py            # Routes utilisateurs et auth
│   ├── products/              # App Produits
│   │   ├── models.py          # Modèle Produit
│   │   ├── serializers.py     # Serializers DRF
│   │   ├── views.py           # Vues API (CRUD produits)
│   │   └── urls.py            # Routes produits
│   ├── requirements.txt       # Dépendances Python
│   ├── Dockerfile             # Image Docker backend
│   └── entrypoint.sh          # Script de démarrage
│
├── frontend/                   # Application Next.js
│   ├── components/            # Composants React
│   │   ├── Layout.tsx         # Layout principal
│   │   ├── Navbar.tsx         # Barre de navigation
│   │   ├── ProductCard.tsx    # Carte produit
│   │   └── LoadingSpinner.tsx # Loader
│   ├── lib/                   # Services et types
│   │   ├── api.ts             # Client API Axios
│   │   └── types.ts           # Types TypeScript
│   ├── pages/                 # Pages Next.js
│   │   ├── index.tsx          # Page d'accueil (liste produits)
│   │   ├── login.tsx          # Page de connexion
│   │   ├── register.tsx       # Page d'inscription
│   │   └── add-product.tsx    # Page d'ajout produit
│   ├── styles/
│   │   └── globals.css        # Styles Tailwind
│   ├── package.json           # Dépendances npm
│   ├── Dockerfile             # Image Docker frontend
│   └── next.config.js         # Configuration Next.js
│
├── docker-compose.yml         # Orchestration (DB + Backend + Frontend)
├── k8s/                       # Manifests Kubernetes
│   ├── namespace.yaml         # Namespace ecommerce
│   ├── configmap.yaml         # Configuration
│   ├── secrets.yaml           # Secrets (passwords)
│   ├── postgres-deployment.yaml  # PostgreSQL + PVC
│   ├── backend-deployment.yaml   # Backend Django
│   ├── frontend-deployment.yaml  # Frontend Next.js
│   ├── all-in-one.yaml       # Tous les manifests
│   ├── kustomization.yaml    # Kustomize
│   ├── Makefile              # Commandes K8s
│   └── README.md             # Documentation K8s
├── scripts/                   # Scripts utilitaires
│   ├── build-and-push.sh     # Build et push images Docker
│   ├── update-k8s-images.sh  # Met à jour les manifests
│   └── deploy-k8s.sh         # Déploie sur K8s
├── README.md                  # Documentation principale
├── AUTHENTICATION.md          # Guide d'authentification JWT
├── API_EXAMPLES.md            # Exemples d'utilisation de l'API
├── TEST_RESULTS.md            # Résultats des tests
├── FRONTEND_SETUP.md          # Guide de démarrage frontend
└── Makefile                   # Commandes Docker Compose
```

## 📦 Technologies Utilisées

### Backend
- **Python 3.12**
- **Django 5.0.1**
- **Django REST Framework 3.14.0**
- **Django REST Framework Simple JWT 5.3.1** (authentification)
- **PostgreSQL 16**
- **psycopg2-binary** (driver PostgreSQL)
- **django-cors-headers** (gestion CORS)

### Frontend
- **Next.js 14.0.4**
- **React 18.2.0**
- **TypeScript 5.3.3**
- **Tailwind CSS 3.3.6**
- **Axios 1.6.2** (client HTTP)

### Infrastructure
- **Docker & Docker Compose**
- Architecture microservices

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

