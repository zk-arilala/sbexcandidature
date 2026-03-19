"use server"

import { prisma } from "@/lib/prisma"
import {
  candidaturePostUniversitaireSchema,
  CandidaturePostUniversitaireInput,
} from "./schema"
import { DateTime } from 'luxon';
import bcrypt from "bcryptjs"
import fs from 'fs/promises'
import path from "path"

const zone = 'Indian/Antananarivo';

export async function creerCandidaturePostUniversitaire(
  data: CandidaturePostUniversitaireInput & {
    pieces_jointes: Array<{
      type_piece: string;
      nom_fichier: string;
    }>;
    utilisateur: {
      id?: string | number
      email: string
      password?: string
      nom?: string
      prenom?: string
    } | null;
    annonce_bourse_id?: number | null;
  }
) {
  const parsed = candidaturePostUniversitaireSchema.safeParse(data)

  if (!parsed.success) {
    console.error("Validation échouée:", parsed.error.format());
    console.error("Données reçues:", data);
    return { success: false, message: "Validation échouée", errors: parsed.error.flatten() };
  }

  try {
    let currentNumeroDossier: string | null = null;
    const baseDir = path.join(process.cwd(), "public/pieces_jointes");

    await prisma.$transaction(async (tx) => {
      //const today = new Date();
      const todayMdg = DateTime.now().setZone(zone);
      //const todayMdg = DateTime.now();
      //const today = todayMdg.toISO();   //OK
      const today = todayMdg.toJSDate();
      
      //const dateExpiration = new Date();
      //dateExpiration.setFullYear(today.getFullYear() + 2); // +2 ans de la date de depot
      const dateExpirationMdg = todayMdg.plus({ years: 2 });
      //const dateExpiration = dateExpirationMdg.toISO();   //OK
      const dateExpiration = dateExpirationMdg.toJSDate();

      const formatPhone = (phone: string) => {
        if (!phone) return phone;
        // Remplace le premier '0' par '+261'
        return phone.trim().replace(/^0/, '+261');
      };

      const regionData = await tx.region.findUnique({
        where: { id: data.logement_region_id },
        select: { province_id: true }
      });
      if (!regionData) {
        throw new Error("La région sélectionnée n'existe pas.");
      }

      // 0 UTILISATEUR
      let currentUserId: number
      if (data.utilisateur && data.utilisateur.password) {
        const currentUserEmail = data.utilisateur.email.trim().toLowerCase();
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await tx.utilisateur.findFirst({
          where: {
            OR: [
              { user_email: currentUserEmail },
              { identifiant: currentUserEmail }
            ]
          },
        });

        if (existingUser) {
          throw new Error(`L'email ou l'identifiant ${currentUserEmail} est déjà utilisé. Si c'est vous, merci de vous connecter pour finaliser votre demande de candidature.`)
        }

        const hashedPassword = await bcrypt.hash(
          data.utilisateur.password!,
          10
        )

        try {
          console.log("Données UTILISATEUR envoyées à Prisma:", {
            nom: data.utilisateur.nom,
            prenom: data.utilisateur.prenom,
            user_email: currentUserEmail,
            identifiant: currentUserEmail,
            mot_de_passe: hashedPassword,
            est_actif: true,
            date_creation: today,
            role_id: 4,
          })
          const utilisateur = await tx.utilisateur.create({
            data: {
              nom: data.utilisateur.nom || "",
              prenom: data.utilisateur.prenom || "",
              user_email: currentUserEmail,
              identifiant: currentUserEmail,
              mot_de_passe: hashedPassword,
              est_actif: true,
              date_creation: today,
              role_id: 4, // rôle "CANDIDAT"
            },
          })
          currentUserId = utilisateur.id
        } catch (error: any) {
          console.error("Erreur détaillée Prisma:", error);
          if (error.code === 'P2002') {
            throw new Error(`Contrainte unique violée sur le champ : ${error.meta?.target}`);
          }
          throw error;
        }
      } else if (data.utilisateur && data.utilisateur.id) {
        // si utilisateur connecté
        currentUserId = Number(data.utilisateur.id);
      } else {
        throw new Error("Informations utilisateur manquantes. Merci de vous connecter ou de créer un compte.");
      }

      // 1 CANDIDAT
      console.log("Données CANDIDAT envoyées à Prisma:", {
        utilisateur_id: currentUserId,
        region_origine: data.region_origine,
        nom: data.nom,
        prenom: data.prenom,
        sexe: data.sexe,
        date_naissance: new Date(data.date_naissance as string),
        lieu_naissance: data.lieu_naissance,
        age: data.age,
        nationalite: data.nationalite,
        situation_familiale: data.situation_familiale,
        conjoint_employeur_nom: data.conjoint_employeur_nom,
        conjoint_employeur_adresse: data.conjoint_employeur_adresse,
        logement_adresse: data.logement_adresse,
        logement_region_id: data.logement_region_id,
        logement_province_id: regionData.province_id,
        email: data.email,
        telephone: formatPhone(data.telephone),
        urgence_nom: data.urgence_nom,
        urgence_adresse: data.urgence_adresse,
        urgence_telephone: formatPhone(data.urgence_telephone),
        nombre_enfants: data.nombre_enfants,
        nombre_enfants_acharge: data.nombre_enfants_acharge,
        dernier_diplome_id: data.dernier_diplome_id,
        dernier_diplome_annee: data.dernier_diplome_annee,
      });
      const candidat = await tx.candidat.create({
        data: {
          utilisateur_id: currentUserId, // id utilisateur connecté
          region_origine: data.region_origine,
          nom: data.nom,
          prenom: data.prenom,
          sexe: data.sexe,
          date_naissance: new Date(data.date_naissance as string),
          lieu_naissance: data.lieu_naissance,
          age: data.age,
          nationalite: data.nationalite,
          situation_familiale: data.situation_familiale,
          conjoint_employeur_nom: data.conjoint_employeur_nom,
          conjoint_employeur_adresse: data.conjoint_employeur_adresse,
          logement_adresse: data.logement_adresse,
          logement_region_id: data.logement_region_id,
          logement_province_id: regionData.province_id,
          email: data.email,
          telephone: formatPhone(data.telephone),
          urgence_nom: data.urgence_nom,
          urgence_adresse: data.urgence_adresse,
          urgence_telephone: formatPhone(data.urgence_telephone),
          nombre_enfants: data.nombre_enfants,
          nombre_enfants_acharge: data.nombre_enfants_acharge,
          dernier_diplome_id: data.dernier_diplome_id,
          dernier_diplome_annee: data.dernier_diplome_annee,
        },
      })

      // 2 INFOS BAC
      console.log("Données INFOS BAC envoyées à Prisma:", {
          candidat_id: candidat.id,
          type: data.type_bac,
          serie: data.serie_bac,
          mention_obtenu: data.mention_bac,
          annee_obtention: data.annee_obtention,
          numero_inscription: data.numero_inscription,
          bacc_province_id: data.bacc_province_id,
      });
      await tx.infosBaccalaureat.create({
        data: {
          candidat_id: candidat.id,
          type: data.type_bac,
          serie: data.serie_bac,
          mention_obtenu: data.mention_bac,
          annee_obtention: data.annee_obtention,
          numero_inscription: data.numero_inscription,
          bacc_province_id: data.bacc_province_id,
        },
      })

      // 3 DEMANDE BOURSE
      console.log("Données DEMANDE BOURSE envoyées à Prisma:", {
        numero_dossier: data.numero_dossier,
        candidat_id: candidat.id,
        type_bourse_id: data.type_bourse_id,
        
        specialites: data.specialites,
        pays_demandes: data.pays_demandes,

        organisme_sollicite: data.organisme_sollicite,
        organisme_detail_contact: data.organisme_detail_contact,
        //organisme_lettre_accueil: data.organisme_lettre_accueil,
        
        autre_depot_externe: data.autre_depot_externe,
        autresdepot_nature_bourse: data.autresdepot_nature_bourse,
        autresdepot_specialite: data.autresdepot_specialite,
        autresdepot_organisme_sollicite: data.autresdepot_organisme_sollicite,
        autresdepot_date_depart: data.autresdepot_date_depart ? new Date(data.autresdepot_date_depart as string) : null,
        
        statut_demande: "valide",
        statut_dossier: "soumis",
        date_depot: today,
        date_expiration: dateExpiration,
      });
      const demande = await tx.demandeBourse.create({
        data: {
          numero_dossier: data.numero_dossier,
          candidat_id: candidat.id,
          type_bourse_id: data.type_bourse_id,

          specialites: data.specialites,
          pays_demandes: data.pays_demandes,

          organisme_sollicite: data.organisme_sollicite,
          organisme_detail_contact: data.organisme_detail_contact,
          //organisme_lettre_accueil: data.organisme_lettre_accueil,
          
          autre_depot_externe: data.autre_depot_externe,
          nombre_depot_externe: data.nombre_depot_externe,
          autresdepot_nature_bourse: data.autresdepot_nature_bourse,
          autresdepot_specialite: data.autresdepot_specialite,
          autresdepot_organisme_sollicite: data.autresdepot_organisme_sollicite,
          autresdepot_date_depart: data.autresdepot_date_depart ? new Date(data.autresdepot_date_depart as string) : null,
          /*depots_externes: {
            create: data.depots_externes.map((depot) => ({
              demande_bourse_id: 0,
              nature_bourse: depot.nature_bourse,
              specialite: depot.specialite,
              organisme_sollicite: depot.organisme_sollicite,
              date_depart: depot.date_depart ? new Date(depot.date_depart) : null,
            })),
          },*/
          /*depots_externes: {
            create: (Array.isArray(data.depots_externes) ? data.depots_externes : []).map((depot) => ({
              nature_bourse: depot.nature_bourse,
              specialite: depot.specialite,
              organisme_sollicite: depot.organisme_sollicite,
              date_depart: depot.date_depart ? new Date(depot.date_depart) : null,
            })),
          },*/
          
          statut_demande: "valide",
          statut_dossier: "soumis",
          date_depot: today,
          date_expiration: dateExpiration,
          
          /*annonce_bourse_externe_id: data.annonce_bourse_id,*/
          annonce_bourse_externe_id: (data.annonce_bourse_id && Number(data.annonce_bourse_id) > 0) 
          ? Number(data.annonce_bourse_id) 
          : null,
        },
      });
      const currentYear = new Date().getFullYear();
      const currentDemande_id = String(demande.id).padStart(4, "0");
      currentNumeroDossier = `BPU-${currentYear}-${currentDemande_id}`;
      const demandeUpdated = await tx.demandeBourse.update({
        where: { id: demande.id },
        data: { numero_dossier: currentNumeroDossier },
      });
      const demandeNumeroDossier = demandeUpdated.numero_dossier;
      
      // Enregistrer les autres dépôts avec l'ID de demandeBourse
      if (data.depots_externes && data.depots_externes.length > 0) {
        await tx.depotExterne.createMany({
          data: data.depots_externes.map((depot) => ({
            demande_bourse_id: demande.id,
            nature_bourse: depot.nature_bourse,
            specialite: depot.specialite,
            organisme_sollicite: depot.organisme_sollicite,
            date_depart: depot.date_depart ? new Date(depot.date_depart) : null,
          })),
        });
      }

      // 4 PIECES JOINTES (avec chemins de fichiers)
      const tempNumeroDossier = "BPU_TEMP_0000";
      if (data.pieces_jointes && data.pieces_jointes.length > 0) {
        await tx.piecesJointes.createMany({
          data: data.pieces_jointes.map((piece: { type_piece: any; nom_fichier: any; }) => ({
            demande_bourse_id: demande.id,
            type_piece: piece.type_piece,
            nom_fichier: piece.nom_fichier.replace(tempNumeroDossier, demandeNumeroDossier),
          })),
        })
      }

      const tempDirPath = path.join(baseDir, tempNumeroDossier);
      const trueDirPath = path.join(baseDir, demandeNumeroDossier);
      try {
        await fs.access(tempDirPath);
        const files = await fs.readdir(tempDirPath);
        for (const fileName of files) {
            if (fileName.includes(tempNumeroDossier)) {
                const oldFilePath = path.join(tempDirPath, fileName);
                const newFileName = fileName.replace(tempNumeroDossier, demandeNumeroDossier);
                const newFilePath = path.join(tempDirPath, newFileName);
                await fs.rename(oldFilePath, newFilePath);
            }
        }
        await fs.rename(tempDirPath, trueDirPath);
        console.log(`Fichiers et dossier renommés avec succès : ${demandeNumeroDossier}`);
      } catch (err) {
        console.error("Erreur lors du renommage physique des fichiers / dossier de la demande :", err);
      }

    });

    return { 
      success: true, 
      currentNumeroDossier: currentNumeroDossier
    }
  } catch (error) {
    console.error('Erreur création candidature:', error)
    return { success: false, message: (error as Error).message }
  }
}
