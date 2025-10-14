from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Utilisateur

@admin.register(Utilisateur)
class UtilisateurAdmin(UserAdmin):
    """Configuration de l'interface d'administration pour les utilisateurs"""
    list_display = ['email', 'nom', 'username', 'is_staff', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']
    search_fields = ['email', 'nom', 'username']
    ordering = ['email']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {'fields': ('nom', 'username', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nom', 'username', 'password1', 'password2'),
        }),
    )
