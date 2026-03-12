"use client"

import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import { ReactNode } from "react"

type AlertType = "success" | "error" | "warning" | "info"

type Props = {
  open: boolean
  type: AlertType
  title: string
  message: string | ReactNode
  onClose: () => void
}

const styles = {
  success: {
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-300",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-300",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-300",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-300",
  },
}

export default function AlertModal({
  open,
  type,
  title,
  message,
  onClose,
}: Props) {
  if (!open) return null

  const Icon = styles[type].icon

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/40">
      <div
        className={`w-full max-w-lg rounded-lg border p-6 shadow-lg
        ${styles[type].bg} ${styles[type].border}`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-7 h-7 ${styles[type].text}`} />

          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${styles[type].text}`}>
              {title}
            </h3>
            <div className="mt-2 text-sm text-gray-700 leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-md
              bg-gray-700 text-white px-4 py-2 text-sm
              hover:bg-gray-800 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
