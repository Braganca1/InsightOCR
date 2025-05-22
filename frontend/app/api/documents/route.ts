import { NextResponse }   from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_BACKEND_URL!; 
export async function GET(request: NextRequest) {
  const res = await fetch(`${API}/documents`, {
    headers: { cookie: request.headers.get('cookie') || '' },
    credentials: 'include'
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: txt }, { status: res.status });
  }

  const docs = await res.json();
  return NextResponse.json(docs);
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type')!;
  const cookie      = request.headers.get('cookie') || '';

  // @ts-ignore Next.js runtime supports duplex even though TS defs don't
  const res = await (fetch as any)(`${API}/documents/upload`, {
    method: 'POST',
    headers: {
      cookie,
      'content-type': contentType,
    },
    body: request.body,
    duplex: 'half',
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: txt }, { status: res.status });
  }

  const json = await res.json();
  return NextResponse.json(json);
}
