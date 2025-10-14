from django.contrib import admin
from .models import Produit

@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    """Configuration de l'interface d'administration pour les produits"""
    list_display = ['nom', 'prix', 'quantite', 'date_creation']
    list_filter = ['date_creation', 'prix']
    search_fields = ['nom', 'description']
    list_editable = ['prix', 'quantite']
    ordering = ['-date_creation']
