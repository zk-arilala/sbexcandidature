"use client";
import { X, FileSpreadsheet, Globe, Calendar, GraduationCap, Check, FileDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import * as actions from "@app/actions";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  paysBourses: string[]; // Liste des pays
  listeOffres: any[];   // Liste des annonces de bourses externes publiées
}

export default function ExportExcelModal({ isOpen, onClose, paysBourses, listeOffres }: ExportModalProps) {
  const [loading, setLoading] = useState(true);

  const [exportFilters, setExportFilters] = useState({
    typeBourse: "tous",
    paysDemande: [] as string[],
    offreId: "tous",
    dateDebut: "",
    dateFin: ""
  });

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    const result = await actions.exportCandidaturesToExcel(exportFilters);
    
    if (result.success && result.base64) {
        // Création d'un lien invisible pour forcer le téléchargement
        const link = document.createElement("a");
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${result.base64}`;
        link.download = result.filename || "export_sbex.xlsx";
        link.click();
    } else {
        alert("Erreur lors de l'exportation");
    }
    setLoading(false);
    onClose();
  };


  const togglePays = (p: string) => {
    setExportFilters(prev => ({
      ...prev,
      pays: prev.paysDemande.includes(p) 
        ? prev.paysDemande.filter(item => item !== p) 
        : [...prev.paysDemande, p]
    }));
  };

  const labelStyle = "text-sm font-semibold text-slate-600 mb-1 ml-1 tracking-wider";
  const inputStyle = "input transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-(--color-theme-green) rounded-lg">
              <FileDown size={20} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Exportation de données sous Excel</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Type de Bourse */}
          <div>
            <label className={labelStyle}>Filtrez par type de bourse :</label>
            <div className="grid grid-cols-3 gap-2">
              {['tous', '1', '2'].map((t) => (
                <button
                  key={t}
                  onClick={() => setExportFilters({...exportFilters, typeBourse: t})}
                  className={cn(
                    "py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all",
                    exportFilters.typeBourse === t ? "bg-(--color-theme-green) text-white border-(--color-theme-green)" : "bg-white text-slate-700 border-slate-200 hover:border-(--color-theme-green) hover:text-(--color-theme-green)"
                  )}
                >
                    <span className="flex items-center justify-center gap-2 px-4">
                        {exportFilters.typeBourse === t && <Check size={12} strokeWidth={4} />}
                        
                        {t === 'tous' ? (
                            'Tous les types'
                        ) : t === '1' ? (
                            'Universitaire'
                        ) : (
                            'Post universitaire'
                        )}
                    </span>
                </button>
              ))}
            </div>
          </div>

          {/* Offres de Bourse */}
          <div>
            <label className={labelStyle}>Filtrez par Offre de bourses publié :</label>
            <select 
              className={inputStyle}
              value={exportFilters.offreId}
              onChange={(e) => setExportFilters({...exportFilters, offreId: e.target.value})}
            >
              <option value="tous">Toutes les offres</option>
              {listeOffres.map(o => (
                <option key={o.id} value={o.id}>Bourse {o.pays} ({o.annee_universitaire}) - Clôturé le {new Date(o.limite_candidature).toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'})}</option>
              ))}
            </select>
          </div>

          {/* Plage de dates */}
          <label className={labelStyle}>Filtrez par date de dépôt :</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Date minimum :</label>
              <input 
                type="date" 
                className={inputStyle}
                max={exportFilters.dateFin}
                onChange={(e) => setExportFilters({...exportFilters, dateDebut: e.target.value})}
              />
            </div>
            <div>
              <label className={labelStyle}>Date maximum :</label>
              <input 
                type="date" 
                className={inputStyle}
                min={exportFilters.dateDebut}
                onChange={(e) => setExportFilters({...exportFilters, dateFin: e.target.value})}
              />
            </div>
          </div>

          {/* Pays demandés multisélection */}
          <div>
            <label className={labelStyle}>
                Sélectionnez les Pays sollicités par les candidats ({exportFilters.paysDemande.length === 0 
                ? (<span className="font-medium normal-case">Tous les pays</span>) 
                : (<span className="font-medium normal-case"> {exportFilters.paysDemande.length + " pays selectionnés"}</span>)
                })
            </label>
            <br/><span className="text-[13px] font-regular text-slate-500">* Si aucun pays n’est sélectionné, les données associées à tous les pays seront importées.</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-40 overflow-y-auto">
              {paysBourses.map((p) => (
                <label onClick={() => togglePays(p)} key={p} className="flex items-center gap-2 hover:bg-(--color-theme-yellow) rounded-xl cursor-pointer transition-colors group">
                  <div 
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all",
                      exportFilters.paysDemande.includes(p) ? "bg-(--color-theme-green) border-(--color-theme-green) text-white" : "bg-white border-slate-300"
                    )}
                  >
                    {exportFilters.paysDemande.includes(p) && <Check size={12} strokeWidth={4} />}
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-700">{p}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 inline-flex gap-3 bg-gray-200 text-gray-700 px-8 py-3 font-medium hover:bg-(--color-theme-yellow) hover:text-slate-700 disabled:opacity-50 transition rounded-xl items-center justify-center"
          >
            <X size={18} />
            Annuler
          </button>
          <button 
            onClick={handleExport}
            className="flex-2 inline-flex gap-3 items-center justify-center bg-(--color-theme-green) border border-(--color-theme-green) text-white text-sm font-medium px-8 py-3 rounded-xl hover:bg-(--color-theme-yellow) hover:text-slate-700 hover:border-(--color-theme-yellow) group-hover:translate-x-1 transition-all active:scale-95"
          >
            <FileSpreadsheet size={18} />
            Générer le fichier Excel
          </button>
        </div>
      </div>
    </div>
  );
}
