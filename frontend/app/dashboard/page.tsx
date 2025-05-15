'use client';
import React, { useEffect, useState } from 'react';
import DocumentList from '../../components/DocumentList';
import UploadForm from '../../components/UploadForm';

interface Doc { id: string; filename: string; extractedText: string; createdAt: string; }
export default function DashboardPage() {
  const [docs, setDocs] = useState<Doc[]>([]);

  const fetchDocs = async () => {
    const res = await fetch('/api/documents');
    setDocs(await res.json());
  };
  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (file: File) => {
    const formData = new FormData(); formData.append('file', file);
    await fetch('/api/documents', { method: 'POST', body: formData });
    fetchDocs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    fetchDocs();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">My Documents</h2>
        <UploadForm onUpload={handleUpload} />
      </div>

      {docs.length > 0 ? (
        <DocumentList documents={docs} onDelete={handleDelete} />
      ) : (
        <p className="text-center text-gray-500">No documents yet. Upload one to get started!</p>
      )}
    </>
  );
}
