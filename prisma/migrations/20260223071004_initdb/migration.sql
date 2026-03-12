-- CreateEnum
CREATE TYPE "StatutDossier" AS ENUM ('Dossier Soumis', 'En cours de traitement', 'Accepté', 'Rejeté');

-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('Valide', 'Expirée');

-- CreateEnum
CREATE TYPE "Sexe" AS ENUM ('Masculin', 'Feminin');

-- CreateEnum
CREATE TYPE "SituationFamiliale" AS ENUM ('Célibataire', 'Marié', 'Divorcé', 'Veuf');

-- CreateEnum
CREATE TYPE "TypeBaccalaureat" AS ENUM ('Général', 'Technique');

-- CreateEnum
CREATE TYPE "SerieBaccalaureat" AS ENUM ('A1', 'A2', 'C', 'D', 'L', 'S', 'OSE', 'Technique');

-- CreateEnum
CREATE TYPE "MentionBaccalaureat" AS ENUM ('Très bien', 'Bien', 'Assez bien', 'Passable');

-- CreateTable
CREATE TABLE "RoleUtilisateur" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "RoleUtilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "identifiant" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "est_actif" BOOLEAN NOT NULL DEFAULT true,
    "date_creation" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_inactivation" TIMESTAMPTZ(3),
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(200) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "province_id" INTEGER NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diplome" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(200) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Diplome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidat" (
    "id" SERIAL NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,
    "region_origine" INTEGER NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "sexe" "Sexe" NOT NULL,
    "date_naissance" DATE NOT NULL,
    "age" INTEGER NOT NULL,
    "lieu_naissance" VARCHAR(255) NOT NULL,
    "nationalite" VARCHAR(100) NOT NULL,
    "situation_familiale" "SituationFamiliale" NOT NULL,
    "logement_adresse" TEXT NOT NULL,
    "logement_region_id" INTEGER NOT NULL,
    "logement_province_id" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    "pere_nom" TEXT,
    "pere_profession" TEXT,
    "mere_nom" TEXT,
    "mere_profession" TEXT,
    "tuteur_nom" TEXT,
    "tuteur_profession" TEXT,
    "urgence_nom" TEXT,
    "urgence_adresse" TEXT,
    "urgence_telephone" TEXT,
    "nombre_frere_soeur" INTEGER,
    "noms_frere_soeur" TEXT,
    "nombre_enfants" INTEGER,
    "nombre_enfants_acharge" INTEGER,
    "conjoint_employeur_nom" TEXT,
    "conjoint_employeur_adresse" TEXT,
    "dernier_diplome_id" INTEGER,
    "dernier_diplome_annee" INTEGER,

    CONSTRAINT "Candidat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfosBaccalaureat" (
    "id" SERIAL NOT NULL,
    "candidat_id" INTEGER NOT NULL,
    "type" "TypeBaccalaureat" NOT NULL,
    "serie" "SerieBaccalaureat" NOT NULL,
    "mention_obtenu" "MentionBaccalaureat" NOT NULL,
    "annee_obtention" INTEGER NOT NULL,
    "numero_inscription" VARCHAR(100) NOT NULL,
    "bacc_province_id" INTEGER NOT NULL,

    CONSTRAINT "InfosBaccalaureat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeBourse" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(200) NOT NULL,
    "description" TEXT,

    CONSTRAINT "TypeBourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NumeroDossier" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "reference" VARCHAR(250) NOT NULL,

    CONSTRAINT "NumeroDossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandeBourse" (
    "id" SERIAL NOT NULL,
    "numero_dossier" VARCHAR(100) NOT NULL,
    "candidat_id" INTEGER NOT NULL,
    "type_bourse_id" INTEGER NOT NULL,
    "specialites" TEXT NOT NULL,
    "pays_demandes" TEXT NOT NULL,
    "organisme_sollicite" TEXT,
    "organisme_detail_contact" TEXT,
    "autre_depot_externe" BOOLEAN,
    "details_autres_depots" TEXT,
    "autresdepot_nature_bourse" TEXT,
    "autresdepot_specialite" TEXT,
    "autresdepot_organisme_sollicite" TEXT,
    "autresdepot_date_depart" DATE,
    "nombre_depot_externe" INTEGER NOT NULL,
    "date_depot" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_expiration" TIMESTAMPTZ(3),
    "statut_demande" "StatutDemande" NOT NULL,
    "statut_dossier" "StatutDossier" NOT NULL,

    CONSTRAINT "DemandeBourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepotExterne" (
    "id" SERIAL NOT NULL,
    "demande_bourse_id" INTEGER NOT NULL,
    "nature_bourse" TEXT,
    "specialite" TEXT,
    "organisme_sollicite" TEXT,
    "date_depart" DATE,

    CONSTRAINT "DepotExterne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PiecesJointes" (
    "id" SERIAL NOT NULL,
    "demande_bourse_id" INTEGER NOT NULL,
    "type_piece" VARCHAR(255) NOT NULL,
    "nom_fichier" TEXT NOT NULL,

    CONSTRAINT "PiecesJointes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_user_email_key" ON "Utilisateur"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "InfosBaccalaureat_candidat_id_key" ON "InfosBaccalaureat"("candidat_id");

-- CreateIndex
CREATE UNIQUE INDEX "DemandeBourse_numero_dossier_key" ON "DemandeBourse"("numero_dossier");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "RoleUtilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidat" ADD CONSTRAINT "Candidat_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidat" ADD CONSTRAINT "Candidat_region_origine_fkey" FOREIGN KEY ("region_origine") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidat" ADD CONSTRAINT "Candidat_logement_region_id_fkey" FOREIGN KEY ("logement_region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidat" ADD CONSTRAINT "Candidat_logement_province_id_fkey" FOREIGN KEY ("logement_province_id") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidat" ADD CONSTRAINT "Candidat_dernier_diplome_id_fkey" FOREIGN KEY ("dernier_diplome_id") REFERENCES "Diplome"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfosBaccalaureat" ADD CONSTRAINT "InfosBaccalaureat_candidat_id_fkey" FOREIGN KEY ("candidat_id") REFERENCES "Candidat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfosBaccalaureat" ADD CONSTRAINT "InfosBaccalaureat_bacc_province_id_fkey" FOREIGN KEY ("bacc_province_id") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeBourse" ADD CONSTRAINT "DemandeBourse_candidat_id_fkey" FOREIGN KEY ("candidat_id") REFERENCES "Candidat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeBourse" ADD CONSTRAINT "DemandeBourse_type_bourse_id_fkey" FOREIGN KEY ("type_bourse_id") REFERENCES "TypeBourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepotExterne" ADD CONSTRAINT "DepotExterne_demande_bourse_id_fkey" FOREIGN KEY ("demande_bourse_id") REFERENCES "DemandeBourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PiecesJointes" ADD CONSTRAINT "PiecesJointes_demande_bourse_id_fkey" FOREIGN KEY ("demande_bourse_id") REFERENCES "DemandeBourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
