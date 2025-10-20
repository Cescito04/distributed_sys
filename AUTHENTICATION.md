# Guide d'Authentification JWT

Ce guide explique comment utiliser l'authentification JWT dans l'API e-commerce.

## 🔐 Fonctionnement de l'authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification. Une fois connecté, vous recevez :
- Un **access token** (valide 1 heure) pour accéder aux ressources protégées
- Un **refresh token** (valide 7 jours) pour obtenir un nouveau access token

## 📋 Endpoints d'authentification

### 1. Inscription (Créer un compte)

**POST** `/api/v1/users/create/`

```bash
curl -X POST http://localhost:8000/api/v1/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "password": "motdepasse123"
  }'
```

**Réponse :**
```json
{
  "id": 2,
  "nom": "Jean Dupont",
  "email": "jean@example.com"
}
```

### 2. Connexion (Login)

**POST** `/api/v1/auth/login/`

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "motdepasse123"
  }'
```

**Réponse :**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. Rafraîchir le token

**POST** `/api/v1/auth/refresh/`

```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }'
```

**Réponse :**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 🔑 Utiliser le token d'accès

Pour accéder aux endpoints protégés, incluez le token dans l'en-tête `Authorization` :

```bash
curl http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

## 📡 Endpoints protégés

### Endpoints publics (pas d'authentification requise)
- ✅ `GET /api/v1/products/` - Liste des produits
- ✅ `GET /api/v1/products/<id>/` - Détails d'un produit
- ✅ `POST /api/v1/users/create/` - Inscription
- ✅ `POST /api/v1/auth/login/` - Connexion

### Endpoints nécessitant une authentification
- 🔒 `GET /api/v1/users/` - Liste des utilisateurs (utilisateur connecté)
- 🔒 `GET /api/v1/users/me/` - Profil de l'utilisateur connecté

### Endpoints réservés aux administrateurs
- 🔐 `POST /api/v1/products/create/` - Créer un produit
- 🔐 `PUT/PATCH /api/v1/products/<id>/` - Modifier un produit
- 🔐 `DELETE /api/v1/products/<id>/` - Supprimer un produit
- 🔐 `GET/PUT/DELETE /api/v1/users/<id>/` - Gérer un utilisateur spécifique

## 🧪 Exemples complets

### Scénario 1 : Inscription et connexion

```bash
# 1. Créer un nouveau compte
curl -X POST http://localhost:8000/api/v1/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Marie Martin",
    "email": "marie@example.com",
    "password": "motdepasse456"
  }'

# 2. Se connecter
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie@example.com",
    "password": "motdepasse456"
  }'
# Sauvegardez le access token retourné

# 3. Obtenir son profil
curl http://localhost:8000/api/v1/users/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Scénario 2 : Admin crée un produit

```bash
# 1. Se connecter en tant qu'admin
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
# Sauvegardez le access token

# 2. Créer un produit (nécessite être admin)
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "MacBook Pro",
    "description": "Ordinateur portable haute performance",
    "prix": "2499.99",
    "quantite": 10
  }'
```

### Scénario 3 : Gestion des erreurs

#### Accès non autorisé (pas de token)
```bash
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -d '{"nom": "Test", "prix": "100", "quantite": 5}'
```

**Réponse :**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

#### Token expiré
```bash
curl http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```

**Réponse :**
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid"
}
```

#### Permissions insuffisantes (utilisateur normal essaie de créer un produit)
```bash
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nom": "Test", "prix": "100", "quantite": 5}'
```

**Réponse :**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

## 🔧 Configuration JWT

Les tokens JWT sont configurés dans `settings.py` :

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),      # Token d'accès valide 1h
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),      # Token de rafraîchissement valide 7j
    'ROTATE_REFRESH_TOKENS': True,                    # Nouveau refresh token à chaque rafraîchissement
    'UPDATE_LAST_LOGIN': True,                        # Met à jour last_login
    'ALGORITHM': 'HS256',                             # Algorithme de signature
    'AUTH_HEADER_TYPES': ('Bearer',),                 # Type d'en-tête
}
```

## 📝 Script Python pour tester

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

class APIClient:
    def __init__(self):
        self.access_token = None
        self.refresh_token = None
    
    def signup(self, nom, email, password):
        """Inscription"""
        response = requests.post(
            f"{BASE_URL}/users/create/",
            json={"nom": nom, "email": email, "password": password}
        )
        return response.json()
    
    def login(self, email, password):
        """Connexion"""
        response = requests.post(
            f"{BASE_URL}/auth/login/",
            json={"email": email, "password": password}
        )
        data = response.json()
        self.access_token = data.get('access')
        self.refresh_token = data.get('refresh')
        return data
    
    def get_headers(self):
        """Retourne les en-têtes avec le token"""
        return {"Authorization": f"Bearer {self.access_token}"}
    
    def get_profile(self):
        """Obtenir son profil"""
        response = requests.get(
            f"{BASE_URL}/users/me/",
            headers=self.get_headers()
        )
        return response.json()
    
    def create_product(self, nom, description, prix, quantite):
        """Créer un produit (admin uniquement)"""
        response = requests.post(
            f"{BASE_URL}/products/create/",
            headers=self.get_headers(),
            json={
                "nom": nom,
                "description": description,
                "prix": prix,
                "quantite": quantite
            }
        )
        return response.json()

# Utilisation
client = APIClient()

# S'inscrire
print("Inscription...")
client.signup("Test User", "test@example.com", "password123")

# Se connecter
print("Connexion...")
client.login("test@example.com", "password123")

# Obtenir son profil
print("Profil:", client.get_profile())
```

## 🔒 Bonnes pratiques

1. **Ne jamais partager vos tokens** - Ils sont aussi sensibles qu'un mot de passe
2. **Stocker les tokens de manière sécurisée** - Utiliser httpOnly cookies ou localStorage avec précaution
3. **Rafraîchir les tokens avant expiration** - Implémenter un système de rafraîchissement automatique
4. **Gérer la déconnexion** - Supprimer les tokens du stockage local
5. **HTTPS en production** - Toujours utiliser HTTPS pour transmettre les tokens

## ❓ FAQ

### Comment devenir administrateur ?

Via l'interface Django Admin ou la console :
```bash
docker-compose exec backend python manage.py shell
```

```python
from users.models import Utilisateur
user = Utilisateur.objects.get(email="user@example.com")
user.is_staff = True
user.is_superuser = True
user.save()
```

### Que faire si mon token expire ?

Utilisez le refresh token pour obtenir un nouveau access token :
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'
```

### Comment tester avec Postman ?

1. Créer une requête POST vers `/api/v1/auth/login/`
2. Sauvegarder l'access token
3. Dans les requêtes suivantes, aller dans l'onglet "Authorization"
4. Sélectionner "Bearer Token"
5. Coller votre access token

