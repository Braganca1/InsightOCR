// frontend/app/api/documents/[id]/download/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  // proxy to your Nest backend download endpoint
  const res = await fetch(`${API}/documents/${params.id}/download`);
  if (!res.ok) {
    return new NextResponse('Not found', { status: res.status });
  }
  const arrayBuffer = await res.arrayBuffer();
  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': res.headers.get('content-disposition')!
    },
  });
}
