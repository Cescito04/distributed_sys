# 📚 Index de la Documentation - ShopHub E-Commerce

Bienvenue ! Ce fichier référence toute la documentation du projet pour vous aider à naviguer facilement.

---

## 🎯 Par Où Commencer ?

| Vous êtes... | Lisez... |
|--------------|----------|
| **Nouveau sur le projet** | [`QUICK_START.md`](QUICK_START.md) puis [`README.md`](README.md) |
| **Développeur backend** | [`AUTHENTICATION.md`](AUTHENTICATION.md) + [`API_EXAMPLES.md`](API_EXAMPLES.md) |
| **Développeur frontend** | [`FRONTEND_SETUP.md`](FRONTEND_SETUP.md) |
| **DevOps / SRE** | [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) + [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md) |
| **En phase de test** | [`VERIFICATION_CHECKLIST.md`](VERIFICATION_CHECKLIST.md) |
| **Manager / Lead** | [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) |

---

## 📖 Documentation Principale

### 1. 🚀 [`QUICK_START.md`](QUICK_START.md) - **COMMENCEZ ICI !**
**~500 lignes** | Démarrage rapide

Guide ultra-rapide pour démarrer l'application en quelques minutes.

**Contenu :**
- Instructions Docker Compose (1 commande)
- Instructions Kubernetes Minikube (6 commandes)
- Instructions Kubernetes Production
- Tests de l'application
- Troubleshooting rapide
- Résumé ultra-rapide

**Quand l'utiliser :** Vous voulez juste lancer l'app rapidement

---

### 2. 📘 [`README.md`](README.md) - Documentation Principale
**~370 lignes** | Vue d'ensemble complète

Documentation principale du projet avec architecture et fonctionnalités.

**Contenu :**
- Vue d'ensemble du projet
- Fonctionnalités backend et frontend
- Installation Docker Compose
- Installation Kubernetes
- Endpoints API
- Structure du projet
- Technologies utilisées
- Configuration
- Commandes utiles

**Quand l'utiliser :** Vous voulez comprendre le projet en détail

---

## 🔐 Documentation Backend

### 3. [`AUTHENTICATION.md`](AUTHENTICATION.md) - Guide Authentification JWT
**~330 lignes** | Authentification

Guide complet sur l'authentification JWT.

**Contenu :**
- Fonctionnement de JWT
- Endpoints d'authentification (login, refresh)
- Utilisation des tokens
- Endpoints protégés vs publics
- Exemples complets
- Script Python pour tester
- Bonnes pratiques
- FAQ

**Quand l'utiliser :** Vous implémentez l'authentification côté client

---

### 4. [`API_EXAMPLES.md`](API_EXAMPLES.md) - Exemples d'Utilisation API
**~310 lignes** | API REST

Exemples pratiques d'utilisation de l'API.

**Contenu :**
- Exemples CURL pour tous les endpoints
- Requêtes GET, POST, PATCH, DELETE
- Gestion des produits
- Gestion des utilisateurs
- Tests avec Python (script complet)
- Tests avec Postman
- Codes de statut HTTP
- Pagination et filtrage
- Validation des données

**Quand l'utiliser :** Vous développez un client de l'API

---

### 5. [`TEST_RESULTS.md`](TEST_RESULTS.md) - Résultats Tests API
**~320 lignes** | Tests Backend

Résultats complets des tests d'intégration de l'API.

**Contenu :**
- Tests d'authentification
- Tests CRUD utilisateurs
- Tests CRUD produits
- Tests de sécurité et permissions
- Validation des fonctionnalités
- Commandes pour reproduire

**Quand l'utiliser :** Vous voulez voir les preuves que l'API fonctionne

---

## 🎨 Documentation Frontend

### 6. [`FRONTEND_SETUP.md`](FRONTEND_SETUP.md) - Guide Frontend
**~300 lignes** | Next.js Frontend

Guide complet du frontend Next.js.

**Contenu :**
- Installation et démarrage
- Structure du projet
- Pages disponibles
- Authentification JWT côté client
- API Integration
- Personnalisation (styles, couleurs)
- Résolution de problèmes
- Commandes utiles

