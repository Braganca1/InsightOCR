// frontend/app/api/documents/[id]/interactions/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // Proxy to your NestJS GET /documents/:id/interactions
  const res = await fetch(`${API}/documents/${id}/interactions`, {
    headers: { cookie: request.headers.get('cookie')! },
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // Destructure the question out of the JSON body
  const { question } = await request.json();

  // Proxy to your NestJS POST /documents/:id/interactions
  const res = await fetch(`${API}/documents/${id}/interactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie')!,
    },
    credentials: 'include',
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
