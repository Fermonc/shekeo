'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { customAlphabet } from 'nanoid';

// Define a type for the form state
export type FormState = { 
  message: string;
  error?: boolean;
};


export async function createSession(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
  
  // The type definitions seem to be incorrect, we use `as any` to bypass the type checker.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (cookies() as any).set('session', sessionCookie, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: expiresIn,
    path: '/'
  });

  redirect('/dashboard');
}

export async function handleLogout() {
  // The type definitions seem to be incorrect, we use `as any` to bypass the type checker.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (cookies() as any).delete('session');
  redirect('/login');
}

export async function handleResetPassword(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;

  console.log(`Se ha enviado un correo de restablecimiento a: ${email}`);
  
  return {
    message: 'Si existe una cuenta con este correo, recibirás un enlace para restablecer tu contraseña.',
  };
}

export async function createService(prevState: { message: string }, formData: FormData) {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const creatorId = decodedToken.uid;
    
    const title = formData.get('title') as string;
    if (!title) {
      return { message: 'El título es obligatorio.', error: true };
    }

    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);
    const inviteCode = nanoid();

    const serviceRef = adminDb.collection('services').doc();
    await serviceRef.set({
      title: title,
      creatorId: creatorId,
      participantId: null,
      status: 'pending_invite',
      inviteCode: inviteCode,
      createdAt: new Date(),
    });
    
    revalidatePath('/dashboard');
    return { message: `¡Servicio "${title}" creado con éxito!` };

  } catch (error) {
    console.error("Error al crear el servicio:", error);
    return { message: 'Error al crear el servicio. Por favor, inténtalo de nuevo.', error: true };
  }
}

export async function joinService(prevState: { message: string }, formData: FormData) {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    redirect('/login');
  }

  const inviteCode = formData.get('inviteCode') as string;
  if (!inviteCode) {
    return { message: 'El código de enlace no puede estar vacío.', error: true };
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const joinerId = decodedToken.uid;

    const servicesRef = adminDb.collection('services');
    const query = servicesRef.where('inviteCode', '==', inviteCode).limit(1);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return { message: 'El código de enlace no es válido.', error: true };
    }

    const serviceDoc = snapshot.docs[0];
    const serviceData = serviceDoc.data();

    if (serviceData.creatorId === joinerId) {
      return { message: 'No puedes unirte a tu propio servicio.', error: true };
    }

    if (serviceData.participantId) {
      return { message: 'Este servicio ya tiene un participante.', error: true };
    }

    await serviceDoc.ref.update({
      participantId: joinerId,
      status: 'pending_agreement',
    });

    revalidatePath('/dashboard');
    return { message: `Te has unido al servicio "${serviceData.title}".` };

  } catch (error) {
    console.error("Error al unirse al servicio:", error);
    return { message: 'Error al unirse al servicio. Inténtalo de nuevo.', error: true };
  }
}

export async function saveAgreementTerms(prevState: { message: string }, formData: FormData) {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    redirect('/login');
  }

  const serviceId = formData.get('serviceId') as string;
  const agreement = formData.get('agreement') as string;

  if (!agreement) {
    return { message: 'Los términos del acuerdo no pueden estar vacíos.', error: true };
  }
  
  if (!serviceId) {
    return { message: 'ID de servicio no encontrado.', error: true };
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const updaterId = decodedToken.uid;

    const serviceRef = adminDb.collection('services').doc(serviceId);
    const serviceDoc = await serviceRef.get();

    if (!serviceDoc.exists) {
      return { message: 'Este servicio ya no existe.', error: true };
    }

    const serviceData = serviceDoc.data()!;

    // For now, only the creator can edit the agreement
    if (serviceData.creatorId !== updaterId) {
      return { message: 'No tienes permiso para editar este acuerdo.', error: true };
    }

    // You can only edit while the agreement is pending
    if (serviceData.status !== 'pending_agreement') {
        return { message: 'Este acuerdo ya no se puede editar.', error: true };
    }

    await serviceRef.update({
      agreement: agreement,
    });

    revalidatePath(`/service/${serviceId}`);
    return { message: '¡Los términos del acuerdo se han guardado con éxito!' };

  } catch (error) {
    console.error("Error guardando el acuerdo:", error);
    return { message: 'Error al guardar los términos. Por favor, inténtalo de nuevo.', error: true };
  }
}

export async function acceptAgreement(prevState: { message: string }, formData: FormData) {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    redirect('/login');
  }

  const serviceId = formData.get('serviceId') as string;
  if (!serviceId) {
    return { message: 'ID de servicio no encontrado.', error: true };
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const participantId = decodedToken.uid;

    const serviceRef = adminDb.collection('services').doc(serviceId);
    const serviceDoc = await serviceRef.get();

    if (!serviceDoc.exists) {
      return { message: 'Este servicio ya no existe.', error: true };
    }

    const serviceData = serviceDoc.data()!;

    // Verify the user is the participant
    if (serviceData.participantId !== participantId) {
      return { message: 'No tienes permiso para aceptar este acuerdo.', error: true };
    }

    // Verify the service is pending agreement
    if (serviceData.status !== 'pending_agreement') {
      return { message: 'Este acuerdo no se puede aceptar en su estado actual.', error: true };
    }

    await serviceRef.update({
      status: 'active',
    });

    revalidatePath(`/service/${serviceId}`);
    return { message: '¡Acuerdo aceptado! El servicio está ahora activo.' };

  } catch (error) {
    console.error("Error al aceptar el acuerdo:", error);
    return { message: 'Error al aceptar el acuerdo. Por favor, inténtalo de nuevo.', error: true };
  }
}
