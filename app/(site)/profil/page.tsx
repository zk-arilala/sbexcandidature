"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import * as actions from "@app/actions";
import { 
  User, Mail, ShieldCheck, Calendar, 
  Fingerprint, KeyRound, Loader2, BadgeCheck,
  ToggleLeft, ToggleRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilPage() {
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        setLoading(true);
        // Utilise getFullUserSession qui doit inclure { role: true }
        const data = await actions.getFullUserSession(user.id);
        setProfile(data);
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-(--color-theme-green)" size={40} />
      </div>
    );
  }

  return (
    <section className="bg-white py-14 md:py-5">
      <div className="wrapper">
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
          
          {/* HEADER BANNER */}
          <div className="relative h-48 bg-linear-to-r from-slate-800 to-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-20" />
            <div className="absolute -bottom-12 left-10 flex items-end gap-6">
              <div className="h-32 w-32 rounded-2xl bg-white p-1 shadow-2xl">
                <div className="h-full w-full rounded-[1.8rem] bg-green-900/20 flex items-center justify-center text-(--color-theme-green)">
                  <User size={60} strokeWidth={1.5} />
                </div>
              </div>
              <div className="pb-16">
                <h1 className="text-3xl font-black text-white tracking-wide">
                  <span className="uppercase">{profile?.nom}</span> {profile?.prenom}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-4 py-1 bg-(--color-theme-green) backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white tracking-widest border border-(--color-theme-green)">
                    {profile?.role?.libelle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
            
            {/* COLONNE INFOS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <BadgeCheck className="text-(--color-theme-green)" size={18} />
                    Détails du compte utilisateur
                  </h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                  <InfoItem icon={Fingerprint} label="Identifiant Système" value={profile?.identifiant} />
                  <InfoItem icon={Mail} label="Email de connexion" value={profile?.user_email} />
                  <InfoItem icon={Calendar} label="Date de création" value={new Date(profile?.date_creation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })} />
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl">
                      {profile?.est_actif ? <ToggleRight className="text-(--color-theme-green)" size={18} /> : <ToggleLeft className="text-slate-300" size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 tracking-wide mb-1">Statut du compte</p>
                      <p className={cn("text-sm font-bold", profile?.est_actif ? "text-(--color-theme-green)" : "text-red-500")}>
                        {profile?.est_actif ? "Compte activé" : "Compte désactivé"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MOT DE PASSE */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl">
                    <KeyRound size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Sécurité du compte</p>
                    <p className="text-xs text-slate-400">Le mot de passe est chiffré pour votre sécurité</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-(--color-theme-green) text-white rounded-xl text-sm font-medium hover:bg-(--color-theme-yellow) hover:text-slate-900  transition-all">
                  Modifier le mot de passe
                </button>
              </div>
            </div>

            {/* COLONNE DROITE : ROLE DESCRIPTION */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="inline-flex p-4 bg-emerald-50 text-(--color-theme-green) rounded-3xl mb-4">
                    <ShieldCheck size={32} />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight">Rôle {profile?.role?.libelle}</h4>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Votre compte dispose des privilèges <strong>{profile?.role?.libelle}</strong> dans tout la platforme de gestion des bourses extérieurs.
                </p>
              </div>
              
              {profile?.date_inactivation && (
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Note de maintenance</p>
                  <p className="text-xs text-rose-700 font-medium italic">
                    Ce compte a été désactivé le {new Date(profile.date_inactivation).toLocaleDateString()}.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 tracking-wide mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800 break-all">{value || "---"}</p>
      </div>
    </div>
  );
}
