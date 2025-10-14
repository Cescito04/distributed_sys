'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProducts } from '@/services/api';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Erreur lors du chargement des produits');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(parseFloat(price));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">E-commerce Demo</h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/add-product"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Ajouter un produit
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h2>
          <p className="text-gray-600">
            {products.length} produit{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit disponible</h3>
            <p className="text-gray-600 mb-6">Il n'y a actuellement aucun produit dans notre catalogue.</p>
            <Link
              href="/add-product"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter le premier produit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.nom}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(product.prix)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.quantite}
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Voir détails
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}