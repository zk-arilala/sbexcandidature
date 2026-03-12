"use server"

import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

//serveur action
export async function getFullUserSession(userId: string | number) {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: Number(userId) },
      include: {
        role: true,
      },
    })

    if (!user) return null

    // On retourne tout sauf le mot de passe
    const { mot_de_passe, ...safeUser } = user
    return safeUser
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return null
  }
}

export async function getRegionsASC() {
  const regions = await prisma.region.findMany({
    orderBy: { libelle: "asc" },
  })
  return regions || null;
}

export async function getProvincesASC() {
  const provinces = await prisma.province.findMany({
    orderBy: { libelle: "asc" },
  })
  return provinces || null;
}

export async function getTypesBourseASC() {
  const typesBourse = await prisma.typeBourse.findMany({
    orderBy: { libelle: "asc" },
  })
  return typesBourse || null;
}

export async function getDiplomesASC() {
  const diplomes = await prisma.diplome.findMany({
    orderBy: { id: "asc" },
  })
  return diplomes || null;
}

export async function getPaysBourseById(id: number) {
  const bourse = await prisma.bourseExterne.findUnique({
    where: { id: Number(id) },
    select: { id: true, pays: true }
  });
  return bourse || null;
}

export async function getInfosBourseById(id: number) {
  const bourse = await prisma.bourseExterne.findUnique({
    where: { id: Number(id) }
  });
  return bourse || null;
}

export async function getCandidaturesBySessionUserId(userId: number) {
  return await prisma.demandeBourse.findMany({
    where: {
      candidat: {
        utilisateur_id: userId
      }
    },
    include: {
      annonce_bourse_externe: true,
    },
    orderBy: {
      date_depot: 'desc'
    }
  });
}

export async function getCountBoursesDisponibles() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); //date avec heure début de la journée

  const bourses = await prisma.bourseExterne.findMany({
    where: {
      disponibilite: 1,
    },
    select: {
      disponibilite: true,
      limite_candidature: true,
    }
  });

  const count = bourses.filter(bourse => {
    const estDisponible = bourse.disponibilite === 1;
    
    const estNonExpirée = bourse.limite_candidature.every(dateStr => {
      const dateLimite = new Date(dateStr);
      return dateLimite >= today;
    });

    return estDisponible && estNonExpirée;
  }).length;

  return count;
}

// ADMIN : INDICATEURS

// Helper pour obtenir la plage de dates de l'année en cours
const getYearBounds = () => {
  const year = new Date().getFullYear();
  return {
    start: new Date(year, 0, 1), // 1er Janvier
    end: new Date(year, 11, 31, 23, 59, 59), // 31 Décembre
    today: new Date()
  };
};

// 1. Demandes totales reçues (Année en cours)
export async function getCandidaturesTotales() {
  const bounds = getYearBounds();
  const whereClause = { date_depot: { gte: bounds.start, lte: bounds.end } };
  
  const total = await prisma.demandeBourse.count({ where: whereClause });
  const univ = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 1 } });
  const post = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 2 } });

  return { total, univ, post };
}

// 2. Candidatures rattachées à une offre (annonce_bourse_externe_id != null)
export async function getCandidaturesRattachees() {
  const bounds = getYearBounds();
  const whereClause = { 
    date_depot: { gte: bounds.start, lte: bounds.end },
    annonce_bourse_externe_id: { not: null } 
  };

  const total = await prisma.demandeBourse.count({ where: whereClause });
  const univ = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 1 } });
  const post = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 2 } });

  return { total, univ, post };
}

// 3. Candidatures libres (annonce_bourse_externe_id == null)
export async function getCandidaturesLibres() {
  const bounds = getYearBounds();
  const whereClause = { 
    date_depot: { gte: bounds.start, lte: bounds.end },
    annonce_bourse_externe_id: null 
  };

  const total = await prisma.demandeBourse.count({ where: whereClause });
  const univ = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 1 } });
  const post = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 2 } });

  return { total, univ, post };
}

