"use client";

import { User, MapPin, Mail, Phone, ShieldAlert, Baby, Home, GraduationCap, Globe, Users } from "lucide-react";

export default function CandidatInfo({ dossier }: { dossier: any }) {
  const c = dossier.candidat;
  
  const SITUATIONS: Record<string, string> = {
    celibataire: "Célibataire",
    marie: "Marié(e)",
    divorce: "Divorcé(e)",
    veuf: "Veuf/Veuve"
  };

  const photoIdentite = dossier.pieces_jointes?.find(
    (pj: any) => pj.type_piece === "Photo d'identité récente"
  );
  const photoUrl = photoIdentite 
  ? `/pieces_jointes/${dossier.numero_dossier}/${photoIdentite.nom_fichier}`
  : null;
  
  return (
    <div className="space-y-10">

      <h2 className="text-md font-bold uppercase tracking-wide text-(--color-theme-dark-blue) mb-8 flex items-center gap-4 p-4 bg-amber-100 border border-amber-200 rounded-2xl">
        Informations sur le candidat
      </h2>
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-4 border-(--color-theme-green) pb-8 gap-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full">
          {/* PHOTO D'IDENTITÉ */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 bg-slate-100 overflow-hidden border-2 border-(--color-theme-green) shadow-sm rounded-2xl">
              {photoUrl ? (
                  <img 
                      src={photoUrl} 
                      alt={`${c.prenom} ${c.nom}`} 
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                      }}
                  />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <User size={90} strokeWidth={1} />
                  </div>
              )}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl tracking-tighter text-slate-900 leading-none">
              <span className="font-semibold uppercase">{c.nom}</span> 
              <span className="font-medium text-slate-500 ml-2">{c.prenom}</span>
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span>{c.nationalite}</span>
              <span className="text-slate-200">/</span>
              <span>{c.age} ans</span>
              <span className="text-slate-200">/</span>
              <span>{c.sexe}</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- INFOS ACADÉMIQUE --- */}
      <div className="p-8 bg-(--color-theme-green) text-white rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
        <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
          <GraduationCap className="text-white" size={32} strokeWidth={1} />
        </div>
        <div className="d-flex flex-column grow  text-center md:text-left gap-6 relative z-10">
            <p className="text-[12px] font-medium text-white tracking-wider">Dernier diplôme obtenu :</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {c.dernier_diplome?.libelle || "Diplôme non spécifié"}
            </p>
        </div>
        
        <div className="d-flex flex-column text-center md:text-right relative z-10">
          <span className="text-[12px] font-medium text-white tracking-wider block mb-1">Année d'obtention :</span>
          <span className="text-4xl text-white">{c.dernier_diplome_annee}</span>
        </div>
      </div>

      {/* --- CORPS : STRUCTURE EN COLONNES --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* COLONNE GAUCHE : IDENTITÉ & FAMILLE */}
        <div className="md:col-span-8 space-y-12">

          <section>
            <h3 className="text-md font-bold uppercase tracking-widest text-(--color-theme-green) mb-8 flex items-center gap-4">
              01. Région d'origine <span className="h-px flex-1 bg-slate-100"></span>
            </h3>
            <div className="grid grid-cols-2 gap-y-10 gap-x-6 bg-rose-50 p-6 rounded-2xl border border-rose-100">
              <SimpleField label="Région :" value={c.region?.libelle} />
              <SimpleField label="Province :" value={c.region?.province?.libelle} />
            </div>
          </section>
          
          <section>
            <h3 className="text-md font-bold uppercase tracking-widest text-(--color-theme-green) mb-8 flex items-center gap-4">
              02. État Civil <span className="h-px flex-1 bg-slate-100"></span>
            </h3>
            <div className="grid grid-cols-2 gap-y-10 gap-x-6">
              <SimpleField label="Date de naissance :" value={new Date(c.date_naissance).toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'})} />
              <SimpleField label="Lieu de naissance :" value={c.lieu_naissance} />
              <SimpleField label="Situation familiale :" value={SITUATIONS[c.situation_familiale] || "Non spécifiée"} />
            </div>
            {(dossier.type_bourse_id ==2) && (
              <div className="grid grid-cols-2 gap-y-10 gap-x-6 mt-10">
                <SimpleField label="Nom de l'organisme employeur du conjoint :" value={c.conjoint_employeur_nom} />
                <SimpleField label="Adresse de l'organisme employeur du conjoint :" value={c.conjoint_employeur_adresse} />
              </div>
            )}
          </section>

          <section>
            <h3 className="text-md font-bold uppercase tracking-widest text-(--color-theme-green) mb-8 flex items-center gap-4">
              03. Relation familiale <span className="h-px flex-1 bg-slate-100"></span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(dossier.type_bourse_id ==2) && (
                <div className="space-y-6">
                  <SimpleField label="Père :" value={c.pere_nom} sub={"Profession : " + (c.pere_profession || " - ") } />
                  <SimpleField label="Mère :" value={c.mere_nom} sub={"Profession : " + (c.mere_profession || " - ") } />
                  <SimpleField label="Tuteur(trice) :" value={c.tuteur_nom} sub={"Profession : " + (c.tuteur_profession || " - ") } />
                </div>
              )}

              <div className="space-y-6">
                {(dossier.type_bourse_id ==1) && (
                <div>
                  <SimpleField label="Nombre de frères & soeurs :" value={String(c.nombre_frere_soeur || 0).padStart(2, '0') + " frère(s) et soeur(s)"} />
                  <div className="md:col-span-2 mt-5">
                    <label className="text-sm font-regular text-slate-500 tracking-[0.05em] mb-2 block">
                        Noms des frères & soeurs :
                    </label>
                    <div className="flex flex-col gap-3">
                      { c.noms_frere_soeur ? 
                      (c.noms_frere_soeur
                          ?.split(/[;,]/)
                          .map((nom: string) => nom.trim())
                          .filter((nom: string) => nom !== "")
                          .map((nom: string, index: number ) => (
                              <div 
                                  key={index} 
                                  className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-full"
                                  style={{ animationDelay: `${index * 50}ms` }}
                              >
                                  <User size={18} />
                                  <span className="text-sm font-semibold text-slate-800 tracking-wide">
                                      {nom}
                                  </span>
                              </div>
                          ))) : <span className="text-sm font-semibold text-slate-800 tracking-wide">Aucun</span>
                      }
                    </div>
                  </div>
                </div>
                )}
                  
                {(dossier.type_bourse_id ==2) && (
                <div>
                  <div className="flex gap-10">
                    <SimpleField label="Nombre d'enfants :" value={String(c.nombre_enfants || 0).padStart(2, '0') + " enfant(s)"} />
                    <SimpleField label="À charge :" value={String(c.nombre_enfants_acharge || 0).padStart(2, '0') + " enfant(s)"} />
                  </div>
                </div>
                )}

              </div>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : CONTACTS & URGENCE */}
        <div className="md:col-span-4 space-y-12 border-l border-slate-100 pl-8">
          <section>
            <h3 className="text-md font-bold uppercase tracking-widest text-(--color-theme-green) mb-8">04. Contacts & adresse</h3>
            <div className="space-y-8">
              <ContactBlock icon={Mail} label="Email :" value={c.email} />
              <ContactBlock icon={Phone} label="Téléphone :" value={c.telephone} />
              <ContactBlock icon={MapPin} label="Adresse :" value={c.logement_adresse} />
              <ContactBlock icon={MapPin} label="Région :" value={c.logement_region?.libelle} />
              <ContactBlock icon={MapPin} label="Province :" value={c.logement_region?.province?.libelle} />
            </div>
          </section>

          <section className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-4 flex items-center gap-2">
              <ShieldAlert size={50} /> Personne à prévenir en cas d'urgence
            </h3>
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-800">{c.urgence_nom}</p>
              <p className="text-sm text-slate-800">Tel: <a href={`tel:${c.urgence_telephone}`} className="transition-colors hover:text-green-600 hover:font-medium">{c.urgence_telephone}</a></p>
              <p className="text-sm text-slate-800 leading-tight">Adresse: {c.urgence_adresse}</p>
            </div>
          </section>
        </div>
      </div>

    </div>
  )
}

const SimpleField = ({ label, value, sub }: any) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-regular text-slate-500 tracking-[0.05em]">{label}</span>
    <span className="text-sm font-semibold text-slate-800">{value || "—"}</span>
    {sub && <span className="text-sm text-slate-800 italic">{sub}</span>}
  </div>
);

const ContactBlock = ({ icon: Icon, label, value }: any) => (
  <div className="flex gap-4">
    <div className="text-slate-500 pt-1">
      <Icon size={18} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-sm font-regular text-slate-500 tracking-[0.05em]">{label}</p>
      <p className="text-sm font-medium text-slate-700 break-all">{value || "—"}</p>
    </div>
  </div>
);
