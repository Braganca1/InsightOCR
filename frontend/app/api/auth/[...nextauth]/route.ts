import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider            from 'next-auth/providers/credentials';
import { PrismaAdapter }             from '@next-auth/prisma-adapter';
import { PrismaClient }              from '@prisma/client';
import bcrypt                        from 'bcryptjs';
import jsonwebtoken                  from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: { strategy: 'jwt' },


  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
        // @ts-ignore: NextAuth’s TS defs don’t expose this flag,
        // but it will be honored at runtime.
        encryption: false,
      },
    },
  },

  // We’ll override how NextAuth signs/verifies the JWT
  jwt: {
    async encode({ token, secret, maxAge }) {
      // strip exp/iat so we can set our own
      const { exp, iat, ...payload } = token as Record<string, any>;
      return jsonwebtoken.sign(payload, secret!, {
        algorithm: 'HS256',
        expiresIn: maxAge,
      });
    },
    async decode({ token, secret }) {
      if (!token) return null;
      try {
        const decoded = jsonwebtoken.verify(token, secret!);
        return typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
      } catch {
        return null;
      }
    },
  },


  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'text'     },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user!,
          id: token.id as string,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
