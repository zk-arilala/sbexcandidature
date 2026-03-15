import Image from 'next/image';
import { CalendarDays, Globe, Clock, ArrowRight, GraduationCap, Send, FilePenLine } from "lucide-react";
import { useState } from 'react';
import PostulezModal from '@/components/PostulezModal';

// On définit l'interface pour correspondre à votre structure JSON/Prisma
interface Bourse {
  id: number;
  nom_bourse: string;
  annonce: string;
  image_representation: string;
  limite_candidature: string[];
  pays: string;
  date_publication: Date | string;
}

export default function BoursesExternesCard({ bourse }: { bourse: Bourse }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dateLimite = bourse.limite_candidature?.[0] || "Non spécifiée";

  return (
    <>
    <div className="p-2 bg-gray-50 dark:bg-white/5 dark:border-gray-800 border rounded-[20px] border-gray-100 hover:border-(--color-theme-green) transition group flex flex-col h-full">
      
      <div className="flex items-center p-3 mb-3 bg-white/90 dark:bg-white/3 rounded-2xl shadow-sm">
        <div className="shrink-0 h-13 w-13 rounded-full bg-theme-green/10 flex items-center justify-center mr-4 border border-theme-green/20">
          <GraduationCap className="text-(--color-theme-green)" size={28} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <h3 className="text-gray-500 font-medium text-[12px] tracking-widest dark:text-gray-400">
            Date limite de candidature :
          </h3>
          <p className="text-base font-bold text-(--color-theme-red) dark:text-white/90 truncate">
            {new Date(dateLimite).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })}
          </p>
        </div>
      </div>
      
      <div className="p-5 rounded-2xl bg-white/90 dark:bg-white/3 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm leading-6 text-gray-700 dark:text-gray-400 font-medium line-clamp-4">
            {bourse.annonce}
          </p>
        </div>

        {/* Section Infos Supplémentaires : Pays et Date de Pub */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-gray-300">
              <Globe size={14} className="text-blue-500" />
              <span>{bourse.pays}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <CalendarDays size={12} />
              <span>Publié le {new Date(bourse.date_publication).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        type="button" 
        onClick={() => setIsModalOpen(true)}
        className="mt-4 inline-flex gap-3 items-center justify-center bg-white border border-(--color-theme-green) text-(--color-theme-green) text-sm font-medium px-8 py-3 rounded-xl hover:bg-(--color-theme-green) hover:text-white group-hover:translate-x-1 transition-all active:scale-95"
      >
        <FilePenLine size={22} />
        Postulez maintenant
        <ArrowRight size={22} className="absolute right-4 opacity-0 translate-x-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"/>
      </button>
    </div>

    <PostulezModal 
      bourseId={bourse.id} 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
    
    </>
  );
}
