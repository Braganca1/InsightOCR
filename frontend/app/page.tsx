'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard'); }, [router]);
  return <p className="text-center mt-20">Redirecting to Dashboard...</p>;
}