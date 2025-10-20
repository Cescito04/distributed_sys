from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from .models import Produit
from .serializers import ProduitSerializer, ProduitCreateSerializer


class ProduitListView(generics.ListAPIView):
    """
    Vue pour lister tous les produits.
    GET /api/v1/products/
    Accessible à tous (lecture publique).
    """
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_classes = [AllowAny]


class ProduitCreateView(generics.CreateAPIView):
    """
    Vue pour créer un produit.
    POST /api/v1/products/create/
    Accessible uniquement aux administrateurs.
    """
    queryset = Produit.objects.all()
    serializer_class = ProduitCreateSerializer
    permission_classes = [IsAdminUser]


class ProduitDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, modifier ou supprimer un produit.
    GET /api/v1/products/<id>/
    - GET : Accessible à tous (lecture publique)
    - PUT/PATCH/DELETE : Accessible uniquement aux administrateurs
    """
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    
    def get_permissions(self):
        """
        Permissions personnalisées selon la méthode HTTP.
        GET : Accessible à tous
        PUT/PATCH/DELETE : Uniquement administrateurs
        """
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

