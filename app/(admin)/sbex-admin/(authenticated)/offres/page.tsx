"use client";

import { useState, useEffect } from "react";
import * as actions from "@app/actions";
import { 
  Plus, Search, Globe, Calendar, Loader2, Edit, Trash2, 
  CheckCircle2, XCircle, ArrowUpRight, Building2, 
  FileSpreadsheet, RotateCcw, ArrowUpAZ, ArrowDownZA, 
  SearchX,
  MapPin,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";

const filterStyles = {
  select: "border border-slate-300 bg-slate-50 rounded-lg px-3 py-1.5 text-sm font-medium outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)",
  input: "border border-slate-300 bg-slate-50 rounded-lg px-3 py-1.5 text-sm font-medium outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)",
};

export default function OffresPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>({ data: [], totalPages: 0, totalCount: 0 });
  
  const initialFilters = {
    page: 1,
    search: "",
    pays: "",
    disponibilite: "",
    tri: "date_publication",
    order: "desc" as "asc" | "desc"
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await actions.getFilteredBoursesExternes(filters);
      setResult(res);
      setLoading(false);
    }
    load();
  }, [filters]);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="lg:flex xs:flex-col justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des annonces de bourses d'études extérieurs</h1>
        
        {/* BOUTON ACTION */}
        <button 
          className="flex items-center gap-2 px-5 py-2.5 bg-(--color-theme-yellow) border border-(--color-theme-yellow) rounded-xl text-sm font-semibold text-slate-900 hover:bg-(--color-theme-green) hover:border-(--color-theme-green) hover:text-white shadow-sm transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Publier une offre de bourses
        </button>
      </div>

      {/* RECHERCHE & FILTRES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-slate-600">Filtrer par :</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="disponibilite" onChange={handleFilterChange} className={filterStyles.select} value={filters.disponibilite}>
                    <option value="">Tous les statuts</option>
                    <option value="1">En ligne (Actif)</option>
                    <option value="0">Clôturé (Archivé)</option>
                </select>
                <input 
                    name="pays" 
                    placeholder="Pays (ex: France)" 
                    onChange={handleFilterChange} 
                    className={filterStyles.input} 
                    value={filters.pays} 
                />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-600">Trier par :</span>
            <select name="tri" onChange={handleFilterChange} className={filterStyles.select} value={filters.tri}>
              <option value="date_publication">Date de publication</option>
              <option value="date_expiration">Date d'expiration</option>
              <option value="nom">Titre de la bourse</option>
              <option value="pays">Pays d'accueil</option>
            </select>

            <button 
                onClick={() => setFilters({...filters, order: filters.order === 'asc' ? 'desc' : 'asc'})}
                className="p-2 bg-slate-100 hover:bg-(--color-theme-green) hover:text-white rounded-lg transition-all text-(--color-theme-green)"
                title={filters.order === 'asc' ? 'Tri croissant' : 'Tri décroissant'}
            >
                {filters.order === 'asc' ? <ArrowUpAZ size={20} /> : <ArrowDownZA size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 p-4">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                name="search"
                placeholder="Rechercher par titre de l'annonce ou par programme..."
                className="w-full pl-10 pr-4 py-3 rounded-xl transition-all border border-slate-400 outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)"
                onChange={handleFilterChange}
                />
            </div>

            <button 
                onClick={() => setFilters(initialFilters)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100 shrink-0"
            >
                <RotateCcw size={16} /> 
                <span>Réinitialiser</span>
            </button>
        </div>
      </div>

      <div className="w-full font-medium">
        Nombre de résultats trouvés : <span className="font-bold text-(--color-theme-red) animate-in fade-in duration-500">{result.totalCount || 0}</span> <span className="text-(--color-theme-red)">annonces</span>
      </div>

      <div className="w-full">
        {/* --- VUE TABLEAU (Visible dès MD) --- */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 align-top">
                    <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">Titre de l'Offre</th>
                    <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">Pays d'accueil & Année universitaire</th>
                    <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">Dates de candidature</th>
                    <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest">Candidatures reçues</th>
                    <th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest text-center">Status</th>
                    {/*<th className="px-6 py-4 text-sm font-black text-(--color-theme-green) uppercase tracking-widest text-right">Actions</th>*/}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {loading ? (
                <tr>
                    <td colSpan={5} className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-(--color-theme-green)" />
                    </td>
                </tr>
                ) : result.totalCount > 0 ? (
                result.data.map((o: any) => {
                    const dateLimite = o.limite_candidature?.[0];
                    const isExpired = dateLimite ? new Date(dateLimite) < new Date() : false;

                    return (
                    <tr key={o.id} className="group hover:bg-emerald-800/10 transition-colors align-top">
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-sm">{o.nom_bourse}</span>
                                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                    <GraduationCap size={12}/> 
                                    Organisme : {o.organisme}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                    <MapPin size={12} /> {o.pays}
                                </span>
                                <span className="text-xs font-normal text-slate-600 flex items-center gap-1">Année : <span className="font-medium">{o.annee_universitaire}</span></span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col gap-1 text-center">
                                <span className={cn(
                                    "inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-semibold",
                                    isExpired ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-700 border-blue-100"
                                )}>
                                    <span className="font-normal">Clôturé le</span> {new Date(dateLimite).toLocaleDateString('fr-FR') || "Non définie"}
                                </span>
                                <span className="text-xs font-normal tracking-wider text-slate-600">
                                    Publié le <span className="font-medium">{new Date(o.date_publication).toLocaleDateString('fr-FR') || "Non définie"}</span>
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className="text-sm font-semibold text-slate-600">{o._count?.demandes_bourse || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border",
                                o.disponibilite === 1 ? "bg-green-100 text-(--color-theme-green) border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                                )}>
                                {o.disponibilite === 1 ? "Publié" : "Clôturé"}
                                </span>
                            </div>
                        </td>
                        {/*<td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-4">
                                <button className="p-2 text-blue-600 bg-slate-100 hover:text-white hover:bg-blue-600 rounded-lg transition-all" title="Éditer">
                                    <Edit size={16} />
                                </button>
                                <button className="p-2 text-red-500 bg-slate-100 hover:text-white hover:bg-red-500 rounded-lg transition-all" title="Supprimer">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>*/}
                    </tr>
                    );
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
                                Aucune offre de bourse trouvée
                            </h3>
                            <p className="text-sm text-amber-700/70 max-w-100 leading-relaxed mx-auto font-medium">
                                Aucune annonce n’a été trouvée avec les critères de recherche renseignés. Veuillez vérifier les informations saisies ou modifier vos filtres, puis réessayer.
                            </p>
                            </div>
                        </div>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* --- VUE CARTES (Visible uniquement Mobile < MD) --- */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
            {loading ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-(--color-theme-green)" /></div>
            ) : result.totalCount > 0 ? (
            result.data.map((o: any) => {
                const dateLimite = o.limite_candidature?.[0];
                const isExpired = dateLimite ? new Date(dateLimite) < new Date() : false;

                return (
                <div key={o.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-sm font-bold text-(--color-theme-green)">{o.nom_bourse}</p>
                                <p className="text-xs font-medium text-slate-500 tracking-wide">Organisme: {o.organisme}</p>
                            </div>
                        </div>
                        {/*<div className="flex gap-1">
                            <button className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Edit size={16} /></button>
                            <button className="p-2 bg-red-50 text-red-400 rounded-lg"><Trash2 size={16} /></button>
                        </div>*/}
                    </div>

                    <div className="space-y-3 border-t border-slate-50 pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500 tracking-wide">Pays d'accueil :</span>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-37.5">{o.pays}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500 tracking-wide">Date de publication :</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md text-slate-600">
                            Publié le <span className="font-semibold">{new Date(o.date_publication).toLocaleDateString('fr-FR') || "Non définie"}</span>
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500 tracking-wide">Date de clôture :</span>
                        <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-md",
                            isExpired ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                            )}>
                            Clôturé le {new Date(dateLimite).toLocaleDateString('fr-FR') || "Non définie"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500 tracking-wide">Status / Candidatures reçues :</span>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border",
                                o.disponibilite === 1 ? "bg-green-100 text-(--color-theme-green) border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                                )}>
                                {o.disponibilite === 1 ? "Publié" : "Clôturé"}
                            </span>
                        <span className="text-xs font-medium text-slate-700">{o._count?.demandes_bourse || 0} demandes</span>
                        </div>
                    </div>
                    </div>
                </div>
                );
            })
            ) : (
                <>
                    {/* MESSAGE STYLE SI VIDE */}
                    <div className="p-12 md:p-12 text-center bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200/60 relative overflow-hidden group">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-amber-900/30 flex items-center justify-center text-amber-900">
                        <SearchX size={40} strokeWidth={1.5} className="animate-pulse" />
                        </div>
                        <h3 className="text-base font-bold text-amber-900 mb-2 tracking-tight">
                        Aucune offre de bourse trouvée
                        </h3>
                        <p className="text-sm text-amber-700/70 max-w-100 leading-relaxed mx-auto font-medium">
                        Aucune annonce n’a été trouvée ou publiée pour le moment. Veuillez réessayer plus tard.
                        </p>
                    </div>
                    </div>
                </>
            )}
        </div>
      </div>


      <Pagination current={filters.page} total={result.totalPages} onPageChange={(p: number) => setFilters({...filters, page: p})} />
    </div>
  );
}
