import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authAPI.login(formData.email, formData.password);
      
      // Save tokens to localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      // Get user info
      const user = await authAPI.getCurrentUser();
      localStorage.setItem('user_name', user.nom);
      
      // Redirect to home
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError('Erreur lors de la connexion. Vérifiez que le backend est démarré.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Connexion - E-Commerce">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Connexion
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                S'inscrire
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>🔐 Compte de test :</strong>
            </p>
            <p className="text-sm text-gray-600">
              Email: <code className="bg-gray-200 px-2 py-1 rounded">admin@example.com</code>
            </p>
            <p className="text-sm text-gray-600">
              Mot de passe: <code className="bg-gray-200 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