**Quand l'utiliser :** Vous travaillez sur le frontend

---

## 🐳 Documentation DevOps

### 7. [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) - Guide de Déploiement
**~430 lignes** | Docker vs Kubernetes

Comparaison complète des méthodes de déploiement.

**Contenu :**
- Comparaison Docker Compose vs Kubernetes
- Workflow Docker Compose
- Workflow Kubernetes complet
- Configuration des environnements
- Checklist sécurité production
- Monitoring et logs
- Debugging
- Mise à jour de l'application
- Backups

**Quand l'utiliser :** Vous choisissez une méthode de déploiement

---

### 8. [`docker-compose.yml`](docker-compose.yml) - Configuration Docker
**67 lignes** | Docker Compose

Fichier d'orchestration Docker Compose.

**Services :**
- PostgreSQL (port 5433)
- Backend Django (port 8000)
- Frontend Next.js (port 3000)

**Quand l'utiliser :** Déploiement local avec Docker

---

### 9. [`Makefile`](Makefile) - Commandes Docker Compose
**80 lignes** | Automation

Makefile avec commandes utiles pour Docker Compose.

**Commandes principales :**
- `make up` - Démarrer
- `make down` - Arrêter
- `make logs` - Voir les logs
- `make shell` - Shell Django
- `make help` - Voir toutes les commandes

---

## ☸️ Documentation Kubernetes

### 10. [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md) - Guide K8s Complet
**~650 lignes** | Kubernetes Détaillé

Guide ultra-complet pour déployer sur Kubernetes.

**Contenu :**
- Architecture Kubernetes
- Composants (PVC, Deployments, Services)
- Builder et pusher les images
- Déploiement étape par étape
- Vérification et debugging
- Accès à l'application
- Commandes de diagnostic
- Concepts Kubernetes expliqués
- Métriques et observabilité
- Sécurité (Ingress, NetworkPolicies)
- Améliorations futures

**Quand l'utiliser :** Déploiement Kubernetes détaillé

---

### 11. [`k8s/QUICK_START.md`](k8s/QUICK_START.md) - K8s Démarrage Rapide
**~110 lignes** | Kubernetes Rapide

Démarrage rapide Kubernetes en 5 minutes.

**Contenu :**
- Déploiement en 5 min
- Commandes essentielles
- Troubleshooting rapide

**Quand l'utiliser :** Déploiement K8s rapide

---

### 12. [`k8s/README.md`](k8s/README.md) - Overview Kubernetes
**~250 lignes** | Kubernetes Overview

Vue d'ensemble des ressources Kubernetes.

**Contenu :**
- Structure des manifests
- Ressources créées
- Commandes utiles
- Bonnes pratiques
- Tests sur Minikube

---

### 13. [`k8s/TEST_RESULTS_K8S.md`](k8s/TEST_RESULTS_K8S.md) - Tests Kubernetes
**~520 lignes** | Tests K8s

Résultats complets des tests sur Kubernetes.

**Contenu :**
- État des ressources déployées
- Tests fonctionnels (Frontend, Backend, PostgreSQL)
- Validation des composants
- Problèmes rencontrés et solutions
- Performance et ressources
- Tests de connectivité
- Tests de sécurité
- Tests de résilience

**Quand l'utiliser :** Voir les preuves que K8s fonctionne

---

### 14. [`k8s/Makefile`](k8s/Makefile) - Commandes Kubernetes
**~114 lignes** | K8s Automation

Makefile avec commandes Kubernetes.

**Commandes principales :**
- `make deploy` - Déployer
- `make status` - État
- `make port-forward` - Accès frontend
- `make logs-backend` - Logs backend
- `make delete` - Supprimer tout

---

### 15. Manifests Kubernetes

