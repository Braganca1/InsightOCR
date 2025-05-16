'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatInterface from '../../../components/ChatInterface';

interface Document {
  originalName: string;
  id: string;
  filename: string;
  extractedText: string;
  createdAt: string;
}

enum TabKey {
  Original = 'original',
  Conversations = 'conversations',
}

export default function DocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.Original);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/documents/${id}`)
      .then((res) => res.json())
      .then((data: Document) => setDoc(data))
      .catch(console.error);
  }, [id]);

  if (!doc) {
    return <p className="text-center py-20">Loading document...</p>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header area */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{doc.originalName}</h1>
          <p className="text-gray-500">
            Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 space-x-4">
          {/* Download Button */}
          <a
            href={`/api/documents/${doc.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Download
          </a>
          {/* Back Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Back to Documents
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-4">
          <button
            onClick={() => setActiveTab(TabKey.Original)}
            className={`px-4 py-2 font-medium ${
              activeTab === TabKey.Original
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Original Text
          </button>
          <button
            onClick={() => setActiveTab(TabKey.Conversations)}
            className={`px-4 py-2 font-medium ${
              activeTab === TabKey.Conversations
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Conversations
          </button>
        </nav>
      </div>

      {/* Content panels */}
      {activeTab === TabKey.Original ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Extracted Text Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Extracted Text</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap overflow-auto max-h-[400px]">
              {doc.extractedText}
            </div>
          </div>

          {/* Ask AI Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ask AI</h2>
            <p className="text-gray-600 mb-4">
              Ask questions about the document to get AI-powered insights.
            </p>
            <ChatInterface documentId={doc.id} showHistory={false} />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Conversations</h2>
          <ChatInterface documentId={doc.id} showHistory={true} />
        </div>
      )}
    </div>
  );
}
