import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex-1">
            {product.nom}
          </h3>
          {product.est_disponible ? (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              En stock
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Rupture
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {parseFloat(product.prix).toFixed(2)} €
            </p>
            <p className="text-sm text-gray-500">
              {product.quantite} disponible{product.quantite > 1 ? 's' : ''}
            </p>
          </div>

          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product.est_disponible}
          >
            Acheter
          </button>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500">
        Ajouté le {new Date(product.date_creation).toLocaleDateString('fr-FR')}
      </div>
    </div>
  );
}

