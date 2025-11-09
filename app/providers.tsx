'use client';

import { AuthProvider } from '../context/AuthContext';
import type { DecodedIdToken } from 'firebase-admin/auth';

export function Providers({ 
  initialSession,
  children 
}: { 
  initialSession: DecodedIdToken | null;
  children: React.ReactNode 
}) {
  return <AuthProvider initialSession={initialSession}>{children}</AuthProvider>;
}