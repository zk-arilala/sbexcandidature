import MesCandidatures from "@/components/MesCandidatures";

export const metadata = {
  title: "Mes Candidatures | SBEX",
};

export default function Page() {
  return (
    <div className="pb-10">
      <section className="bg-white py-14 md:py-5">
        <div className="wrapper">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12">
                <div className="lg:px-12 p-8 bg-(--color-theme-green) lg:pb-0 lg:p-12 relative rounded-[20px] h-full lg:flex lg:flex-row justify-between bg-cover flex-col gap-5">
                  <div className="mx-auto mb-12 text-center">
                    <h2 className="mb-3 font-bold text-center text-white text-3xl dark:text-white/90 md:text-title-xl">
                      Mes Candidatures
                    </h2>
                    <p className="max-w-xl mx-auto leading-6 text-gray-100 font-light dark:text-gray-400">
                      Vous trouvez ici la liste de vos demandes de bourses d'études.
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
            <div className="max-w-6xl mx-auto">
                <MesCandidatures />
            </div>
        </div>
      </section>

      </div>
  );
}
