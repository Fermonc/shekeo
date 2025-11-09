'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { type FormState, saveAgreementTerms, acceptAgreement } from '@/lib/actions';

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
        <button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
            {pending ? 'Guardando...' : 'Guardar Acuerdo'}
        </button>
    );
}

function AcceptButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-green-400 disabled:cursor-not-allowed">
            {pending ? 'Aceptando...' : 'Aceptar Acuerdo y Activar'}
        </button>
    );
}

// A new component for the text area
function AgreementTextArea({ agreement, canEdit, onTextChange }: { agreement: string, canEdit: boolean, onTextChange: (text: string) => void }) {
    return (
        <div className="prose prose-invert max-w-none bg-gray-900 rounded-lg p-4 border border-gray-700 mb-6">
            <textarea
                name="agreement"
                rows={15}
                className="w-full bg-transparent focus:outline-none"
                placeholder={canEdit ? "Describe los términos, condiciones y entregables de este servicio..." : "Los términos del acuerdo aún no han sido definidos por el creador."}
                defaultValue={agreement}
                readOnly={!canEdit}
                onChange={(e) => onTextChange(e.target.value)}
            />
        </div>
    );
}

export default function AgreementClientPage({ service, currentUser, creator, participant }: AgreementClientPageProps) {
  
  const [agreementText, setAgreementText] = React.useState(service.agreement || '');
  const initialState: FormState = { message: "" };
  const [saveState, saveDispatch] = useFormState(saveAgreementTerms, initialState);
  const [acceptState, acceptDispatch] = useFormState(acceptAgreement, initialState);

  const isCreator = service.creatorId === currentUser.uid;
  const isParticipant = service.participantId === currentUser.uid;
  
  const canEditAgreement = isCreator && service.status === 'pending_agreement';
  const canAcceptAgreement = isParticipant && service.status === 'pending_agreement';

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
             <span 
                className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${service.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                {service.status.replace('_', ' ')}
            </span>
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
            <AgreementTextArea agreement={agreementText} canEdit={canEditAgreement} onTextChange={setAgreementText} />

            {/* --- Form for Creator to Save --- */}
            {canEditAgreement && (
                <form action={saveDispatch} className="mt-6 flex justify-end items-center gap-4">
                    <input type="hidden" name="serviceId" value={service.id} />
                    <input type="hidden" name="agreement" value={agreementText} />
                    {saveState.message && <p className={`text-sm ${saveState.error ? 'text-red-400' : 'text-green-400'}`}>{saveState.message}</p>}
                    <SaveButton />
                </form>
            )}
            
            {/* --- Form for Participant to Accept --- */}
            {canAcceptAgreement && (
                <form action={acceptDispatch} className="mt-6 flex justify-end items-center gap-4">
                    <input type="hidden" name="serviceId" value={service.id} />
                    {acceptState.message && <p className={`text-sm ${acceptState.error ? 'text-red-400' : 'text-green-400'}`}>{acceptState.message}</p>}
                    <AcceptButton />
                </form>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
