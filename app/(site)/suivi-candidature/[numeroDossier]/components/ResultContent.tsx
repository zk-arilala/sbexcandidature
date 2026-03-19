"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { getCandidaturesBySessionUserId, getFullUserSession } from "@app/actions";
import { Loader2, Calendar, FileText, Clock, Lock, ArrowRight, AlertTriangle, FileWarning, MessageCircleWarning, UserLock, LockKeyhole, LogIn } from "lucide-react";
import Link from "next/link";
import Tabs from "./Tabs";
import LoginModal from "@/components/LoginModal";

export default function ResultContent({ dossier_candidat, isExpired }: { dossier_candidat: any, isExpired: boolean }) {
  const { user } = useSession();
  const router = useRouter();
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userSessionInfo, setUserSessionInfo] = useState<any>(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    //setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
        setIsUserDataLoaded(true);
        setLoading(false);
        return;
    }

    async function loadData() {
        if (user?.id) {
            const data = await getFullUserSession(user.id)
            setUserSessionInfo(data)
        }
        setIsUserDataLoaded(true);
        setLoading(false);
    }
    loadData();

  }, [user]);

  const isAdmin = userSessionInfo?.role_id === 1 || userSessionInfo?.role_id === 2 || userSessionInfo?.role_id === 3;

  // Déterminer si on doit afficher le contenu autorisé
  const isAuthorized = user && (
    (user.email === dossier_candidat.candidat?.utilisateur?.user_email && dossier_candidat.candidat?.utilisateur?.role_id === 4) || 
    isAdmin
  );
  
  // Déterminer si on doit afficher le message d'erreur de non-autorisation
  const showUnauthorizedMessage = user && 
    isUserDataLoaded &&
    !isAuthorized && 
    !(user.email === dossier_candidat.candidat?.utilisateur?.user_email && dossier_candidat.candidat?.utilisateur?.role_id === 4) && 
    !isAdmin;

  return (
    <div>
        <section className="py-14 md:py-5">
            <div className="wrapper">
                <div className="max-w-6xl mx-auto">

                    <div className="w-full max-w-6xl mx-auto">
                        <div className={`relative overflow-hidden ${isExpired ? "bg-(--color-theme-red)" : "bg-(--color-theme-green)"} rounded-3xl p-8 lg:p-10 shadow-xl`}>
                            <div className="relative flex flex-col md:flex-row items-center gap-6">
                            
                                <div>
                                    <FileText className="w-20 h-20 text-white" />
                                </div>

                                <div className="flex flex-col items-center md:items-start gap-3">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                                        Dossier N° {dossier_candidat.numero_dossier}
                                    </h1>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm">
                                        <Calendar className="w-4 h-4 text-white/70" />
                                        <span>Déposé le {new Date(dossier_candidat.date_depot).toLocaleString("fr-FR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "numeric"
                                        })}
                                        </span>
                                    </div>
                                    {dossier_candidat.date_expiration && (
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-200 text-sm">
                                            {isExpired ? (
                                                <AlertTriangle className="w-4 h-4" />
                                            ) : (
                                                <Clock className="w-4 h-4" />
                                            )}
                                            <span className="font-medium">
                                                {isExpired ? (
                                                    <>Expiré depuis le {new Date(dossier_candidat.date_expiration!).toLocaleDateString("fr-FR", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}</>
                                                ) : (
                                                    <>Valide jusqu'au {new Date(dossier_candidat.date_expiration!).toLocaleDateString("fr-FR", {
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
                    </div>

                    {(loading || !isUserDataLoaded) && user && (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-theme-green" size={40} />
                        </div>
                    )}

                    {/* BANDEAU INCITATIF (Affiché uniquement si NON connecté) */}
                    {mounted && !user && !loading && (
                    <div className="p-12 md:p-12 mt-4 text-center bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200/60 relative overflow-hidden group">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-amber-900/30 flex items-center justify-center text-amber-900">
                            <LockKeyhole size={40} strokeWidth={1.5} className="animate-pulse" />
                            </div>
                            <h3 className="text-base font-bold text-amber-900 mb-2 tracking-tight">
                            Connexion requise pour accéder au dossier complet.
                            </h3>
                            <p className="text-sm text-amber-700/70 max-w-100 leading-relaxed mx-auto font-medium">
                            Pour consulter toutes les informations de ce dossier, Merci de vous connecter à votre compte utilisateur.
                            </p>
                            <button 
                                type="button" 
                                onClick={() => setIsLoginOpen(true)}
                                className="inline-flex gap-3 border bg-(--color-theme-green) text-white mt-2 px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) transition"
                            >
                                Se connecter
                                <LogIn className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                    )}

                </div>
            </div>
        </section>
                    
        {mounted && user && isUserDataLoaded && isAuthorized && (
            <section className="mx-auto md:py-10 py-14 relative mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="wrapper">
                    <div className="max-w-6xl mx-auto">
                        <div className="overflow-hidden">
                            <Tabs dossier={dossier_candidat} user={user} />
                        </div>
                    </div>
                </div>
            </section>
        )}
        
        {mounted && user && isUserDataLoaded && showUnauthorizedMessage && (
            <section className={`py-14 md:py-5 ${!user ? 'hidden' : 'block'}`}>
                <div className="wrapper">
                    <div className="max-w-6xl mx-auto">
                        <div className="p-12 md:p-12 text-center bg-red-50/30 rounded-2xl border-2 border-dashed border-red-200/60 relative overflow-hidden group">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-red-900/30 flex items-center justify-center text-red-900">
                                <LockKeyhole size={40} strokeWidth={1.5} className="animate-pulse" />
                                </div>
                                <h3 className="text-base font-bold text-red-900 mb-2 tracking-tight">
                                Ce dossier ne semble pas lié à votre compte candidat actuel.
                                </h3>
                                <p className="text-sm text-red-700/70 max-w-100 leading-relaxed mx-auto font-medium">
                                Merci de noter que l’accès à ce dossier est limité seulement au compte candidat qui a déposé la candidature.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )}

        <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
        />
    </div>
  );
}
