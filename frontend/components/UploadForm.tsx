// frontend/components/UploadForm.tsx
'use client';
import React, { useState } from 'react';

interface Props { onUpload: (file: File) => Promise<void> }

const UploadForm: React.FC<Props> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  // You can still programmatically open the native picker
  // if you want, but the default label is gone
  const openPicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (f) setFile(f);
    };
    input.click();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await onUpload(file);
    setFile(null);
  };

  return (
    <form onSubmit={submit} className="flex items-center space-x-4">
      {/* Custom pick button instead of native input label */}
      <button
        type="button"
        onClick={openPicker}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        {file ? file.name : 'Choose File…'}
      </button>

      {/* If you still want an explicit upload button: */}
      {file && (
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Upload
        </button>
      )}
    </form>
  );
};

export default UploadForm;
