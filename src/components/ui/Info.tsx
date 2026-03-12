export function Info({
  label,
  value,
  badge = false,
  icon: Icon
}: {
  label: string
  value?: string
  badge?: boolean
  icon?: any
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
        {Icon && (
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                <Icon className="w-4 h-4" />
            </div>
        )}
        <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{value || "—"}</p>
        </div>
    </div>
  )
}
