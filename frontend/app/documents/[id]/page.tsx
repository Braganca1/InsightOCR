'use client';  // Uses hooks and client-side navigation
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import UploadForm from '../../../components/UploadForm';
import ChatInterface from '../../../components/ChatInterface';

interface Doc { id: string; filename: string; extractedText: string; }
export default function DocumentPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState<Doc | null>(null);

  useEffect(() => {
    if (id) fetch(`/api/documents/${id}`).then((r) => r.json()).then(setDoc);
  }, [id]);

  const upload = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    await fetch(`/api/documents/upload`, { method: 'POST', body: form });
    if (id) fetch(`/api/documents/${id}`).then((r) => r.json()).then(setDoc);
  };

  if (!doc) return <p>Loading...</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">{doc.filename}</h2>
      <UploadForm onUpload={upload} />
      <pre className="bg-white p-4 rounded mb-4">{doc.extractedText}</pre>
      <ChatInterface documentId={doc.id} />
    </>
  );
}
