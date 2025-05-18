// frontend/components/DocumentList.tsx
'use client'

import Link from 'next/link'
import React from 'react'

export interface Doc {
  id: string
  originalName: string
  createdAt: string
}

interface Props {
  documents: Doc[]
  onDelete: () => Promise<void>
}

export default function DocumentList({ documents, onDelete }: Props) {
  return (
    <div className="space-y-6">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
        >
          <div>
            <Link
              href={`/documents/${doc.id}`}
              className="text-lg font-semibold text-purple-600 hover:underline"
            >
              {doc.originalName}
            </Link>
            <p className="text-sm text-gray-500">
              Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex space-x-3">

            <Link href={`/documents/${doc.id}`}>
              <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-gray-100 transition">
                View
              </button>
            </Link>

            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              onClick={async () => {
                if (!confirm('Delete this document?')) return
                try {
                  const res = await fetch(`/api/documents/${doc.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                  })
                  if (!res.ok) {
                    console.error('Delete failed:', await res.text())
                  } else {
                    await onDelete()
                  }
                } catch (err) {
                  console.error(err)
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
