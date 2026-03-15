"use client";

import { getCurrentYear } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/sbex-admin')) return null;

  return (
    <footer className="relative overflow-hidden bg-theme-blue2">
      <span className="absolute top-0 -translate-x-1/2 left-1/2">
        <svg
          width="1260"
          height="457"
          viewBox="0 0 1260 457"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/*<g filter="url(#filter0_f_11105_867)">
            <circle cx="630" cy="-173.299" r="230" fill="#1A1A37" />
          </g>*/}
          <defs>
            <filter
              id="filter0_f_11105_867"
              x="0"
              y="-803.299"
              width="1260"
              height="1260"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="200"
                result="effect1_foregroundBlur_11105_867"
              />
            </filter>
          </defs>
        </svg>
      </span>
      <div className="relative z-10 py-16 xl:py-24">
        <div className="container px-5 mx-auto sm:px-7">
          <div className="grid gap-y-8 gap-x-6 lg:grid-cols-12">
            <div className="lg:col-span-6 xl:col-span-6">
              <div>
                {/* <Link href="/" className="block mb-6">
                  <Image
                    src="/images/logo-white.svg"
                    alt="logo"
                    width={128}
                    height={32}
                  />
                </Link>*/}
                <h4 className="block text-gray-400 mb-3">
                  Plateforme de candidature aux bourses d'études extérieurs
                </h4>
                <p className="block text-sm text-gray-400 mb-3">
                  Service des Bourses EXterieurs (SBEX)
                </p>
                <p className="block text-sm text-gray-400 mb-9">
                  Direction des Bourses Nationales et Extérieures (DBNE)<br/> Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
                </p>
                
              </div>
            </div>

            <div className="lg:col-span-6 xl:col-span-6">
              <div className="grid sm:grid-cols-2 gap-7">
                <div>
                  <h4 className="relative block mb-6 text-(--color-theme-red) font-bold">
                    Liens rapides
                  </h4>
                  <nav className="flex flex-col space-y-3">
                    <Link target="_blank" href="https://www.mesupres.gov.mg/" className="text-sm font-normal text-gray-400 transition hover:text-white" >
                      Site officiel du MESUPRES
                    </Link>
                    <Link href="/bourses_disponibles" className="text-sm font-normal text-gray-400 transition hover:text-white" >
                      Les bourses disponibles
                    </Link>
                    <Link href="/candidature-universitaire" className="text-sm font-normal text-gray-400 transition hover:text-white" >
                      Candidature aux bourses Universitaires
                    </Link>
                    <Link href="/candidature-post-universitaire" className="text-sm font-normal text-gray-400 transition hover:text-white" >
                      Candidature aux bourses Post-Universitaires
                    </Link>
                  </nav>
                </div>
                
                <div>
                  <h4 className="relative block mb-6 text-(--color-theme-red) font-bold">
                    Localisation et Contacts
                  </h4>
                  <nav className="flex flex-col space-y-3">
                    <p className="block text-sm text-gray-400 mb-3">
                      <strong>Adresse :</strong> Antananarivo, Madagascar
                    </p>
                    <p className="block text-sm text-gray-400 mb-3">
                      <strong>Téléphone :</strong> -
                    </p>
                    <p className="block text-sm text-gray-400 mb-3">
                      <strong>Adresse email :</strong> -
                    </p>
                  </nav>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container relative z-10 px-5 mx-auto sm:px-7">
          <div className="py-5 text-center">
            <p className="text-sm text-gray-500">
              &copy; {getCurrentYear()} Service des Bourses EXterieurs (SBEX) - MESUPRES - Tous les droits sont réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
