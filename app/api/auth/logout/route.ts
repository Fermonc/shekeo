import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { admin } from '../../../../lib/firebase/admin';

export async function POST() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    // Si no hay cookie, no hay nada que hacer
    return new NextResponse(JSON.stringify({ status: 'success' }), { status: 200 });
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie);
    await admin.auth().revokeRefreshTokens(decodedClaims.sub); // Invalida el token en Firebase

    const response = new NextResponse(JSON.stringify({ status: 'success' }), {
      status: 200,
    });

    // Borra la cookie del navegador
    response.cookies.set({
      name: 'session',
      value: '',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Error al cerrar la sesión:', error);
    // Incluso si hay un error (ej. la cookie expiró), borra la cookie del lado del cliente
    const response = new NextResponse(JSON.stringify({ error: 'Error logging out' }), {
      status: 500,
    });
    response.cookies.set({
      name: 'session',
      value: '',
      maxAge: 0,
    });
    return response;
  }
}