// 4. Dossiers encore valides (date_expiration >= Today)
export async function getDossiersValides() {
  const bounds = getYearBounds();
  const whereClause = { 
    date_depot: { gte: bounds.start, lte: bounds.end },
    date_expiration: { gte: bounds.today },
  };

  const total = await prisma.demandeBourse.count({ where: whereClause });
  const univ = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 1 } });
  const post = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 2 } });

  return { total, univ, post };
}

// 5. Dossiers Expirés (date_expiration < Today)
export async function getDossiersExpires() {
  const bounds = getYearBounds();
  const whereClause = { 
    date_depot: { gte: bounds.start, lte: bounds.end },
    date_expiration: { lt: bounds.today }
  };

  const total = await prisma.demandeBourse.count({ where: whereClause });
  const univ = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 1 } });
  const post = await prisma.demandeBourse.count({ where: { ...whereClause, type_bourse_id: 2 } });

  return { total, univ, post };
}

export async function getRecentCandidatures(nombreResultat: number) {
  return await prisma.demandeBourse.findMany({
    take: Number(nombreResultat),
    orderBy: {
      date_depot: 'desc'
    },
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
    }
  });
}

export async function getStatsParPays() {
  const currentYear = Number(new Date().getFullYear().toString());

  const demandes = await prisma.demandeBourse.findMany({
    where: {
      numero_dossier: {
        contains: `-${currentYear}-`,
      },
    },
    select: {
      pays_demandes: true,
    },
  });

  const counts: Record<string, number> = {};

  demandes.forEach((d) => {
    if (d.pays_demandes) {
      const listePays = d.pays_demandes
        .split(", ")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      listePays.forEach((pays) => {
        counts[pays] = (counts[pays] || 0) + 1;
      });
    }
  });

  const colors = ["bg-(--color-theme-green)", "bg-(--color-theme-red)", "bg-blue-800",  "bg-fuchsia-800", "bg-emerald-500", "bg-amber-500"];
  
  return Object.entries(counts)
    .map(([pays, count], index) => ({
      nom_pays: pays,
      nombre_demandes: count,
      couleur: colors[index % colors.length],
    }))
    .sort((a, b) => b.nombre_demandes - a.nombre_demandes) // Tri descendant
    .slice(0, 5); // Top 5
}

export async function getFilteredCandidatures_old(params: {
  page?: number;
  search?: string;
  typeBourse?: string;
  categorie?: string;
  region?: string;
  pays?: string;
  specialite?: string;
  status?: string;
  tri?: string;
  order: "asc" | "desc";
}) {
  const pageSize = 10;
  const skip = ((params.page || 1) - 1) * pageSize;
  
  // On définit l'ordre (par défaut 'desc' si non spécifié)
  const sortOrder = params.order || "desc";

  // Configuration dynamique du tri
  let orderBy: any = { date_depot: sortOrder }; // Tri par défaut

  if (params.tri === "nom") {
    orderBy = { candidat: { nom: sortOrder } };
  } else if (params.tri === "numero_dossier") {
    orderBy = { numero_dossier: sortOrder };
  } else if (params.tri === "date_depot") {
    orderBy = { date_depot: sortOrder };
  }

  const where: any = {
    AND: [
      params.search ? {
        OR: [
          { candidat: { nom: { contains: params.search, mode: 'insensitive' } } },
          { candidat: { prenom: { contains: params.search, mode: 'insensitive' } } },
          { numero_dossier: { contains: params.search, mode: 'insensitive' } }
        ]
      } : {},
      params.typeBourse ? { type_bourse: { libelle: params.typeBourse } } : {},
      params.categorie === 'rattache' ? { annonce_bourse_externe_id: { not: null } } : 
      params.categorie === 'libre' ? { annonce_bourse_externe_id: null } : {},
      params.region ? { candidat: { region: { libelle: params.region } } } : {},
      params.pays ? { pays_demandes: { contains: params.pays, mode: 'insensitive' } } : {},
      params.specialite ? { specialites: { contains: params.specialite, mode: 'insensitive' } } : {},
      params.status === 'valide' ? { date_expiration: { gt: new Date() } } :
      params.status === 'expire' ? { date_expiration: { lt: new Date() } } : {},
    ]
  };

  const [total, data] = await Promise.all([
    prisma.demandeBourse.count({ where }),
    prisma.demandeBourse.findMany({
      where,
      include: { 
        candidat: { 
          include: { 
            region: true,
            dernier_diplome: true 
          } 
        }, 
        type_bourse: true,
        annonce_bourse_externe: true
      },
      take: pageSize,
      skip,
      orderBy: orderBy
    })
  ]);

  return {
    data,
    totalPages: Math.ceil(total / pageSize),
    totalCount: total
  };
}

