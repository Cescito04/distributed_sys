# Exemples d'utilisation de l'API

Ce document contient des exemples pratiques d'utilisation de l'API du mini e-commerce.

## Base URL

```
http://localhost:8000/api/v1/
```

## 📦 API Produits

### 1. Lister tous les produits

**Requête :**
```bash
curl http://localhost:8000/api/v1/products/
```

**Réponse (exemple) :**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "nom": "MacBook Pro",
      "description": "Ordinateur portable haute performance",
      "prix": "2499.99",
      "quantite": 10,
      "est_disponible": true,
      "date_creation": "2025-10-20T10:30:00Z",
      "date_modification": "2025-10-20T10:30:00Z"
    },
    {
      "id": 2,
      "nom": "iPhone 15",
      "description": "Smartphone dernière génération",
      "prix": "999.99",
      "quantite": 0,
      "est_disponible": false,
      "date_creation": "2025-10-20T11:00:00Z",
      "date_modification": "2025-10-20T11:00:00Z"
    }
  ]
}
```

### 2. Créer un nouveau produit

**Requête :**
```bash
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "iPad Air",
    "description": "Tablette légère et puissante",
    "prix": "699.99",
    "quantite": 25
  }'
```

**Réponse :**
```json
{
  "id": 3,
  "nom": "iPad Air",
  "description": "Tablette légère et puissante",
  "prix": "699.99",
  "quantite": 25
}
```

### 3. Obtenir les détails d'un produit

**Requête :**
```bash
curl http://localhost:8000/api/v1/products/1/
```

**Réponse :**
```json
{
  "id": 1,
  "nom": "MacBook Pro",
  "description": "Ordinateur portable haute performance",
  "prix": "2499.99",
  "quantite": 10,
  "est_disponible": true,
  "date_creation": "2025-10-20T10:30:00Z",
  "date_modification": "2025-10-20T10:30:00Z"
}
```

### 4. Mettre à jour un produit (complet)

**Requête :**
```bash
curl -X PUT http://localhost:8000/api/v1/products/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "MacBook Pro M3",
    "description": "Ordinateur portable avec puce M3",
    "prix": "2699.99",
    "quantite": 15
  }'
```

### 5. Mettre à jour un produit (partiel)

**Requête :**
```bash
curl -X PATCH http://localhost:8000/api/v1/products/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "quantite": 20
  }'
```

### 6. Supprimer un produit

**Requête :**
```bash
curl -X DELETE http://localhost:8000/api/v1/products/1/
```

**Réponse :**
```
Status: 204 No Content
```

## 👥 API Utilisateurs

### 1. Lister tous les utilisateurs

**Requête :**
```bash
curl http://localhost:8000/api/v1/users/
```

**Réponse (exemple) :**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "nom": "admin",
      "email": "admin@example.com",
      "date_joined": "2025-10-20T09:00:00Z",
      "is_active": true
    },
    {
      "id": 2,
      "nom": "John Doe",
      "email": "john@example.com",
      "date_joined": "2025-10-20T10:00:00Z",
      "is_active": true
    }
  ]
}
```

## 🧪 Tests avec Python

### Installation des dépendances

```bash
pip install requests
```

### Script Python pour tester l'API

```python
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# 1. Lister tous les produits
print("=== Liste des produits ===")
response = requests.get(f"{BASE_URL}/products/")
print(json.dumps(response.json(), indent=2))

# 2. Créer un nouveau produit
print("\n=== Création d'un produit ===")
new_product = {
    "nom": "AirPods Pro",
    "description": "Écouteurs sans fil avec réduction de bruit",
    "prix": "279.99",
    "quantite": 50
}
response = requests.post(f"{BASE_URL}/products/create/", json=new_product)
print(json.dumps(response.json(), indent=2))
product_id = response.json()["id"]

# 3. Obtenir les détails du produit créé
print(f"\n=== Détails du produit {product_id} ===")
response = requests.get(f"{BASE_URL}/products/{product_id}/")
print(json.dumps(response.json(), indent=2))

# 4. Mettre à jour le stock
print(f"\n=== Mise à jour du stock du produit {product_id} ===")
update_data = {"quantite": 100}
response = requests.patch(f"{BASE_URL}/products/{product_id}/", json=update_data)
print(json.dumps(response.json(), indent=2))

# 5. Lister tous les utilisateurs
print("\n=== Liste des utilisateurs ===")
response = requests.get(f"{BASE_URL}/users/")
print(json.dumps(response.json(), indent=2))
```

## 🧪 Tests avec Postman

### Configuration de Postman

1. Créer une nouvelle collection "E-Commerce API"
2. Définir une variable d'environnement `base_url` = `http://localhost:8000/api/v1`

### Requêtes à créer

1. **GET** `{{base_url}}/products/` - Liste des produits
2. **POST** `{{base_url}}/products/create/` - Créer un produit
   - Body (raw JSON):
   ```json
   {
     "nom": "Apple Watch",
     "description": "Montre connectée",
     "prix": "449.99",
     "quantite": 30
   }
   ```
3. **GET** `{{base_url}}/products/1/` - Détails d'un produit
4. **PATCH** `{{base_url}}/products/1/` - Mettre à jour un produit
5. **DELETE** `{{base_url}}/products/1/` - Supprimer un produit
6. **GET** `{{base_url}}/users/` - Liste des utilisateurs

## 📊 Codes de statut HTTP

- `200 OK` - Succès (GET, PUT, PATCH)
- `201 Created` - Ressource créée (POST)
- `204 No Content` - Succès sans contenu (DELETE)
- `400 Bad Request` - Données invalides
- `404 Not Found` - Ressource non trouvée
- `500 Internal Server Error` - Erreur serveur

## 🔍 Filtrage et Pagination

### Pagination

Par défaut, l'API pagine les résultats (10 éléments par page).

```bash
# Page 1
curl http://localhost:8000/api/v1/products/?page=1

# Page 2
curl http://localhost:8000/api/v1/products/?page=2
```

## 🛡️ Validation des données

### Contraintes sur les produits

- `nom` : Obligatoire, max 200 caractères
- `description` : Optionnel, texte libre
- `prix` : Obligatoire, décimal positif (min 0.01)
- `quantite` : Obligatoire, entier positif ou zéro

### Exemples d'erreurs de validation

**Prix négatif :**
```bash
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prix": "-10.00",
    "quantite": 5
  }'
```

**Réponse :**
```json
{
  "prix": ["Ensure this value is greater than or equal to 0.01."]
}
```

## 🎯 Prochaines fonctionnalités (à implémenter)

- Authentification JWT
- Gestion du panier
- Gestion des commandes
- Upload d'images pour les produits
- Recherche et filtres avancés
- Webhooks pour les notifications

## 📝 Notes

- Toutes les dates sont au format ISO 8601 (UTC)
- Les prix sont en décimal avec 2 chiffres après la virgule
- Le champ `est_disponible` est calculé automatiquement (true si quantite > 0)

