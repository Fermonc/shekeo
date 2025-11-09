import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const protectedRoutes = ['/dashboard'];

  const isProtectedRoute = protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtectedRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verificar la cookie de sesión con Firebase Admin
      await adminAuth.verifySessionCookie(sessionCookie, true /** checkRevoked */);
      // Si la cookie es válida, permitir el acceso
      return NextResponse.next();
    } catch (error) {
      console.error('Error de verificación de sesión en middleware:', error);
      // Si la cookie es inválida (expirada, revocada, etc.), redirigir al login
      // Es buena idea limpiar la cookie inválida del navegador
      const response = NextResponse.redirect(new URL('/login?error=session_expired', request.url));
      // The type definitions seem to be incorrect, we use `as any` to bypass the type checker.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response.cookies as any).delete('session');
      return response;
    }
  }

  // Para rutas no protegidas, simplemente continuar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, which is public)
     * - login, signup, forgot-password (auth pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup|forgot-password|^/$).*)',
    '/dashboard/:path*',
  ],
};
