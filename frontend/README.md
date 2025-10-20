# Frontend E-Commerce - Next.js

Frontend moderne construit avec Next.js 14, TypeScript et Tailwind CSS pour le mini projet e-commerce.

## 🚀 Fonctionnalités

- ✅ Page d'accueil avec liste des produits
- ✅ Authentification (connexion/inscription)
- ✅ Ajout de produits (admin uniquement)
- ✅ Design responsive avec Tailwind CSS
- ✅ Gestion des erreurs
- ✅ TypeScript pour la sécurité des types
- ✅ Intégration avec l'API Django via JWT

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Backend Django démarré sur http://localhost:8000

## 🛠️ Installation et Démarrage

### Option 1 : Développement local

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

L'application sera accessible sur http://localhost:3000

### Option 2 : Avec Docker

```bash
# Depuis la racine du projet
docker-compose up -d frontend
```

### Option 3 : Avec Docker (tout le projet)

```bash
# Depuis la racine du projet
docker-compose up -d
```

Cela démarre :
- Backend Django sur http://localhost:8000
- PostgreSQL sur localhost:5433
- Frontend Next.js sur http://localhost:3000

## 📁 Structure du projet

```
frontend/
├── components/          # Composants React réutilisables
│   ├── Layout.tsx      # Layout principal avec navbar et footer
│   ├── Navbar.tsx      # Barre de navigation
│   ├── ProductCard.tsx # Carte produit
│   └── LoadingSpinner.tsx # Indicateur de chargement
├── lib/                # Utilitaires et services
│   ├── api.ts          # Client API pour communiquer avec Django
│   └── types.ts        # Types TypeScript
├── pages/              # Pages Next.js
│   ├── _app.tsx        # Point d'entrée de l'app
│   ├── _document.tsx   # Document HTML personnalisé
│   ├── index.tsx       # Page d'accueil (liste produits)
│   ├── login.tsx       # Page de connexion
│   ├── register.tsx    # Page d'inscription
│   └── add-product.tsx # Page d'ajout de produit
├── styles/             # Fichiers de styles
│   └── globals.css     # Styles globaux + Tailwind
├── public/             # Assets statiques
├── Dockerfile          # Configuration Docker
├── .dockerignore       # Fichiers ignorés par Docker
├── next.config.js      # Configuration Next.js
├── tailwind.config.js  # Configuration Tailwind CSS
├── tsconfig.json       # Configuration TypeScript
└── package.json        # Dépendances npm
```

## 🎨 Pages disponibles

