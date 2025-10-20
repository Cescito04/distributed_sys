from django.contrib import admin
from .models import Produit


@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    """Configuration de l'admin pour le modèle Produit."""
    
    list_display = ('nom', 'prix', 'quantite', 'est_disponible', 'date_creation')
    list_filter = ('date_creation', 'date_modification')
    search_fields = ('nom', 'description')
    ordering = ('-date_creation',)
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('nom', 'description')
        }),
        ('Prix et stock', {
            'fields': ('prix', 'quantite')
        }),
        ('Dates', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('date_creation', 'date_modification')

