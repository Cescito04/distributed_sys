from rest_framework import serializers
from django.core.validators import MinValueValidator
from .models import Produit

class ProduitSerializer(serializers.ModelSerializer):
    """Serializer pour lister et récupérer les produits"""
    
    class Meta:
        model = Produit
        fields = ['id', 'nom', 'description', 'prix', 'quantite', 'date_creation', 'date_modification']
        read_only_fields = ['id', 'date_creation', 'date_modification']

class ProduitCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un nouveau produit"""
    
    class Meta:
        model = Produit
        fields = ['nom', 'description', 'prix', 'quantite']
    
    def validate_prix(self, value):
        """Validation du prix"""
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être supérieur à 0.")
        return value
    
    def validate_quantite(self, value):
        """Validation de la quantité"""
        if value < 0:
            raise serializers.ValidationError("La quantité ne peut pas être négative.")
        return value

class ProduitUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour modifier un produit"""
    
    class Meta:
        model = Produit
        fields = ['nom', 'description', 'prix', 'quantite']
    
    def validate_prix(self, value):
        """Validation du prix"""
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être supérieur à 0.")
        return value
    
    def validate_quantite(self, value):
        """Validation de la quantité"""
        if value < 0:
            raise serializers.ValidationError("La quantité ne peut pas être négative.")
        return value
