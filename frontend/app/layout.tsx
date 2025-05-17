import './globals.css';
import Providers from '../components/Providers';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import Navbar from '../components/Navbar';


export const metadata = {
  title: 'Paggo OCR',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch the session on the server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen pt-16">
        {/* Wrap everything in the client-side SessionProvider via Providers */}
        <Providers session={session}>
          <Navbar />

          {/* Main content area */}
          <main className="flex-grow container mx-auto px-6 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t">
            <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
              <span>© 2025 Paggo. All rights reserved.</span>
              <div className="space-x-4 mt-2 md:mt-0">
                <Link href="/" className="hover:text-purple-600">
                  Home
                </Link>
                <Link href="/contact" className="hover:text-purple-600">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
