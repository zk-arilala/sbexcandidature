import { z } from "zod"

const DepotExterneSchema = z.object({
  nature_bourse: z.string(),
  specialite: z.string(),
  organisme_sollicite: z.string(),
  date_depart: z.string(),
});

export const candidaturePostUniversitaireSchema = z.object({
  // ---- UTILISATEUR ----
  /*utilisateur_id: z.coerce.number(),
  user_nom: z.string(),
  user_prenom: z.string(),
  user_email: z.string(),
  identifiant: z.string(),
  mot_de_passe: z.string(),
  date_creation: z.string(),*/

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

  conjoint_employeur_nom: z.string(),
  conjoint_employeur_adresse: z.string(),

  logement_adresse: z.string(),
  logement_region_id: z.coerce.number(),

  email: z.string(),
  telephone: z.string(),

  //pere_nom: z.string(),
  //pere_profession: z.string(),

  //mere_nom: z.string(),
  //mere_profession: z.string(),

  //tuteur_nom: z.string(),
  //tuteur_profession: z.string(),

  urgence_nom: z.string(),
  urgence_adresse: z.string(),
  urgence_telephone: z.string(),

  //nombre_frere_soeur: z.coerce.number(),
  nombre_enfants: z.coerce.number(),
  nombre_enfants_acharge: z.coerce.number(),

  dernier_diplome_id: z.coerce.number(),
  dernier_diplome_annee: z.coerce.number(),

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

  organisme_sollicite: z.string(),
  organisme_detail_contact: z.string(),
  //organisme_lettre_accueil: z.object({
  //  type_piece: z.string(),
  //  nom_fichier: z.string(),
  //}).optional().nullable(),

  autre_depot_externe: z.boolean(),
  nombre_depot_externe: z.coerce.number(),
  autresdepot_nature_bourse: z.string(),
  autresdepot_specialite: z.string(),
  autresdepot_organisme_sollicite: z.string(),
  autresdepot_date_depart: z.string(),

  depots_externes: z.array(DepotExterneSchema).default([]),

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

export type CandidaturePostUniversitaireInput =
  z.infer<typeof candidaturePostUniversitaireSchema>
