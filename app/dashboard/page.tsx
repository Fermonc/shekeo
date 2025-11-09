import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import DashboardClientPage from './client-page';

// Define the type for the service data
interface Service {
  id: string;
  title: string;
  status: string;
  // Add any other fields you expect from Firestore
}

// Fetches services for the current user
async function getServices(userId: string): Promise<Service[]> {
  const services: Service[] = [];
  
  // Query for services where the user is the creator
  const createdServicesQuery = adminDb.collection('services').where('creatorId', '==', userId);
  
  // Query for services where the user is the participant
  const joinedServicesQuery = adminDb.collection('services').where('participantId', '==', userId);

  const [createdSnapshot, joinedSnapshot] = await Promise.all([
    createdServicesQuery.get(),
    joinedServicesQuery.get()
  ]);

  createdSnapshot.forEach(doc => {
    services.push({ id: doc.id, ...(doc.data() as Omit<Service, 'id'>) });
  });

  joinedSnapshot.forEach(doc => {
    // Avoid adding duplicates if a user is both creator and participant (shouldn't happen, but good practice)
    if (!services.some(s => s.id === doc.id)) {
      services.push({ id: doc.id, ...(doc.data() as Omit<Service, 'id'>) });
    }
  });

  return services;
}

export default async function DashboardPage() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    redirect('/login');
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    redirect('/login');
  }

  const user = await adminAuth.getUser(decodedToken.uid);
  const userName = user.displayName || user.email || 'Usuario';
  
  const services = await getServices(user.uid);

  return (
    <DashboardClientPage userName={userName} services={services} />
  );
}