/**
 * Récupère toutes les Demandes de bourses depuis le formulaire de recherche multicritère
 * Triées par nom du candidat, numero de dossier, date de la demande (alphabétique: ascendent ou descendant)
 * Avec pagination
 */
export async function getFilteredCandidatures(params: {
  page?: number;
  search?: string;
  typeBourse?: string;
  modalite?: string; // 'rattache' | 'libre' remplace 'categorie'
  region?: string;
  pays?: string;
  dateDebut?: string;
  dateFin?: string;
  validite?: string; // 'valide' | 'expire' remplace 'status'
  ageMin?: String;
  ageMax?: String;
  diplome?: string;
  offreBourseId?: string;
  tri?: string;
  order: "asc" | "desc";
}) {
  const pageSize = 10;
  const skip = ((params.page || 1) - 1) * pageSize;
  const sortOrder = params.order || "desc";
  const now = new Date();

  // 1. Calcul des dates pour le filtre d'âge
  const dateAgeMin = params.ageMax ? new Date(now.getFullYear() - Number(params.ageMax), now.getMonth(), now.getDate()) : null;
  const dateAgeMax = params.ageMin ? new Date(now.getFullYear() - Number(params.ageMin), now.getMonth(), now.getDate()) : null;

  // 2. Configuration dynamique du tri
  let orderBy: any = { date_depot: sortOrder };
  if (params.tri === "nom") {
    orderBy = { candidat: { nom: sortOrder } };
  } else if (params.tri === "numero_dossier") {
    orderBy = { numero_dossier: sortOrder };
  }

  // 3. Construction du filtre WHERE
  const where: any = {
    AND: [
      // Recherche textuelle libre
      params.search ? {
        OR: [
          { candidat: { nom: { contains: params.search, mode: 'insensitive' } } },
          { candidat: { prenom: { contains: params.search, mode: 'insensitive' } } },
          { numero_dossier: { contains: params.search, mode: 'insensitive' } }
        ]
      } : {},

      // --- FILTRES ONGLET DEMANDES ---
      params.typeBourse ? { type_bourse_id: Number(params.typeBourse) } : {},
      params.modalite === 'rattache' ? { annonce_bourse_externe_id: { not: null } } : 
      params.modalite === 'libre' ? { annonce_bourse_externe_id: null } : {},
      params.pays ? { pays_demandes: { contains: params.pays, mode: 'insensitive' } } : {},
      (params.dateDebut || params.dateFin) ? {
        date_depot: {
          gte: params.dateDebut ? new Date(params.dateDebut) : undefined,
          lte: params.dateFin ? new Date(params.dateFin) : undefined,
        }
      } : {},
      params.validite === 'valide' ? { date_expiration: { gt: now } } :
      params.validite === 'expire' ? { date_expiration: { lt: now } } : {},

      // --- FILTRES ONGLET CANDIDAT ---
      params.region ? { candidat: { region: { libelle: params.region } } } : {},
      (dateAgeMin || dateAgeMax) ? {
        candidat: {
          date_naissance: {
            gte: dateAgeMin || undefined, // Plus vieux
            lte: dateAgeMax || undefined  // Plus jeune
          }
        }
      } : {},
      params.diplome ? { candidat: {  dernier_diplome_id: Number(params.diplome) } } : {},
      params.offreBourseId ? { annonce_bourse_externe_id: parseInt(params.offreBourseId) } : {},
    ]
  };

  const [total, data] = await Promise.all([
    prisma.demandeBourse.count({ where }),
    prisma.demandeBourse.findMany({
      where,
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
      take: pageSize,
      skip,
      orderBy: orderBy
    })
  ]);

  return {
    data,
    totalPages: Math.ceil(total / pageSize),
    totalCount: total
  };
}

