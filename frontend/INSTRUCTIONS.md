# Instructions de Test - Frontend E-commerce

## 🚀 Démarrage Rapide

### 1. Mode Développement
```bash
cd frontend
npm install
npm run dev
```
L'application sera disponible sur http://localhost:3000

### 2. Mode Docker
```bash
cd frontend
docker build -t frontend-ecommerce .
docker run -p 3000:3000 frontend-ecommerce
```

## 📱 Pages Disponibles

### Page d'Accueil (`/`)
- **Fonctionnalité** : Liste des produits avec fetch API
- **API** : `GET /api/v1/products/`
- **Design** : Interface moderne avec Tailwind CSS
- **Responsive** : Adapté mobile et desktop

### Page de Connexion (`/login`)
- **Fonctionnalité** : Authentification utilisateur
- **API** : `POST /api/v1/auth/login/`
- **Compte de démo** : admin@ecommerce.com / admin123
- **Gestion** : JWT tokens automatiques

### Page d'Inscription (`/register`)
- **Fonctionnalité** : Création de compte utilisateur
- **Mode démo** : Simulation (pas d'API réelle)
- **Validation** : Côté client complète

### Page Ajout Produit (`/add-product`)
- **Fonctionnalité** : Création de nouveaux produits
- **API** : `POST /api/v1/products/create/` (si connecté)
- **Mode démo** : Simulation si non connecté
- **Validation** : Prix > 0, quantité ≥ 0

## 🔧 Configuration

### Variables d'Environnement
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend Requis
- Django backend sur port 8000
- Base de données PostgreSQL
- API REST fonctionnelle

## 🐳 Docker

### Construction
```bash
docker build -t frontend-ecommerce .
```

### Exécution
```bash
docker run -p 3000:3000 frontend-ecommerce
```

### Docker Compose (avec backend)
```bash
docker-compose up --build
```

## 🎨 Technologies

- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling utilitaire
- **Axios** : Client HTTP
- **Docker** : Containerisation

## 📊 Fonctionnalités

### ✅ Implémentées
- [x] Page d'accueil avec liste des produits
- [x] Fetch API vers backend Django
- [x] Pages de connexion et inscription
- [x] Formulaire d'ajout de produit
- [x] Design responsive avec Tailwind CSS
- [x] Gestion des erreurs et états de chargement
- [x] Authentification JWT
- [x] Dockerfile optimisé
- [x] Configuration TypeScript complète

### 🔄 Mode Démonstration
- Simulation des appels API si backend non disponible
- Messages d'erreur informatifs
- Interface utilisateur fonctionnelle

## 🧪 Tests

### Test Manuel
1. Ouvrir http://localhost:3000
2. Vérifier l'affichage des produits
3. Tester la navigation entre pages
4. Tester les formulaires
5. Vérifier la responsivité

### Test avec Backend
1. Démarrer le backend Django
2. Se connecter avec admin@ecommerce.com
3. Tester l'ajout de produits
4. Vérifier la synchronisation des données

## 📝 Notes

- L'application fonctionne en mode standalone
- Optimisée pour la production
- Prête pour le déploiement Kubernetes
- Gestion d'erreurs robuste
- Interface utilisateur moderne et intuitive
