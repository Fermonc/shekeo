'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { saveAgreementTerms } from '@/lib/actions';

// ... (interfaces remain the same)
interface ServiceDetails {
  id: string;
  title: string;
  status: string;
  creatorId: string;
  participantId?: string;
  agreement?: string;
}

interface UserInfo {
  displayName: string;
  email: string;
}

interface CurrentUser {
    uid: string;
    name: string;
}

interface AgreementClientPageProps {
  service: ServiceDetails;
  currentUser: CurrentUser;
  creator: UserInfo;
  participant: UserInfo | null;
}

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-green-400 disabled:cursor-not-allowed">
            {pending ? 'Guardando...' : 'Guardar Acuerdo'}
        </button>
    );
}

export default function AgreementClientPage({ service, currentUser, creator, participant }: AgreementClientPageProps) {
  
  const initialState = { message: "" };
  const [state, dispatch] = useFormState(saveAgreementTerms, initialState);

  const isCreator = service.creatorId === currentUser.uid;
  // For now, only the creator can edit. This can be expanded later.
  const canEditAgreement = isCreator && service.status === 'pending_agreement';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
       <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-400 hover:text-blue-300">
            &larr; Volver al Panel
          </Link>
          <div className="text-gray-300">{currentUser.name}</div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{service.title}</h1>
            <span className={"inline-block bg-yellow-500/20 text-yellow-300 text-sm font-semibold px-3 py-1 rounded-full"}>{service.status.replace('_', ' ')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Creador</h2>
              <p className="text-gray-300">{creator.displayName}</p>
              <p className="text-gray-400 text-sm">{creator.email}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Participante</h2>
              {participant ? (
                <>
                  <p className="text-gray-300">{participant.displayName}</p>
                  <p className="text-gray-400 text-sm">{participant.email}</p>
                </>
              ) : (
                <p className="text-gray-400">Esperando participante...</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Términos del Acuerdo</h2>
            <form action={dispatch}>
                <input type="hidden" name="serviceId" value={service.id} />
                <textarea
                    name="agreement"
                    rows={15}
                    className="w-full bg-gray-900 text-gray-200 rounded-lg p-4 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                    placeholder={canEditAgreement ? "Describe los términos, condiciones y entregables de este servicio..." : "Los términos del acuerdo aún no han sido definidos."}
                    defaultValue={service.agreement || ''}
                    readOnly={!canEditAgreement}
                />
                {canEditAgreement && (
                    <div className="mt-6 flex justify-end items-center gap-4">
                        {state.message && <p className={`text-sm ${state.error ? 'text-red-400' : 'text-green-400'}`}>{state.message}</p>}
                        <SaveButton />
                    </div>
                )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
