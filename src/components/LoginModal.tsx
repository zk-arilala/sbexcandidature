"use client";

import { useState } from "react";
import { X, Eye, EyeOff, LogIn, LockKeyhole } from "lucide-react";
import { useSession } from "@/context/SessionContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formLoginData = new FormData(e.currentTarget);
    const email = formLoginData.get("authentification_email") as string;
    const password = formLoginData.get("authentification_password") as string;

    try {
      const response = await fetch('/api/authentification/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
          login(data.id, data.email); 
          onClose();
      } else {
          alert(data.error || "Erreur de connexion");
      }
    } catch (error) {
        alert("Le serveur est injoignable.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-(--color-theme-green)">Connectez-vous à votre compte</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Adresse email</label>
            <input type="email" name="authentification_email" required className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-(--color-theme-green) outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="authentification_password"
                required
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-(--color-theme-green) outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-(--color-theme-green) text-white py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition">
            {loading ? "Connexion..." : "Se connecter"}
            <LogIn className="w-5 h-5"/>
          </button>
        </form>
      </div>
    </div>
  );
}
