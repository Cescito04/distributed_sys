from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UtilisateurListView, 
    UtilisateurCreateView,
    UtilisateurDetailView,
    CurrentUserView
)

app_name = 'users'

urlpatterns = [
    # Gestion des utilisateurs
    path('users/', UtilisateurListView.as_view(), name='user-list'),
    path('users/create/', UtilisateurCreateView.as_view(), name='user-create'),
    path('users/me/', CurrentUserView.as_view(), name='user-current'),
    path('users/<int:pk>/', UtilisateurDetailView.as_view(), name='user-detail'),
    
    # Authentification JWT
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

