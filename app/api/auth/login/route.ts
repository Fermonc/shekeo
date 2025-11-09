import { NextResponse } from 'next/server';
import { admin } from '../../../../lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return new NextResponse(JSON.stringify({ error: 'No se proporcionó un token de ID.' }), { status: 400 });
    }

    // 5 días de validez para la cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const decodedIdToken = await admin.auth().verifyIdToken(idToken);

    // Solo crea la cookie si el token es válido y no ha sido revocado
    if (new Date().getTime() / 1000 < decodedIdToken.exp) {
      const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
      const options = { name: 'session', value: sessionCookie, maxAge: expiresIn, httpOnly: true, secure: true };

      const response = new NextResponse(JSON.stringify({ status: 'success' }), {
        status: 200,
      });

      response.cookies.set(options);
      return response;
    }

    return new NextResponse(JSON.stringify({ error: 'El token ha expirado.' }), { status: 401 });

  } catch (error) {
    console.error('Error al crear la cookie de sesión:', error);
    return new NextResponse(JSON.stringify({ error: 'Autenticación fallida.' }), { status: 401 });
  }
}