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
      {/* Hero Section */}
      <div className="glass rounded-3xl p-12 mb-12 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fadeIn">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bienvenue sur ShopHub
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fadeIn" style={{animationDelay: '0.1s'}}>
            Découvrez notre sélection de produits de qualité premium
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                {products.length}+
              </div>
              <div className="text-gray-600 font-medium">Produits disponibles</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-600 font-medium">Satisfaction client</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg animate-fadeIn" style={{animationDelay: '0.4s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Support client</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass border-l-4 border-red-500 p-6 rounded-xl mb-8 animate-slideIn">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-red-700">Erreur de connexion</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="glass rounded-3xl p-16 text-center animate-fadeIn">
          <div className="text-8xl mb-6 animate-bounce">🛍️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Aucun produit disponible
          </h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Notre catalogue est en cours de préparation. Revenez bientôt pour découvrir nos produits exceptionnels !
          </p>
          <a
            href="/add-product"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Ajouter votre premier produit</span>
          </a>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <div className="animate-slideIn">
              <h2 className="text-3xl font-bold text-white mb-2">
                Nos Produits
              </h2>
              <p className="text-white/80">
                Découvrez notre sélection de {products.length} produit{products.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={fetchProducts}
              className="group flex items-center space-x-2 glass hover:bg-white/30 text-gray-800 px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium">Actualiser</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={product.id} style={{animationDelay: `${index * 0.1}s`}}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      {!loading && products.length > 0 && (
        <div className="mt-16 glass rounded-3xl p-12 text-center animate-fadeIn">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Vous n'avez pas trouvé ce que vous cherchiez ?
          </h3>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Contactez-nous pour des recommandations personnalisées ou suggérez un produit !
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold">
              Contactez-nous
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border-2 border-gray-200 font-semibold">
              En savoir plus
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
