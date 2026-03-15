import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ current, total, onPageChange }: PaginationProps) {
  if (total <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 1; 
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const navBtnClass = "p-2 rounded-lg border border-slate-300 bg-white text-slate-600 transition-all hover:bg-(--color-theme-yellow) hover:border-(--color-theme-yellow) hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-500";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-8">
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={current === 1}
          className={navBtnClass}
          title="Première page"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          className={cn(navBtnClass, "flex items-center gap-2 px-3")}
        >
          <ChevronLeft size={18} />
          <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Précédent</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl">
        {getPages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="w-10 text-center text-slate-400 font-bold">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "w-9 h-9 rounded-lg text-sm font-black transition-all",
                  current === page
                    ? "bg-(--color-theme-green) text-white border border-(--color-theme-green)"
                    : "text-slate-500 bg-slate-100 border border-slate-300 hover:bg-(--color-theme-yellow) hover:text-slate-900 hover:border-(--color-theme-yellow)"
                )}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(current + 1)}
          disabled={current === total}
          className={cn(navBtnClass, "flex items-center gap-2 px-3")}
        >
          <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Suivant</span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onPageChange(total)}
          disabled={current === total}
          className={navBtnClass}
          title="Dernière page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>

      <div className="text-[11px] px-3 py-2 border border-slate-400 rounded-lg font-bold text-slate-700 tracking-widest sm:absolute sm:right-10">
        Page <span className="text-slate-900">{current}</span> / {total}
      </div>
    </div>
  );
}
