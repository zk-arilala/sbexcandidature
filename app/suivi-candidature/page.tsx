"use client"

import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import { getCandidatureByNumero } from "./actions"
import AlertModal from "@/components/ui/AlertModal"
import Image from "next/image";

export default function SuiviCandidaturePage() {
  const [numero, setNumero] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [modal, setModal] = useState<{
      open: boolean
      type: "success" | "error" | "warning" | "info"
      title: string
      message: string | ReactNode
      onClose?: () => void
    }>({
      open: false,
      type: "info",
      title: "",
      message: "",
      onClose: undefined,
    })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!numero.trim()) return
    //router.push(`/suivi-candidature/${numero}`)
    setIsLoading(true)

    try {
      const dossier = await getCandidatureByNumero(numero.trim())

      if (!dossier) {
        setModal({
          open: true,
          type: "error",
          title: `Dossier N° ${numero} introuvable`,
          message: `Le dossier portant le numéro ${numero} n'existe pas. Merci de verifier et entrer le bon numéro de dossier.`,
        })
      } else {
        router.push(`/suivi-candidature/${numero}`)
      }
    } catch (error) {
      setModal({
        open: true,
        type: "error",
        title: "Erreur technique",
        message: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white py-14 md:py-5">
      <section className="bg-white py-14 md:py-5">
        <div className="wrapper">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12">
                <div className="lg:px-12 p-8 bg-(--color-theme-green) lg:pb-0 lg:p-12 relative rounded-[20px] h-full lg:flex lg:flex-row justify-between bg-cover flex-col gap-5">
                  <div className="mx-auto mb-12 text-center">
                    <h2 className="mb-3 font-bold text-center text-white text-3xl dark:text-white/90 md:text-title-xl">
                      Suivi de candidature
                    </h2>
                    <p className="max-w-xl mx-auto leading-6 text-gray-100 font-light dark:text-gray-400">
                      Cette page vous permet de retrouver votre dossier et de consulter les détails de vos demandes de bourse d’études déjà déposées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-5">
        <div className="wrapper">
          <div className="max-w-6xl mx-auto border rounded-[20px] border-gray-300">
            <div className="max-w-lg mx-auto md:py-10 py-14 relative">
              
              <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Numéro de dossier"
                    value={numero.trim().toUpperCase()}
                    onChange={(e) => setNumero(e.target.value.trim().toUpperCase())}
                    className="input w-full transition-all outline-(--color-theme-green) focus:border-(--color-theme-blue2) focus:ring-1 focus:ring-(--color-theme-blue2)"
                    required
                  />
                  
                  <p className="text-sm text-gray-500 mb-4 text-center">
                      Exemple : <strong>BU-2026-2471</strong>
                  </p>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-(--color-theme-green) text-white py-3 rounded-lg hover:bg-(--color-theme-yellow)"
                    >
                    {isLoading ? "Recherche en cours..." : "Rechercher mon dossier"}
                  </button>
              </form>

            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto mt-30">
        <div className="overflow-hidden rounded-[20px]">
          <div className="flex">
              <div className="flex-[0_0_100%] min-w-0 relative h-100 md:h-90">
                
                <Image
                  src="/images/sbex/Untitled-7-01.jpg"
                  alt="Ne manquez aucune opportunité"
                  fill
                  className="object-cover"
                />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full z-10">
                  <div className="max-w-2xl">
                    <h3 className="font-bold text-white text-3xl md:text-4xl mb-4 leading-tight">
                    </h3>
                    <p className="text-lg text-white/90 max-w-lg">
                    </p>
                  </div>
                </div>

              </div>
          </div>
        </div>
      </div>

      <AlertModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        /*onClose={() => setModal({ ...modal, open: false })}*/
        onClose={() => {
          if (modal.onClose) {
            modal.onClose();
          }
          setModal(prev => ({ ...prev, open: false }));
        }}
      />
    </div>
  )
}
