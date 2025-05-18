// frontend/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import DocumentList, { Doc } from '../../components/DocumentList'

export default function DashboardPage() {
  const [docs, setDocs]       = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDocs = async () => {
    setLoading(true)
    const res = await fetch('/api/documents', { credentials: 'include' })
    if (res.ok) {
      setDocs(await res.json())
    } else {
      console.error('Failed to load docs', await res.text())
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">My Documents</h2>
      {loading ? (
        <p>Loading…</p>
      ) : docs.length ? (
        <DocumentList documents={docs} onDelete={fetchDocs} />
      ) : (
        <p>No documents yet. Upload one to get started!</p>
      )}
    </div>
  )
}
