'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DesktopNav from './desktop-nav';
import MainMobileNav from './main-mobile-nav';
import { usePathname } from 'next/navigation';
import { SessionProvider, useSession } from "@/context/SessionContext";
import LoginModal from "@/components/LoginModal";
import { User as UserIcon, LogOut, Menu as MenuIcon, X as CloseIcon, LogIn, LockKeyhole, LockKeyholeOpen, FileText, LayoutDashboard, ChevronDown } from "lucide-react";
import { getFullUserSession } from '@app/actions';
//import { CloseIcon, MenuIcon } from '@/icons/icons';

export default function Header() {
  const { user, logout } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userSessionInfo, setUserSessionInfo] = useState<any>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        const data = await getFullUserSession(user.id)
        setUserSessionInfo(data)
      }
    }
    loadProfile()
  }, [user?.id])

  const isAdmin = userSessionInfo?.role_id === 1 || userSessionInfo?.role_id === 2 || userSessionInfo?.role_id === 3;

  if (pathname.startsWith('/sbex-admin')) return null;

  return (
    <header className="bg-theme-red border-b border-gray-100 sticky top-0 z-50 py-2 lg:py-4">
      <div className="px-4 sm:px-6 lg:px-7">
        <div className="grid grid-cols-2 items-center lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center">
            <Link href="/" className="flex items-end gap-2">
              <Image
                src="/images/brands/sbex.svg"
                className="block"
                alt="Service des Bourses EXtérieurs | MESUPRES"
                width={180}
                height={30}
              />

            </Link>
          </div>

          <DesktopNav />

          <div className="flex items-center gap-4 justify-self-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              type="button"
              className="order-last shrink-0 inline-flex items-center justify-center p-2 rounded-md text-white  hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {mounted ? (
              user ? (
                /* AFFICHAGE SI CONNECTÉ */
                <div className="hidden lg:flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="group relative flex items-center gap-3 bg-white border border-slate-200 pl-2 pr-4 py-1.5 rounded-full hover:shadow-md transition-all cursor-pointer">
                    
                    {/* Avatar avec indicateur en ligne */}
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-(--color-theme-green) flex items-center justify-center text-white shadow-inner">
                        <UserIcon size={18} strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Infos Utilisateur */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">
                          {user.email}
                        </span>
                        <span className="text-[11px] font-normal tracking-widest text-slate-500 leading-none mb-1">
                          {userSessionInfo?.role?.libelle || "Non renseigné"}
                        </span>
                      </div>
                      <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform" />
                    </div>

                    {/* Menu flottant au survol */}
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                      
                      {/* Infos user */}
                      <div className="p-4 mb-2 border border-(--color-theme-green) rounded-xl">
                        <div className="flex flex-col items-center gap-1 ">
                            <p className="text-xs font-normal text-slate-500">Session active :</p>
                            <p className="text-[11px] font-semibold text-(--color-theme-green) leading-none truncate text-center">
                              <span className='uppercase'>{userSessionInfo?.nom}</span><br/> {userSessionInfo?.prenom}
                            </p>
                            <p className="text-xs font-medium text-(--color-theme-green) mt-0.5">
                              {user.email}
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                              {userSessionInfo?.role?.libelle || "Candidat"}
                            </p>
                        </div>
                      </div>
                      
                      {/* Liens de navigation */}
                      <div className="space-y-0.5">
                        <Link 
                          href="/profil"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-green-800/10 rounded-xl transition-colors group/item"
                        >
                          <div className="p-1.5 bg-slate-100 rounded-lg group-hover/item:bg-(--color-theme-green) group-hover/item:text-white transition-colors">
                            <UserIcon size={14} />
                          </div>
                          Mon profil
                        </Link>

                        {isAdmin ? (
                          <Link 
                            href="/sbex-admin"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-green-800/10 rounded-xl transition-colors group/item"
                          >
                            <div className="p-1.5 bg-slate-100 rounded-lg group-hover/item:bg-(--color-theme-green) group-hover/item:text-white transition-colors">
                              <LayoutDashboard size={14} />
                            </div>
                            Espace admin
                          </Link>
                        ) : (
                          <Link 
                            href="/mes-candidatures"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-green-800/10 rounded-xl transition-colors group/item"
                          >
                            <div className="p-1.5 bg-slate-100 rounded-lg group-hover/item:bg-(--color-theme-green) group-hover/item:text-white transition-colors">
                              <FileText size={14} />
                            </div>
                            Mes candidatures
                          </Link>
                        )}
                        
                      </div>

                      <div className="my-1 border-t border-slate-50"></div>

                      {/* Bouton déconnexion */}
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors group/logout"
                      >
                        <div className="p-1.5 bg-red-100 rounded-lg group-hover/logout:bg-red-500 group-hover/logout:text-white transition-colors">
                          <LogOut size={14} />
                        </div>
                        Se déconnecter
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                /* AFFICHAGE SI NON CONNECTÉ */
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="hidden lg:inline-flex gap-3 items-center text-sm font-medium text-white px-6 py-3 rounded-full transition-all bg-(--color-theme-green) hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue)"
                  >
                    <LogIn className="w-5 h-5"/>
                    Se connecter
                  </button>

                  {/*<Link
                    href="/signup"
                    className="inline-flex gap-3 lg:inline-flex items-center text-sm font-medium text-white px-6 py-3 rounded-full transition-all bg-(--color-theme-green) hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue)"
                  >
                    <LogIn className="w-5 h-5"/>
                    S'inscrire
                  </Link>*/}
                </>
              ) 
            ): (
              <></>
            )}
            
          </div>
        </div>
      </div>

      <SessionProvider>
      <MainMobileNav isOpen={mobileMenuOpen} />
      </SessionProvider>
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </header>
  );
}
