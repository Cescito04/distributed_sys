from rest_framework import serializers
from .models import Produit


class ProduitSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Produit."""
    
    est_disponible = serializers.ReadOnlyField()
    
    class Meta:
        model = Produit
        fields = (
            'id',
            'nom',
            'description',
            'prix',
            'quantite',
            'est_disponible',
            'date_creation',
            'date_modification'
        )
        read_only_fields = ('id', 'date_creation', 'date_modification')


class ProduitCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création d'un produit."""
    
    class Meta:
        model = Produit
        fields = ('id', 'nom', 'description', 'prix', 'quantite')
        read_only_fields = ('id',)

