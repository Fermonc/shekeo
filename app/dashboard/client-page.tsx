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
    <div className=\"min-h-screen bg-gray-900 text-white\">\n      <CreateServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <header className=\"bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10\">\n        <nav className=\"container mx-auto px-6 py-4 flex justify-between items-center\">\n          <div className=\"text-2xl font-bold text-blue-400\">Nexus</div>\n          <div className=\"flex items-center space-x-4\">\n            <span className=\"text-gray-300 hidden sm:block\">Bienvenido, {userName}</span>\n            <form action={handleLogout}>\n              <button \n                type=\"submit\"
                className=\"bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300\"\n              >\n                Cerrar Sesión\n              </button>\n            </form>\n          </div>\n        </nav>\n      </header>

      <main className=\"container mx-auto px-6 py-12\">\n        <div className=\"text-center mb-12\">\n          <h1 className=\"text-4xl md:text-5xl font-extrabold tracking-tight\">Panel de Control</h1>\n          <p className=\"mt-3 max-w-2xl mx-auto text-lg text-gray-400\">Gestiona tus acuerdos, crea nuevos servicios y únete a colaboraciones existentes.</p>\n        </div>

        <div className=\"flex flex-col items-center justify-center gap-6 mb-16\">\n          <div className=\"flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl\">\n            <button \n              onClick={() => setIsModalOpen(true)}
              className=\"w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-transform transform hover:scale-105 shadow-lg\">\n              + Crear Nuevo Servicio\n            </button>\n            
            <form action={joinAction} ref={formRef} className=\"w-full sm:w-auto flex-grow\">\n              <div className=\"flex items-center w-full\">\n                <input \n                  type=\"text\" \n                  name=\"inviteCode\"\n                  placeholder=\"Introduce un código de enlace...\" \n                  className=\"flex-grow w-full bg-gray-700 text-white border border-gray-600 rounded-l-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition\" \n                  required\n                />\n                <JoinButton />\n              </div>
            </form>
          </div>
          {joinState.message && (
              <p className={`text-sm text-center ${joinState.error ? 'text-red-400' : 'text-green-400'}`}>
                  {joinState.message}
              </p>
          )}
        </div>

        <div>\n          <h2 className=\"text-3xl font-bold mb-8\">Mis Servicios</h2>\n          {services.length === 0 ? (\n            <div className=\"text-center bg-gray-800/50 p-12 rounded-xl border-2 border-dashed border-gray-700\">\n              <svg className=\"mx-auto h-12 w-12 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\" />\n              </svg>\n              <h3 className=\"mt-2 text-xl font-semibold text-gray-300\">No tienes servicios activos</h3>\n              <p className=\"mt-1 text-gray-400\">Crea un nuevo servicio o únete a uno para empezar.</p>\n            </div>\n          ) : (\n            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8\">\n              {services.map((service) => (\n                <Link key={service.id} href={`/service/${service.id}`} passHref>\n                  <div className=\"bg-gray-800 rounded-xl shadow-lg p-6 hover:bg-gray-700/70 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-blue-500 h-full\">\n                    <h3 className=\"text-xl font-bold text-blue-400 truncate\">{service.title}</h3>\n                    <div className=\"mt-4\">\n                      <span className={\"inline-block bg-yellow-500/20 text-yellow-300 text-xs font-semibold mr-2 px-3 py-1 rounded-full\"}>{service.status.replace('_', ' ')}</span>\n                    </div>\n                  </div>\n                </Link>\n              ))}\n            </div>\n          )}\n        </div>\n      </main>\n    </div>\n  );
}
