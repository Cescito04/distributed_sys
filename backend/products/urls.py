from django.urls import path
from .views import ProduitListAPIView, ProduitCreateAPIView, ProduitDetailAPIView

app_name = 'products'

urlpatterns = [
    path('products/', ProduitListAPIView.as_view(), name='product-list'),
    path('products/create/', ProduitCreateAPIView.as_view(), name='product-create'),
    path('products/<int:pk>/', ProduitDetailAPIView.as_view(), name='product-detail'),
]
