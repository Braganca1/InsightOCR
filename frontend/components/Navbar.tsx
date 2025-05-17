// frontend/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-16">
      <div className="container mx-auto flex items-center justify-between h-full px-6">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          Paggo
        </Link>
        <nav className="space-x-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
            My Documents
          </Link>
          <Link
            href="/upload"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Upload Document
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
