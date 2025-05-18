'use client';

import React, { useState, useCallback } from 'react';
import { useRouter }                    from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile]       = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  // handle the actual upload + OCR via our proxy
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    // this hits /api/documents POST, which proxies to /documents/upload
    const res = await fetch('/api/documents', {
      method: 'POST',
      body: formData,
    });

    setLoading(false);
    if (res.ok) {
      router.push('/dashboard');
    } else {
      console.error('Upload failed:', await res.text());
    }
  };

  // drag & drop handlers
  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-2">Upload Document</h1>
      <p className="text-gray-600 mb-6">
        Upload a PDF or image file to extract text and analyze it with AI
      </p>

      <div
        className={`relative mb-6 p-8 border-2 border-dashed rounded-lg ${
          dragOver ? 'border-purple-400' : 'border-gray-300'
        }`}
        onDragEnter={onDragEnter}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          id="file-input"
          type="file"
          accept="application/pdf,image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={!!file}
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        />
        <div className="flex flex-col items-center justify-center">
          {/* Cloud upload SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>

          <p className="text-gray-700 font-medium">
            {file ? file.name : 'Drag & drop your file here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports JPG, JPEG, PNG (Max 10 MB)
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-5 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Uploading…' : 'Upload & Process'}
        </button>
      </div>
    </div>
  );
}
