"use client";

import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { Calendar, Clock, AlertTriangle, FileText, User, GraduationCap, FolderTree } from 'lucide-react';
//import CandidatInfo from '@/components/CandidatInfo';
//import BourseInfo from '@/components/BourseInfo';
//import PiecesJointes from '@/components/PiecesJointes';
import CandidatInfo from '@app/(site)/suivi-candidature/[numeroDossier]/components/CandidatInfo';
import BourseInfo from '@app/(site)/suivi-candidature/[numeroDossier]/components/BourseInfo';
import PiecesJointes from '@app/(site)/suivi-candidature/[numeroDossier]/components/PiecesJointes';
import InfoModal from '@/components/InfoModal';

// Réutilisation du composant Tabs
function DossierTabs({ dossier, user }: { dossier: any; user: any }) {
  const [tab, setTab] = useState("candidat");

  const tabsConfig = [
    { key: "candidat", label: "Candidat", icon: User },
    { key: "bourse", label: "Bourse demandée", icon: GraduationCap },
    { key: "pieces", label: "Pièces jointes", icon: FolderTree },
  ];

  return (
    <div className="space-y-6">
      {/* BARRE D'ONGLETS */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {tabsConfig.map(({ key, label, icon: Icon }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`
                  relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold 
                  transition-all duration-300 ease-out
                  ${isActive 
                    ? "bg-white text-(--color-theme-green) shadow-md scale-100" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50 scale-95 hover:scale-100"
                  }
                `}
              >
                <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-(--color-theme-green)" : "text-slate-400"}`} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ZONE DE CONTENU */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200">
        <div key={tab} className="p-6 animate-fade-in-up">
          {tab === "candidat" && <CandidatInfo dossier={dossier} />}
          {tab === "bourse" && <BourseInfo dossier={dossier} />}
          {tab === "pieces" && <PiecesJointes dossier={dossier} />}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

interface DemandeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: any;
  isExpired?: boolean;
}

export default function DemandeDetailsModal({ 
  isOpen, 
  onClose, 
  dossier
}: DemandeDetailsModalProps) {
  const { user } = useSession();

  if (!dossier) return null;
  
  const isExpired = (dossier.statut_demande as string) === "Expirée" || (dossier.date_expiration !== null && new Date(dossier.date_expiration) < new Date());

  return (
    <InfoModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Dossier N° ${dossier.numero_dossier}`}
      size="xl"
    >
      <div className="p-6">
        <div className={`relative overflow-hidden ${isExpired ? "bg-(--color-theme-red)" : "bg-(--color-theme-green)"} rounded-2xl p-6 mb-6 shadow-lg`}>
          <div className="relative flex flex-col md:flex-row items-center gap-4">
            <div>
              <FileText className="w-12 h-12 text-white" />
            </div>
            <div className="flex flex-col items-center md:items-start gap-2 flex-1">
              <h3 className="text-xl font-bold text-white">
                Dossier N° {dossier.numero_dossier}
              </h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm">
                  <Calendar className="w-3 h-3 text-white/70" />
                  <span>Déposé le {new Date(dossier.date_depot).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  })}</span>
                </div>
                {dossier.date_expiration && (
                  <div className={`flex items-center gap-2 px-3 py-1 backdrop-blur-md border rounded-full text-sm ${
                    isExpired 
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-200" 
                      : "bg-white/10 border-white/20 text-white"
                  }`}>
                    {isExpired ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span className="font-medium">
                      {isExpired ? (
                        <>Expiré le {new Date(dossier.date_expiration!).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}</>
                      ) : (
                        <>Valide jusqu'au {new Date(dossier.date_expiration!).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}</>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DossierTabs dossier={dossier} user={user} />
        
      </div>
    </InfoModal>
  );
}