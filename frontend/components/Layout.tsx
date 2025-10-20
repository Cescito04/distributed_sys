import Navbar from './Navbar';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'E-Commerce' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Mini e-commerce avec Next.js et Django" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 E-Commerce Mini Projet - Tous droits réservés</p>
            <p className="text-sm text-gray-400 mt-2">
              Construit avec Next.js et Django
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

