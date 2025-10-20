from rest_framework import serializers
from .models import Utilisateur


class UtilisateurSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Utilisateur."""
    
    class Meta:
        model = Utilisateur
        fields = ('id', 'nom', 'email', 'date_joined', 'is_active')
        read_only_fields = ('id', 'date_joined')


class UtilisateurCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création d'un utilisateur."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Utilisateur
        fields = ('id', 'nom', 'email', 'password')
        read_only_fields = ('id',)
    
    def create(self, validated_data):
        """Crée un utilisateur avec le mot de passe hashé."""
        password = validated_data.pop('password')
        user = Utilisateur.objects.create_user(
            password=password,
            **validated_data
        )
        return user

