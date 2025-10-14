from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Produit
from .serializers import ProduitSerializer, ProduitCreateSerializer, ProduitUpdateSerializer

class ProduitListAPIView(generics.ListAPIView):
    """API View pour lister tous les produits"""
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_classes = [AllowAny]  # Lecture libre pour tous
    
    def get(self, request, *args, **kwargs):
        """GET /api/v1/products - Retourne la liste de tous les produits"""
        produits = self.get_queryset()
        serializer = self.get_serializer(produits, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': produits.count()
        }, status=status.HTTP_200_OK)

class ProduitCreateAPIView(generics.CreateAPIView):
    """API View pour créer un nouveau produit"""
    queryset = Produit.objects.all()
    serializer_class = ProduitCreateSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]  # Seuls les admins peuvent créer
    
    def post(self, request, *args, **kwargs):
        """POST /api/v1/products - Crée un nouveau produit"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            produit = serializer.save()
            return Response({
                'success': True,
                'message': 'Produit créé avec succès',
                'data': ProduitSerializer(produit).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class ProduitDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """API View pour récupérer, modifier ou supprimer un produit"""
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_classes = [AllowAny]  # Lecture libre pour tous
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProduitSerializer
        elif self.request.method in ['PUT', 'PATCH']:
            return ProduitUpdateSerializer
        return ProduitSerializer
    
    def get_permissions(self):
        """Permissions dynamiques selon la méthode"""
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get(self, request, *args, **kwargs):
        """GET /api/v1/products/<id> - Récupère un produit"""
        produit = self.get_object()
        serializer = self.get_serializer(produit)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def put(self, request, *args, **kwargs):
        """PUT /api/v1/products/<id> - Modifie un produit"""
        produit = self.get_object()
        serializer = self.get_serializer(produit, data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Produit modifié avec succès',
                'data': ProduitSerializer(produit).data
            }, status=status.HTTP_200_OK)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        """PATCH /api/v1/products/<id> - Modifie partiellement un produit"""
        kwargs['partial'] = True
        return self.put(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        """DELETE /api/v1/products/<id> - Supprime un produit"""
        produit = self.get_object()
        produit.delete()
        return Response({
            'success': True,
            'message': 'Produit supprimé avec succès'
        }, status=status.HTTP_204_NO_CONTENT)
