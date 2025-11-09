import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { getServerSession } from '../lib/get-server-session';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shekeo - Transacciones de Servicios, Seguras y sin Complicaciones',
  description: 'Shekeo es tu intermediario de confianza para garantizar que los servicios se paguen de forma justa y segura. Minimiza riesgos y asegura tus transacciones con nuestro sistema de depósito por objetivos.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <Providers initialSession={session}> { /* Pasar la sesión inicial */ }
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
