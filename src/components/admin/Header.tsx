"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/AdminSidebarContext";
import { Menu, Search, Bell, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserInfo from "./UserInfo";

export default function AdminHeader() {
  const { toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();

  // Configuration des titres par route
  const getPageInfo = () => {
    if (pathname.includes("/tableau-de-bord")) {
      return { 
        title: "Tableau de bord", 
        desc: "Statistiques générales des demandes de bourses, déposées durant l'année en cours" 
      };
    }
    if (pathname.includes("/demandes")) {
      return { 
        title: "Demandes de bourses", 
        desc: "Liste et suivi des dossiers de candidature aux bourses d’études extérieurs" 
      };
    }
    
    return { 
      title: "Administration SBEX", 
      desc: "Gestion du plateforme de candidature aux bourses d'études extérieurs" 
    };
  };
  const { title, desc } = getPageInfo();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 py-5 md:px-8">
      
      {/* Côté Gauche : Toggle Mobile & Titre */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} className="text-slate-600" />
        </button>

        {isMobile && (
          <Link href="/sbex-admin/dashboard">
            <Image src="/images/brands/sbex.svg" width={100} height={25} alt="Logo" />
          </Link>
        )}

        <div className="hidden  xl:block">
          <h1 className="text-xl font-black text-slate-900 tracking-tight mb-1">
            {title}
          </h1>
          <p className="text-xs font-medium text-slate-500 tracking-widest">
            {desc}
          </p>
        </div>
      </div>

      {/* Côté Droit : Recherche & Profil */}
      <div className="flex flex-1 items-center justify-end gap-3 md:gap-6">
        
        {/* Barre de recherche */}
        <div className="relative w-full max-w-70 block">
          <input
            type="search"
            placeholder="Rechercher un dossier..."
            className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-(--color-theme-green) focus:ring-1 focus:ring-(--color-theme-green)"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        </div>

        {/* Notifications & User */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="h-8 w-px bg-slate-100"></div>

          <UserInfo />
        </div>
      </div>
    </header>
  );
}
