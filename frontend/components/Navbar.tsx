import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const name = localStorage.getItem('user_name');
    setIsLoggedIn(!!token);
    setUserName(name || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold hover:text-primary-200 transition">
            🛒 E-Commerce
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-primary-200 transition">
              Accueil
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/add-product" className="hover:text-primary-200 transition">
                  Ajouter Produit
                </Link>
                <span className="text-primary-200">👤 {userName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-primary-200 transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-500 hover:bg-primary-400 px-4 py-2 rounded-lg transition"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

