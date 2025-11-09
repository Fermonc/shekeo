import { cookies } from 'next/headers';
import { admin } from './firebase/admin';

export async function getServerSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
    return decodedClaims;
  } catch {
    // La cookie no es válida (expirada, revocada, etc.)
    // Podrías añadir un log aquí si quieres
    return null;
  }
}
