import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) return new NextResponse("Path manquant", { status: 400 });

    // Construction du chemin absolu vers le dossier public
    const fullPath = path.join(process.cwd(), 'public', filePath);

    if (!fs.existsSync(fullPath)) {
        return new NextResponse("Fichier non trouvé sur le disque", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);
    
    return new NextResponse(fileBuffer, {
        headers: { 'Content-Type': 'application/pdf' },
    });
}
