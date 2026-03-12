import { prisma } from '@/lib/prisma';
import BoursesListClient from './bourses-list';
import { BellRing, Ghost } from 'lucide-react';

export default async function BoursesExternesSection() {

    const boursesDisponible = await prisma.bourseExterne.findMany({
      where: {
        disponibilite: 1,
      },
      orderBy: {
        date_publication: 'desc',
      },
    });

    const hasBourses = boursesDisponible.length > 0;

    return (
      <section className="md:py-28 md:pb-15 py-14 relative">
        <div className="wrapper">
            <div>
                <div className="max-w-2xl mx-auto mb-12 text-center">
                  <h2 className="mb-3 font-bold text-center text-(--color-theme-dark-blue) text-3xl dark:text-white/90 md:text-title-lg">
                      Les bourses disponibles
                  </h2>
                  <p className="max-w-xl mx-auto leading-6 text-(--color-theme-grey) dark:text-gray-400">
                      Vous trouverez ici la liste des bourses disponibles en ce moment
                  </p>
                </div>

                {hasBourses ? (
                  <BoursesListClient bourses={boursesDisponible} />
                ) : (
                  /* MESSAGE STYLE SI VIDE */
                  <div className="max-w-3xl mx-auto">
                    <div className="relative p-10 md:p-16 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50">
                      {/* Décoration d'arrière-plan */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-theme-green/5 rounded-full blur-3xl"></div>
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-6 p-5 bg-white rounded-3xl shadow-sm border border-slate-100">
                          <Ghost size={48} className="text-slate-300 animate-bounce" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          Aucune offre de bourse n’est disponible pour le moment.
                        </h3>
                        <p className="text-slate-500 max-w-sm mb-8">
                          Toutes les offres de bourses d'études ont été clôturées. Revenez très bientôt pour découvrir de nouvelles opportunités.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </div>
      </section>
    );
  }
