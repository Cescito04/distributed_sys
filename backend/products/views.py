from rest_framework import generics
from .models import Produit
from .serializers import ProduitSerializer, ProduitCreateSerializer


class ProduitListView(generics.ListAPIView):
    """
    Vue pour lister tous les produits.
    GET /api/v1/products/
    """
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer


class ProduitCreateView(generics.CreateAPIView):
    """
    Vue pour créer un produit.
    POST /api/v1/products/create/
    """
    queryset = Produit.objects.all()
    serializer_class = ProduitCreateSerializer


class ProduitDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, modifier ou supprimer un produit.
    GET/PUT/PATCH/DELETE /api/v1/products/<id>/
    """
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer

