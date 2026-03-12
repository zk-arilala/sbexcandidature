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

        const timeout = setTimeout(() => {
            if (!user) router.push("/"); 
        }, 500);
        return () => clearTimeout(timeout);
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
                    <div className="relative overflow-hidden bg-(--color-theme-yellow) rounded-2xl p-1 shadow-md mt-5">
                        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-[calc(1rem-1px)] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 ">
                            <div className="p-4 bg-white/20 rounded-lg">
                                <MessageCircleWarning className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-2">Connexion requise pour accéder au dossier complet.</p>
                                <p className="text-xs">Pour consulter toutes les informations de ce dossier, Merci de vous connecter à votre compte utilisateur.</p>
                            </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setIsLoginOpen(true)}
                                className="inline-flex gap-3 border bg-(--color-theme-green) text-white px-8 py-3 rounded-lg hover:bg-(--color-theme-yellow) transition"
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
                        <div className="relative overflow-hidden bg-amber-100 rounded-2xl p-1 shadow-md">
                            <div className="relative bg-white/10 backdrop-blur-md border border-(--color-theme-yellow) rounded-[calc(1rem-1px)] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3 ">
                                    <div className="p-4 bg-(--color-theme-yellow) rounded-lg">
                                        <MessageCircleWarning className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm mb-2 ">Ce dossier ne semble pas lié à votre compte candidat actuel.</p>
                                        <p className="text-xs">Merci de noter que l’accès à ce dossier est limité au compte candidat ayant effectué la candidature.</p>
                                    </div>
                                </div>
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
