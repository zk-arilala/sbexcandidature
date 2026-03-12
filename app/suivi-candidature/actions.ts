"use server"

import { prisma } from "@/lib/prisma"

export async function getCandidatureByNumero(numero: string) {
  if (!numero) return null;

  const dossier = await prisma.demandeBourse.findUnique({
    where: { numero_dossier: numero },
    include: {
      pieces_jointes: true,
      type_bourse: true,
      candidat: {
        include: {
          dernier_diplome: true,
          region: {
            include: {
                province: true,
            }
          },
          logement_region: {
            include: {
                province: true,
            }
          },
          province: true,
          utilisateur: true,
        }
      },
      depots_externes: true, 
      annonce_bourse_externe: true,
    },
  })

  if (!dossier) return null
  return dossier
}