| Fichier | Description |
|---------|-------------|
| [`k8s/namespace.yaml`](k8s/namespace.yaml) | Namespace ecommerce |
| [`k8s/configmap.yaml`](k8s/configmap.yaml) | Variables de configuration |
| [`k8s/secrets.yaml`](k8s/secrets.yaml) | Données sensibles |
| [`k8s/postgres-deployment.yaml`](k8s/postgres-deployment.yaml) | PostgreSQL + PVC + Service |
| [`k8s/backend-deployment.yaml`](k8s/backend-deployment.yaml) | Backend Django + Service |
| [`k8s/frontend-deployment.yaml`](k8s/frontend-deployment.yaml) | Frontend Next.js + Service |
| [`k8s/all-in-one.yaml`](k8s/all-in-one.yaml) | Tous les manifests en 1 fichier |
| [`k8s/minikube-test.yaml`](k8s/minikube-test.yaml) | Version test Minikube (images locales) |
| [`k8s/kustomization.yaml`](k8s/kustomization.yaml) | Configuration Kustomize |

---

## 🛠️ Documentation Scripts

### 16. [`scripts/build-and-push.sh`](scripts/build-and-push.sh)
**~76 lignes** | Build & Push Docker

Script pour builder et pusher les images sur Docker Hub.

**Usage :**
```bash
./scripts/build-and-push.sh votre-username-dockerhub [version]
```

---

### 17. [`scripts/update-k8s-images.sh`](scripts/update-k8s-images.sh)
**~40 lignes** | Update Manifests

Script pour mettre à jour les noms d'images dans les manifests K8s.

**Usage :**
```bash
./scripts/update-k8s-images.sh votre-username-dockerhub
```

---

### 18. [`scripts/deploy-k8s.sh`](scripts/deploy-k8s.sh)
**~68 lignes** | Deploy K8s

Script de déploiement automatisé sur Kubernetes.

**Usage :**
```bash
./scripts/deploy-k8s.sh
```

---

## 🧪 Documentation Tests et Validation

### 19. [`VERIFICATION_CHECKLIST.md`](VERIFICATION_CHECKLIST.md) - Checklist Complète
**~370 lignes** | Validation

Checklist exhaustive pour valider le déploiement.

**Contenu :**
- Checklist Docker Compose
- Checklist Kubernetes
- Tests fonctionnels
- Tests de résilience
- Problèmes courants et solutions
- Validation finale

**Quand l'utiliser :** Vérifier que tout fonctionne

---

### 20. [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) - Récapitulatif Projet
**~650 lignes** | Synthèse

Récapitulatif complet du projet avec architecture et statistiques.

**Contenu :**
- Vue d'ensemble
- Statistiques (fichiers, lignes, technologies)
- Architecture détaillée
- Fonctionnalités implémentées
- Structure complète
- Tests effectués
- Credentials
- Métriques de qualité
- Accomplissements
- Compétences démontrées

**Quand l'utiliser :** Présenter le projet à quelqu'un

---

### 21. [`FINAL_SUMMARY.txt`](FINAL_SUMMARY.txt) - Résumé Final
**61 lignes** | Quick Overview

Résumé ultra-concis du projet terminé.

**Quand l'utiliser :** Vue rapide des accomplissements

---

## 📂 Documentation Backend (Code)

### Fichiers Principaux

| Fichier | Description |
|---------|-------------|
| [`backend/requirements.txt`](backend/requirements.txt) | Dépendances Python |
| [`backend/backend/settings.py`](backend/backend/settings.py) | Configuration Django (PostgreSQL, DRF, JWT, CORS) |
| [`backend/backend/urls.py`](backend/backend/urls.py) | Routes principales API |
| [`backend/users/models.py`](backend/users/models.py) | Modèle Utilisateur personnalisé |
| [`backend/users/views.py`](backend/users/views.py) | Vues API utilisateurs + auth |
| [`backend/products/models.py`](backend/products/models.py) | Modèle Produit |
| [`backend/products/views.py`](backend/products/views.py) | Vues API produits (CRUD) |
| [`backend/Dockerfile`](backend/Dockerfile) | Image Docker pour Docker Compose |
| [`backend/Dockerfile.k8s`](backend/Dockerfile.k8s) | Image Docker optimisée pour Kubernetes |
| [`backend/entrypoint.sh`](backend/entrypoint.sh) | Script de démarrage Docker Compose |

