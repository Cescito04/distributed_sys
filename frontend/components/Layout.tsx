import Navbar from './Navbar';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'ShopHub - E-Commerce' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="ShopHub - Votre marketplace moderne avec Next.js et Django" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Add padding top for fixed navbar */}
        <main className="flex-1 pt-20 pb-16">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>

        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 mt-auto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* About */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">ShopHub</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Votre marketplace moderne pour découvrir et acheter des produits de qualité.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                      <span>→</span><span>Accueil</span>
                    </a>
                  </li>
                  <li>
                    <a href="/login" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                      <span>→</span><span>Connexion</span>
                    </a>
                  </li>
                  <li>
                    <a href="/register" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                      <span>→</span><span>Inscription</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">Next.js</span>
                  <span className="bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">Django</span>
                  <span className="bg-purple-600/20 text-purple-400 text-xs px-3 py-1 rounded-full border border-purple-500/30">PostgreSQL</span>
                  <span className="bg-pink-600/20 text-pink-400 text-xs px-3 py-1 rounded-full border border-pink-500/30">TypeScript</span>
                  <span className="bg-cyan-600/20 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-500/30">Tailwind CSS</span>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 <span className="text-white font-semibold">ShopHub</span> - Tous droits réservés
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Construit avec ❤️ par l'équipe ShopHub
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

