import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Extend the Session type to include `user.id`
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Instantiate PrismaClient for this Next.js route
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Use Prisma to persist users & sessions
  adapter: PrismaAdapter(prisma),

  // Store session in a JSON Web Token
  session: { strategy: 'jwt' },

  // Secret must match your NEXTAUTH_SECRET in .env.local
  secret: process.env.NEXTAUTH_SECRET,

  // Override default NextAuth pages to point at your React ones
  pages: {
    signIn: '/login',      // custom login page
    error: '/login',       // display errors on login page
    // you can also override signOut, verifyRequest, newUser, etc.
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
        // Look up the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        // Verify password
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        // Return the user object — NextAuth puts this into the JWT
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  callbacks: {
    // Add the user.id into the JWT on sign in
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    // Make the `token.id` available as `session.user.id` in the client
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};

// Export both GET and POST to handle NextAuth’s routes
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
