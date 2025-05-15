'use client';
import React from 'react';
import Link from 'next/link';

interface Doc { id: string; filename: string; extractedText: string; createdAt: string; }
interface Props { documents: Doc[]; onDelete: (id: string) => void; }

const DocumentList: React.FC<Props> = ({ documents, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {documents.map((doc) => (
      <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            <Link href={`/documents/${doc.id}`} className="hover:text-purple-600">
              {doc.filename}
            </Link>
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            Uploaded {new Date(doc.createdAt).toLocaleDateString()}
          </p>
          <div className="bg-gray-100 p-3 rounded mb-4 text-gray-700 text-sm line-clamp-4">
            {doc.extractedText}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onDelete(doc.id)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
          <Link
            href={`/documents/${doc.id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            View Document
          </Link>
        </div>
      </div>
    ))}
  </div>
);
export default DocumentList;