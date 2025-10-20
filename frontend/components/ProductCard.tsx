import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>

      <div className="p-5">
        {/* Badge */}
        {product.est_disponible ? (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-2">
            En stock
          </span>
        ) : (
          <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded mb-2">
            Rupture
          </span>
        )}

        {/* Titre */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.nom}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Prix */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {parseFloat(product.prix).toFixed(2)} €
            </p>
            <p className="text-xs text-gray-500">
              {product.quantite} disponible{product.quantite > 1 ? 's' : ''}
            </p>
          </div>

          {/* Bouton */}
          <button 
            className={`px-4 py-2 rounded font-medium transition-colors ${
              product.est_disponible 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!product.est_disponible}
          >
            {product.est_disponible ? 'Acheter' : 'Indisponible'}
          </button>
        </div>

        {/* Date */}
        <div className="pt-3 border-t border-gray-100 text-xs text-gray-400">
          Ajouté le {new Date(product.date_creation).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </div>
  );
}

