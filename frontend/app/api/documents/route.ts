// frontend/app/api/documents/route.ts
import { NextResponse }   from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_BACKEND_URL!; // e.g. "http://localhost:4000"

export async function GET(request: NextRequest) {
  const res = await fetch(`${API}/documents`, {
    headers: { cookie: request.headers.get('cookie') || '' },
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

  // Proxy to Nest’s POST /documents/upload
  // @ts-ignore – Next.js supports duplex even though TS defs don't
  const res = await (fetch as any)(`${API}/documents/upload`, {
    method: 'POST',
    headers: {
      cookie,
      'content-type': contentType,
    },
    body: request.body,
    duplex: 'half',
  });

  // 1) Error?
  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: txt }, { status: res.status });
  }

  // 2) Only parse JSON if the content-type says it's JSON
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await res.json();
    return NextResponse.json(data);
  }

  // 3) Fallback: empty body (no crash)
  return NextResponse.json({}, { status: res.status });
}
