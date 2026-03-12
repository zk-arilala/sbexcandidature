import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.utilisateur.findUnique({
            where: { user_email: email },
        });
        
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
            
            if (!isPasswordValid) {
                return NextResponse.json(
                    { error: "Le mot de passe est incorrect. Merci de vérifier!" }, 
                    { status: 401 }
                );
            }
            else {
                return NextResponse.json({
                    id: user.id,
                    email: user.user_email
                });
            }
        }
        else {
            return NextResponse.json(
                { error: `L'adresse email ${email} n'existe pas. Merci de vérifier!` }, 
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: "Erreur interne du serveur" }, 
            { status: 500 }
        );
    }
}
