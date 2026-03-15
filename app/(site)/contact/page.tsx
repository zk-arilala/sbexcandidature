import React from 'react';
import { Phone, Mail, MapPin, Globe, Clock, HelpCircle, MessageCircle, ArrowBigLeft, ArrowRight, ChevronsLeft, ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact SBEX",
  description: "Contacts et adresse du Service ds Bourses Extérieurs",
};

const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Service Support",
      detail: "+261 20 22 XXX XX",
      description: "Pour toute assistance technique sur la plateforme ou demandes d'informations.",
      action: "Appeler",
      link: "tel:+261202200000",
      color: "green"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Adresse Email",
      detail: "contact@sbex.mg",
      description: "Envoi de documents officiels et demandes d'informations.",
      action: "Écrire",
      link: "mailto:contact@sbex.mg",
      color: "green"
    }
  ];

export default function ContactPage() {
  return (
    <div>
      <section className="bg-white py-5 md:py-5">
        <div className="wrapper">
          <div className=" max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-[20px]">
              <div className="flex">
                  <div className="flex-[0_0_100%] min-w-0 relative h-60 md:h-60">
                    
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
        </div>
      </section>
      
      <section className="bg-white py-5 md:py-5">
        <div className="wrapper">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-12">
              <h3 className="text-gray-800 font-bold dark:text-white text-3xl mb-2">
                Pour nous contacter!
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className="group relative p-8 bg-gray-50 dark:bg-gray-800/40 rounded-[20px] border border-transparent hover:border-(--color-theme-green) hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className={`mb-6 inline-block p-4 rounded-2xl bg-white dark:bg-gray-700 shadow-sm group-hover:scale-110 transition-transform duration-300 text-(--color-theme-green) group-hover:bg-(--color-theme-green) group-hover:text-white`}>
                    {method.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{method.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                    {method.description}
                  </p>
                  <div className="text-lg font-mono font-semibold text-gray-800 dark:text-gray-200 mb-6">
                    {method.detail}
                  </div>
                  <a 
                    href={method.link}
                    className="inline-flex items-center gap-4 font-semibold text-(--color-theme-green) hover:text-(--color-theme-yellow) transition-colors"
                  >
                    {method.action} maintenant
                    <MoveRight />
                  </a>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center bg-(--color-theme-green) rounded-[20px] p-8 md:p-8 overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-8">Adresse & horaires</h2>
                
                <div className="space-y-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <div className="flex items-start gap-5">
                    <div className="bg-white p-3 rounded-2xl"><MapPin className="w-6 h-6 text-(--color-theme-yellow)" /></div>
                    <div>
                      <p className="text-(--color-theme-yellow) text-sm font-medium tracking-widest">Siège Physique :</p>
                      <p className="text-white text-md font-medium mt-1">Immeuble MESUPRES<br />Antananarivo 101, Madagascar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="bg-white p-3 rounded-2xl"><Clock className="w-6 h-6 text-(--color-theme-yellow)" /></div>
                    <div>
                      <p className="text-(--color-theme-yellow) text-sm font-medium tracking-widest">Horaires d'ouverture :</p>
                      <p className="text-white text-md font-medium mt-1">Lundi au Vendredi : 08h00 à 16h00<br />Fermé les week-ends et jours fériés</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
