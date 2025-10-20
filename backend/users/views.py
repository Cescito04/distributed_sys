from rest_framework import generics
from .models import Utilisateur
from .serializers import UtilisateurSerializer


class UtilisateurListView(generics.ListAPIView):
    """Vue pour lister tous les utilisateurs."""
    
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer

