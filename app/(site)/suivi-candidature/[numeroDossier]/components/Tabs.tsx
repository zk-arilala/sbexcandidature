"use client"

import { useState } from "react"
import CandidatInfo from "./CandidatInfo"
import BourseInfo from "./BourseInfo"
import PiecesJointes from "./PiecesJointes"
import { User, GraduationCap, FolderTree, Loader2, FileDown } from "lucide-react";
import { User as UserLogedIn } from "@/context/SessionContext"; 
import { useExportPDF } from "@/hooks/useExportPDF";

export default function Tabs({ dossier, user }: { dossier: any, user: UserLogedIn | null; }) {
  const [tab, setTab] = useState("candidat");
  const { exportToPDF, isExporting, error } = useExportPDF();

  const tabsConfig = [
    { key: "candidat", label: "Candidat", icon: User },
    { key: "bourse", label: "Bourse demandée", icon: GraduationCap },
    { key: "pieces", label: "Pièces jointes", icon: FolderTree },
  ];

  const handleExport = async () => {
    await exportToPDF(dossier);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        
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

        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-(--color-theme-yellow) border border-(--color-theme-yellow) rounded-xl text-sm font-semibold text-slate-900 hover:bg-(--color-theme-green) hover:border-(--color-theme-green) hover:text-white shadow-sm transition-all active:scale-95"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Exporter la demande (PDF)
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* ZONE DE CONTENU AVEC TRANSITION DE CHANGEMENT */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm">
        {/* 
          Clé unique (key={tab}) : Oblige React à remonter le composant 
          permettant de redéclencher l'animation CSS à chaque changement 
        */}
        <div 
          key={tab} 
          className="p-8 animate-fade-in-up"
        >
          {tab === "candidat" && <CandidatInfo dossier={dossier} />}
          {tab === "bourse" && <BourseInfo dossier={dossier} />}
          {tab === "pieces" && <PiecesJointes dossier={dossier} />}
        </div>
      </div>

      {/* AJOUTEZ CECI DANS VOTRE FICHIER CSS GLOBAL (globals.css) */}
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
  )
}
