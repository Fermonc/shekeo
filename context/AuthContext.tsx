'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  UserCredential
} from 'firebase/auth';
import { auth } from '../lib/firebase/client';
import { useRouter } from 'next/navigation';
import type { DecodedIdToken } from 'firebase-admin/auth';

interface AuthContextType {
  user: User | null; // Usuario del cliente de Firebase
  session: DecodedIdToken | null; // Sesión del servidor
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  initialSession,
  children, 
}: { 
  initialSession: DecodedIdToken | null;
  children: ReactNode; 
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Escucha cambios en el estado de autenticación del *cliente* de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Crea la sesión del servidor
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (response.ok) {
      // Refresca la página para que el servidor reconozca la nueva cookie
      router.refresh();
    } else {
      throw new Error('No se pudo iniciar sesión en el servidor.');
    }
  };

  const logOut = async () => {
    await firebaseSignOut(auth);
    
    // Cierra la sesión del servidor
    await fetch('/api/auth/logout', { method: 'POST' });

    // Refresca para que el servidor reconozca el estado de logout
    router.refresh();
    router.push('/login');
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    user, // El usuario del SDK de cliente, útil para operaciones del lado del cliente
    session: initialSession, // La sesión del servidor, para saber si está autenticado en el backend
    loading,
    signUp,
    logIn,
    logOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
