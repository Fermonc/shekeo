import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import AgreementClientPage from './client-page';

interface ServiceDetails {
  id: string;
  title: string;
  status: string;
  creatorId: string;
  participantId?: string;
  agreement?: string; // Agreement terms
}

interface UserInfo {
  displayName: string;
  email: string;
}

async function getServiceDetails(serviceId: string): Promise<ServiceDetails | null> {
  const docRef = adminDb.collection('services').doc(serviceId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, ...data } = doc.data()!;
  return { id: doc.id, ...data } as ServiceDetails;
}

async function getUserInfo(uid: string): Promise<UserInfo | null> {
    try {
        const userRecord = await adminAuth.getUser(uid);
        return { 
            displayName: userRecord.displayName || 'Usuario sin nombre',
            email: userRecord.email || 'Email no disponible'
        };
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export default async function ServiceAgreementPage({ params }: { params: { serviceId: string } }) {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    redirect('/login');
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) { 
    redirect('/login');
  }

  const service = await getServiceDetails(params.serviceId);

  if (!service || (service.creatorId !== decodedToken.uid && service.participantId !== decodedToken.uid)) {
    redirect('/dashboard');
  }
  
  // Fetch all user info in parallel
  const [currentUserInfo, creatorInfo, participantInfo] = await Promise.all([
      getUserInfo(decodedToken.uid),
      getUserInfo(service.creatorId),
      service.participantId ? getUserInfo(service.participantId) : Promise.resolve(null)
  ]);

  if (!creatorInfo || !currentUserInfo) {
    // If creator or current user can't be found, something is wrong
    redirect('/dashboard');
  }

  return (
    <AgreementClientPage 
      service={service}
      currentUser={{ uid: decodedToken.uid, name: currentUserInfo.displayName }}
      creator={creatorInfo}
      participant={participantInfo}
    />
  );
}
