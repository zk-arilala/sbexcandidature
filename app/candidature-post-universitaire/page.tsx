import { prisma } from "@/lib/prisma";
import CandidaturePostUniversitaireForm from "@/components/forms/CandidaturePostUniversitaireForm";
import { getRegionsASC, getProvincesASC, getTypesBourseASC, getDiplomesASC, getPaysBourseById } from "@app/actions";
import { SessionProvider } from "@/context/SessionContext";

export const metadata = {
  title: "SBEX - Formulaire de candidature au bourse post-universitaire",
  description: "Dépôt de candidature en ligne pour une bourse post-universitaire",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ bourseId?: string }>;
}) {
  const { bourseId } = await searchParams;
  let defaultPaysDemande = { id: 0, pays: "" };
  if (bourseId) {
    const bourseData = await getPaysBourseById(Number(bourseId));
    if (bourseData) {
      defaultPaysDemande = bourseData;
    }
  }
  
  const regions = await getRegionsASC();
  const provinces = await getProvincesASC();
  const typesBourse = await getTypesBourseASC();
  const diplomes = await getDiplomesASC();
  
  return (
    <div>
      <section className="bg-white py-14 md:py-5">
        <div className="wrapper">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12">
                <div className="lg:px-12 p-8 bg-(--color-theme-green) lg:pb-0 lg:p-12 relative rounded-[20px] h-full lg:flex lg:flex-row justify-between bg-cover flex-col gap-5">
                  <div className="mx-auto mb-12 text-center">
                    <h2 className="mb-3 font-bold text-center text-white text-3xl dark:text-white/90 md:text-title-xl">
                      Formulaire de candidature <br/>aux bourses <span className="underline">Post Universitaire</span>
                    </h2>
                    <p className="max-w-xl mx-auto leading-6 text-gray-100 font-light dark:text-gray-400">
                      Lorem ipsum dolor sit amet consectetur
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="md:py-10 py-14 relative">
        <div className="wrapper">
          <div>
            <SessionProvider>
            <CandidaturePostUniversitaireForm 
              regions={regions}
              provinces={provinces}
              typesBourse={typesBourse} 
              diplomes={diplomes}
              defaultPaysDemande={defaultPaysDemande}
            />
            </SessionProvider>
            
          </div>
        </div>
        
      </section>

    </div>
  );
}
