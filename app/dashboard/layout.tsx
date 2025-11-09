import { redirect } from 'next/navigation';
import { getServerSession } from '../../lib/get-server-session';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Si no hay sesión o la sesión es inválida, redirige al login.
  if (!session) {
    redirect('/login');
  }

  // Si la sesión es válida, muestra el contenido del dashboard.
  return <>{children}</>;
}