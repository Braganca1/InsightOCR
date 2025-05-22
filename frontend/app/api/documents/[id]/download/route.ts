import { NextResponse }   from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const res = await fetch(`${API}/documents/${id}/download`, {
    headers: { cookie: request.headers.get('cookie') || '' },
    credentials: 'include'
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json({ error: errorText }, { status: res.status });
  }

  const arrayBuffer = await res.arrayBuffer();
  const fileName = `${id}.pdf`;

  return new NextResponse(Buffer.from(arrayBuffer), {
    status: 200,
    headers: {
      'Content-Type':        res.headers.get('content-type') || 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}
