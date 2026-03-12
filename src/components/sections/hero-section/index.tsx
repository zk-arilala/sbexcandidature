import Image from 'next/image';
import Link from 'next/link';
import HeroLogos from '../hero-logos';
import { prisma } from '@/lib/prisma';

export default async function HeroSection() {
  const countBoursesDispo = await prisma.bourseExterne.count({
      where: {
        disponibilite: 1,
      },
    });
    
  return (
    <section className="hero-glow-bg pt-16 relative overflow-hidden dark:bg-[#171F2E]">
      <div className="max-w-480 mx-auto relative">
        <HeroLogos />
        <div className="wrapper">
          <div className="max-w-300 mx-auto">
            <div className="text-center pb-16">

              <h1 className="text-white mx-auto font-bold mb-4 text-4xl sm:text-[50px] dark:text-white/90 sm:leading-14 max-w-250">
                Plateforme de dépôt de candidature aux bourses d'études extérieurs
              </h1>
              <p className="max-w-200 text-center mx-auto dark:text-gray-400 text-gray-500 text-base">
                Cette plateforme permet aux étudiants de soumettre leurs candidatures aux bourses universitaires et post-universitaires de manière simple, sécurisée et entièrement en ligne.
              </p>

              <div className="mt-9 flex sm:flex-row flex-col gap-3 relative z-5 items-center justify-center">
                <Link href="#" className="bg-(--color-theme-green) tracking-wide transition h-12 inline-flex items-center justify-center hover:bg-(--color-theme-yellow) hover:text-(--color-theme-dark-blue) px-6 py-3 rounded-full text-white text-sm" >
                  Offres de bourses disponibles : <span className="font-semibold pl-4 text-xl">{countBoursesDispo}</span>
                </Link>

              </div>
            </div>
          </div>
          <div className="max-w-250 mx-auto relative">
            
            <div className="absolute hidden lg:block z-10 -top-20 -translate-y-20 left-1/2 -translate-x-1/2">
              <svg
                width="1300"
                height="1001"
                viewBox="0 0 1300 1001"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.7" filter="url(#filter0_f_9279_7148)">
                  <circle cx="800" cy="500.03" r="300" fill="#4E6EFF" />
                </g>
                <g opacity="0.3" filter="url(#filter1_f_9279_7148)">
                  <circle cx="500" cy="500.03" r="300" fill="#FF58D5" />
                </g>
                <defs>
                  <filter
                    id="filter0_f_9279_7148"
                    x="300"
                    y="0.029541"
                    width="1000"
                    height="1000"
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
                      stdDeviation="100"
                      result="effect1_foregroundBlur_9279_7148"
                    />
                  </filter>
                  <filter
                    id="filter1_f_9279_7148"
                    x="0"
                    y="0.029541"
                    width="1000"
                    height="1000"
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
                      stdDeviation="100"
                      result="effect1_foregroundBlur_9279_7148"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/*<div className="max-[1100px]:hidden">
          <Image
            src="/images/hero/shape-left-1.svg"
            className="absolute top-14 left-16 floating-1"
            alt=""
            width={170}
            height={44}
          />
          <Image
            src="/images/hero/shape-left-2.svg"
            className="absolute left-36.25 top-74.5 floating-2 max-[1240px]:left-20"
            alt=""
            width={181}
            height={44}
          />
          <Image
            src="/images/hero/shape-right-1.svg"
            className="absolute right-16 top-27 floating-3"
            alt=""
            width={176}
            height={44}
          />
          <Image
            src="/images/hero/shape-right-2.svg"
            className="absolute top-79 right-50 floating-4 max-[1240px]:right-20 max-[1350px]:right-37.5 max-[1500px]:right-50"
            alt=""
            width={179}
            height={44}
          />
        </div>*/}
      </div>
    </section>
  );
}