### 1. Page d'accueil (`/`)
- Affiche la liste de tous les produits
- Accessible à tous (pas d'authentification requise)
- Affiche les détails : nom, description, prix, quantité
- Bouton "Acheter" (désactivé si rupture de stock)

### 2. Page de connexion (`/login`)
- Formulaire de connexion avec email et mot de passe
- Authentification JWT
- Redirection vers la page d'accueil après connexion
- Compte de test fourni : admin@example.com / admin123

### 3. Page d'inscription (`/register`)
- Formulaire d'inscription
- Validation du mot de passe (min 8 caractères)
- Connexion automatique après inscription

### 4. Page d'ajout de produit (`/add-product`)
- Formulaire pour ajouter un nouveau produit
- Nécessite d'être connecté
- Réservé aux administrateurs
- Validations côté client

## 🔐 Authentification

Le frontend utilise JWT pour l'authentification :

1. **Connexion** : POST vers `/api/v1/auth/login/`
   - Reçoit `access_token` et `refresh_token`
   - Stocke les tokens dans localStorage

2. **Requêtes authentifiées** : 
   - Ajoute automatiquement `Authorization: Bearer <token>` dans les en-têtes

3. **Déconnexion** :
   - Supprime les tokens du localStorage
   - Redirection vers la page d'accueil

## 📡 API Integration

Le fichier `lib/api.ts` contient toutes les fonctions pour communiquer avec le backend :

```typescript
// Authentification
authAPI.login(email, password)
authAPI.register(nom, email, password)
authAPI.getCurrentUser()

// Produits
productAPI.getAll()
productAPI.getById(id)
productAPI.create(product)
productAPI.update(id, product)
productAPI.delete(id)
```

## 🎨 Personnalisation des styles

Le projet utilise Tailwind CSS avec une palette de couleurs personnalisée :

```js
// tailwind.config.js
colors: {
  primary: {
    500: '#3b82f6', // Bleu principal
    600: '#2563eb',
    700: '#1d4ed8',
    // ...
  }
}
```

## 🐳 Docker

### Dockerfile

Le Dockerfile utilise une stratégie multi-stage pour optimiser la taille de l'image :

1. **Stage 1 (deps)** : Installation des dépendances
2. **Stage 2 (builder)** : Build de l'application Next.js
3. **Stage 3 (runner)** : Image finale légère

### Variables d'environnement

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 🧪 Tester l'application

### Scénario 1 : Consulter les produits

1. Ouvrir http://localhost:3000
2. Voir la liste des produits (ou message si vide)

### Scénario 2 : S'inscrire et se connecter

1. Cliquer sur "Inscription"
2. Remplir le formulaire
3. Automatiquement connecté après inscription

### Scénario 3 : Ajouter un produit (admin)

1. Se connecter avec le compte admin
2. Cliquer sur "Ajouter Produit"
3. Remplir le formulaire
4. Soumettre le formulaire

## 📝 Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## 🔧 Configuration

### Modifier l'URL de l'API

Créer un fichier `.env.local` :

```bash
NEXT_PUBLIC_API_URL=http://votre-backend-url/api/v1
```

### Build optimisé

Le projet est configuré avec `output: 'standalone'` pour Docker, produisant un build optimisé.

## ⚠️ Limitations connues

1. **Pas de refresh token automatique** - Le token expire après 1h, nécessite une reconnexion
2. **Pas de gestion du panier** - Fonctionnalité à implémenter
3. **Pas de paiement** - Projet de démo
4. **Images des produits** - Pas d'upload d'images pour l'instant

## 🚀 Améliorations possibles

- [ ] Implémenter le refresh automatique des tokens JWT
- [ ] Ajouter un système de panier
- [ ] Implémenter la recherche et les filtres
- [ ] Ajouter l'upload d'images pour les produits
- [ ] Implémenter la pagination côté client
- [ ] Ajouter des tests unitaires (Jest, React Testing Library)
- [ ] Implémenter un système de favoris
- [ ] Ajouter des animations avec Framer Motion

## 🐛 Débogage

### Problème : "Erreur lors du chargement des produits"

**Solution :** Vérifier que le backend Django est démarré sur http://localhost:8000

```bash
curl http://localhost:8000/api/v1/products/
```

### Problème : CORS errors

**Solution :** Vérifier que le backend a bien configuré CORS pour http://localhost:3000

```python
# backend/backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Problème : "Vous n'avez pas les permissions"

**Solution :** Se connecter avec un compte administrateur. Utiliser le compte de test ou créer un admin via Django admin.

## 📚 Technologies utilisées

- **Next.js 14** - Framework React avec SSR/SSG
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Client HTTP
- **JWT** - Authentification

## 🤝 Intégration avec le backend

Le frontend communique avec le backend Django via des requêtes HTTP :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/v1/auth/login/ | Connexion |
| POST | /api/v1/users/create/ | Inscription |
| GET | /api/v1/users/me/ | Profil utilisateur |
| GET | /api/v1/products/ | Liste des produits |
| POST | /api/v1/products/create/ | Créer un produit |
| GET | /api/v1/products/{id}/ | Détails d'un produit |
| PATCH | /api/v1/products/{id}/ | Modifier un produit |
| DELETE | /api/v1/products/{id}/ | Supprimer un produit |

## 📄 Licence

Ce projet est sous licence MIT.

