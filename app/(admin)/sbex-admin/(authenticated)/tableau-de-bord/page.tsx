"use client";

import { useSession } from "@/context/SessionContext";
//import { getCountBoursesDisponibles, getFullUserSession } from "@app/actions";
import * as actions from "@app/actions";
import { useEffect, useState } from "react";
import { 
  FileText, CheckCircle2, Clock, 
  ArrowUpRight, Loader2, Search, 
  LayoutDashboard, GraduationCap, Globe,
  Layers, Link2, Unlink, AlertTriangle, ChevronRight, Briefcase, History,
  CalendarDays,
  MoveRight,
  User,
  MapPin,
  FileSearch,
  FileXCorner
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import DemandeDetailsModal from "../demandes/components/DemandeDetailsModal";

export default function AdminDashboardPage() {
  const { user } = useSession();
  const [userSessionInfo, setUserSessionInfo] = useState<any>(null);
  const [countBoursesDisponibles, setCountBoursesisponibles] = useState(0);
  const [recentDossiers, setRecentDossiers] = useState<any[] | null>(null); 
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [statsParPays, setStatsParPays] = useState<any[]>([]);
  
  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour ouvrir le modal avec un dossier spécifique
  const handleViewDossier = (dossier: any) => {
    setSelectedDossier(dossier);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    async function loadData() {
      if (user) {
        try {
          const [session, countDispo, allStats, recent, statsPays] = await Promise.all([
            actions.getFullUserSession(user.id),
            actions.getCountBoursesDisponibles(),
            Promise.all([
              actions.getCandidaturesTotales(),
              actions.getCandidaturesRattachees(),
              actions.getCandidaturesLibres(),
              actions.getDossiersValides(),
              actions.getDossiersExpires(),
            ]),
            actions.getRecentCandidatures(5),
            actions.getStatsParPays()
          ]);

          setUserSessionInfo(session);
          setCountBoursesisponibles(countDispo);
          setStats({
            demandes_totales: allStats[0],
            demandes_rattachees: allStats[1],
            demandes_libres: allStats[2],
            dossiers_valides: allStats[3],
            dossiers_expires: allStats[4]
          });
          setRecentDossiers(recent);
          setStatsParPays(statsPays);
          setMounted(true);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [user]);

  // Si pas encore monté ou session en cours de chargement
  if (!mounted && (loading || (user && !userSessionInfo))) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-(--color-theme-green)" size={40} />
      </div>
    );
  }

  const indicateurs = stats ? [
    { label: "Dossiers reçus", ...stats.demandes_totales, icon: Layers, color: "text-slate-600", bg: "bg-slate-100" },
    { label: "Candidatures à une offre", ...stats.demandes_rattachees, icon: Link2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Candidatures libres", ...stats.demandes_libres, icon: Unlink, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Dossiers encore valides", ...stats.dossiers_valides, icon: CheckCircle2, color: "text-(--color-theme-green)", bg: "bg-emerald-50" },
    { label: "Dossiers Expirés", ...stats.dossiers_expires, icon: AlertTriangle, color: "text-red-500", bg: "bg-rose-50" },
  ] : [];
  /*const indicateurs = [
    { 
      label: "Demandes totales reçues", 
      total: 1284, univ: 800, post: 484, 
      icon: Layers, color: "text-slate-600", bg: "bg-slate-100" 
    },
    { 
      label: "Candidatures rattachées à une offre", 
      total: 750, univ: 500, post: 250, 
      icon: Link2, color: "text-blue-600", bg: "bg-blue-50" 
    },
    { 
      label: "Candidatures libres", 
      total: 534, univ: 300, post: 234, 
      icon: Unlink, color: "text-amber-600", bg: "bg-amber-50" 
    },
    { 
      label: "Dossiers encore valides", 
      total: 1100, univ: 700, post: 400, 
      icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" 
    },
    { 
      label: "Dossiers Expirés", 
      total: 184, univ: 100, post: 84, 
      icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" 
    },
  ];*/

  // Déterminer si on doit afficher le contenu autorisé
  const isAdmin = userSessionInfo?.role_id === 1 || userSessionInfo?.role_id === 2;

  return (
    <div className="mx-auto space-y-10 pb-10 animate-in fade-in duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-md mb-4">
            Bienvenue, <span className="font-bold text-slate-700">{userSessionInfo?.prenom || user?.email}</span>
          </p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-(--color-theme-green)" />
            Statistiques des Candidatures : <span className="text-(--color-theme-green)">année {new Date().getFullYear()}</span>
          </h1>
        </div>
        {/*<div className="flex items-center gap-3">
          <button 
            onClick=""
            className="flex items-center gap-3 px-4 py-3 text-slate-600 font-semibold text-sm hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm md:shadow-none"
          >
            <History size={20} className="text-slate-400 group-hover:text-slate-600" />
            <span className="whitespace-nowrap">Historique des statistiques</span>
          </button>
        </div>*/}

      </div>

      {/* --- 1. SECTION INDICATEURS (Grid en 5 colonnes) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {indicateurs.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div>
              <p className={cn(
                "text-sm font-bold uppercase tracking-wider mb-1",
                stat.label === "Dossiers encore valides" ? "text-(--color-theme-green)" : 
                stat.label === "Dossiers Expirés" ? "text-(--color-theme-red)" : 
                "text-slate-900"
              )}>
                {stat.label}
              </p>

              <h3 className="text-3xl font-black text-slate-900 leading-none mb-4">{stat.total}</h3>
              
              <div className="space-y-1 border-t border-slate-50 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500 text-[12px]">Bourses Universitaires :</span>
                  <span className="text-slate-700 text-[14px]">{stat.univ}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500 text-[12px]">Bourses Post-Universitaires :</span>
                  <span className="text-slate-700 text-[14px]">{stat.post}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- 2. SECTION DOSSIERS RÉCENTS --- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-(--color-theme-green)" />
                Demandes de bourses récemment déposées
            </h2>
            <Link href="/sbex-admin/demandes" className="group flex items-center gap-2 text-sm font-semibold text-(--color-theme-green) hover:text-(--color-theme-yellow)">
                Voir toutes les demandes
                <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-200">
            {mounted && (
              // 1. On vérifie si les données sont en cours de chargement (null)
              recentDossiers === null ? (
                <div className="p-20 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-slate-300 mb-4" size={40} />
                  <p className="text-slate-400 text-sm italic">Chargement des dossiers...</p>
                </div>
              ) : 
              // 2. Si chargement fini, on vérifie s'il y a des données
              recentDossiers.length > 0 ? (
                recentDossiers.map((d, i) => {
                  const isRattache = d.annonce_bourse_externe_id !== null;

                  return (
                    <div key={d.id} className="group relative bg-white border-b last:border-0 border-slate-100 hover:bg-slate-50/50 transition-all p-4 sm:p-5 lg:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-(--color-theme-green) group-hover:text-white transition-colors">
                            <GraduationCap size={24} />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                <span className="text-slate-600">Dossier n°</span> {d.numero_dossier}
                              </p>
                              <span className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-md tracking-wider border",
                                isRattache 
                                  ? "bg-blue-50 text-blue-600 border-blue-100" 
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              )}>
                                {isRattache ? 'A repondu à une offre publiée' : 'Demande libre'}
                              </span>
                            </div>

                            <div className="grid flex-wrap grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-x-6 gap-y-1">
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <CalendarDays size={14} className="text-slate-300" />
                                <span className="font-medium">Déposé le :</span>
                                <span className="font-semibold text-slate-700">
                                  {new Date(d.date_depot).toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric', hour: "numeric", minute: "numeric"})}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Layers size={14} className="text-slate-300" />
                                <span className="font-medium">Candidature :</span>
                                <span className="font-semibold text-slate-700">{d.type_bourse?.libelle || "Non spécifié"}</span>
                              </div>
                            </div>

                            <div className="grid flex-wrap grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-x-6 gap-y-1">
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <User size={14} className="text-slate-300" />
                                <span className="font-medium">Par :</span>
                                <span className="font-semibold text-slate-700"><span className="uppercase">{d.candidat.nom}</span> {d.candidat.prenom}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <MapPin size={14} className="text-slate-300" />
                                <span className="font-medium">Région d'origine :</span>
                                <span className="font-semibold text-slate-700">{d.candidat.region.libelle}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end md:justify-end border-slate-100">
                          <button 
                            key={d.id}
                            onClick={() => handleViewDossier(d)}
                            className="mt-4 sm:mt-0 inline-flex gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-(--color-theme-green) hover:text-white transition-all"
                          >
                            Voir détail <ArrowUpRight size={14} />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              ) : (
                // 3. Cas où le chargement est fini ET le tableau est vide
                <div className="p-12 md:p-20 text-center bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200/60 relative overflow-hidden group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-amber-900/30 flex items-center justify-center text-amber-900">
                      <FileXCorner size={40} strokeWidth={1.5} className="animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold text-amber-900 mb-2 tracking-tight">
                      Aucune candidature déposée pour cette année
                    </h3>
                    <p className="text-xs text-amber-700/70 max-w-60 leading-relaxed mx-auto font-medium">
                      Il semble qu'aucune demande de bourses d'études n'ait été déposée pour cette année en cours.
                    </p>
                  </div>
                </div>
              )
            )}

              
          </div>
        </div>

        {/* --- 3. GESTION BOURSES & STATISTIQUES PAR PAYS --- */}
        <div className="space-y-8">
          
          {/* Gestion des annnoce de Bourses */}
          {isAdmin && (
          <div className="p-8 bg-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden group border border-white/5">
              <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-(--color-theme-green)">
                          <GraduationCap  size={30} />
                      </div>
                      
                      {/* INDICATEUR DYNAMIQUE */}
                      <div className="flex items-center gap-2 px-3 py-1 bg-theme-green/10 border border-theme-green/20 rounded-full">
                          <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-sm font-medium text-white tracking-wider">
                              {countBoursesDisponibles || 0} offres en cours
                          </span>
                      </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2 tracking-wide">Gestion des annonces de bourses d'études</h3>
                  <p className="text-xs text-slate-400 mb-8 leading-relaxed font-medium">
                      Publiez de nouvelles offres de bourses d'études extérieurs.
                  </p>

                  <Link 
                      href="/sbex-admin/offres"
                      className="inline-flex w-full justify-center gap-3 bg-(--color-theme-green) text-white uppercase px-8 py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-(--color-theme-yellow) hover:text-slate-900 transition-all shadow-lg shadow-theme-green/10"
                  >
                      Gérer les annonces
                  </Link>
              </div>

              {/* Effet visuel de fond */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-theme-green/10 rounded-full blur-3xl group-hover:bg-theme-green/20 transition-all duration-500"></div>
          </div>
          )}

          {/* Statistiques par Pays */}
          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Globe size={18} className="text-blue-500" />
              <h3 className="font-bold text-md text-slate-900 tracking-tight">
                Pays les plus demandés <span className="font-semibold text-xs text-slate-600">(Année {new Date().getFullYear()})</span>
              </h3>
            </div>
            
            <div className="space-y-5">
              {statsParPays.length > 0 ? (
                statsParPays.map((item, i) => {
                  // Calcul du max pour la barre de progression (optionnel)
                  const maxCandidatures = Math.max(...statsParPays.map(s => s.nombre_demandes)) * 1.5;
                  
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-slate-600">{item.nom_pays}</span>
                        <span className="text-slate-900">{item.nombre_demandes} demandes</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.couleur} rounded-full transition-all duration-1000`} 
                          style={{ width: `${(item.nombre_demandes / maxCandidatures) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 md:p-8 text-center bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200/60 relative overflow-hidden group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-base font-bold text-amber-900 mb-2 tracking-tight">
                      Aucune donnée disponible
                    </h3>
                    <p className="text-xs text-amber-700/70 max-w-60 leading-relaxed mx-auto font-medium">
                      Il semble qu'aucune demande de bourses d'études n'ait été déposée pour cette année en cours.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>

      </div>

      {/* Popup Modal détails d'un demande */}
      <DemandeDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDossier(null);
        }}
        dossier={selectedDossier}
      />
      
    </div>
  );
}
