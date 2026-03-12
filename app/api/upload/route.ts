import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "pieces_jointes")
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]

function generateFileName(
  numeroDossier: string,
  pieceKey: string,
  originalName: string
) {
  const extension = originalName.split(".").pop()?.toLowerCase() || "pdf"

  return `${numeroDossier}_${pieceKey}.${extension}`
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const numeroDossier = formData.get("numero_dossier") as string | null
    const pieceKey = formData.get("piece_key") as string | null

    if (!file || !numeroDossier || !pieceKey) {
      return NextResponse.json({ error: "Paramètres manquantes" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé" }, { status: 400 })
    }

    const dossier = join(UPLOAD_DIR, numeroDossier)
    if (!existsSync(dossier)) {
      await mkdir(dossier, { recursive: true })
    }

    const filename = generateFileName(numeroDossier, pieceKey, file.name)
    const filePath = join(dossier, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      nom_fichier: filename,
      chemin_public: `/pieces_jointes/${numeroDossier}/${filename}`,
    })
  } catch (error) {
    console.error("Erreur upload:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
