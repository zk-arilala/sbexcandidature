"use client";
import { useSession } from "@/context/SessionContext";
import { ReactNode } from "react";

interface SessionListenerProps {
  children: (user: any) => ReactNode;
}

export default function SessionListener({ children }: SessionListenerProps) {
  const { user, login, logout } = useSession();
  return <>{children(user)}</>;
}
