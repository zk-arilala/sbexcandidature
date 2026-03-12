"use client";
import { X, GraduationCap, School } from "lucide-react";
import Link from "next/link";

export default function PostulezModal({ bourseId, isOpen, onClose }: { 
    bourseId?: number | null, 
    isOpen: boolean, 
    onClose: () => void 
}) {
  if (!isOpen) return null;

  const getUrl = (base: string) => bourseId ? `${base}?bourseId=${bourseId}` : base;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Choisissez le type de candidature</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 grid gap-4">
          {/* Option Universitaire */}
          <Link 
            href={getUrl("/candidature-universitaire")}
            className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
          >
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <School size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Universitaire</p>
              <p className="text-xs text-slate-500">Licence / Premier cycle</p>
            </div>
          </Link>

          {/* Option Post-Universitaire */}
          <Link 
            href={getUrl("/candidature-post-universitaire")}
            className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition group"
          >
            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Post-Universitaire</p>
              <p className="text-xs text-slate-500">Master / Doctorat / Recherche</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
