import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { productAPI } from '@/lib/api';

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    quantite: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate prix
    const prix = parseFloat(formData.prix);
    if (isNaN(prix) || prix <= 0) {
      setError('Le prix doit être supérieur à 0');
      setLoading(false);
      return;
    }

    // Validate quantite
    const quantite = parseInt(formData.quantite);
    if (isNaN(quantite) || quantite < 0) {
      setError('La quantité doit être supérieure ou égale à 0');
      setLoading(false);
      return;
    }

    try {
      const product = {
        nom: formData.nom,
        description: formData.description,
        prix: formData.prix,
        quantite: quantite,
      };

      await productAPI.create(product);
      
      setSuccess('Produit ajouté avec succès !');
      
      // Reset form
      setFormData({
        nom: '',
        description: '',
        prix: '',
        quantite: '',
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating product:', err);
      if (err.response?.status === 403) {
        setError('Vous n\'avez pas les permissions pour ajouter un produit. Seuls les administrateurs peuvent ajouter des produits.');
      } else if (err.response?.status === 401) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError("Erreur lors de l'ajout du produit. Vérifiez que le backend est démarré.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <Layout title="Ajouter un produit - E-Commerce">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Ajouter un nouveau produit
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">❌ Erreur</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">✅ Succès</p>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                id="nom"
                required
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: MacBook Pro"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Décrivez le produit..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  id="prix"
                  required
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="99.99"
                  value={formData.prix}
                  onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité en stock *
                </label>
                <input
                  type="number"
                  id="quantite"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10"
                  value={formData.quantite}
                  onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Ajout en cours...' : '➕ Ajouter le produit'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition duration-300"
              >
                Annuler
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Note importante :</strong> Seuls les administrateurs peuvent ajouter des produits.
              Si vous n'êtes pas admin, cette action échouera.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

