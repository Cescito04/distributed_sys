from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer

User = get_user_model()

class UserListAPIView(generics.ListAPIView):
    """
    API View to list all users in the system
    Access restricted to administrators only
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        """
        GET /api/v1/users/
        Returns paginated list of all users
        Requires administrator privileges
        """
        users = self.get_queryset()
        serializer = self.get_serializer(users, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': users.count()
        }, status=status.HTTP_200_OK)

class UserCreateAPIView(generics.CreateAPIView):
    """
    API View to create a new user account
    Public registration without authentication required
    """
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        """
        POST /api/v1/users/create/
        Creates a new user account with data validation
        Returns created user information or validation errors
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'Utilisateur créé avec succès',
                'data': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class UserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API View to handle CRUD operations on a specific user
    Permissions: GET/PUT (owner or admin), DELETE (admin only)
    """
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Returns the appropriate serializer based on HTTP method"""
        if self.request.method == 'GET':
            return UserSerializer
        return UserUpdateSerializer
    
    def get(self, request, *args, **kwargs):
        """
        GET /api/v1/users/<id>/
        Retrieves user information
        A user can only view their own profile, unless they are an administrator
        """
        user = self.get_object()
        if not request.user.is_staff and user != request.user:
            return Response({
                'success': False,
                'message': 'Vous ne pouvez voir que votre propre profil'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(user)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def put(self, request, *args, **kwargs):
        """PUT /api/v1/users/<id> - Modifie un utilisateur"""
        user = self.get_object()
        # Un utilisateur ne peut modifier que son propre profil, sauf s'il est admin
        if not request.user.is_staff and user != request.user:
            return Response({
                'success': False,
                'message': 'Vous ne pouvez modifier que votre propre profil'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(user, data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Utilisateur modifié avec succès',
                'data': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        """DELETE /api/v1/users/<id> - Supprime un utilisateur"""
        user = self.get_object()
        # Seuls les admins peuvent supprimer des utilisateurs
        if not request.user.is_staff:
            return Response({
                'success': False,
                'message': 'Seuls les administrateurs peuvent supprimer des utilisateurs'
            }, status=status.HTTP_403_FORBIDDEN)
        
        user.delete()
        return Response({
            'success': True,
            'message': 'Utilisateur supprimé avec succès'
        }, status=status.HTTP_204_NO_CONTENT)
