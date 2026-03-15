"use server"

import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// Configuration
const UPLOAD_BASE_DIR = join(process.cwd(), 'public', 'pieces_jointes')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

// Fonction pour générer le nom du dossier candidat
export async function generateCandidateFolder(numeroDossier: string): Promise<string> {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0] // Format YYYY-MM-DD
  
  // Nettoyer le numéro de dossier (enlever les caractères spéciaux)
  const cleanNumeroDossier = numeroDossier.replace(/[^a-zA-Z0-9-_]/g, '_')
  
  return `${dateStr}_${cleanNumeroDossier}`
}

// Fonction pour générer un nom de fichier unique
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const extension = originalName.split('.').pop()?.toLowerCase() || 'pdf'
  
  // Nettoyer le nom de fichier
  const cleanName = originalName
    .substring(0, originalName.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 50)
  
  return `${cleanName}_${timestamp}_${random}.${extension}`
}

// Initialiser le dossier de base
function ensureBaseDirectoryExists() {
  if (!existsSync(UPLOAD_BASE_DIR)) {
    mkdirSync(UPLOAD_BASE_DIR, { recursive: true })
  }
}

export async function uploadFile(
  file: File,
  numeroDossier: string,
  typePiece: string,
  customName?: string
): Promise<{ 
  success: boolean; 
  nom_fichier?: string;
  chemin_dossier?: string;
  chemin_public?: string;
  error?: string 
}> {
  try {
    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'Fichier trop volumineux (max 10MB)' }
    }

    // Vérifier le type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: 'Type de fichier non autorisé' }
    }

    // S'assurer que le dossier de base existe
    ensureBaseDirectoryExists()

    // Générer le nom du dossier candidat
    const candidateFolder = await generateCandidateFolder(numeroDossier)
    const candidateDir = join(UPLOAD_BASE_DIR, candidateFolder)

    // Créer le dossier du candidat s'il n'existe pas
    if (!existsSync(candidateDir)) {
      mkdirSync(candidateDir, { recursive: true })
    }

    // Générer le nom de fichier
    const uniqueFilename = customName || generateUniqueFilename(file.name)
    const filePath = join(candidateDir, uniqueFilename)

    // Convertir File en Buffer et écrire
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Retourner les informations
    return {
      success: true,
      nom_fichier: uniqueFilename,
      chemin_dossier: candidateFolder,
      chemin_public: `/pieces_jointes/${candidateFolder}/${uniqueFilename}`
    }

  } catch (error) {
    console.error('Erreur upload:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur lors de l\'upload' 
    }
  }
}

// Fonction pour uploader plusieurs fichiers
export async function uploadMultipleFiles(
  files: File[],
  numeroDossier: string,
  typePiece: string
): Promise<{ 
  success: boolean; 
  results?: Array<{
    nom_fichier: string;
    chemin_public: string;
  }>;
  error?: string 
}> {
  const results: Array<{ nom_fichier: string; chemin_public: string }> = []
  
  for (const file of files) {
    const result = await uploadFile(file, numeroDossier, typePiece)
    if (!result.success) {
      return { success: false, error: result.error }
    }
    if (result.nom_fichier && result.chemin_public) {
      results.push({
        nom_fichier: result.nom_fichier,
        chemin_public: result.chemin_public
      })
    }
  }

  return { success: true, results }
}