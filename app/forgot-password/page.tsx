'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { handleResetPassword } from '../../lib/actions';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {pending ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
    </button>
  );
}

// Componente de la página de Olvidé Contraseña
export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(handleResetPassword, initialState);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">Nexus</h1>
          <h2 className="text-2xl font-semibold mt-2">Restablecer Contraseña</h2>
          <p className="text-gray-400 mt-2">Ingresa tu email y te enviaremos un enlace para recuperarla.</p>
        </div>
        
        <form action={formAction}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">Correo Electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="tu@email.com"
            />
          </div>

          <SubmitButton />

          {state?.message && (
            <p className="text-center text-green-400 mt-4 bg-green-900/50 p-3 rounded-lg">
              {state.message}
            </p>
          )}
        </form>

        <p className="text-center text-gray-400 mt-8">
          ¿Recordaste tu contraseña? 
          <Link href="/login" className="font-semibold text-blue-400 hover:underline ml-1">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
