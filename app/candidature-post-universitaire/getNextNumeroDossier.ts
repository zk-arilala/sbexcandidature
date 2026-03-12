"use server"

import { prisma } from "@/lib/prisma"

export async function getNextNumeroDossier() {
  const currentYear = new Date().getFullYear()

  /*const lastDemande = await prisma.demandeBourse.findFirst({
    orderBy: { id: "desc" },
    select: { id: true },
  })
  const nextId = lastDemande ? lastDemande.id + 1 : 1
  const sequence = String(nextId).padStart(4, "0")*/

  // Récupère et incrémente l'ID atomiquement dans PostgreSQL
  /*const resq = await prisma.$queryRaw<any[]>`SELECT last_value from "DemandeBourse_id_seq"`
  const lastValue = resq[0]?.last_value ?? 0
  const nextId = Number(lastValue) + 1
  const sequence = String(nextId).padStart(4, "0")*/

  const resq = await prisma.$queryRaw<any[]>`SELECT nextval(' "DemandeBourse_id_seq" ') as next_id`
  const nextId = Number(resq[0]?.next_id)
  const sequence = String(nextId).padStart(4, "0")

  return `BPU-${currentYear}-${sequence}`
}
