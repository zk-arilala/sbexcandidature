// app/suivi-candidature/[numeroDossier]/page.tsx
import { notFound } from "next/navigation"
import { getCandidatureByNumero } from "../actions"
import Tabs from "./components/Tabs"
import { Calendar, FileText, CheckCircle2, Clock, AlertCircle, Lock, ArrowRight, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import ResultContent from "./components/ResultContent";
import { SessionProvider } from "@/context/SessionContext";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ numeroDossier: string }>
}) {
  const { numeroDossier } = await params 
  const dossier_candidat = await getCandidatureByNumero(numeroDossier)
  const isLogged = false

  if (!dossier_candidat) notFound()

  const isExpired = (dossier_candidat.statut_demande as string) === "Expirée" || (dossier_candidat.date_expiration !== null && new Date(dossier_candidat.date_expiration) < new Date());

  return (
    <SessionProvider>
      <ResultContent dossier_candidat={dossier_candidat} isExpired={isExpired} />
    </SessionProvider>
  )
}
