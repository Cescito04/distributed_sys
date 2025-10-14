from django.db import models
from django.contrib.auth.models import AbstractUser

class Utilisateur(AbstractUser):
    """Modèle utilisateur personnalisé pour l'e-commerce"""
    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=100)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'nom']
    
    class Meta:
        db_table = 'utilisateurs'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return f"{self.nom} ({self.email})"
