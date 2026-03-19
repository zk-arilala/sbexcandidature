"use client";

import { FileText, Image, Download, Eye, X, Minus, Plus, Move } from "lucide-react"
import { useState } from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import * as pdfjs from 'pdfjs-dist';
import fr_FR from '@react-pdf-viewer/locales/lib/fr_FR.json';

// Styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function PiecesJointes({ dossier }: { dossier: any }) {
    const listPieces = dossier?.pieces_jointes || [];

    const [imageZoom, setImageZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

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

  const [currentFile, setCurrentFile] = useState<any>(null);
  const [showFileModal, setShowFileModal] = useState(false);

  const handleOpenSpecificFile = async (piece: any) => {
    const isPDF = piece.nom_fichier?.toLowerCase().endsWith('.pdf');
    const fileUrl = `/pieces_jointes/${dossier.numero_dossier}/${piece.nom_fichier}`;
    
    setCurrentFile(piece);

    if (isPDF) {
        try {
            const response = await fetch(`/api/pdf?path=${encodeURIComponent(fileUrl)}`);
            const arrayBuffer = await response.arrayBuffer();
            setPdfData(new Uint8Array(arrayBuffer));
            setShowFileModal(true);
        } catch (error) {
            alert("Erreur de chargement du PDF");
        }
    } else {
        //image
        setPdfData(null); 
        setShowFileModal(true);
    }
  };

  return (
    <div className="space-y-16">
        
      <h2 className="text-md font-bold uppercase tracking-wide text-(--color-theme-dark-blue) mb-8 flex items-center gap-4 p-4 bg-amber-100 border border-amber-200 rounded-2xl">
        Liste des pièces jointes
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {listPieces.length === 0 ? (
          <p className="text-sm text-(--color-theme-red) italic p-4">Aucune pièce jointe disponible.</p>
        ) : (
          listPieces
          .sort((a: any, b: any) => a.type_piece.localeCompare(b.type_piece))
          .map((piece: any, index: number) => {
            const isPDF = piece.nom_fichier?.toLowerCase().endsWith('.pdf');
            const fileUrl = `/pieces_jointes/${dossier.numero_dossier}/${piece.nom_fichier}`;

            return (
              <div 
                key={index} 
                className="flex flex-col md:flex-row items-start md:items-center gap-6 relative px-4 py-3 rounded-2xl bg-white shadow-sm border border-slate-100 transition-hover hover:shadow-md"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shrink-0 ${
                  isPDF ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
                }`}>
                  {isPDF ? (
                    <FileText className="text-red-600" size={28} strokeWidth={1.5} />
                  ) : (
                    <Image className="text-blue-600" size={28} strokeWidth={1.5} />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 tracking-wider mb-1">
                    {piece.type_piece}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800 tracking-tight truncate max-w-50 md:max-w-md">
                      {piece.nom_fichier}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
                  <a
                    href={fileUrl}
                    download={piece.nom_fichier}
                    className="flex items-center gap-2 bg-white border border-(--color-theme-green) text-(--color-theme-green) px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-(--color-theme-green) hover:text-white group shadow-sm"
                    title="Télécharger le fichier"
                  >
                    <Download size={18} />
                    Télécharger
                  </a>

                  <button
                    onClick={() => handleOpenSpecificFile(piece)}
                    className="flex items-center gap-2 bg-white border border-(--color-theme-green) text-(--color-theme-green) px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-(--color-theme-green) hover:text-white group shadow-sm"
                  >
                    <Eye size={18} />
                    Consulter
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showFileModal && (
        <div 
            className="fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
            onClick={() => {
                setShowFileModal(false);
                setPdfData(null);
            }}
        >
            <div 
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden" 
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* Header Dynamique */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white z-10">
                    <div>
                        <h3 className="font-bold text-slate-800 truncate">
                            {currentFile?.type_piece || "Document PDF"}
                        </h3>
                        <span className="text-sm font-regular text-slate-500 tracking-[0.05em]">
                            {currentFile?.nom_fichier || ""}
                        </span>
                    </div>
                    <button 
                        onClick={() => {
                            setShowFileModal(false);
                            setPdfData(null);
                        }} 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors hover:text-(--color-theme-green)"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Contenu : PDF (via Buffer) ou IMAGE (via URL) */}
                <div className="flex-1 overflow-hidden bg-slate-100">
                    <div className="h-full w-full">
                        {currentFile?.nom_fichier?.toLowerCase().endsWith('.pdf') ? (
                            /* type PDF */
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
                                    <span className="animate-pulse text-slate-400">Chargement du lecteur...</span>
                                </div>
                            )
                        ) : (
                            /* type Image */
                            <div 
                              className="relative h-full w-full bg-slate-200 overflow-hidden flex items-center justify-center p-6 group cursor-grab active:cursor-grabbing"
                              onMouseDown={(e) => {
                                  setIsDragging(true);
                                  // On calcule la position de départ par rapport à l'offset actuel
                                  setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
                              }}
                              onMouseMove={(e) => {
                                  if (!isDragging) return;
                                  // Mise à jour de la position pendant le glissement
                                  setOffset({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
                              }}
                              onMouseUp={() => setIsDragging(false)}
                              onMouseLeave={() => setIsDragging(false)}
                            >
                              {/* Contrôles de Zoom Flottants */}
                              <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); setImageZoom(prev => Math.min(prev + 0.25, 4)); }}
                                      className="p-2 bg-white rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                                      title="Zoomer"
                                  >
                                      <Plus size={20} />
                                  </button>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); setImageZoom(1); setOffset({ x: 0, y: 0 }); }}
                                      className="px-2 bg-white rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                                      title="Réinitialiser"
                                  >
                                      {Math.round(imageZoom * 100)}%
                                  </button>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); setImageZoom(prev => Math.max(prev - 0.25, 0.5)); }}
                                      className="p-2 bg-white rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                                      title="Dézoomer"
                                  >
                                      <Minus size={20} />
                                  </button>
                              </div>

                              {/* L'image avec transformation SCALE + TRANSLATE */}
                              <div 
                                  className="transition-transform duration-75 ease-out origin-center" 
                                  style={{ 
                                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${imageZoom})`,
                                      userSelect: 'none' // Empêche la sélection du texte/image pendant le drag
                                  }}
                              >
                                  <img 
                                      src={`/pieces_jointes/${dossier.numero_dossier}/${currentFile?.nom_fichier}`} 
                                      alt="Aperçu" 
                                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-white pointer-events-none" 
                                  />
                              </div>

                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] text-slate-400 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-300">
                                  <Move size={12} className="text-slate-400" />
                                  Cliquez-maintenez et déplacez
                              </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-3 border-t border-slate-100 text-right bg-white">
                    <button 
                        onClick={() => {
                            setShowFileModal(false);
                            setPdfData(null);
                        }}
                        className="flex items-center justify-center gap-3 bg-(--color-theme-green) text-white py-3 rounded-lg hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) disabled:opacity-50 transition transition"
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