/**
 * Récupère toutes les annonces de bourses externes
 * Triées par nom de bourse (alphabétique)
 */
export async function getBoursesExternes() {
  try {
    const bourses = await prisma.bourseExterne.findMany({
      orderBy: {
        id: 'desc'
      },
      include: {
        _count: {
          select: { demandes_bourse: true }
        }
      }
    });
    return bourses;
  } catch (error) {
    console.error("Erreur lors de la récupération des bourses externes:", error);
    return [];
  }
}

/**
 * Export des données en Excel
 * Filtre avant export
 */
export async function exportCandidaturesToExcel(params: {
  typeBourse?: string;
  paysDemande?: string[];
  offreId?: string;
  dateDebut?: string;
  dateFin?: string;
}) {
  try {
    const now = new Date();

    const where: any = {
      AND: [
        params.typeBourse && params.typeBourse !== "tous" 
          ? { type_bourse_id: Number(params.typeBourse) } : {},
        params.offreId && params.offreId !== "tous" 
          ? { annonce_bourse_externe_id: parseInt(params.offreId) } : {},
        params.paysDemande && params.paysDemande.length > 0 
          ? { pays_demandes: { contains: params.paysDemande[0] } }
          : {},
        (params.dateDebut || params.dateFin) ? {
          date_depot: {
            gte: params.dateDebut ? new Date(params.dateDebut) : undefined,
            lte: params.dateFin ? new Date(params.dateFin) : undefined,
          }
        } : {},
      ]
    };

    const candidatures = await prisma.demandeBourse.findMany({
      where,
      include: {
        candidat: { 
          include: { 
            dernier_diplome: true,
            logement_region: {
              include: {
                province : true,
              }
            },
            region: { //region_origine
              include: {
                province : true,
              }
            }, 
            province: true, //logement_province
            infosbaccalaureat: {
              include: {
                province: true
              }
            }
          } 
        },
        type_bourse: true,
        annonce_bourse_externe: true,
        depots_externes: true,
        pieces_jointes: true
      },
      orderBy: { date_depot: 'desc' }
    });

    // Création du classeur Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Candidatures SBEX");

    // Colonnes
    worksheet.columns = [
      //1) DemandeBourse
      { header: "NUMERO_DOSSIER", key: "demande_numero_dossier", width: 20 },
      { header: "TYPE_BOURSE", key: "demande_type_bourse", width: 20 }, //Universitaire ou Post universitaire
      { header: "SPECIALITES_DEMANDES", key: "demande_specialites", width: 20 },
      { header: "PAYS_DEMANDES", key: "demande_pays_demandes", width: 20 },
      { header: "DATE_DEPOT", key: "demande_date_depot", width: 20 },
      { header: "DATE_EXPIRATION", key: "demande_date_expiration", width: 20 },
      { header: "STATUT_DOSSIER", key: "demande_statut", width: 20 },
      { header: "ORGANISME_SOLLICITE", key: "demande_organisme_sollicite", width: 20 },
      { header: "CONTACT_ORGANISME_SOLLICITE", key: "demande_organisme_contact", width: 20 },

      //depots_externes
      { header: "AUTRE_DEPOT_REALISE", key: "autre_depot_externe", width: 20 },  //OUI ou NON
      { header: "AUTRE_DEPOT_NOMBRE", key: "autre_depot_nombre", width: 20 },
      { header: "AUTRE_DEPOT_NATURE", key: "autre_depot_nature", width: 20 },
      { header: "AUTRE_DEPOT_SPECIALITES", key: "autre_depot_specialite", width: 20 },
      { header: "AUTRE_DEPOT_ORGANISME", key: "autre_depot_organisme", width: 20 },
      { header: "AUTRE_DEPOT_DATE DEPART", key: "autre_depot_date_depart", width: 20 },
      
      //annonce_bourse_externe
      { header: "MODALITE_DEPOT", key: "modalite_depot", width: 20 }, //Repondu à une offre ou Candidature Libre
      { header: "OFFRE_POSTULÉ_ID", key: "annonce_bourse_externe_id", width: 20 }, //ID
      { header: "OFFRE_POSTULÉ_PAYS", key: "annonce_bourse_pays", width: 20 },
      { header: "OFFRE_POSTULÉ_ANNEE_UNIVERSITAIRE", key: "annonce_bourse_annee_univ", width: 20 },
      { header: "OFFRE_POSTULÉ_DATE_LIMITE", key: "annonce_bourse_limite_candidature", width: 20 },

      //2) Candidat
      { header: "NOM", key: "candidat_nom", width: 20 },
      { header: "PRENOM", key: "candidat_prenom", width: 25 },
      { header: "SEXE", key: "candidat_sexe", width: 25 },
      { header: "AGE", key: "candidat_age", width: 25 },
      { header: "NATIONALITE", key: "candidat_nationalite", width: 25 },
      { header: "SITUATION_FAMILIALE", key: "candidat_situation_familiale", width: 25 },
      { header: "LOGEMENT_ADRESSE", key: "candidat_logement_adresse", width: 25 },
      { header: "LOGEMENT_REGION", key: "candidat_logement_region", width: 20 },
      { header: "LOGEMENT_PROVINCE", key: "candidat_logement_province", width: 20 },
      { header: "EMAIL", key: "candidat_email", width: 20 },
      { header: "TELEPHONE", key: "candidat_telephone", width: 20 },
      { header: "PERE_NOM", key: "candidat_pere_nom", width: 20 },
      { header: "PERE_PROFESSION", key: "candidat_pere_profession", width: 20 },
      { header: "MERE_NOM", key: "candidat_mere_nom", width: 20 },
      { header: "MERE_PROFESSION", key: "candidat_mere_profession", width: 20 },
      { header: "TUTEUR_NOM", key: "candidat_tuteur_nom", width: 20 },
      { header: "TUTEUR_PROFESSION", key: "candidat_tuteur_profession", width: 20 },
      { header: "URGENCE_NOM", key: "candidat_urgence_nom", width: 20 },
      { header: "URGENCE_ADRESSE", key: "candidat_urgence_adresse", width: 20 },
      { header: "URGENCE_TELEPHONE", key: "candidat_urgence_telephone", width: 20 },
      { header: "NOMBRE_FRERE_SOEUR", key: "candidat_nombre_frere_soeur", width: 20 },
      { header: "NOMBRE_ENFANTS", key: "candidat_nombre_enfants", width: 20 },
      { header: "ENFANTS_A_CHARGE", key: "candidat_nombre_enfants_acharge", width: 20 },
      { header: "CONJOINT_EMPLOYEUR_NOM", key: "candidat_conjoint_employeur_nom", width: 20 },
      { header: "CONJOINT_EMPLOYEUR_ADRESSE", key: "candidat_conjoint_employeur_adresse", width: 20 },
      { header: "DERNIER_DIPLOME_OBTENU", key: "candidat_dernier_diplome", width: 20 },
      { header: "DERNIER_DIPLOME_ANNEE", key: "candidat_dernier_diplome_annee", width: 20 },

      //InfosBaccalaureat
      { header: "BACC_NUMERO_INSCRIPTION", key: "bacc_numero_inscription", width: 20 },
      { header: "BACC_ENSEIGNEMENT_SUIVI", key: "bacc_type", width: 20 },
      { header: "BACC_SERIE", key: "bacc_serie", width: 20 },
      { header: "BACC_MENTION_OBTENU", key: "bacc_mention_obtenu", width: 20 },
      { header: "BACC_ANNEE_OBTENTION", key: "bacc_annee_obtention", width: 20 },
      { header: "BACC_PROVINCE_OBTENTION", key: "bacc_province_obtention", width: 20 },
    ];

    // Style en-tête
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '059669' } };

    // Ajout des données
    candidatures.forEach(d => {
      const natures = d.depots_externes.map(dep => dep.nature_bourse).filter(Boolean).join(", ");
      const specialites = d.depots_externes.map(dep => dep.specialite).filter(Boolean).join(", ");
      const organismes = d.depots_externes.map(dep => dep.organisme_sollicite).filter(Boolean).join(", ");
      const date_depart = d.depots_externes.map(dep => dep.date_depart && new Date(dep.date_depart).toLocaleDateString('fr-FR')).filter(Boolean).join(", ");

      const situationFamilialeMap = {
        celibataire: "Célibataire",
        marie: "Marié(e)",
        divorce: "Divorcé(e)",
        veuf: "Veuf(ve)"
      };

      const mentionBaccalaureatMap = {
        tres_bien: "Très bien",
        bien: "Bien",
        assez_bien: "Assez bien",
        passable: "Passable"
      };

      const formatDateFR = (dateStr: string): string => {
        return (new Date(dateStr)).toLocaleDateString('fr-FR');
      };

      worksheet.addRow({
        //1) DemandeBourse
        demande_numero_dossier: d.numero_dossier,
        demande_type_bourse: d.type_bourse.libelle,
        demande_specialites: d.specialites,
        demande_pays_demandes: d.pays_demandes,
        demande_date_depot: new Date(d.date_depot).toLocaleString('fr-FR'),
        demande_date_expiration: d.date_expiration && new Date(d.date_expiration).toLocaleDateString('fr-FR'),
        demande_statut: d.date_expiration && new Date(d.date_expiration) < now ? "Expiré" : "Valide",
        demande_organisme_sollicite: d.organisme_sollicite || "",
        demande_organisme_contact: d.organisme_detail_contact || "",

        //depots_externes
        autre_depot_externe: d.autre_depot_externe === true ? "OUI" : "NON",
        autre_depot_nombre: d.nombre_depot_externe,
        autre_depot_nature: natures || "",
        autre_depot_specialite: specialites || "",
        autre_depot_organisme: organismes || "",
        autre_depot_date_depart: date_depart || "",

        //annonce_bourse_externe
        modalite_depot: d.annonce_bourse_externe_id !== null ? "Repondu à une offre" : "Dépôt Libre",
        annonce_bourse_externe_id: d.annonce_bourse_externe_id || "",
        annonce_bourse_pays: d.annonce_bourse_externe?.pays,
        annonce_bourse_annee_univ: d.annonce_bourse_externe?.annee_universitaire,
        annonce_bourse_limite_candidature: d.annonce_bourse_externe?.limite_candidature
          ?.map(formatDateFR)
          .join(', ') || '',

        //2) Candidat
        candidat_nom: d.candidat.nom.toUpperCase(),
        candidat_prenom: d.candidat.prenom,
        candidat_sexe: d.candidat.sexe,
        candidat_age: d.candidat.age,
        candidat_nationalite: d.candidat.nationalite,
        candidat_situation_familiale: situationFamilialeMap[d.candidat.situation_familiale] || d.candidat.situation_familiale,
        candidat_logement_adresse: d.candidat.logement_adresse,
        candidat_logement_region: d.candidat.logement_region.libelle,
        candidat_logement_province: d.candidat.province.libelle,
        candidat_email: d.candidat.email,
        candidat_telephone: d.candidat.telephone,
        candidat_pere_nom: d.candidat.pere_nom,
        candidat_pere_profession: d.candidat.pere_profession,
        candidat_mere_nom: d.candidat.mere_nom,
        candidat_mere_profession: d.candidat.mere_profession,
        candidat_tuteur_nom: d.candidat.tuteur_nom,
        candidat_tuteur_profession: d.candidat.tuteur_profession,
        candidat_urgence_nom: d.candidat.urgence_nom,
        candidat_urgence_adresse: d.candidat.urgence_adresse,
        candidat_urgence_telephone: d.candidat.urgence_telephone,
        candidat_nombre_frere_soeur: d.candidat.nombre_frere_soeur,
        candidat_nombre_enfants: d.candidat.nombre_enfants,
        candidat_nombre_enfants_acharge: d.candidat.nombre_enfants_acharge,
        candidat_conjoint_employeur_nom: d.candidat.conjoint_employeur_nom,
        candidat_conjoint_employeur_adresse: d.candidat.conjoint_employeur_adresse,
        candidat_dernier_diplome: d.candidat.dernier_diplome?.libelle,
        candidat_dernier_diplome_annee: d.candidat.dernier_diplome_annee,

        //InfosBaccalaureat
        bacc_numero_inscription: d.candidat.infosbaccalaureat?.numero_inscription,
        bacc_type: d.candidat.infosbaccalaureat?.type,
        bacc_serie: d.candidat.infosbaccalaureat?.serie,
        bacc_mention_obtenu: d.candidat.infosbaccalaureat?.mention_obtenu && mentionBaccalaureatMap[d.candidat.infosbaccalaureat?.mention_obtenu] || d.candidat.infosbaccalaureat?.mention_obtenu,
        bacc_annee_obtention: d.candidat.infosbaccalaureat?.annee_obtention,
        bacc_province_obtention: d.candidat.infosbaccalaureat?.province.libelle

      });
    });

    // Génération du Buffer et conversion en Base64 pour le transit
    const buffer = await workbook.xlsx.writeBuffer();

    const nowDate = new Date();
    const day = String(nowDate.getDate()).padStart(2, '0');
    const month = String(nowDate.getMonth() + 1).padStart(2, '0'); // +1 car janvier = 0
    const year = nowDate.getFullYear();

    const hours = String(nowDate.getHours()).padStart(2, '0');
    const minutes = String(nowDate.getMinutes()).padStart(2, '0');
    const seconds = String(nowDate.getSeconds()).padStart(2, '0');

    const dateStr = `${day}${month}${year}`;
    const timeStr = `${hours}${minutes}${seconds}`;

    return { 
        success: true, 
        base64: Buffer.from(buffer).toString('base64'),
        filename: `export_sbex_candidatures_${dateStr}_${timeStr}.xlsx` 
    };

  } catch (error) {
    console.error("Erreur Export Excel:", error);
    return { success: false, error: "Erreur lors de la génération du fichier" };
  }
}

