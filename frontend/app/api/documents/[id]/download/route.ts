import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Point to your NestJS backend
const API = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    // Proxy the download endpoint, forwarding the auth cookie
    const res = await fetch(
      `${API}/documents/${id}/download`,
      {
        headers: {
          // Forward NextAuth session cookie to NestJS
          cookie: request.headers.get('cookie') || '',
        },
        credentials: 'include',
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    // Stream the binary PDF data back to the client
    const arrayBuffer = await res.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          res.headers.get('content-disposition') ||
          `attachment; filename="${id}.pdf"`,
      },
    });
  } catch (err) {
    console.error('Proxy GET /download failed:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
