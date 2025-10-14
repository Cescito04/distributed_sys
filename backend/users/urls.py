from django.urls import path
from .views import UserListAPIView, UserCreateAPIView, UserDetailAPIView
from .auth_views import LoginView, LogoutView, RefreshTokenView, UserProfileView

app_name = 'users'

urlpatterns = [
    # Authentification
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='refresh-token'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Gestion des utilisateurs
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('users/create/', UserCreateAPIView.as_view(), name='user-create'),
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'),
]
