import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden card-hover animate-fadeIn">
      {/* Image placeholder with gradient */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        {/* Badge en stock */}
        <div className="absolute top-4 right-4">
          {product.est_disponible ? (
            <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>En stock</span>
            </div>
          ) : (
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Rupture
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {product.nom}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {product.description}
        </p>

        {/* Prix et quantité */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {parseFloat(product.prix).toFixed(2)} €
            </p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>{product.quantite} disponible{product.quantite > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Bouton Acheter */}
          <button 
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5
              ${product.est_disponible 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            disabled={!product.est_disponible}
          >
            {product.est_disponible ? (
              <span className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Acheter</span>
              </span>
            ) : (
              'Indisponible'
            )}
          </button>
        </div>

        {/* Date d'ajout */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Ajouté le {new Date(product.date_creation).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

