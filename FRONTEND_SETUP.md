# Guide de démarrage rapide - Frontend

Ce guide vous explique comment démarrer le frontend Next.js de l'application e-commerce.

## 🚀 Démarrage rapide avec Docker

### Tout démarrer (Backend + Frontend + Database)

```bash
# Depuis la racine du projet
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

**Accès aux services :**
- Frontend : http://localhost:3000
- Backend API : http://localhost:8000
- Admin Django : http://localhost:8000/admin

### Démarrer uniquement le frontend

```bash
docker-compose up -d frontend
```

## 💻 Développement local (sans Docker)

### Prérequis

- Node.js 18+
- Le backend Django doit être démarré sur http://localhost:8000

### Installation

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Créer le fichier d'environnement (optionnel)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# Démarrer en mode développement
npm run dev
```

Le frontend sera accessible sur http://localhost:3000

## 🧪 Tester l'application

### 1. Voir la liste des produits

- Ouvrir http://localhost:3000
- La page affiche tous les produits disponibles
- Si aucun produit, un message s'affiche

### 2. Créer un compte

1. Cliquer sur "Inscription" dans la navbar
2. Remplir le formulaire :
   - Nom complet
   - Email
   - Mot de passe (min 8 caractères)
3. Soumettre
4. Vous serez automatiquement connecté

### 3. Se connecter avec le compte admin

1. Cliquer sur "Connexion"
2. Utiliser ces identifiants :
   - **Email :** `admin@example.com`
   - **Mot de passe :** `admin123`
3. Vous verrez votre nom dans la navbar

### 4. Ajouter un produit (admin uniquement)

1. Se connecter avec le compte admin
2. Cliquer sur "Ajouter Produit" dans la navbar
3. Remplir le formulaire :
   - Nom du produit
   - Description
   - Prix (en euros)
   - Quantité en stock
4. Soumettre
5. Le produit apparaîtra sur la page d'accueil

## 📱 Captures d'écran des pages

### Page d'accueil
- Liste de tous les produits en grille
- Chaque produit affiche :
  - Nom et description
  - Prix
  - Quantité disponible
  - Badge "En stock" ou "Rupture"
  - Bouton "Acheter"

### Page de connexion
- Formulaire avec email et mot de passe
- Lien vers l'inscription
- Compte de test fourni

### Page d'inscription
- Formulaire complet
- Validation du mot de passe
- Connexion automatique après inscription

### Page d'ajout de produit
- Formulaire avec validations
- Message de succès/erreur
- Redirection automatique après ajout

## 🔑 Authentification

### Comment fonctionne l'authentification ?

1. **Connexion**
   - L'utilisateur entre son email et mot de passe
   - Le frontend envoie une requête à `/api/v1/auth/login/`
   - Le backend retourne `access_token` et `refresh_token`
   - Les tokens sont stockés dans `localStorage`

2. **Requêtes authentifiées**
   - Chaque requête inclut automatiquement `Authorization: Bearer <token>`
   - L'intercepteur Axios ajoute le token à toutes les requêtes

3. **Déconnexion**
   - Supprime les tokens du `localStorage`
   - Rafraîchit la navbar
   - Redirige vers la page d'accueil

### Durée de vie des tokens

- **Access token :** 1 heure
- **Refresh token :** 7 jours

## 🎨 Personnalisation

### Changer les couleurs

Modifier `frontend/tailwind.config.js` :

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',  // Changez cette couleur
        600: '#2563eb',
        // ...
      },
    },
  },
}
```

### Changer l'URL de l'API

Créer `frontend/.env.local` :

```bash
NEXT_PUBLIC_API_URL=http://votre-backend:8000/api/v1
```

## 🐛 Résolution de problèmes

### Erreur : "Erreur lors du chargement des produits"

**Cause :** Le backend n'est pas accessible

**Solution :**
```bash
# Vérifier que le backend est démarré
curl http://localhost:8000/api/v1/products/

# Ou avec docker-compose
docker-compose ps
```

### Erreur CORS

**Cause :** Le backend n'autorise pas les requêtes depuis http://localhost:3000

**Solution :** Vérifier `backend/backend/settings.py` :
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Erreur : "Vous n'avez pas les permissions"

**Cause :** Votre compte n'est pas administrateur

**Solutions :**
1. Se connecter avec `admin@example.com` / `admin123`
2. Ou rendre votre compte admin via Django shell :
```bash
docker-compose exec backend python manage.py shell
```
```python
from users.models import Utilisateur
user = Utilisateur.objects.get(email="votre@email.com")
user.is_staff = True
user.is_superuser = True
user.save()
```

### Le token a expiré

**Cause :** Le token JWT expire après 1 heure

**Solution :** Se reconnecter

### Page blanche / Erreur 500

**Cause :** Erreur JavaScript

**Solution :**
```bash
# Voir les logs du frontend
docker-compose logs frontend

# Ou en développement local
# Les erreurs s'affichent dans la console du navigateur (F12)
```

## 📚 Ressources

### Documentation Next.js
- https://nextjs.org/docs

### Documentation Tailwind CSS
- https://tailwindcss.com/docs

### Documentation React
- https://react.dev/

## 🔥 Commandes utiles

```bash
# Reconstruire l'image Docker
docker-compose build frontend

# Redémarrer le frontend
docker-compose restart frontend

# Voir les logs en temps réel
docker-compose logs -f frontend

# Accéder au shell du conteneur
docker-compose exec frontend sh

# Arrêter tout
docker-compose down

# Tout redémarrer
docker-compose up -d
```

## ✅ Checklist de vérification

Avant de considérer que tout fonctionne :

- [ ] Le backend est accessible sur http://localhost:8000
- [ ] Le frontend est accessible sur http://localhost:3000
- [ ] La liste des produits s'affiche (même vide)
- [ ] Je peux créer un compte
- [ ] Je peux me connecter
- [ ] Je peux voir mon nom dans la navbar après connexion
- [ ] Je peux me déconnecter
- [ ] Les admins peuvent ajouter des produits
- [ ] Les non-admins ne peuvent PAS ajouter des produits
- [ ] Les produits ajoutés apparaissent sur la page d'accueil

## 🎯 Prochaines étapes

Une fois le frontend fonctionnel, vous pouvez :

1. Ajouter plus de produits via l'interface
2. Personnaliser les couleurs et le design
3. Implémenter de nouvelles fonctionnalités :
   - Panier d'achat
   - Page de détails produit
   - Recherche et filtres
   - Upload d'images
   - Gestion du profil utilisateur

## 💡 Astuces

### Développement rapide

Utilisez le hot reload de Next.js pour voir vos modifications instantanément :

```bash
cd frontend
npm run dev
```

Modifiez n'importe quel fichier `.tsx` et la page se rafraîchit automatiquement.

### Déboguer l'API

Ouvrez les DevTools du navigateur (F12) et allez dans l'onglet "Network" pour voir toutes les requêtes HTTP.

### Tester rapidement sans Docker

Si Docker est lent sur votre machine :

1. Démarrez le backend avec Docker : `docker-compose up -d backend db`
2. Démarrez le frontend localement : `cd frontend && npm run dev`

C'est plus rapide pour le développement frontend !

