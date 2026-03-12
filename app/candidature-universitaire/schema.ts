import { z } from "zod"

export const candidatureUniversitaireSchema = z.object({
  // ---- CANDIDAT ----
  region_origine: z.coerce.number(),
  nom: z.string(),
  prenom: z.string(),
  sexe: z.enum(["Masculin", "Feminin"]),
  date_naissance: z.string(),
  lieu_naissance: z.string(),
  age: z.coerce.number(),
  nationalite: z.string(),

  situation_familiale: z.enum([
    "celibataire",
    "marie",
    "divorce",
    "veuf",
  ]),

  logement_adresse: z.string(),
  logement_region_id: z.coerce.number(),

  email: z.string(),
  telephone: z.string(),

  pere_nom: z.string(),
  pere_profession: z.string(),

  mere_nom: z.string(),
  mere_profession: z.string(),

  tuteur_nom: z.string(),
  tuteur_profession: z.string(),

  urgence_nom: z.string(),
  urgence_adresse: z.string(),
  urgence_telephone: z.string(),

  nombre_frere_soeur: z.coerce.number(),
  noms_frere_soeur: z.string(),

  // ---- BAC ----
  type_bac: z.enum(["General", "Technique"]),
  serie_bac: z.enum(["A1", "A2", "C", "D", "L", "S", "OSE", "Technique"]),
  mention_bac: z.enum([
    "tres_bien",
    "bien",
    "assez_bien",
    "passable",
  ]),
  annee_obtention: z.coerce.number(),
  numero_inscription: z.string(),
  bacc_province_id: z.coerce.number(),

  // ---- DEMANDE ----
  numero_dossier: z.string(),
  type_bourse_id: z.coerce.number(),
  specialites: z.string(),
  pays_demandes: z.string(),

  // ---- PIECES ----
  pieces_jointes: z
    .array(
      z.object({
        type_piece: z.string(),
        nom_fichier: z.string(),
      })
    )
    .min(1),
})

export type CandidatureUniversitaireInput =
  z.infer<typeof candidatureUniversitaireSchema>
