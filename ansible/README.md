# Déploiement Ansible - ShopHub E-Commerce

Automatisation complète du déploiement de l'application sur VM Ubuntu avec Ansible.

## 🎯 Objectif

Ce playbook Ansible automatise :
- ✅ Installation de Docker
- ✅ Installation de Kubernetes (K3s)
- ✅ Déploiement de l'application (Backend + Frontend + PostgreSQL)
- ✅ Vérification de l'état du déploiement
- ✅ Test d'accès au frontend

## 📋 Prérequis

### Sur votre machine locale (control node)
- Ansible installé (`pip install ansible`)
- Clé SSH pour accéder à la VM Ubuntu
- Accès réseau à la VM

### Sur la VM cible (managed node)
- Ubuntu 22.04 LTS (ou version récente)
- Accès root ou sudo
- Connexion SSH configurée
- Minimum 2 CPU, 4Go RAM, 20Go disque

## 📁 Structure

```
ansible/
├── deploy_app.yml              # Playbook principal
├── inventory.ini               # Inventaire des serveurs
├── ansible.cfg                 # Configuration Ansible
├── roles/                      # Rôles Ansible
│   ├── install_docker/         # Installation Docker
│   │   └── tasks/main.yml
│   ├── install_kubernetes/     # Installation K3s
│   │   └── tasks/main.yml
│   └── deploy_app/            # Déploiement application
│       └── tasks/main.yml
└── README.md                   # Ce fichier
```

## 🚀 Démarrage Rapide

### 1. Configuration de l'inventaire

Éditez `inventory.ini` et remplacez :
- `192.168.1.100` par l'IP de votre VM
- `ubuntu` par votre username SSH si différent
- Le chemin de la clé SSH si nécessaire

```ini
[ecommerce_servers]
vm-ecommerce ansible_host=192.168.1.100

[ecommerce_servers:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa
```

### 2. Tester la connexion

```bash
# Tester la connexion SSH via Ansible
ansible ecommerce_servers -i inventory.ini -m ping

# Résultat attendu:
# vm-ecommerce | SUCCESS => {
#     "ping": "pong"
# }
```

### 3. Exécuter le playbook

```bash
# Déploiement complet
ansible-playbook -i inventory.ini deploy_app.yml

# Avec verbose
ansible-playbook -i inventory.ini deploy_app.yml -v

# Seulement certains tags
ansible-playbook -i inventory.ini deploy_app.yml --tags docker
ansible-playbook -i inventory.ini deploy_app.yml --tags kubernetes
ansible-playbook -i inventory.ini deploy_app.yml --tags deploy
```

## 📊 Déroulement du Playbook

### Phase 1: Installation Docker (~5 minutes)
1. Mise à jour du cache APT
2. Installation des prérequis
3. Ajout de la clé GPG Docker
4. Ajout du repository Docker
5. Installation Docker Engine
6. Configuration et démarrage
7. Ajout utilisateur au groupe docker

### Phase 2: Installation Kubernetes (~3 minutes)
1. Téléchargement et installation K3s
2. Configuration kubeconfig
3. Création lien symbolique kubectl
4. Vérification du cluster
5. Attente que K3s soit prêt

### Phase 3: Déploiement Application (~5 minutes)
1. Copie des manifests Kubernetes
2. Création namespace
3. Application ConfigMaps et Secrets
4. Déploiement PostgreSQL + attente ready
5. Déploiement Backend + attente ready
6. Déploiement Frontend + attente ready
7. Vérification pods et services
8. Test d'accès
9. Création script d'accès

**Temps total: ~15 minutes**

## 🔍 Vérification Post-Déploiement

Une fois le playbook terminé, connectez-vous à la VM :

```bash
ssh ubuntu@192.168.1.100
```

Puis vérifiez :

```bash
# Vérifier K3s
sudo k3s kubectl get nodes

# Vérifier les pods
kubectl get pods -n ecommerce

# Vérifier les services
kubectl get services -n ecommerce

# Accéder au frontend (port forwarding)
kubectl port-forward -n ecommerce service/frontend-service 3000:3000

# Ou utiliser le script créé
~/k8s/access-frontend.sh
```

