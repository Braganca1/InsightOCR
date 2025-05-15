import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.BACKEND_URL || 'http://localhost:3000';
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/documents/${params.id}/interactions`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { question } = await req.json();
  const res = await fetch(`${API}/documents/${params.id}/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