---

## 📂 Documentation Frontend (Code)

### Fichiers Principaux

| Fichier | Description |
|---------|-------------|
| [`frontend/package.json`](frontend/package.json) | Dépendances npm |
| [`frontend/lib/api.ts`](frontend/lib/api.ts) | Client API Axios avec JWT |
| [`frontend/lib/types.ts`](frontend/lib/types.ts) | Types TypeScript |
| [`frontend/pages/index.tsx`](frontend/pages/index.tsx) | Page d'accueil |
| [`frontend/pages/login.tsx`](frontend/pages/login.tsx) | Page connexion |
| [`frontend/pages/register.tsx`](frontend/pages/register.tsx) | Page inscription |
| [`frontend/pages/add-product.tsx`](frontend/pages/add-product.tsx) | Page ajout produit |
| [`frontend/components/Navbar.tsx`](frontend/components/Navbar.tsx) | Navigation |
| [`frontend/components/ProductCard.tsx`](frontend/components/ProductCard.tsx) | Carte produit |
| [`frontend/components/Layout.tsx`](frontend/components/Layout.tsx) | Layout principal |
| [`frontend/styles/globals.css`](frontend/styles/globals.css) | Styles Tailwind CSS |
| [`frontend/Dockerfile`](frontend/Dockerfile) | Image Docker frontend |
| [`frontend/README.md`](frontend/README.md) | Documentation frontend spécifique |

---

## 🗂️ Documentation par Thème

### 🔐 Sécurité & Authentification
1. [`AUTHENTICATION.md`](AUTHENTICATION.md) - Guide JWT complet
2. [`k8s/secrets.yaml`](k8s/secrets.yaml) - Secrets Kubernetes
3. `backend/backend/settings.py` - Configuration sécurité Django

### 🌐 API REST
1. [`API_EXAMPLES.md`](API_EXAMPLES.md) - Exemples CURL
2. [`TEST_RESULTS.md`](TEST_RESULTS.md) - Tests API validés
3. `backend/*/views.py` - Code des vues API

### 🐳 Docker
1. [`docker-compose.yml`](docker-compose.yml) - Orchestration
2. [`Makefile`](Makefile) - Commandes Docker Compose
3. `backend/Dockerfile` - Image backend
4. `frontend/Dockerfile` - Image frontend

### ☸️ Kubernetes
1. [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md) - Guide complet
2. [`k8s/QUICK_START.md`](k8s/QUICK_START.md) - Démarrage rapide
3. [`k8s/README.md`](k8s/README.md) - Overview
4. [`k8s/TEST_RESULTS_K8S.md`](k8s/TEST_RESULTS_K8S.md) - Tests validés
5. [`k8s/Makefile`](k8s/Makefile) - Commandes K8s
6. Manifests YAML (7 fichiers)

### 🧪 Tests & Validation
1. [`TEST_RESULTS.md`](TEST_RESULTS.md) - Tests API
2. [`k8s/TEST_RESULTS_K8S.md`](k8s/TEST_RESULTS_K8S.md) - Tests K8s
3. [`VERIFICATION_CHECKLIST.md`](VERIFICATION_CHECKLIST.md) - Checklist

### 🚀 Déploiement
1. [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) - Guide comparatif
2. [`QUICK_START.md`](QUICK_START.md) - Démarrage rapide
3. `scripts/` - Scripts automatisés (3 fichiers)

---

## 📊 Documentation par Niveau

### Débutant 🌱
Commencez par ces fichiers :
1. [`QUICK_START.md`](QUICK_START.md)
2. [`README.md`](README.md)
3. [`VERIFICATION_CHECKLIST.md`](VERIFICATION_CHECKLIST.md)

### Intermédiaire 📈
Approfondissez avec :
1. [`AUTHENTICATION.md`](AUTHENTICATION.md)
2. [`API_EXAMPLES.md`](API_EXAMPLES.md)
3. [`FRONTEND_SETUP.md`](FRONTEND_SETUP.md)
4. [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)

