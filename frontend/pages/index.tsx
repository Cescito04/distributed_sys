import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productAPI } from '@/lib/api';
import { Product } from '@/lib/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productAPI.getAll();
      setProducts(data.results || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError("Erreur lors du chargement des produits. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Accueil - ShopHub">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bienvenue sur ShopHub
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez nos produits de qualité
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="font-semibold text-red-800">Erreur</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Aucun produit disponible
            </h2>
            <p className="text-gray-600 mb-6">
              Les produits seront bientôt ajoutés.
            </p>
            <a
              href="/add-product"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors font-medium"
            >
              Ajouter un produit
            </a>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Tous les produits ({products.length})
              </h2>
              <button
                onClick={fetchProducts}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualiser</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
