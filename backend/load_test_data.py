#!/usr/bin/env python
"""
Script pour charger des données de test
"""
import os
import sys
import django

# Ajouter le répertoire du projet au path Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Produit

def load_test_products():
    """Charger des produits de test"""
    # Vérifier si des produits existent déjà
    if Produit.objects.exists():
        print("Des produits existent déjà dans la base de données.")
        return
    
    # Créer des produits de test
    test_products = [
        {
            'nom': 'iPhone 15 Pro',
            'description': 'Le dernier smartphone Apple avec puce A17 Pro et caméra 48MP',
            'prix': 1199.99,
            'quantite': 50
        },
        {
            'nom': 'MacBook Air M2',
            'description': 'Ordinateur portable Apple avec puce M2 et écran 13 pouces',
            'prix': 1299.99,
            'quantite': 25
        },
        {
            'nom': 'AirPods Pro',
            'description': 'Écouteurs sans fil avec réduction de bruit active',
            'prix': 249.99,
            'quantite': 100
        },
        {
            'nom': 'Apple Watch Series 9',
            'description': 'Montre connectée avec GPS et capteurs de santé',
            'prix': 399.99,
            'quantite': 75
        },
        {
            'nom': 'iPad Air',
            'description': 'Tablette Apple avec puce M1 et écran 10.9 pouces',
            'prix': 599.99,
            'quantite': 40
        }
    ]
    
    try:
        for product_data in test_products:
            Produit.objects.create(**product_data)
        
        print(f"{len(test_products)} produits de test créés avec succès.")
    except Exception as e:
        print(f"Erreur lors de la création des produits de test: {e}")

if __name__ == '__main__':
    load_test_products()
