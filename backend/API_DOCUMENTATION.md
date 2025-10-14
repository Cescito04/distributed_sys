# Documentation API - Backend Django E-commerce

## 🚀 Endpoints Disponibles

### 🔐 Authentification

#### POST /api/v1/auth/login/
**Description:** Connexion utilisateur avec JWT
**Permissions:** Aucune

**Body:**
```json
{
    "email": "admin@ecommerce.com",
    "password": "admin123"
}
```

**Réponse:**
```json
{
    "success": true,
    "message": "Connexion réussie",
    "data": {
        "user": {
            "id": 1,
            "email": "admin@ecommerce.com",
            "username": "admin",
            "nom": "Administrateur",
            "is_active": true,
            "date_joined": "2025-09-11T11:46:58.756428Z"
        },
        "tokens": {
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
    }
}
```

#### POST /api/v1/auth/logout/
**Description:** Déconnexion utilisateur
**Permissions:** Authentifié

**Body:**
```json
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/v1/auth/refresh/
**Description:** Renouveler le token d'accès
**Permissions:** Aucune

**Body:**
```json
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /api/v1/auth/profile/
**Description:** Récupérer le profil de l'utilisateur connecté
**Permissions:** Authentifié

**Headers:**
```
Authorization: Bearer <access_token>
```

### 👥 Gestion des Utilisateurs

#### GET /api/v1/users/
**Description:** Lister tous les utilisateurs
**Permissions:** Admin uniquement

**Headers:**
```
Authorization: Bearer <access_token>
```

#### POST /api/v1/users/create/
**Description:** Créer un nouvel utilisateur
**Permissions:** Admin uniquement

**Body:**
```json
{
    "email": "nouveau@email.com",
    "username": "nouveau_user",
    "nom": "Nouveau Utilisateur",
    "first_name": "Prénom",
    "last_name": "Nom",
    "password": "motdepasse123",
    "password_confirm": "motdepasse123"
}
```

#### GET /api/v1/users/{id}/
**Description:** Récupérer un utilisateur spécifique
**Permissions:** Authentifié (propre profil ou admin)

#### PUT /api/v1/users/{id}/
**Description:** Modifier un utilisateur
**Permissions:** Authentifié (propre profil ou admin)

#### DELETE /api/v1/users/{id}/
**Description:** Supprimer un utilisateur
**Permissions:** Admin uniquement

### 🛍️ Gestion des Produits

#### GET /api/v1/products/
**Description:** Lister tous les produits
**Permissions:** Aucune (public)

**Réponse:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "nom": "iPhone 15 Pro",
            "description": "Le dernier smartphone Apple...",
            "prix": "1199.99",
            "quantite": 50,
            "date_creation": "2025-09-11T11:47:05.677118Z",
            "date_modification": "2025-09-11T11:47:05.677144Z"
        }
    ],
    "count": 5
}
```

#### POST /api/v1/products/create/
**Description:** Créer un nouveau produit
**Permissions:** Admin uniquement

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
    "nom": "MacBook Pro M3",
    "description": "Ordinateur portable professionnel",
    "prix": 1999.99,
    "quantite": 15
}
```

#### GET /api/v1/products/{id}/
**Description:** Récupérer un produit spécifique
**Permissions:** Aucune (public)

#### PUT /api/v1/products/{id}/
**Description:** Modifier un produit
**Permissions:** Admin uniquement

#### PATCH /api/v1/products/{id}/
**Description:** Modifier partiellement un produit
**Permissions:** Admin uniquement

#### DELETE /api/v1/products/{id}/
**Description:** Supprimer un produit
**Permissions:** Admin uniquement

## 🔒 Sécurité et Permissions

### Niveaux d'accès:
- **Public:** Lecture des produits uniquement
- **Authentifié:** Accès au profil personnel
- **Admin:** Toutes les opérations CRUD

### Authentification JWT:
- **Access Token:** Valide 60 minutes
- **Refresh Token:** Valide 7 jours
- **Header:** `Authorization: Bearer <token>`

## ✅ Validations

### Produits:
- **Prix:** Doit être > 0
- **Quantité:** Doit être ≥ 0
- **Nom:** Obligatoire, max 200 caractères
- **Description:** Obligatoire

### Utilisateurs:
- **Email:** Format valide, unique
- **Mot de passe:** Validation Django par défaut
- **Confirmation:** Doit correspondre au mot de passe

## 🌐 CORS

Configuration CORS pour les frontends:
- `http://localhost:3000` (React)
- `http://localhost:8080` (Vue.js)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:8080`

## 📊 Codes de Statut

- **200:** Succès
- **201:** Créé avec succès
- **204:** Supprimé avec succès
- **400:** Erreur de validation
- **401:** Non authentifié
- **403:** Accès refusé
- **404:** Ressource non trouvée
- **500:** Erreur serveur

## 🚀 Utilisation

### 1. Démarrer le serveur:
```bash
docker-compose up --build
```

### 2. Se connecter:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ecommerce.com", "password": "admin123"}'
```

### 3. Utiliser le token:
```bash
curl -H "Authorization: Bearer <access_token>" \
  http://localhost:8000/api/v1/products/
```

## 🔧 Configuration

### Variables d'environnement:
- **DEBUG:** True/False
- **SECRET_KEY:** Clé secrète Django
- **DATABASE_URL:** URL de la base de données

### Base de données:
- **Host:** db (Docker) / localhost (local)
- **Port:** 5432
- **Database:** ecommerce_db
- **User:** postgres
- **Password:** postgres
