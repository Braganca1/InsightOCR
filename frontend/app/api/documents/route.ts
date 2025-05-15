import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET() {
  const res = await fetch(`${API}/documents`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file');
  const body = new FormData();
  body.append('file', file as Blob);

  const res = await fetch(`${API}/documents/upload`, { method: 'POST', body });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}