/**
 * Récupère toutes les annonces de bourses d'etudes
 * Triées par nom, pays, disponibilité (alphabétique: ascendent ou descendant)
 * Avec pagination
 */
export async function getFilteredBoursesExternes(params: {
  page?: number;
  search?: string;
  pays?: string;
  disponibilite?: string; // '1' pour actif, '0' pour inactif
  tri?: string;
  order?: "asc" | "desc";
}) {
  const pageSize = 10;
  const skip = ((params.page || 1) - 1) * pageSize;
  const sortOrder = params.order || "desc";

  // Configuration du tri
  let orderBy: any = { date_publication: sortOrder };
  if (params.tri === "nom") {
    orderBy = { nom_bourse: sortOrder };
  } else if (params.tri === "pays") {
    orderBy = { pays: sortOrder };
  }

  const where: any = {
    AND: [
      // Recherche sur le nom de la bourse ou l'organisme
      params.search ? {
        OR: [
          { nom_bourse: { contains: params.search, mode: 'insensitive' } },
          { organisme: { contains: params.search, mode: 'insensitive' } },
        ]
      } : {},
      
      // Filtre par pays (recherche dans la string "France, Maroc...")
      params.pays ? {
        pays: { contains: params.pays, mode: 'insensitive' }
      } : {},

      // Filtre par disponibilité
      params.disponibilite ? {
        disponibilite: Number(params.disponibilite)
      } : {},
    ]
  };

  try {
    const [total, data] = await Promise.all([
      prisma.bourseExterne.count({ where }),
      prisma.bourseExterne.findMany({
        where,
        include: {
          _count: {
            select: { demandes_bourse: true }
          }
        },
        take: pageSize,
        skip,
        orderBy: orderBy
      })
    ]);

    return {
      data,
      totalPages: Math.ceil(total / pageSize),
      totalCount: total
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces de bourses:", error);
    return { data: [], totalPages: 0, totalCount: 0 };
  }
}