## 🌐 Accès à l'Application

### Option 1: Port Forwarding (Recommandé)

Depuis la VM :
```bash
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

Puis depuis votre machine locale :
```bash
ssh -L 3000:localhost:3000 ubuntu@192.168.1.100
```

Accéder à http://localhost:3000

### Option 2: NodePort Direct

Le frontend est exposé via NodePort (port 30000).

Accéder directement depuis votre machine :
```
http://192.168.1.100:30000
```

### Option 3: Via tunnel SSH

```bash
ssh -L 3000:localhost:30000 ubuntu@192.168.1.100
```

Puis http://localhost:3000

## 📝 Variables Configurables

Dans `inventory.ini` :

| Variable | Description | Défaut |
|----------|-------------|--------|
| `ansible_host` | IP de la VM | - |
| `ansible_user` | Utilisateur SSH | ubuntu |
| `ansible_ssh_private_key_file` | Clé SSH | ~/.ssh/id_rsa |
| `k8s_manifests_path` | Chemin des manifests sur VM | /home/ubuntu/k8s |
| `app_namespace` | Namespace K8s | ecommerce |
| `deployment_type` | Type K8s (k3s/minikube) | k3s |

Dans `deploy_app.yml` :

| Variable | Description | Défaut |
|----------|-------------|--------|
| `manifests_local_path` | Chemin local des manifests | ../k8s |
| `manifests_remote_path` | Chemin distant | /home/ubuntu/k8s |
| `namespace` | Namespace K8s | ecommerce |

## 🏷️ Tags Disponibles

Exécutez uniquement certaines parties :

```bash
# Seulement Docker
ansible-playbook -i inventory.ini deploy_app.yml --tags docker

# Seulement Kubernetes
ansible-playbook -i inventory.ini deploy_app.yml --tags kubernetes

# Seulement déploiement app
ansible-playbook -i inventory.ini deploy_app.yml --tags deploy

# Installation uniquement
ansible-playbook -i inventory.ini deploy_app.yml --tags install

# Tout sauf installation
ansible-playbook -i inventory.ini deploy_app.yml --skip-tags install
```

## 🔄 Idempotence

Le playbook est idempotent, vous pouvez le réexécuter sans problème :

```bash
# Première exécution
ansible-playbook -i inventory.ini deploy_app.yml
# Résultat: changed=XX, ok=YY

# Deuxième exécution
ansible-playbook -i inventory.ini deploy_app.yml
# Résultat: changed=0 (si pas de modifications)
```

## 🐛 Debugging

### Vérifier la connexion

```bash
ansible ecommerce_servers -i inventory.ini -m ping
ansible ecommerce_servers -i inventory.ini -m setup -a "filter=ansible_distribution*"
```

### Mode verbose

```bash
# Niveau 1
ansible-playbook -i inventory.ini deploy_app.yml -v

# Niveau 2 (plus détaillé)
ansible-playbook -i inventory.ini deploy_app.yml -vv

# Niveau 3 (très détaillé)
ansible-playbook -i inventory.ini deploy_app.yml -vvv
```

### Dry-run (check mode)

```bash
ansible-playbook -i inventory.ini deploy_app.yml --check
```

### Exécution pas à pas

```bash
ansible-playbook -i inventory.ini deploy_app.yml --step
```

## 📊 Exemples de Sortie

### Succès

```
PLAY RECAP *****************************************************
vm-ecommerce : ok=45  changed=15  unreachable=0  failed=0  skipped=0

✅ Déploiement terminé avec succès !
Namespace: ecommerce
Pour accéder au frontend:
  kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

### Vérification sur la VM

```bash
$ kubectl get all -n ecommerce
NAME                                   READY   STATUS    RESTARTS   AGE
pod/backend-deployment-xxx             1/1     Running   0          5m
pod/frontend-deployment-xxx            1/1     Running   0          5m
pod/postgres-deployment-xxx            1/1     Running   0          6m

NAME                       TYPE        CLUSTER-IP      PORT(S)
service/backend-service    ClusterIP   10.43.x.x       8000/TCP
service/frontend-service   NodePort    10.43.x.x       3000:30000/TCP
service/postgres-service   ClusterIP   10.43.x.x       5432/TCP
```

