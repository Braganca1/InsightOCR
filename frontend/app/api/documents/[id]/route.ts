import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.BACKEND_URL || 'http://localhost:3000';
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/documents/${params.id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/documents/${params.id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}