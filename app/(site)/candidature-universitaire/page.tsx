import { prisma } from "@/lib/prisma";
import CandidatureUniversitaireForm from "@/components/forms/CandidatureUniversitaireForm";
import { getRegionsASC, getProvincesASC, getTypesBourseASC, getPaysBourseById } from "@app/actions";
import { SessionProvider } from "@/context/SessionContext";

export const metadata = {
  title: "SBEX - Formulaire de candidature au bourse universitaire",
  description: "Dépôt de candidature en ligne pour une bourse universitaire",
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

  return (
    <div>
      <section className="bg-white py-14 md:py-5">
        <div className="wrapper">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12">
                <div className="lg:px-12 p-8 bg-(--color-theme-green) lg:pb-0 lg:p-12 relative rounded-[20px] h-full lg:flex lg:flex-row justify-between bg-cover flex-col gap-5">
                  <div className="mx-auto mb-12 text-center">
                    <h2 className="mb-3 font-bold text-center text-white text-3xl md:text-title-xl">
                      Formulaire de candidature <br/>aux bourses <span className="underline">Universitaire</span>
                    </h2>
                    <p className="max-w-xl mx-auto leading-6 text-gray-100 font-light">
                      Vous avez le baccalauréat et souhaitez poursuivre votre parcours universitaire ? Déposer votre demande ici.
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
            <CandidatureUniversitaireForm 
              regions={regions}
              provinces={provinces}
              typesBourse={typesBourse}
              defaultPaysDemande={defaultPaysDemande}
            />
            </SessionProvider>
          </div>
        </div>
        
      </section>

    </div>
  );
}
