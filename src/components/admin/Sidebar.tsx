"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, Users, FileText, Settings, 
  ChevronDown, LogOut, ShieldCheck, X, Briefcase, 
  GraduationCap,
  ContactRound,
  UserRoundCheck,
  UserLock,
  UserLockIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "@/context/AdminSidebarContext";
import { useSession } from "@/context/SessionContext";
import * as actions from "@app/actions";

const NAV_DATA = [
  {
    label: "Principal",
    items: [
      { title: "Tableau de bord", icon: LayoutDashboard, url: "/sbex-admin/tableau-de-bord" },
    ]
  },
  {
    label: "Gestion",
    items: [
      { title: "Demandes de bourses", icon: FileText, url: "/sbex-admin/demandes" },
      { title: "Offres de Bourses", icon: GraduationCap, url: "/sbex-admin/offres" },
      { title: "Utilisateurs", icon: UserLockIcon, url: "/sbex-admin/utilisateurs" },
    ]
  },
  {
    label: "Système",
    items: [
      { title: "Paramètres", icon: Settings, url: "/sbex-admin/parametres" },
    ]
  }
];

export default function Sidebar() {
  const { user, logout } = useSession();
  const { isOpen, setIsOpen, isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const [userSessionInfo, setUserSessionInfo] = useState<any>(null);
  useEffect(() => {
    async function load() {
      if (user?.id) {
        const data = await actions.getFullUserSession(user.id);
        setUserSessionInfo(data);
      }
    }
    load();
  }, [user]);
  const isAdmin = userSessionInfo?.role_id === 1 || userSessionInfo?.role_id === 2;

  return (
    <>
      {/* Overlay Mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={toggleSidebar} />
      )}

      <aside
        className={cn(
          "bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-50",
          isMobile ? "fixed inset-y-0 left-0 shadow-2xl" : "sticky top-0 h-screen",
          isOpen ? "w-70" : "w-0 lg:w-20 overflow-hidden"
        )}
      >
        <div className="flex flex-col">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-6 mb-4">
            <Link href="/sbex-admin" className={cn("transition-opacity", !isOpen && "lg:opacity-0")}>
               <Image
                src="/images/brands/sbex-red.svg"
                className=""
                alt="Service des Bourses EXtérieurs | MESUPRES"
                width={180}
                height={30}
                />
            </Link>
            {isMobile && (
              <button onClick={toggleSidebar} className="p-2 text-slate-500"><X size={20}/></button>
            )}
          </div>

          {/* Side Navigation menu */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            {NAV_DATA.map((section) => {
              const filteredItems = section.items.filter((item) => {
                if (item.title === "Utilisateurs" || item.title === "Paramètres") {
                  return isAdmin;
                }
                return true;
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={section.label} className="mb-8">
                  <p className={cn(
                    "mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-all",
                    !isOpen && "lg:text-center lg:tracking-normal"
                  )}>
                    {isOpen ? section.label : "•••"}
                  </p>

                  <nav className="space-y-1.5">
                    {filteredItems.map((item) => (
                      <SidebarItem 
                        key={item.title} 
                        item={item} 
                        active={pathname === item.url} 
                        collapsed={!isOpen && !isMobile}
                      />
                    ))}
                  </nav>
                </div>)
              }
            )}
          </div>
            
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
             <button 
             onClick={logout}
             className="flex items-center gap-3 w-full p-3 text-red-500 font-semibold text-sm hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={20} />
                <span className={cn(!isOpen && "lg:hidden")}>Se déconnecter</span>
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ item, active, collapsed }: any) {
  return (
    <Link
      href={item.url}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all group text-(--color-theme-dark-blue)",
        active 
          ? "bg-(--color-theme-green) text-white shadow-lg shadow-theme-green/20" 
          : " hover:bg-theme-grey/20 dark:hover:bg-slate-900"
      )}
    >
      <item.icon size={20} className={cn("shrink-0", active ? "text-white" : "text-(--color-theme-dark-blue)")} />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </Link>
  );
}