### Avancé 🚀
Pour aller plus loin :
1. [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md)
2. [`k8s/TEST_RESULTS_K8S.md`](k8s/TEST_RESULTS_K8S.md)
3. [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md)
4. Code source backend/frontend

---

## 🎯 Documentation par Cas d'Usage

### "Je veux juste lancer l'app"
1. [`QUICK_START.md`](QUICK_START.md) ⭐

### "Je veux comprendre l'architecture"
1. [`README.md`](README.md)
2. [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md)

### "Je veux développer le backend"
1. [`AUTHENTICATION.md`](AUTHENTICATION.md)
2. [`API_EXAMPLES.md`](API_EXAMPLES.md)
3. `backend/` - Code source

### "Je veux développer le frontend"
1. [`FRONTEND_SETUP.md`](FRONTEND_SETUP.md)
2. [`frontend/README.md`](frontend/README.md)
3. `frontend/` - Code source

### "Je veux déployer en production"
1. [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
2. [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md)
3. [`VERIFICATION_CHECKLIST.md`](VERIFICATION_CHECKLIST.md)

### "Je cherche des exemples"
1. [`API_EXAMPLES.md`](API_EXAMPLES.md)
2. [`AUTHENTICATION.md`](AUTHENTICATION.md)
3. [`TEST_RESULTS.md`](TEST_RESULTS.md)

### "J'ai un problème"
1. [`VERIFICATION_CHECKLIST.md`](VERIFICATION_CHECKLIST.md) - Section troubleshooting
2. [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) - Section debugging
3. [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md) - Section debugging

---

## 📈 Progression Recommandée

### Jour 1 : Découverte
1. Lire [`QUICK_START.md`](QUICK_START.md)
2. Lancer avec Docker Compose
3. Explorer l'interface
4. Lire [`README.md`](README.md)

### Jour 2 : Développement
1. Lire [`AUTHENTICATION.md`](AUTHENTICATION.md)
2. Lire [`API_EXAMPLES.md`](API_EXAMPLES.md)
3. Tester l'API avec CURL
4. Modifier le code frontend/backend

### Jour 3 : DevOps
1. Lire [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
2. Lire [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md)
3. Déployer sur Minikube
4. Tester les fonctionnalités

### Jour 4 : Production
1. Builder les images Docker Hub
2. Déployer sur cluster cloud
3. Configurer monitoring
4. Mettre en production

---

## 📑 Résumé des Fichiers de Documentation

### Documentation Markdown (12 fichiers)
1. `QUICK_START.md` - Démarrage rapide ⭐
2. `README.md` - Documentation principale
3. `AUTHENTICATION.md` - Guide JWT
4. `API_EXAMPLES.md` - Exemples API
5. `TEST_RESULTS.md` - Tests API
6. `FRONTEND_SETUP.md` - Guide frontend
7. `DEPLOYMENT_GUIDE.md` - Docker vs K8s
8. `VERIFICATION_CHECKLIST.md` - Checklist
9. `PROJECT_SUMMARY.md` - Récapitulatif
10. `DOCS_INDEX.md` - Ce fichier (index)
11. `FINAL_SUMMARY.txt` - Résumé final
12. `frontend/README.md` - Doc frontend

### Documentation Kubernetes (5 fichiers)
1. `k8s/KUBERNETES_SETUP.md` - Guide complet
2. `k8s/QUICK_START.md` - Démarrage rapide
3. `k8s/README.md` - Overview
4. `k8s/TEST_RESULTS_K8S.md` - Tests K8s

### Manifests Kubernetes (9 fichiers)
1-7. Manifests séparés (namespace, configmap, secrets, 3 deployments)
8. `all-in-one.yaml` - Tout en un
9. `minikube-test.yaml` - Version test Minikube

### Scripts (3 fichiers)
1. `build-and-push.sh` - Build & push images
2. `update-k8s-images.sh` - Update manifests
3. `deploy-k8s.sh` - Deploy automatique

### Automation (2 Makefiles)
1. `Makefile` - Docker Compose
2. `k8s/Makefile` - Kubernetes

---

## 🔍 Recherche Rapide

### Trouver une Information

**"Comment démarrer ?"**
→ [`QUICK_START.md`](QUICK_START.md)

**"Comment fonctionne l'authentification ?"**
→ [`AUTHENTICATION.md`](AUTHENTICATION.md)

**"Exemples d'appels API ?"**
→ [`API_EXAMPLES.md`](API_EXAMPLES.md)

**"Comment déployer sur Kubernetes ?"**
→ [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md)

**"Docker Compose vs Kubernetes ?"**
→ [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)

**"Comment vérifier que ça marche ?"**
→ [`VERIFICATION_CHECKLIST.md`](VERIFICATION_CHECKLIST.md)

**"Vue d'ensemble du projet ?"**
→ [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md)

**"Tests effectués ?"**
→ [`TEST_RESULTS.md`](TEST_RESULTS.md) et [`k8s/TEST_RESULTS_K8S.md`](k8s/TEST_RESULTS_K8S.md)

---

## 💡 Conseils

### Pour Apprendre
Lisez dans cet ordre :
1. QUICK_START.md
2. README.md
3. AUTHENTICATION.md
4. API_EXAMPLES.md
5. DEPLOYMENT_GUIDE.md

### Pour Déployer
1. QUICK_START.md (choisir Docker ou K8s)
2. VERIFICATION_CHECKLIST.md (valider)
3. Si K8s : k8s/KUBERNETES_SETUP.md

### Pour Développer
- Frontend : FRONTEND_SETUP.md + frontend/README.md
- Backend : AUTHENTICATION.md + API_EXAMPLES.md
- DevOps : DEPLOYMENT_GUIDE.md + k8s/

---

## 📊 Statistiques de Documentation

- **Total fichiers de doc** : 20+ fichiers
- **Total lignes** : ~4500 lignes
- **Langues** : Français (principal)
- **Format** : Markdown, YAML, Bash
- **Couverture** : 100% du projet documenté

---

## 🎓 Navigation Recommandée

```
QUICK_START.md (⭐ commencez ici)
    │
    ├─→ README.md (vue d'ensemble)
    │   │
    │   ├─→ AUTHENTICATION.md (backend auth)
    │   ├─→ API_EXAMPLES.md (backend API)
    │   ├─→ FRONTEND_SETUP.md (frontend)
    │   └─→ DEPLOYMENT_GUIDE.md (DevOps)
    │
    ├─→ k8s/KUBERNETES_SETUP.md (K8s détaillé)
    │   ├─→ k8s/QUICK_START.md (K8s rapide)
    │   └─→ k8s/TEST_RESULTS_K8S.md (preuves)
    │
    └─→ VERIFICATION_CHECKLIST.md (validation)
        └─→ PROJECT_SUMMARY.md (synthèse)
```

---

## 🆘 Support

### Problèmes Courants

**Consultez :**
- [`VERIFICATION_CHECKLIST.md`](VERIFICATION_CHECKLIST.md) - Section troubleshooting
- [`QUICK_START.md`](QUICK_START.md) - Section troubleshooting
- [`k8s/KUBERNETES_SETUP.md`](k8s/KUBERNETES_SETUP.md) - Section debugging

### Questions Fréquentes

**"L'app ne démarre pas"**
→ Vérifier que Docker est lancé, voir logs avec `docker-compose logs`

**"Erreur CORS"**
→ Voir [`AUTHENTICATION.md`](AUTHENTICATION.md) section CORS

**"Pods en erreur sur K8s"**
→ Voir [`k8s/TEST_RESULTS_K8S.md`](k8s/TEST_RESULTS_K8S.md) section problèmes rencontrés

---

## ✨ Mise à Jour de la Documentation

La documentation est versionnée avec Git. Pour la dernière version :

```bash
git pull origin main
```

---

**📚 Bonne lecture et bon développement ! 🚀**

*Toute l'équipe ShopHub vous souhaite une excellente expérience avec le projet !*

