"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const INACTIVITY_LIMIT = 10 * 60 * 60 * 1000; //millisecondes
const EVENTS = ["mousedown", "keydown", "scroll", "touchstart"];

export type User = { 
  id: string | number; 
  email: string; 
};
type SessionContextType = {
  user: User | null;
  loading: boolean; 
  login: (id: string | number, email: string) => void;
  logout: () => void;
  loginInForm: (id: string | number, email: string) => void;
  logoutInForm?: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user_session");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const logoutInForm = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user_session");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // Reset du timer session
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (user) {
      const newExpiresAt = Date.now() + INACTIVITY_LIMIT;
      const updatedUser = { ...user, expiresAt: newExpiresAt };
      localStorage.setItem("user_session", JSON.stringify(updatedUser));
      
      timeoutRef.current = setTimeout(() => {
        console.warn("Session expirée pour inactivité");
        logout();
      }, INACTIVITY_LIMIT);
    }
  }, [user, logout]);

  // Charger la session au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem("user_session");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (Date.now() > parsedUser.expiresAt) {
        logout(); //deconnexion si delais d'inactivité dépassé
      } else {
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    resetTimer();
    const handleActivity = () => resetTimer();
    EVENTS.forEach(event => window.addEventListener(event, handleActivity));
    return () => {
      EVENTS.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user, resetTimer]);

  const login = (id: string | number, email: string) => {
    const expiresAt = Date.now() + INACTIVITY_LIMIT;
    const newUser = { id, email, expiresAt };
    setUser(newUser);
    localStorage.setItem("user_session", JSON.stringify(newUser));
    //window.location.reload(); 
  };

  const loginInForm = (id: string | number, email: string) => {
    const expiresAt = Date.now() + INACTIVITY_LIMIT;
    const newUser = { id, email, expiresAt };
    setUser(newUser);
    localStorage.setItem("user_session", JSON.stringify(newUser));
  };

  return (
    <SessionContext.Provider value={{ user, loading, login, logout, loginInForm, logoutInForm }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
};
