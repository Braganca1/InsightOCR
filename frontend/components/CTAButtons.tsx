'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CTAButtons() {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;

  if (session) {
    return (
      <div className="flex space-x-4 justify-center">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          My Documents
        </Link>
        <Link
          href="/upload"
          className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-gray-200 transition"
        >
          Upload New
        </Link>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 justify-center">
      <Link
        href="/register"
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Get Started
      </Link>

      <Link href="/login">
        <button className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-gray-200 transition">
          Sign In
        </button>
      </Link>
    </div>
  );
}
