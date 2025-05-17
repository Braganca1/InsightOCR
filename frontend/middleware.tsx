import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
    error: '/login', // redirect here on error
  },
});

// Protect these paths:
export const config = {
  matcher: ['/dashboard/:path*', '/upload/:path*', '/documents/:path*'],
};
