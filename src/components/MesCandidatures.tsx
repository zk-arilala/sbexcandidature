"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { getCandidaturesBySessionUserId } from "@app/actions";
import { GraduationCap, Globe2, Clock, ArrowRight, Loader2, FileText, Search, Plus, Landmark, FilePenLine, Sparkles } from "lucide-react";
import Link from "next/link";
import PostulezModal from "./PostulezModal";

export default function MesCandidatures() {
  const { user } = useSession();
  const router = useRouter();
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      // On attend un court instant pour laisser le temps au localStorage de charger
      const timeout = setTimeout(() => {
        if (!user) router.push("/"); 
      }, 500);
      return () => clearTimeout(timeout);
    }

    async function loadData() {
      if (user?.id) {
        const data = await getCandidaturesBySessionUserId(Number(user.id));
        setDossiers(data);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-theme-green" size={40} /></div>;

  if (dossiers.length === 0) return (
    <>
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
        <div className="bg-white p-4 rounded-3xl shadow-sm mb-6">
            <FileText size={48} className="text-slate-300" />
        </div>
        
        <p className="text-slate-600 font-medium mb-8 max-w-xs">
            Vous n'avez pas encore déposé de candidature pour le moment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
            {/* Bouton 1 : Voir les offres */}
            <Link 
            href="/bourses_disponibles"
            className="inline-flex items-center gap-2 bg-white border border-(--color-theme-green) text-(--color-theme-green) px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:border-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) font-medium transition"
            >
            <Search size={18} />
            Voir les offres
            </Link>

            <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) font-medium transition"
            >
            <Plus size={18} />
            Déposer une candidature
            </button>
        </div>
        </div>

        {/* La modal appelée sans bourseId */}
        <PostulezModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        />
    </>
    );

  return (
    <div className="space-y-6">
      {dossiers.map((d) => {
        const offre = d.annonce_bourse_externe;
        const isExpired = new Date(d.date_expiration) < new Date();
        return (
            <div key={d.id} className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-theme-green/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-theme-green/10 transition-colors"></div>
                
                <div className="p-5 md:p-6 flex flex-col lg:flex-row items-start gap-6 relative z-10">
                    <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-(--color-theme-dark-blue) text-white shadow-lg rotate-0 group-hover:-rotate-6 transition-transform duration-300">
                        <GraduationCap size={28} strokeWidth={1.5} />
                    </div>

                    <div className="flex-1 space-y-2">
                        {/* Infos dossier */}
                        <div className="flex items-center gap-3">
                            <div className=" text-theme-green text-2xl font-bold uppercase tracking-wider">
                                Dossier N° {d.numero_dossier}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-blue-500">
                                    <Globe2 size={14} />
                                </div>
                                <span className="text-sm font-medium text-slate-500">Pays demandés :</span> {d.pays_demandes || " -"}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-(--color-theme-green)">
                                    <Sparkles size={14} />
                                </div>
                                <span className="text-sm font-medium text-slate-500">Spécialités demandées :</span> {d.specialites || " -"}
                            </div>
                        </div>
                    
                        {/* Infos offre postulé */}
                        {offre ? (
                            <>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-(--color-theme-green)">
                                        <GraduationCap size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-(--color-theme-green)">Offre de bourses rattaché à cette candidature :</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-500 px-3 py-3 bg-theme-green/10 text-(--color-theme-green) rounded-xl">
                                {/* Titre de la Bourse */}
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-(--color-theme-dark-blue) dark:text-white leading-tight tracking-tight">
                                        {offre.nom_bourse}
                                    </h4>
                                </div>

                                {/* Grille d'informations avec icônes */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                                    {/* Pays */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-blue-500">
                                            <Globe2 size={14} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-medium text-blue-400 tracking-wider">Pays d'accueil :</span>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                                {offre.pays || "-"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Date Limite */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-rose-500">
                                            <Clock size={14} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-medium text-rose-400 tracking-wider">Date limite de candidature :</span>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                {new Date(offre?.limite_candidature).toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'})}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Programme */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-400">
                                            <Landmark size={14} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-medium text-slate-600 tracking-wider">Organisme / Programme :</span>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                                {offre.organisme || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            </>
                        ) : (
                            /* Cas Candidature Libre */
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-2 rounded-xl bg-amber-100/50 border border-dashed border-amber-400 flex items-center gap-4 text-slate-500">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-amber-800">
                                        <FilePenLine size={14} />
                                    </div>
                                    <p className="text-sm font-medium text-amber-800">Candidature Libre (Aucune offre de bourses rattachée)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Badges Pays & Date */}
                    <div className="flex flex-col gap-4 pt-0 lg:border-l lg:pl-8 border-slate-100 min-w-70">
                        <div className="flex w-full justify-end mt-auto">
                            <Link 
                            href={`/suivi-candidature/${d.numero_dossier}`} 
                            className="group/btn relative inline-flex items-center gap-3 px-6 py-2.5 bg-(--color-theme-dark-blue) text-white rounded-xl text-sm font-semibold tracking-wider transition-all hover:bg-(--color-theme-green) active:scale-95 overflow-hidden"
                            >
                                <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-1">
                                    Voir le détail
                                </span>
                                <ArrowRight 
                                    size={16} 
                                    className="relative z-10 transition-all duration-300 opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-1" 
                                />
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            </Link>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-(--color-theme-dark-blue) rounded-xl text-sm font-bold border border-slate-100">
                                <Clock size={12} /> <span className="text-sm font-medium text-slate-500">Déposé le</span> {new Date(d.date_depot).toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'})}
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors ${
                            isExpired 
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-slate-50 text-(--color-theme-green) border-slate-100"
                            }`}>
                            <Clock size={12} className={isExpired ? "text-red-500" : "text-(--color-theme-green)"} /> 
                            
                            <span className={`text-sm font-medium ${isExpired ? "text-red-600" : "text-(--color-theme-green)"}`}>
                                {isExpired ? "Expiré le" : "Valide jusqu'au"}
                            </span>

                            {new Date(d.date_expiration).toLocaleDateString('fr-FR', {
                                day: '2-digit', 
                                month: 'long', 
                                year: 'numeric'
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
      })}
    </div>
  );
}
