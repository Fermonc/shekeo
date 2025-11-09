'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { handleLogout, joinService } from '@/lib/actions';
import CreateServiceModal from '@/components/CreateServiceModal';

// Define the types for the props
interface Service {
  id: string;
  title: string;
  status: string;
}

interface DashboardClientPageProps {
  userName: string;
  services: Service[];
}

function JoinButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit"
      disabled={pending}
      className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 px-6 rounded-r-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Uniéndose...' : 'Unirse'}
    </button>
  );
}

export default function DashboardClientPage({ userName, services }: DashboardClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinState, joinAction] = useFormState(joinService, { message: '' });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (joinState.message && !joinState.error) {
      // Reset form on successful join
      formRef.current?.reset();
    }
  }, [joinState]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <CreateServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-400">Nexus</div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 hidden sm:block">Bienvenido, {userName}</span>
            <form action={handleLogout}>
              <button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Cerrar Sesión
              </button>
            </form>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Panel de Control</h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">Gestiona tus acuerdos, crea nuevos servicios y únete a colaboraciones existentes.</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-transform transform hover:scale-105 shadow-lg">
              + Crear Nuevo Servicio
            </button>
            
            <form action={joinAction} ref={formRef} className="w-full sm:w-auto flex-grow">
              <div className="flex items-center w-full">
                <input 
                  type="text" 
                  name="inviteCode"
                  placeholder="Introduce un código de enlace..." 
                  className="flex-grow w-full bg-gray-700 text-white border border-gray-600 rounded-l-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                  required
                />
                <JoinButton />
              </div>
            </form>
          </div>
          {joinState.message && (
              <p className={`text-sm text-center ${joinState.error ? 'text-red-400' : 'text-green-400'}`}>
                  {joinState.message}
              </p>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-8">Mis Servicios</h2>
          {services.length === 0 ? (
            <div className="text-center bg-gray-800/50 p-12 rounded-xl border-2 border-dashed border-gray-700">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-xl font-semibold text-gray-300">No tienes servicios activos</h3>
              <p className="mt-1 text-gray-400">Crea un nuevo servicio o únete a uno para empezar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link key={service.id} href={`/service/${service.id}`} passHref>
                  <div className="bg-gray-800 rounded-xl shadow-lg p-6 hover:bg-gray-700/70 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-blue-500 h-full">
                    <h3 className="text-xl font-bold text-blue-400 truncate">{service.title}</h3>
                    <div className="mt-4">
                      <span className={"inline-block bg-yellow-500/20 text-yellow-300 text-xs font-semibold mr-2 px-3 py-1 rounded-full"}>{service.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
