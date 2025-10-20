# 🚀 Démarrage Rapide Ansible

Déployez ShopHub en 5 commandes !

## ⚡ Installation Rapide

```bash
# 1. Installer Ansible
pip install ansible

# 2. Configurer l'inventaire
cd ansible
cp inventory.example.ini inventory.ini
# Éditer inventory.ini avec l'IP de votre VM

# 3. Tester la connexion
ansible ecommerce_servers -i inventory.ini -m ping

# 4. Déployer
ansible-playbook -i inventory.ini deploy_app.yml

# 5. Accéder (sur la VM)
ssh ubuntu@VOTRE-IP
kubectl port-forward -n ecommerce service/frontend-service 3000:3000
```

## 🎯 Commandes Essentielles

```bash
# Déployer
ansible-playbook -i inventory.ini deploy_app.yml

# Vérifier
ansible-playbook -i inventory.ini verify.yml

# Nettoyer
ansible-playbook -i inventory.ini cleanup.yml

# Tester connexion
ansible all -i inventory.ini -m ping
```

## 📋 Prérequis

- ✅ Ansible installé
- ✅ VM Ubuntu accessible via SSH
- ✅ Clé SSH configurée
- ✅ VM minimum : 2 CPU, 4Go RAM

## 🌐 Accès après Déploiement

**Via SSH tunnel:**
```bash
ssh -L 3000:localhost:30000 ubuntu@VOTRE-IP
# http://localhost:3000
```

**Direct NodePort:**
```
http://VOTRE-IP:30000
```

## 🔑 Credentials

- Email: `admin@example.com`
- Password: `admin123`

## 📚 Documentation Complète

- [`README.md`](README.md) - Vue d'ensemble
- [`ANSIBLE_GUIDE.md`](ANSIBLE_GUIDE.md) - Guide complet

---

**Temps de déploiement:** ~15 minutes  
**Commande unique:** `ansible-playbook -i inventory.ini deploy_app.yml`  
**Résultat:** Application déployée et opérationnelle ! ✅

