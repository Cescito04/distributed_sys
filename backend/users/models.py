from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UtilisateurManager(BaseUserManager):
    """Manager personnalisé pour le modèle Utilisateur."""
    
    def create_user(self, email, nom, password=None, **extra_fields):
        """Crée et sauvegarde un utilisateur normal."""
        if not email:
            raise ValueError("L'email est obligatoire")
        if not nom:
            raise ValueError("Le nom est obligatoire")
        
        email = self.normalize_email(email)
        user = self.model(email=email, nom=nom, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, nom, password=None, **extra_fields):
        """Crée et sauvegarde un superutilisateur."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superutilisateur doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superutilisateur doit avoir is_superuser=True.')
        
        return self.create_user(email, nom, password, **extra_fields)


class Utilisateur(AbstractBaseUser, PermissionsMixin):
    """
    Modèle personnalisé d'utilisateur.
    Utilise l'email comme identifiant au lieu du username.
    """
    nom = models.CharField(max_length=150, verbose_name="Nom")
    email = models.EmailField(unique=True, verbose_name="Email")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    is_staff = models.BooleanField(default=False, verbose_name="Staff")
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name="Date d'inscription")
    
    objects = UtilisateurManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom']
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.nom} ({self.email})"
    
    def get_full_name(self):
        return self.nom
    
    def get_short_name(self):
        return self.nom

