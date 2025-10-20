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
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>

        <footer className="bg-gray-800 text-white py-8 mt-auto">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-sm mb-2">
                © 2025 ShopHub - Tous droits réservés
              </p>
              <p className="text-xs text-gray-400">
                Construit avec Next.js et Django
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

