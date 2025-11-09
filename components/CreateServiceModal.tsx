'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createService } from '@/lib/actions';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Custom hook for form status
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Creando...' : 'Crear Servicio'}
    </button>
  );
}

export default function CreateServiceModal({ isOpen, onClose }: CreateServiceModalProps) {
  const initialState = { message: '' };
  const [state, dispatch] = useFormState(createService, initialState);

  useEffect(() => {
    // Close modal on successful creation
    if (state.message.includes('éxito')) {
      onClose();
    }
  }, [state.message, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 ease-out" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">Crear un Nuevo Servicio</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>
        
        <form action={dispatch}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">Título del Servicio</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  required
                  placeholder='Ej: Remodelación de Cocina'
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <SubmitButton />
              {state.message && (
                  <p className={`text-sm ${state.message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                      {state.message}
                  </p>
              )}
            </div>
        </form>
      </div>
    </div>
  );
}
