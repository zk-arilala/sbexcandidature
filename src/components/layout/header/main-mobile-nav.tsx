'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { navItems } from './nav-items';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@/icons/icons';
import { getFullUserSession } from '@app/actions';
import { LogIn, LogOut, UserIcon } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import LoginModal from '@/components/LoginModal';

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MainMobileNav({ isOpen }: MobileMenuProps) {
  const { user, logout } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userSessionInfo, setUserSessionInfo] = useState<any>(null);

  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState('');

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? '' : key);
  };

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        const data = await getFullUserSession(user.id)
        setUserSessionInfo(data)
      }
    }
    loadProfile()
  }, [user?.id])

  if (!isOpen) return null;

  return (
    <>
    <div className="lg:hidden h-screen absolute top-full bg-white w-full border-b border-gray-200">
      <div className="flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
            {navItems.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-(--color-theme-green) hover:text-white ',
                      {
                        'text-gray-800 ': pathname === item.href,
                      }
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              if (item.type === 'dropdown') {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={cn(
                        'flex justify-between items-center w-full px-3 py-2 rounded-md text-sm font-medium' +
                          ' text-gray-500  hover:bg-(--color-theme-green) hover:text-white ',
                        {
                          'text-(--color-theme-green) ': item.items.some(
                            (subItem) => pathname.includes(subItem.href)
                          ),
                        }
                      )}
                    >
                      <span>{item.label}</span>
                      <span
                        className={cn(
                          'size-4 transition-transform duration-200',
                          activeDropdown === item.label && 'rotate-180'
                        )}
                      >
                        <ChevronDownIcon />
                      </span>
                    </button>

                    {activeDropdown === item.label && (
                      <div className="mt-2 space-y-1 pl-4">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              'flex items-center px-3 py-2 gap-1.5 rounded-md text-sm font-medium text-gray-500' +
                                '  hover:bg-gray-100 ',
                              {
                                'px-2': 'icon' in subItem,
                                'bg-(--color-theme-green) text-white ':
                                  pathname.includes(subItem.href),
                              }
                            )}
                          >
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* --- VERSION MOBILE (Dans MainMobileNav) --- */}
        <div className="lg:hidden flex flex-col w-full border-t border-slate-100  mt-4 pt-4">
          {user ? (
            /* UTILISATEUR CONNECTÉ : Encadré Profil */
            <div className="p-4 mx-4 bg-slate-50  rounded-2xl border border-slate-100 ">
              <div className="flex  flex-col items-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-full bg-(--color-theme-green) flex items-center justify-center text-white shadow-md">
                  <UserIcon size={30} />
                </div>
                <div className="flex flex-col items-center min-w-35 gap-1">
                    <span className="text-sm font-medium text-slate-700  truncate max-w-37.5">
                      {user.email}
                    </span>
                    <span className="text-xs font-normal tracking-widest text-slate-400 leading-none mb-1">
                      {userSessionInfo?.role?.libelle || "Candidat"}
                    </span>
                  </div>
              </div>

              <div className="flex flex-col items-center mb-4">
                <p className="text-md text-slate-500 truncate font-medium flex items-center">
                  <span className='uppercase'>{userSessionInfo?.nom}</span> {userSessionInfo?.prenom}
                </p>
              </div>

              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50  text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          ) : (
            /* NON CONNECTÉ : Boutons d'Action */
            <div className="flex flex-col gap-3 px-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center justify-center gap-3 w-full py-4 bg-(--color-theme-green) text-white rounded-2xl font-bold shadow-lg shadow-theme-green/20 active:scale-95 transition-all"
              >
                <LogIn size={20} />
                Se connecter
              </button>
              
            </div>
          )}
        </div>
        
      </div>
    </div>

    <LoginModal 
      isOpen={isLoginOpen} 
      onClose={() => setIsLoginOpen(false)} 
    />
    </>
  );
}
