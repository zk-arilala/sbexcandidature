"use client";

import { useState, useEffect } from "react";
import * as actions from "@app/actions";
import { Search, Filter, ChevronLeft, ChevronRight, SlidersHorizontal, Loader2, GraduationCap, CalendarDays, Layers, User, MapPin, ArrowUpRight, RotateCcw, ArrowUpAZ, ArrowDownZA, CalendarCheck, CheckCheck, AlertTriangle, Clock, ChevronDown, Ghost, FileXCorner, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import DemandeDetailsModal from "./components/DemandeDetailsModal";
import ExportExcelModal from "@/components/ExportExcelModal";

const paysBourses = ["Afrique du Sud", "Algérie", "Allemagne", "Algerie", "Arabie Saoudite", "Australie", "Autriche", "Belgique", "Brésil", "Canada", "Chine", "Colombie", "Corée du Sud", "Cuba", "Danemark", "Égypte", "Émirats Arabes Unis", "Espagne", "États-Unis", "Finlande", "France", "Inde", "Indonésie", "Hongrie", "Irlande", "Italie", "Japon", "Libye", "Luxembourg", "Madagascar", "Malaisie", "Maroc", "Mexique", "Maurice", "Norvège", "Nouvelle-Zélande", "Pays-Bas", "Portugal", "Qatar", "La Réunion", "Roumanie", "Royaume-Uni", "Russie", "Seychelles", "Sénégal", "Singapour", "Suède", "Suisse", "Taiwan", "Tunisie", "Turquie"];

const filterStyles = {
  select: "border border-slate-300 bg-slate-50 rounded-lg px-3 py-1.5 text-sm font-medium outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)",
  input: "border border-slate-300 bg-slate-50 rounded-lg px-3 py-1.5 text-sm font-medium outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)",
  tabActive: "bg-(--color-theme-green) text-white shadow-sm scale-[1.02]",
  tabInactive: "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
};

type FilterState = {
  page: number;
  search: string;
  typeBourse: string;
  categorie: string;
  region: string;
  status: string;
  tri: string;
  order: "asc" | "desc";
  specialite: string;
  pays: string;
  modalite: string;
  dateDebut: string;
  dateFin: string;
  validite: string;
  ageMin: string;
  ageMax: string;
  diplome: string;
  offreBourseId: string;
};

export default function CandidaturesPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>({ data: [], totalPages: 0, totalCount: 0 });
  const [activeTab, setActiveTab] = useState<'demande' | 'candidat'>('demande');
  const [listeRegions, setListeRegions] = useState<any[]>([]);
  const [listeTypesBourse, setListeTypesBourse] = useState<any[]>([]);
  const [listeDiplomes, setListeDiplomes] = useState<any[]>([]);
  const [listeOffresBourses, setListeOffresBourses] = useState<any[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showAgePicker, setShowAgePicker] = useState(false);

  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Fonction pour ouvrir le modal avec un dossier spécifique
  const handleViewDossier = (dossier: any) => {
    setSelectedDossier(dossier);
    setIsModalOpen(true);
  };
  
  const getAgeLabel = () => {
    const min = parseInt(filters.ageMin);
    const max = parseInt(filters.ageMax);
    if (min && max) {
      return min === max ? `${min} ans` : `Entre ${min} et ${max} ans`;
    }
    if (min) return `Plus de ${min} ans`;
    if (max) return `Moins de ${max} ans`;
    return "Afficher tout";
  };

  const getDateRangeLabel = () => {
    if (!filters.dateDebut && !filters.dateFin) return "Afficher tout";
    const start = filters.dateDebut ? new Date(filters.dateDebut).toLocaleDateString('fr-FR') : '...';
    const end = filters.dateFin ? new Date(filters.dateFin).toLocaleDateString('fr-FR') : '...';
    return `${start} au ${end}`;
  };
  
  // États des filtres
  const initialFilters: FilterState = {
    page: 1,
    search: "",
    typeBourse: "",
    categorie: "",
    region: "",
    status: "", 
    tri: "date_depot",
    order: "desc",
    specialite: "",
    pays: "",
    modalite: "",
    dateDebut: "",
    dateFin: "",
    validite: "",
    ageMin: "",
    ageMax: "",
    diplome: "",
    offreBourseId: "",
  };
  
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await actions.getFilteredCandidatures(filters);

      const regions = await actions.getRegionsASC();
      const typesBourse = await actions.getTypesBourseASC();
      const diplomes = await actions.getDiplomesASC();
      const offresBourses = await actions.getBoursesExternes();

      setListeRegions(regions);
      setListeTypesBourse(typesBourse);
      setListeDiplomes(diplomes);
      setListeOffresBourses(offresBourses);

      setResult(res);
      setLoading(false);
    }
    load();
  }, [filters]);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      let nextFilters = { ...prev, [name]: value, page: 1 };
      
      // Règle : Si Date Début > Date Fin, on vide la Date Fin
      if (name === "dateDebut" && value && prev.dateFin && value > prev.dateFin) {
        nextFilters.dateFin = ""; 
      }
      // Règle : Si Date Fin < Date Début, on vide la Date Début
      if (name === "dateFin" && value && prev.dateDebut && value < prev.dateDebut) {
        nextFilters.dateDebut = "";
      }

      // --- LOGIQUE ÂGE ---
      const valNum = value !== "" ? parseInt(value) : null;
      const minExisting = prev.ageMin !== "" ? parseInt(prev.ageMin) : null;
      const maxExisting = prev.ageMax !== "" ? parseInt(prev.ageMax) : null;
      // RÈGLE 1 : Si on modifie le MIN et qu'il devient > au MAX existant
      if (name === "ageMin" && valNum !== null && maxExisting !== null && valNum > maxExisting) {
        nextFilters.ageMax = value;
      }
      // RÈGLE 2 : Si on modifie le MAX et qu'il devient < au MIN existant
      if (name === "ageMax" && valNum !== null && minExisting !== null && valNum < minExisting) {
        if (value.length >= prev.ageMin.length || valNum === 0) {
            nextFilters.ageMin = value; 
        }
      }

      return nextFilters;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER & TRI */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des dossiers de candidature déposés</h1>
        
        {/* BOUTON EXPORTER */}
        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-(--color-theme-yellow) border border-(--color-theme-yellow) rounded-xl text-sm font-semibold text-slate-900 hover:bg-(--color-theme-green) hover:border-(--color-theme-green) hover:text-white shadow-sm transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter les données (en Excel)
        </button>
      </div>

      {/* RECHERCHE ET FILTRE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        {/* Filtres par onglet:  */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 gap-4">
          <span className="text-sm font-semibold text-slate-600">Filtrer par :</span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
            <button 
              onClick={() => setActiveTab('demande')}
              className={cn("px-4 py-2 text-sm font-semibold rounded-lg transition-all tracking-wider", activeTab === 'demande' ? "bg-(--color-theme-green) text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-(--color-theme-yellow)")}
            >
              Demandes de bourses
            </button>
            <button 
              onClick={() => setActiveTab('candidat')}
              className={cn("px-4 py-2 text-sm font-semibold rounded-lg transition-all tracking-wider", activeTab === 'candidat' ? "bg-(--color-theme-green) text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-(--color-theme-yellow)")}
            >
              Candidats
            </button>
          </div>

          <div className="flex items-center gap-2 lg:ml-auto">
            <span className="text-sm font-semibold text-slate-600">Trier par :</span>
            <select 
              name="tri" 
              value={filters.tri}
              onChange={handleFilterChange}
              className={filterStyles.select}
            >
              <option value="date_depot">Date de dépôt</option>
              <option value="nom">Nom candidat</option>
              <option value="numero_dossier">N° Dossier</option>
            </select>
            
            <button 
              onClick={() => setFilters({
                ...filters, 
                order: filters.order === 'asc' ? 'desc' : 'asc'
              })}
              className="p-2 bg-slate-100 hover:bg-(--color-theme-green) hover:text-white rounded-lg transition-all text-(--color-theme-green)"
              title={filters.order === 'asc' ? 'Tri croissant' : 'Tri décroissant'}
            >
              {filters.order === 'asc' ? <ArrowUpAZ size={20} /> : <ArrowDownZA size={20} />}
            </button>
          </div>
        </div>

        {/* Recherche commune */}
        <div className="grid grid-cols-1 p-4">
          <div className="relative flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              name="search"
              value={filters.search}
              placeholder="Rechercher par nom du candidat, ou N° dossier..."
              className="w-full pl-10 pr-4 py-3 rounded-xl transition-all border border-slate-400 outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)"
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Recherche multi-critères */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filtres Dynamiques selon l'onglet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {activeTab === 'demande' ? (
                <>
                  {/* Type de Bourse */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Type de bourse</label>
                    <select name="typeBourse" onChange={handleFilterChange} className={filterStyles.select} value={filters.typeBourse}>
                      <option value="">Afficher tout</option>
                      {listeTypesBourse.map(tb => (<option key={tb.id} value={tb.id}>{tb.libelle}</option>))}
                    </select>
                  </div>

                  {/* Modalité */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Modalité de dépôt</label>
                    <select name="modalite" onChange={handleFilterChange} className={filterStyles.select} value={filters.modalite}>
                      <option value="">Afficher tout</option>
                      <option value="rattache">Rattaché à une offre</option>
                      <option value="libre">Candidature libre</option>
                    </select>
                  </div>

                  {/* Pays */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Pays demandé</label>
                    <select name="pays" onChange={handleFilterChange} className={filterStyles.select} value={filters.pays}>
                      <option value="">Afficher tout</option>
                      {paysBourses.map((pays, i) => <option key={i} value={pays}>{pays}</option>)}
                    </select>
                  </div>

                  {/* Plage de Dates */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Période de dépôt</label>
                    
                    <div className="relative">
                      <div className="relative group">
                        <input
                          type="text"
                          readOnly
                          onFocus={() => setShowDatePicker(true)}
                          value={getDateRangeLabel()}
                          placeholder="Sélectionner une période"
                          className={cn(
                            filterStyles.input,
                            "w-full cursor-pointer h-9 px-4"
                          )}
                        />
                        <CalendarDays size={24} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                      </div>

                      {/* Menu déroulant (Pop-over) */}
                      {showDatePicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                          
                          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 animate-in fade-in slide-in-from-top-1 min-w-70">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Choisir l'intervalle</p>
                              {(filters.dateDebut || filters.dateFin) && (
                                <button 
                                  onClick={() => setFilters({...filters, dateDebut: "", dateFin: ""})}
                                  className="text-[12px] font-bold text-rose-500 hover:underline"
                                >
                                  Réinitialiser
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 ml-1">DU</span>
                                <input 
                                  type="date" 
                                  name="dateDebut" 
                                  max={filters.dateFin}
                                  value={filters.dateDebut}
                                  onChange={handleFilterChange} 
                                  className={filterStyles.input + " w-full text-[11px]"} 
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 ml-1">AU</span>
                                <input 
                                  type="date" 
                                  name="dateFin" 
                                  min={filters.dateDebut}
                                  value={filters.dateFin}
                                  onChange={handleFilterChange} 
                                  className={filterStyles.input + " w-full text-[11px]"} 
                                />
                              </div>
                            </div>

                            <button 
                              type="button"
                              onClick={() => setShowDatePicker(false)}
                              className="w-full mt-4 py-2 font-bold rounded-lg uppercase bg-(--color-theme-green) text-white hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue)"
                            >
                              APPLIQUER
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>


                  {/* Validité */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Validité dossier</label>
                    <select name="validite" onChange={handleFilterChange} className={filterStyles.select} value={filters.validite}>
                      <option value="">Afficher tout</option>
                      <option value="valide">Dossier Valide</option>
                      <option value="expire">Dossier Expiré</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Région */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Région d'origine</label>
                    <select name="region" onChange={handleFilterChange} className={filterStyles.select} value={filters.region}>
                      <option value="">Afficher tout</option>
                      {listeRegions.map(r => (<option key={r.id} value={r.libelle}>{r.libelle}</option>))}
                    </select>
                  </div>

                  {/* Âge avec Pop-over */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Age du candidat</label>
                    <div className="relative">
                      <div className="relative group">
                        <input
                          type="text"
                          readOnly
                          placeholder="Sélectionner l'âge"
                          value={getAgeLabel()}
                          onFocus={() => setShowAgePicker(true)}
                          className={cn(
                            filterStyles.input,
                            "w-full cursor-pointer h-9 px-4"
                          )}
                        />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      {showAgePicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowAgePicker(false)} />
                          <div className="absolute top-full left-0 right-0 mt-2 p-5 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 animate-in fade-in slide-in-from-top-2">
                            {/* ... contenu du picker d'âge ... */}
                            <p className="text-xs font-black text-slate-700 mb-4 uppercase tracking-widest">Plage d'âge</p>
                            <div className="flex items-center gap-2">
                                <input type="number" name="ageMin" placeholder="Min" value={filters.ageMin} onChange={handleFilterChange} className={filterStyles.input + " w-full text-center"} min="10" max={filters.ageMax || "100"}/>
                                <span className="text-slate-400 text-xs">à</span>
                                <input type="number" name="ageMax" placeholder="Max" value={filters.ageMax} onChange={handleFilterChange} className={filterStyles.input + " w-full text-center"} min={filters.ageMin || "10"} max="100" />
                            </div>
                            <button onClick={() => setShowAgePicker(false)} className="w-full mt-4 py-2 font-bold rounded-lg uppercase bg-(--color-theme-green) text-white hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue)">Valider</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Diplôme */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Niveau d'étude</label>
                    <select name="diplome" onChange={handleFilterChange} className={filterStyles.select} value={filters.diplome}>
                      <option value="">Afficher tout</option>
                      {listeDiplomes.map(d => (<option key={d.id} value={d.id}>{d.libelle}</option>))}
                    </select>
                  </div>

                  {/* Offre de Bourse */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 ml-1 tracking-wider">Offre de bourse postulé</label>
                    <select name="offreBourseId" onChange={handleFilterChange} className={filterStyles.select} value={filters.offreBourseId}>
                      <option value="">Afficher tout</option>
                      {listeOffresBourses.map(o => <option key={o.id} value={o.id}>Bourse {o.pays} ({o.annee_universitaire}) - Clôturé le {new Date(o.limite_candidature).toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'})}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Bouton Réinitialiser */}
            <button 
              onClick={() => setFilters(initialFilters)}
              className="self-start px-4 py-7 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <RotateCcw size={14} /> Réinitialiser
            </button>
          </div>
        </div>
        
      </div>

      <div className="w-full font-medium">
        Nombre de résultats trouvés : <span className="font-bold text-(--color-theme-red) animate-in fade-in duration-500">{result.totalCount || 0}</span> <span className="text-(--color-theme-red)">dossiers</span>
      </div>
      
      <div className="w-full">
        {/* --- VUE TABLEAU (Visible dès l'écran MD / Tablette) --- */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">N° dossier</th>
                <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">Candidat</th>
                <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">Niveau d'étude</th>
                <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">Bourse demandée</th>
                <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">Validité dossier</th>
                <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              { loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-(--color-theme-green)" />
                  </td>
                </tr>
              ) : ( result.totalCount > 0 ? (
                  result.data.map((d: any) => {
                    //const isRattache = d.annonce_bourse_externe_id !== null;
                    const isExpired = new Date(d.date_expiration) < new Date();
                    
                    return (
                      <tr key={d.id} className="group hover:bg-emerald-800/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">{d.numero_dossier}</span>
                            <span className="text-xs text-slate-600 font-normal flex items-center gap-1">
                                <CalendarCheck size={12}/> 
                                Dépôt: <span className="font-medium">{new Date(d.date_depot).toLocaleDateString('fr-FR')}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700 uppercase">{d.candidat.nom} <span className="capitalize">{d.candidat.prenom}</span></span>
                            <span className="text-xs font-normal text-slate-600 flex items-center gap-1">
                                <MapPin size={12}/> 
                                Origine: <span className="font-medium">{d.candidat.region.libelle}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex gap-1 items-center">
                            <span className="text-sm font-semibold text-slate-700 uppercase">{d.candidat.dernier_diplome.libelle}</span>
                            <span className="text-xs font-normal text-slate-600">
                              ({d.candidat.dernier_diplome_annee})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-normal text-slate-600">{d.type_bourse?.libelle}</span>
                            {/*<span className={cn(
                              "w-fit text-xs font-medium px-2 py-0.5 rounded-md tracking-wider border",
                              isRattache 
                                ? "bg-blue-50 text-blue-600 border-blue-100" 
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            )}>
                              {isRattache ? `Offre rattachée : ${d.annonce_bourse_externe?.pays || 'Aucune'} (${d.annonce_bourse_externe?.annee_universitaire || 'Aucune'})` : 'Demande libre'}
                            </span>*/}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {d.date_expiration && (
                              <>
                                {isExpired ? (
                                  <div className="flex items-center gap-2 text-xs text-(--color-theme-red)">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span className="font-normal tracking-wider text-slate-600">
                                      Expiré le <span className="font-semibold">{new Date(d.date_expiration).toLocaleDateString("fr-FR")}</span>
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-xs text-(--color-theme-green)">
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    <span className="font-normal tracking-wider text-slate-600">
                                      Valide jusqu'au <span className="font-semibold">{new Date(d.date_expiration).toLocaleDateString("fr-FR")}</span>
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            key={d.id}
                            onClick={() => handleViewDossier(d)}
                            className="mt-4 sm:mt-0 inline-flex gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-(--color-theme-green) hover:text-white transition-all"
                          >
                            Voir détail <ArrowUpRight size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-5 text-center">
                      {/* MESSAGE STYLE SI VIDE */}
                      <div className="p-12 md:p-12 text-center bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200/60 relative overflow-hidden group">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10 flex flex-col items-center">
                          <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-amber-900/30 flex items-center justify-center text-amber-900">
                            <SearchX size={40} strokeWidth={1.5} className="animate-pulse" />
                          </div>
                          <h3 className="text-base font-bold text-amber-900 mb-2 tracking-tight">
                            Aucun dossier trouvé
                          </h3>
                          <p className="text-sm text-amber-700/70 max-w-100 leading-relaxed mx-auto font-medium">
                            Aucun dossier n’a été trouvé avec les critères de recherche renseignés. Veuillez vérifier les informations saisies ou modifier vos filtres, puis réessayer.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* --- VUE CARTES (Visible uniquement sur Mobile < MD) --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {loading ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-(--color-theme-green)" /></div>
          ) 
          : ( result.totalCount > 0 
            ? ( result.data.map((d: any) => {
                const isExpired = new Date(d.date_expiration) < new Date();
                return (
                  <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><GraduationCap size={20}/></div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dossier n°</p>
                          <p className="text-sm font-bold text-(--color-theme-green)">{d.numero_dossier}</p>
                        </div>
                      </div>
                      <button 
                        key={d.id}
                        onClick={() => handleViewDossier(d)}
                        className="inline-flex gap-2 px-4 py-2 bg-emerald-50 text-(--color-theme-green) text-xs font-semibold rounded-lg hover:bg-(--color-theme-green) hover:text-white transition-all"
                      >
                        Voir détail <ArrowUpRight size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-2 border-t border-slate-50 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500 tracking-wide">Date de dépôt</span>
                        <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {new Date(d.date_depot).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-slate-500  tracking-wide">Candidat</span>
                        <span className="text-sm font-semibold text-slate-600 uppercase">{d.candidat.nom} {d.candidat.prenom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-slate-500  tracking-wide">Région d'origine</span>
                        <span className="text-sm font-semibold text-slate-600">{d.candidat.region.libelle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-slate-500  tracking-wide">Bourse demandée</span>
                        <span className="text-sm font-semibold text-slate-600">{d.type_bourse?.libelle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-slate-500  tracking-wide">Validité dossier</span>
                        <span className="text-sm font-semibold text-slate-600">
                          { d.date_expiration && (
                            <>
                              {isExpired ? (
                                <div className="flex items-center gap-2 text-xs text-(--color-theme-red)">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span className="font-normal tracking-wider text-slate-600">
                                    Expiré le <span className="font-semibold">{new Date(d.date_expiration).toLocaleDateString("fr-FR")}</span>
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-xs text-(--color-theme-green)">
                                  <CheckCheck className="w-3.5 h-3.5" />
                                  <span className="font-normal tracking-wider text-slate-600">
                                    Valide jusqu'au <span className="font-semibold">{new Date(d.date_expiration).toLocaleDateString("fr-FR")}</span>
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })) 
            : (
              <>
                {/* MESSAGE STYLE SI VIDE */}
                <div className="p-12 md:p-12 text-center bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200/60 relative overflow-hidden group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-amber-900/30 flex items-center justify-center text-amber-900">
                      <SearchX size={40} strokeWidth={1.5} className="animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold text-amber-900 mb-2 tracking-tight">
                      Aucun dossier trouvé
                    </h3>
                    <p className="text-sm text-amber-700/70 max-w-100 leading-relaxed mx-auto font-medium">
                      Aucun dossier n’a été trouvé avec les critères de recherche renseignés. Veuillez vérifier les informations saisies ou modifier vos filtres, puis réessayer.
                    </p>
                  </div>
                </div>
              </>
            ))
          }
        </div>
      </div>


      {/* PAGINATION BAS */}
      <Pagination 
        current={filters.page} 
        total={result.totalPages} 
        onPageChange={(p: any) => setFilters({ ...filters, page: p })} 
      />

      {/* Popup Modal détails d'un demande */}
      <DemandeDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDossier(null);
        }}
        dossier={selectedDossier}
      />

      {/* Popup Modal filtre données avant export excel */}
      <ExportExcelModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)}
        paysBourses={paysBourses}
        listeOffres={listeOffresBourses}
      />
      
    </div>

  );
}

