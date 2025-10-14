from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer pour lister les utilisateurs (sans mot de passe)"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'nom', 'first_name', 'last_name', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un nouvel utilisateur"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'nom', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour modifier un utilisateur"""
    
    class Meta:
        model = User
        fields = ['email', 'username', 'nom', 'first_name', 'last_name', 'is_active']
    
    def update(self, instance, validated_data):
        # Mettre à jour les champs
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
