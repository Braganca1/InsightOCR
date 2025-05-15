import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Paggo OCR' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-white shadow-md">
          <div className="container mx-auto flex items-center justify-between py-4 px-6">
            <Link href="/dashboard" className="text-2xl font-bold text-purple-600">
              Paggo
            </Link>
            <nav className="space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
                My Documents
              </Link>
              <Link   href="/upload"className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Upload Document 
              </Link>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                Sign Out
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-6 py-8">
          {children}
        </main>

        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
            <span>© 2025 Paggo. All rights reserved.</span>
            <div className="space-x-4 mt-2 md:mt-0">
              <Link href="/" className="hover:text-purple-600">Home</Link>
              <Link href="/about" className="hover:text-purple-600">About</Link>
              <Link href="/contact" className="hover:text-purple-600">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
