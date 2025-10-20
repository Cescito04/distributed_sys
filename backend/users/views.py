from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Utilisateur
from .serializers import UtilisateurSerializer, UtilisateurCreateSerializer


class UtilisateurListView(generics.ListAPIView):
    """
    Vue pour lister tous les utilisateurs.
    GET /api/v1/users/
    Accessible uniquement aux utilisateurs authentifiés.
    """
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated]


class UtilisateurCreateView(generics.CreateAPIView):
    """
    Vue pour créer un nouvel utilisateur (inscription).
    POST /api/v1/users/
    Accessible à tous (pas besoin d'authentification pour s'inscrire).
    """
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurCreateSerializer
    permission_classes = [AllowAny]


class UtilisateurDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, modifier ou supprimer un utilisateur.
    GET/PUT/PATCH/DELETE /api/v1/users/<id>/
    Accessible uniquement aux administrateurs.
    """
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAdminUser]


class CurrentUserView(APIView):
    """
    Vue pour obtenir les informations de l'utilisateur connecté.
    GET /api/v1/users/me/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UtilisateurSerializer(request.user)
        return Response(serializer.data)

