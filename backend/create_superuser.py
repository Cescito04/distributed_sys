#!/usr/bin/env python
"""
Script pour créer un superutilisateur par défaut
"""
import os
import sys
import django

# Ajouter le répertoire du projet au path Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    """Créer un superutilisateur par défaut"""
    User = get_user_model()
    
    # Vérifier si un superutilisateur existe déjà
    if User.objects.filter(is_superuser=True).exists():
        print("Un superutilisateur existe déjà.")
        return
    
    # Créer le superutilisateur
    try:
        user = User.objects.create_superuser(
            email='admin@ecommerce.com',
            username='admin',
            nom='Administrateur',
            password='admin123'
        )
        print(f"Superutilisateur créé avec succès:")
        print(f"Email: {user.email}")
        print(f"Nom d'utilisateur: {user.username}")
        print(f"Mot de passe: admin123")
    except Exception as e:
        print(f"Erreur lors de la création du superutilisateur: {e}")

if __name__ == '__main__':
    create_superuser()