## 🔧 Maintenance

### Mettre à jour l'application

```bash
# 1. Modifier le code localement
# 2. Réexécuter le playbook avec tag deploy
ansible-playbook -i inventory.ini deploy_app.yml --tags deploy
```

### Supprimer l'application

Créer un playbook de cleanup :

```bash
# Sur la VM
kubectl delete namespace ecommerce
```

### Désinstaller K3s

```bash
# Sur la VM
/usr/local/bin/k3s-uninstall.sh
```

## 🎯 Rôles Détaillés

### install_docker
- Installation complète de Docker
- Configuration pour l'utilisateur
- Vérification de l'installation

### install_kubernetes
- Installation K3s (léger et rapide)
- Configuration kubeconfig
- Vérification du cluster
- Création de kubectl symlink

### deploy_app
- Copie des manifests
- Déploiement séquentiel (PostgreSQL → Backend → Frontend)
- Attente que chaque composant soit prêt
- Vérification finale
- Test d'accès
- Création de scripts utilitaires

## 📈 Améliorations Possibles

- [ ] Ajouter support pour plusieurs environnements (dev, staging, prod)
- [ ] Implémenter rollback automatique en cas d'échec
- [ ] Ajouter monitoring (Prometheus/Grafana)
- [ ] Configurer backups automatiques PostgreSQL
- [ ] Ajouter notifications (Slack, email)
- [ ] Implémenter health checks avancés
- [ ] Ajouter support pour scaling automatique
- [ ] Configurer SSL/TLS avec cert-manager

## 🔐 Sécurité

### Bonnes Pratiques

1. **Utiliser Ansible Vault pour les secrets**
```bash
ansible-vault encrypt ansible/roles/deploy_app/vars/secrets.yml
ansible-playbook -i inventory.ini deploy_app.yml --ask-vault-pass
```

2. **Ne pas committer les credentials**
```bash
# Ajouter à .gitignore
ansible/inventory.ini
ansible/**/*vault*
```

3. **Utiliser des clés SSH sans mot de passe**
```bash
ssh-keygen -t ed25519
ssh-copy-id ubuntu@192.168.1.100
```

## 📚 Ressources

- [Documentation Ansible](https://docs.ansible.com/)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)
- [K3s Documentation](https://docs.k3s.io/)

## 🆘 Support

### Erreurs Communes

**"Connection refused"**
- Vérifier que SSH fonctionne : `ssh ubuntu@192.168.1.100`
- Vérifier les credentials dans inventory.ini

**"Permission denied"**
- Vérifier que l'utilisateur a les droits sudo
- Ajouter `ansible_become_pass` si sudo demande mot de passe

**"Docker installation failed"**
- Vérifier la connexion internet de la VM
- Vérifier la version d'Ubuntu supportée

**"Pods in CrashLoopBackOff"**
- Vérifier les logs : `kubectl logs -n ecommerce <pod-name>`
- Les images doivent être accessibles (publiques ou avec imagePullSecrets)

## ✅ Checklist de Déploiement

- [ ] Ansible installé sur control node
- [ ] VM Ubuntu accessible via SSH
- [ ] Clé SSH configurée
- [ ] inventory.ini configuré avec IP correcte
- [ ] Connexion testée (`ansible ... -m ping`)
- [ ] Playbook exécuté sans erreur
- [ ] Tous les pods sont Running
- [ ] Frontend accessible
- [ ] Login admin fonctionne

## 🎉 Succès !

Si le playbook s'exécute sans erreur et que vous voyez :

```
✅ Déploiement terminé avec succès !
Test d'accès: Succès ✅
```

Félicitations ! Votre application est déployée et accessible.

Accédez à : `http://<IP-VM>:30000` ou utilisez port-forwarding.

