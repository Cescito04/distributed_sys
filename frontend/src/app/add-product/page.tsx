'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addProduct } from '@/services/api';
import { ProductCreateRequest } from '@/types';

export default function AddProduct() {
  const [formData, setFormData] = useState<ProductCreateRequest>({
    nom: '',
    description: '',
    prix: 0,
    quantite: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'prix' || name === 'quantite' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation côté client
    if (!formData.nom.trim()) {
      setError('Le nom du produit est requis');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('La description est requise');
      setLoading(false);
      return;
    }

    if (formData.prix <= 0) {
      setError('Le prix doit être supérieur à 0');
      setLoading(false);
      return;
    }

    if (formData.quantite < 0) {
      setError('La quantité ne peut pas être négative');
      setLoading(false);
      return;
    }

    try {
      if (isAuthenticated) {
        // Appel API réel si l'utilisateur est connecté
        const response = await addProduct(formData);
        if (response.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setError(response.message || 'Erreur lors de la création du produit');
        }
      } else {
        // Simulation pour la démo
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Produit créé avec succès !</h2>
            <p className="text-gray-600 mb-4">Redirection vers la page d'accueil...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Ajouter un nouveau produit</h1>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ← Retour à la liste
              </Link>
            </div>

            {!isAuthenticated && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                <p className="text-sm">
                  <strong>Mode démonstration :</strong> Vous n'êtes pas connecté. 
                  Le produit sera simulé. <Link href="/login" className="underline">Se connecter</Link> pour une création réelle.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: iPhone 15 Pro"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Décrivez le produit en détail..."
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    name="prix"
                    id="prix"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.prix}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="999.99"
                  />
                </div>

                <div>
                  <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">
                    Quantité en stock *
                  </label>
                  <input
                    type="number"
                    name="quantite"
                    id="quantite"
                    min="0"
                    required
                    value={formData.quantite}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href="/"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Création...' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
