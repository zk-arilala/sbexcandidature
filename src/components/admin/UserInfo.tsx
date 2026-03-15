"use client";

import { useSession } from "@/context/SessionContext";
import { User as UserIcon, LogOut, FileText, ChevronDown, Globe2, Globe } from "lucide-react";
import Link from "next/link";
import { getFullUserSession } from "@app/actions";
import { useEffect, useState } from "react";

export default function UserInfo() {
  const { user, logout } = useSession();
  const [adminSessionInfo, setAdminSessionInfo] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      getFullUserSession(user.id).then(setAdminSessionInfo);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="group relative">
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-2 pr-4 py-1.5 rounded-full hover:shadow-md transition-all cursor-pointer">
        <div className="h-9 w-9 rounded-full bg-(--color-theme-green) flex items-center justify-center text-white shadow-inner">
          <UserIcon size={18} strokeWidth={2.5} />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {user.email}
          </span>
          <span className="text-[11px] font-normal tracking-widest text-slate-500 leading-none mb-1">{adminSessionInfo?.role.libelle}</span>
        </div>
        <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform" />
      </div>

      {/* Menu au survol */}
      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
        <div className="px-3 py-3 border-b border-slate-50 mb-1 text-center">
          <p className="text-xs font-semibold text-(--color-theme-green) leading-none truncate text-center mb-4">
            <span className='uppercase'>{adminSessionInfo?.nom}</span> {adminSessionInfo?.prenom}
          </p>
          <p className="text-xs text-(--color-theme-green) font-medium">
            {user.email}
          </p>
          <p className="text-xs font-medium text-slate-500">
            {adminSessionInfo?.role?.libelle}
          </p>
        </div>
        
        <Link 
            href="/sbex-admin/profil"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-green-800/10 dark:hover:bg-slate-700/50 rounded-xl transition-colors group/item"
        >
            <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover/item:bg-(--color-theme-green) group-hover/item:text-white transition-colors">
            <UserIcon size={14} />
            </div>
            Mon profil
        </Link>

        <Link 
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-green-800/10 dark:hover:bg-slate-700/50 rounded-xl transition-colors group/item"
        >
            <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover/item:bg-(--color-theme-green) group-hover/item:text-white transition-colors">
            <Globe size={14} />
            </div>
            Accéder au site
        </Link>
        
        <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group/logout"
            >
            <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover/logout:bg-red-500 group-hover/logout:text-white transition-colors">
                <LogOut size={14} />
            </div>
            Se déconnecter
        </button>
      </div>
    </div>
  );
}
