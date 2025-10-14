from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import UserSerializer

class LoginView(TokenObtainPairView):
    """
    JWT authentication view for user login
    Generates access and refresh tokens
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        """
        POST /api/v1/auth/login/
        Authenticates a user with email and password
        Returns JWT tokens and user information
        """
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'success': False,
                'message': 'Email et mot de passe requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=email, password=password)
        
        if user is None:
            return Response({
                'success': False,
                'message': 'Email ou mot de passe incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'success': False,
                'message': 'Compte utilisateur désactivé'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate JWT tokens for authenticated user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'success': True,
            'message': 'Connexion réussie',
            'data': {
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    """
    Logout view to invalidate JWT tokens
    Adds refresh token to blacklist to make it unusable
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        """
        POST /api/v1/auth/logout/
        Logs out user by invalidating their refresh token
        """
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'success': True,
                'message': 'Déconnexion réussie'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Erreur lors de la déconnexion'
            }, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    """
    View to renew expired access token
    Uses refresh token to generate a new access token
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        """
        POST /api/v1/auth/refresh/
        Renews access token from refresh token
        """
        refresh_token = request.data.get('refresh_token')
        
        if not refresh_token:
            return Response({
                'success': False,
                'message': 'Token de rafraîchissement requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = RefreshToken(refresh_token)
            access_token = token.access_token
            
            return Response({
                'success': True,
                'data': {
                    'access': str(access_token)
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Token de rafraîchissement invalide'
            }, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(APIView):
    """Vue pour récupérer le profil de l'utilisateur connecté"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        """GET /api/v1/auth/profile - Récupérer le profil utilisateur"""
        return Response({
            'success': True,
            'data': UserSerializer(request.user).data
        }, status=status.HTTP_200_OK)
