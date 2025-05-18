import { NextResponse }    from 'next/server'
import type { NextRequest } from 'next/server'

const API = process.env.NEXT_PUBLIC_BACKEND_URL! 
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // forward NextAuth cookie so Nest can authorize
  const res = await fetch(`${API}/documents/${params.id}`, {
    headers: { cookie: request.headers.get('cookie') || '' },
    credentials: 'include',
  })

  // if Nest returns an error (e.g. not found / unauthorized), proxy it
  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  // otherwise parse the JSON document
  const doc = await res.json()
  return NextResponse.json(doc)
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await fetch(`${API}/documents/${params.id}`, {
    method: 'DELETE',
    headers: { cookie: request.headers.get('cookie') || '' },
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  // Nest returns { success: true }
  const payload = await res.json()
  return NextResponse.json(payload)
}
