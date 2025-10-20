from django.urls import path
from .views import ProduitListView, ProduitCreateView, ProduitDetailView

app_name = 'products'

urlpatterns = [
    path('products/', ProduitListView.as_view(), name='product-list'),
    path('products/create/', ProduitCreateView.as_view(), name='product-create'),
    path('products/<int:pk>/', ProduitDetailView.as_view(), name='product-detail'),
]

