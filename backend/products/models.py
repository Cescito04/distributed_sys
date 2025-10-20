from django.db import models
from django.core.validators import MinValueValidator


class Produit(models.Model):
    """Modèle représentant un produit dans l'e-commerce."""
    
    nom = models.CharField(max_length=200, verbose_name="Nom du produit")
    description = models.TextField(verbose_name="Description", blank=True)
    prix = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name="Prix"
    )
    quantite = models.PositiveIntegerField(
        default=0,
        verbose_name="Quantité en stock"
    )
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.nom} - {self.prix}€"
    
    @property
    def est_disponible(self):
        """Retourne True si le produit est en stock."""
        return self.quantite > 0

