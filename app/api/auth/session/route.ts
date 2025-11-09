// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import admin from 'firebase-admin';
import '../../../../lib/firebase/admin'; // <-- Importa para asegurar la inicialización

/**
 * @swagger
 * /api/auth/session:
 *   post:
 *     summary: Crea una cookie de sesión para el usuario autenticado.
 *     description: Recibe un token de ID de Firebase del cliente, lo verifica y crea una cookie de sesión segura HTTP-Only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión creada exitosamente.
 *       401:
 *         description: Token de ID no válido o ausente.
 *       500:
 *         description: Error del servidor.
 */
export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return new NextResponse(JSON.stringify({ error: 'Token de ID no proporcionado.' }), { status: 401 });
  }

  try {
    // El token de sesión expira en 14 días.
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    // Verificamos el token de ID para asegurar que es válido.
    await admin.auth().verifyIdToken(idToken, true /** checkRevoked */);

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const options = {
      name: 'session', // El nombre de nuestra cookie
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    const response = new NextResponse(JSON.stringify({ status: 'success' }), {
      status: 200,
    });

    response.cookies.set(options);

    return response;

  } catch (error) {
    console.error('Error al crear la cookie de sesión:', error);
    return new NextResponse(JSON.stringify({ error: 'No autorizado.' }), { status: 401 });
  }
}

/**
 * @swagger
 * /api/auth/session:
 *   delete:
 *     summary: Cierra la sesión del usuario.
 *     description: Elimina la cookie de sesión del navegador.
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente.
 */
export async function DELETE() {
  const options = {
    name: 'session',
    value: '',
    maxAge: -1, // Expira la cookie inmediatamente
    path: '/',
  };

  const response = new NextResponse(JSON.stringify({ status: 'success' }), {
    status: 200,
  });

  response.cookies.set(options);

  return response;
}
