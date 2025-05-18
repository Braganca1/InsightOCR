import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/documents/${params.id}/interactions`, {
    headers: { cookie: request.headers.get('cookie') || '' },
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: txt }, { status: res.status });
  }

  const interactions = await res.json();
  return NextResponse.json(interactions);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { question } = await request.json();
  const res = await fetch(`${API}/documents/${params.id}/interactions`, {
    method:  'POST',
    headers: {
      cookie:          request.headers.get('cookie') || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: txt }, { status: res.status });
  }

  const interaction = await res.json();
  return NextResponse.json(interaction);
}
