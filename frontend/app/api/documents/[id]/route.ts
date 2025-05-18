import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/documents/${params.id}`, {
    headers: { cookie: request.headers.get('cookie') || '' },
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: txt }, { status: res.status });
  }

  const doc = await res.json();
  return NextResponse.json(doc);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/documents/${params.id}`, {
    method: 'DELETE',
    headers: { cookie: request.headers.get('cookie') || '' },
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: txt }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}
