"use client";

import { useSession } from "@/context/SessionContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import * as actions from '@app/actions';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: sessionLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (pathname === "/sbex-admin") {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      // Si la session est encore en cours de chargement, on attend
      if (sessionLoading) {
        return;
      }

      // Session chargée mais utilisateur non connecté → redirection
      if (!user) {
        //setLoading(false); 
        router.replace("/sbex-admin");
        return;
      }

      try {
        const data = await actions.getFullUserSession(user.id);
        const isAdmin = data?.role_id === 1 || data?.role_id === 2 || data?.role_id === 3;

        if (!isAdmin) {
          router.replace("/");
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Erreur Guard:", error);
        router.replace("/sbex-admin");
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [user, sessionLoading, pathname, router]);

  if (loading || sessionLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-(--color-theme-green)" size={40} />
      </div>
    );
  }

  if (authorized || pathname === "/sbex-admin") {
    return <>{children}</>;
  }

  return null;
}
