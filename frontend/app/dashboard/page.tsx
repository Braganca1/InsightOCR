'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn }  from 'next-auth/react';
import DocumentList            from '../../components/DocumentList';

interface Doc {
  id: string;
  originalName: string;
  extractedText: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // redirect to your custom login page
      void signIn(undefined, { callbackUrl: '/login' });
    },
  });

  const [docs, setDocs]       = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchDocs = async () => {
      setLoading(true);
      const res = await fetch('/api/documents');
      if (res.ok) setDocs(await res.json());
      else console.error('Failed to load docs', await res.text());
      setLoading(false);
    };

    fetchDocs();
  }, [status]);

  if (status === 'loading') return <p>Loading session…</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">My Documents</h2>
      {loading ? (
        <p>Loading documents…</p>
      ) : docs.length ? (
        <DocumentList documents={docs} onDelete={() => window.location.reload()} />
      ) : (
        <p>No documents yet. Upload one to get started!</p>
      )}
    </div>
  );
}
