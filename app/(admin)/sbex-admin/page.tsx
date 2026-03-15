"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { X, Eye, EyeOff, LogIn, Lock, ShieldCheck, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const { login, user } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirection automatique si déjà connecté comme Admin/Gestionnaire
  useEffect(() => {
    setMounted(true);
    if (user && pathname === "/sbex-admin") {
      router.replace("/sbex-admin/tableau-de-bord");
    }
  }, [user, mounted, router, pathname]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("authentification_email") as string;
    const password = formData.get("authentification_password") as string;

    try {
      const response = await fetch('/api/authentification/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
          // Utilise la fonction login du contexte pour stocker l'ID et l'Email
          login(data.id, data.email); 
          router.push("/sbex-admin/tableau-de-bord");
      } else {
          setError(data.error || "Identifiants invalides");
      }
    } catch (err) {
        setError("Le serveur d'authentification est injoignable.");
    } finally {
        setLoading(false);
    }
  };

  if (!mounted || user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={40} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen top-50 bg-emerald-900/20 flex flex-col items-center justify-center p-4 gap-4">
      <div className="bg-white rounded-[2.5rem] shadow-md w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        
        {/* Header Style Admin */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex p-4 bg-theme-green/10 rounded-2xl mb-4">
            <Lock className="text-theme-green" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-(--color-theme-green) tracking-tight">Espace administration</h1>
          <p className="text-slate-500 text-sm mt-2">Service des Bourses Extérieures</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold animate-shake flex items-center gap-3">
                <AlertCircle size={18} className="shrink-0" />
                <span className="leading-tight">{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-slate-500 ml-1">Adresse email</label>
            <input 
              type="email" 
              name="authentification_email" 
              required
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-(--color-theme-green) outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-slate-500 ml-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="authentification_password"
                required
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-(--color-theme-green) outline-none"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-3 bg-(--color-theme-green) text-white py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authentification en cours...
              </span>
            ) : (
              <>
                Se connecter
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[12px] text-slate-600 font-medium tracking-wider">
                &copy; 2026 MESUPRES - Service des Bourses Extérieures
            </p>
        </div>
      </div>

      <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-(--color-theme-green) transition-colors text-sm font-medium py-3 px-6 rounded-lg border border-white hover:border-(--color-theme-green)">
        <ArrowLeft size={18} />
        Retour au site
      </Link>
    </div>
  );
}
