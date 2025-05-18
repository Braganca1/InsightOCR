// frontend/components/DocumentList.tsx
'use client';

import Link from 'next/link';

interface Doc {
  id: string;
  originalName: string;
  extractedText: string;
  createdAt: string;
}

interface Props {
  documents: Doc[];
  onDelete: (id: string) => void;
}

export default function DocumentList({ documents, onDelete }: Props) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <li key={doc.id} className="bg-white p-4 rounded-lg shadow">
          <Link
            href={`/documents/${doc.id}`}
            className="text-lg font-semibold text-purple-600 hover:underline"
          >
            {doc.originalName}
          </Link>
          <p className="text-gray-500 text-sm mb-2">
            Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
          </p>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
              onClick={() => onDelete(doc.id)}
            >
              Delete
            </button>
            <Link
              href={`/documents/${doc.id}`}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              View
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
