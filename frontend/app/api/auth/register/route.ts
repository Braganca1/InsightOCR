import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash: hash } });
  return NextResponse.json({ ok: true });
}
