"use client";

import { Clock, Download, Eye, Globe, Globe2, GraduationCap, Landmark, Minus, Move, Plus, Sparkles, X } from "lucide-react";
import { Key, useState, useEffect } from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import * as pdfjs from 'pdfjs-dist';
import fr_FR from '@react-pdf-viewer/locales/lib/fr_FR.json';

// Styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { getInfosBourseById } from "@app/actions";

export default function BourseInfo({ dossier }: { dossier: any }) {
    const [imageZoom, setImageZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [loading, setLoading] = useState(false);

    const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.js`;
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar: (Toolbar) => (
            <Toolbar>
                {(slots) => {
                    const {
                        CurrentPageInput,
                        GoToNextPage,
                        GoToPreviousPage,
                        NumberOfPages,
                        Zoom,
                        ZoomIn,
                        ZoomOut,
                        Print,
                        GoToFirstPage,
                        GoToLastPage
                    } = slots;
                    return (
                        <div className="flex items-center w-full justify-between px-2">
                            <div className="flex items-center">
                                <GoToPreviousPage />
                                <CurrentPageInput />
                                <span className="mx-1">/</span>
                                <NumberOfPages />
                                <GoToNextPage />
                            </div>
                            <div className="flex items-center">
                                <ZoomOut />
                                <Zoom />
                                <ZoomIn />
                            </div>
                            <div className="flex items-center">
                                <Print />
                                <GoToFirstPage />
                                <GoToLastPage />
                                {/* Les boutons non inclus ici disparaissent de l'interface */}
                            </div>
                        </div>
                    );
                }}
            </Toolbar>
        ),
    });

    const lettreAccueil = dossier.pieces_jointes?.find(
        (pj: { type_piece: string; }) => pj.type_piece === "Lettre d'accueil"
    );
    const [currentFile, setCurrentFile] = useState<any>(null);
    const [showFileModal, setShowFileModal] = useState(false);

    const [selectedOffreBourse, setSelectedOffreBourse] = useState<any>(null);
    const selectedBourseId = dossier.annonce_bourse_externe?.id;
    useEffect(() => {
        async function loadBourseInfos() {
            if (!selectedBourseId) return;

            setLoading(true);
            try {
                const data = await getInfosBourseById(Number(selectedBourseId));
                setSelectedOffreBourse(data);
            } catch (error) {
                console.error("Erreur récupération bourse:", error);
            } finally {
                setLoading(false);
            }
        }
        loadBourseInfos();
    }, [selectedBourseId]);
    /*if (!selectedBourseId) return null;*/

    const handleOpenModal = async () => {
        const fileUrl = lettreAccueil ? `/pieces_jointes/${dossier.numero_dossier}/${lettreAccueil.nom_fichier}` : "";
        const isPDF = lettreAccueil?.nom_fichier?.toLowerCase().endsWith('.pdf') ?? false;

        setCurrentFile(lettreAccueil);

        if (isPDF) {
            setLoading(true);
            try {
                // Utilisation de l'API pour éviter les erreurs 0 bytes / 204
                const response = await fetch(`/api/pdf?path=${encodeURIComponent(fileUrl)}`);
                const arrayBuffer = await response.arrayBuffer();
                setPdfData(new Uint8Array(arrayBuffer));
                setShowFileModal(true);
            } catch (error) {
                alert("Erreur de chargement de la lettre");
            } finally {
                setLoading(false);
            }
        } else {
            setImageZoom(1); // Reset zoom
            setOffset({ x: 0, y: 0 }); // Reset position
            setShowFileModal(true);
        }
    };

  return (
    <div className="space-y-16">
  
        <h2 className="text-md font-bold uppercase tracking-wide text-(--color-theme-dark-blue) mb-8 flex items-center gap-4 p-4 bg-amber-100 border border-amber-200 rounded-2xl">
            Informations sur la bourse demandée
        </h2>
      
        {/* --- SECTION 05 : BOURSE DEMANDÉE --- */}
        <section className="">
            <h3 className="text-md font-bold uppercase tracking-widest text-(--color-theme-green) mb-8 flex items-center gap-4">
                05. Bourse demandée <span className="h-px flex-1 bg-slate-100"></span>
            </h3>

            {/* Container Principal avec un léger fond pour faire ressortir les cartes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CARTE 1 : Type de Bourse */}
                <div className="md:col-span-3 lg:col-span-1 flex items-start gap-6 relative p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <div className="h-16 w-16 rounded-2xl bg-theme-green/10 flex items-center justify-center border border-theme-green/20">
                        <GraduationCap className="text-(--color-theme-green)" size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                        <SimpleField 
                            label="Type de bourse :" 
                            value={dossier.type_bourse?.libelle} 
                        />
                    </div>
                </div>

                {/* CARTE 2 : Spécialités */}
                <div className="md:col-span-3 lg:col-span-2 flex items-start gap-6 relative p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <div className="h-16 w-16 rounded-2xl bg-theme-green/10 flex items-center justify-center border  border-theme-green/20">
                        <Sparkles className="text-(--color-theme-green)" size={32} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-regular text-slate-500 tracking-[0.05em] mb-2 block">Spécialités demandées :</p>
                        <div className="flex flex-wrap gap-2">
                            {dossier.specialites
                                ?.split(/[;,]/)
                                .map((s: string) => s.trim())
                                .filter((s: string) => s !== "")
                                .map((spec: string, index: number) => (
                                    <span 
                                        key={index} 
                                        className="flex items-center gap-2 bg-theme-green/5 border border-theme-green/20 text-(--color-theme-green) px-4 py-1.5 rounded-xl text-sm font-semibold"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-(--color-theme-grey)"></span>
                                        {spec}
                                    </span>
                                )) || <span className="text-slate-400 italic text-sm">Aucune spécialité spécifiée</span>
                            }
                        </div>
                    </div>
                </div>

                {/* CARTE 3 : Pays demandés */}
                <div className="md:col-span-3 flex items-start gap-6 relative p-5 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
                        <Globe2 className="text-amber-600" size={32} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-regular text-slate-500 tracking-[0.05em] mb-2 block">Pays demandés :</p>
                        <div className="flex flex-wrap gap-2">
                            {dossier.pays_demandes
                                ?.split(/[;,]/)
                                .map((p: string) => p.trim())
                                .filter((p: string) => p !== "")
                                .map((pays: string, index: number) => (
                                    <span 
                                        key={index} 
                                        className="flex items-center gap-2 bg-theme-green/5 border border-theme-green/20 text-(--color-theme-green) px-4 py-1.5 rounded-xl text-sm font-semibold"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-(--color-theme-green)"></span>
                                        {pays}
                                    </span>
                                )) || <span className="text-slate-400 italic text-sm">Aucun pays spécifié</span>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </section>

        {selectedBourseId && selectedOffreBourse && (
            <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="w-1.5 h-6 bg-(--color-theme-green) rounded-full"></div>
                    <h3 className="text-md font-bold uppercase tracking-widest text-(--color-theme-green)">
                        Offre de bourses rattachée à ce dossier <span className="h-px flex-1 bg-slate-100"></span>
                    </h3>
                </div>

                <div className="group relative overflow-hidden bg-white dark:bg-(--color-theme-dark-blue) border border-slate-200/60 rounded-3xl shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-theme-green/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-theme-green/10 transition-colors"></div>
                    <div className="p-4 md:p-4 flex flex-col lg:flex-row items-start gap-8 relative z-10">
                        <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-(--color-theme-dark-blue) text-white shadow-lg rotate-0 group-hover:-rotate-6 transition-transform duration-300">
                            <GraduationCap size={30} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="text-md font-semibold text-(--color-theme-dark-blue) dark:text-white leading-tight">
                                {selectedOffreBourse.nom_bourse}
                            </h4>
                            <p className="text-[12px] font-medium text-(--color-theme-dark-blue)">
                                <span className="text-[12px] font-medium text-slate-500 tracking-[0.05em] mb-1">Programme : </span>{selectedOffreBourse.organisme || "Programme International"}
                            </p>
                            <p className="text-[12px] font-medium text-(--color-theme-dark-blue)">
                                <span className="text-[12px] font-medium text-slate-500 tracking-[0.05em] mb-1">Année universitaire : </span>{selectedOffreBourse.annee_universitaire || "-"}
                            </p>
                            <p className="text-[12px] font-medium text-(--color-theme-dark-blue)">
                                <span className="text-[12px] font-medium text-slate-500 tracking-[0.05em] mb-1">Langue d'enseignement : </span>
                                {selectedOffreBourse.langue_enseignement?.length > 0 
                                ? selectedOffreBourse.langue_enseignement.join(', ') 
                                : "-"}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-4 lg:pt-0 lg:border-l lg:pl-8 border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-[12px] font-medium text-slate-500 tracking-[0.05em] mb-1 block">Pays d'accueil</span>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-slate-800 rounded-xl text-sm font-semibold border border-blue-100">
                                    <Globe2 size={14} />
                                    {selectedOffreBourse.pays}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-medium text-slate-500 tracking-[0.05em] mb-1 block">Limite de dépôt</span>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold border border-rose-100">
                                    <Clock size={14} />
                                    {new Date(selectedOffreBourse.limite_candidature).toLocaleDateString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'})}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* --- SECTION 06 :  --- */}
        {(dossier.type_bourse_id == 2) && (
            <section>
                <h3 className="text-md font-bold uppercase tracking-widest text-(--color-theme-green) mb-8 flex items-center gap-4">
                06. Institution ou organisme d'accueil sollicité <span className="h-px flex-1 bg-slate-100"></span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                    <div className="md:col-span-8">
                        <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                            <SimpleField 
                                label="Nom de l'organisme :" 
                                value={dossier.organisme_sollicite || "Aucun"} 
                            />
                            <SimpleField 
                                label="Contacts du responsable :" 
                                value={dossier.organisme_detail_contact || "Aucun"} 
                            />
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-regular text-slate-500 tracking-[0.05em]">Lettre d'accueil :</label>
                                <div className="flex flex-col gap-3 bg-slate-50 px-5 py-2 rounded-xl border border-slate-200">
                                    <span className="text-sm font-semibold text-slate-700 flex-1">
                                        {lettreAccueil?.nom_fichier || "Aucun fichier"}
                                    </span>
                                    
                                    {lettreAccueil?.nom_fichier && (
                                    <div className="inline-flex gap-4">
                                        <a
                                            href={`/pieces_jointes/${dossier.numero_dossier}/${lettreAccueil.nom_fichier}`}
                                            download={lettreAccueil.nom_fichier}
                                            className="flex items-center gap-2 bg-white border border-(--color-theme-green) text-(--color-theme-green) px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:bg-(--color-theme-green) hover:text-white group"
                                            title="Télécharger le fichier"
                                        >
                                            <Download size={20} />
                                            Télécharger
                                        </a>

                                        <button
                                            disabled={loading}
                                            onClick={handleOpenModal}
                                            className="flex items-center gap-2 bg-white border border-(--color-theme-green) text-(--color-theme-green) px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:bg-(--color-theme-green) hover:text-white group"
                                        >
                                            <Eye size={20} />
                                            {loading ? "Chargement..." : "Consulter"}
                                        </button>
                                    </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* --- SECTION OPTIONNELLE : ORGANISMES EXTERNES --- */}
        {(dossier.organisme_sollicite || dossier.autre_depot_externe) && (dossier.type_bourse_id == 2) && (
            <section>
                <h3 className="text-md font-bold uppercase tracking-widest text-(--color-theme-green) mb-8 flex items-center gap-4">
                    07. Autres demandes de bourse effectuées <span className="h-px flex-1 bg-slate-100"></span>
                </h3>
                {/*<div className="mb-4"><span className="text-sm font-semibold text-slate-800 mb-4">Demande de bourses déjà déposée auprès des organismes nationaux ou étrangers ( <span className="text-sm font-medium text-(--color-theme-green) underline">Nombre :</span></span> <span className="text-md font-extrabold text-(--color-theme-green)">{dossier.nombre_depot_externe} <span className="text-sm font-medium text-(--color-theme-green)">demandes</span></span> )</div>*/}
                <div className="text-sm font-semibold text-slate-800 mb-4">Demande de bourses déjà déposée auprès des organismes nationaux ou étrangers</div>
                
                {/* 1. État Global (Sorti du bloc bleu) */}
                <div className="mb-6 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">Dépôt externe effectué :</span>
                        <span className={`px-6 py-1 rounded-full text-md font-medium uppercase ${dossier.autre_depot_externe ? 'bg-(--color-theme-green) text-white' : 'bg-(--color-theme-red) text-white'}`}>
                            {dossier.autre_depot_externe ? "Oui" : "Non"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">Nombre de demandes :</span> 
                        <span className="px-6 py-1 rounded-full text-md font-medium uppercase bg-(--color-theme-yellow) text-gray-900">
                            {dossier.nombre_depot_externe}
                        </span>
                    </div>
                </div>
                
                {/* 2. Affichage des détails si "Oui" */}
                    {dossier.autre_depot_externe && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dossier.depots_externes?.map((depot: { id: any; nature_bourse: any; specialite: any; organisme_sollicite: any; date_depart: string | number | Date; }, index: number) => (
                                <div key={depot.id || index} className="p-6 bg-green-50 rounded-2xl border border-green-200 relative overflow-hidden">
                                    {/* Badge de numérotation discret en fond */}
                                    <div className="absolute top-2 right-4 text-4xl font-black text-green-800/50">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div className="relative space-y-3">
                                        <h4 className="text-sm font-bold text-(--color-theme-green) uppercase tracking-wider mb-4">Détails de la demande déposée</h4>
                                        
                                        <SimpleField label="Nature de la bourse :" value={depot.nature_bourse} />
                                        <SimpleField label="Spécialité :" value={depot.specialite} />
                                        <SimpleField label="Organisme sollicité :" value={depot.organisme_sollicite} />
                                        <SimpleField 
                                            label="Date de départ :" 
                                            value={depot.date_depart ? new Date(depot.date_depart).toLocaleDateString('fr-FR') : "-"} 
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Message si déclaré "Oui" mais liste vide */}
                            {(!dossier.depots_externes || dossier.depots_externes.length === 0) && (
                                <div className="md:col-span-2 p-6 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-700 italic text-center">
                                    Aucun détail spécifique n'a été renseigné pour ces demandes.
                                </div>
                            )}
                        </div>
                    )}
            </section>
        )}

        {showFileModal && (
            <div 
                className="fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
                onClick={() => {
                    setShowFileModal(false);
                    setPdfData(null);
                    setImageZoom(1);
                }}
            >
                <div 
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden" 
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    {/* Header Dynamique (utilisera les infos de lettreAccueil) */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white z-10">
                        <div>
                            <h3 className="font-bold text-slate-800 truncate uppercase tracking-tight">
                                {currentFile?.type_piece || "Document"}
                            </h3>
                            <span className="text-xs font-regular text-slate-500 tracking-[0.05em]">
                                {currentFile?.nom_fichier || ""}
                            </span>
                        </div>
                        <button 
                            onClick={() => { setShowFileModal(false); setPdfData(null); }} 
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors hover:text-(--color-theme-green)"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Contenu : PDF ou IMAGE avec DRAG & ZOOM */}
                    <div className="flex-1 overflow-hidden bg-slate-100">
                        <div className="h-full w-full">
                            {currentFile?.nom_fichier?.toLowerCase().endsWith('.pdf') ? (
                                pdfData ? (
                                    <Worker workerUrl={workerUrl}>
                                        <Viewer 
                                            fileUrl={pdfData} 
                                            plugins={[defaultLayoutPluginInstance]} 
                                            localization={fr_FR as any}
                                        />
                                    </Worker>
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <span className="animate-pulse text-slate-400 text-sm">Chargement sécurisé du document...</span>
                                    </div>
                                )
                            ) : (
                                <div 
                                className="relative h-full w-full bg-slate-200 overflow-hidden flex items-center justify-center p-6 group cursor-grab active:cursor-grabbing"
                                onMouseDown={(e) => {
                                    setIsDragging(true);
                                    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
                                }}
                                onMouseMove={(e) => {
                                    if (!isDragging) return;
                                    setOffset({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
                                }}
                                onMouseUp={() => setIsDragging(false)}
                                onMouseLeave={() => setIsDragging(false)}
                                >
                                {/* Zoom Controls */}
                                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); setImageZoom(prev => Math.min(prev + 0.25, 4)); }} className="p-2 bg-white rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 text-slate-700"><Plus size={20} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); setImageZoom(1); setOffset({ x: 0, y: 0 }); }} className="px-2 bg-white rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700">{Math.round(imageZoom * 100)}%</button>
                                    <button onClick={(e) => { e.stopPropagation(); setImageZoom(prev => Math.max(prev - 0.25, 0.5)); }} className="p-2 bg-white rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 text-slate-700"><Minus size={20} /></button>
                                </div>

                                <div 
                                    className="transition-transform duration-75 ease-out origin-center" 
                                    style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${imageZoom})`, userSelect: 'none' }}
                                >
                                    <img 
                                        src={`/pieces_jointes/${dossier.numero_dossier}/${currentFile?.nom_fichier}`} 
                                        alt="Aperçu" 
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-white pointer-events-none" 
                                    />
                                </div>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400 bg-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-200">
                                    <Move size={12} />
                                    Maintenez et glissez pour déplacer
                                </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-3 border-t border-slate-100 text-right bg-white">
                        <button 
                            onClick={() => { setShowFileModal(false); setPdfData(null); }}
                            className="inline-flex items-center gap-2 rounded-md bg-(--color-theme-green) px-6 py-2 text-sm font-bold text-white hover:bg-(--color-theme-yellow) transition shadow-sm"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        )}

        
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
    <div className="text-slate-300 pt-1">
      <Icon size={18} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-sm font-regular text-slate-500 tracking-[0.05em]">{label}</p>
      <p className="text-sm font-medium text-slate-700 break-all">{value || "—"}</p>
    </div>
  </div>
);