'use client';
import React, { useState } from 'react';

interface Props { onUpload: (file: File) => Promise<void> }
const UploadForm: React.FC<Props> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    await onUpload(file);
    setFile(null);
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="flex items-center space-x-4">
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        className="block text-sm text-gray-600"
      />
      <button
        type="submit"
        disabled={!file || loading}
        className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload New'}
      </button>
    </form>
  );
};
export default UploadForm;
