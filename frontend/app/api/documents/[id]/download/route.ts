import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/documents/${params.id}/download`, {
    headers: { cookie: request.headers.get('cookie') || '' },
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: txt }, { status: res.status });
  }

  const arrayBuffer = await res.arrayBuffer();
  return new NextResponse(Buffer.from(arrayBuffer), {
    status: 200,
    headers: {
      'Content-Type':        res.headers.get('content-type')!,
      'Content-Disposition': res.headers.get('content-disposition')!,
    },
  });
}
