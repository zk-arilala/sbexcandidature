"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Ne manquez aucune opportunité",
    desc: "Soyez informé en temps réel pour accéder aux meilleures bourses mondiales et transformez vos ambitions académiques en réalité dès aujourd'hui.",
    img: "/images/sbex/Untitled-1-01.jpg",
  },
  {
    title: "Votre futur commence ici",
    desc: "Une plateforme unique pour centraliser et faciliter vos dépôts de candidatures aux bourses d'études extérieures, sans vous déplacer.",
    img: "/images/sbex/Untitled-2-01.jpg",
  },
  {
    title: "Prêt à franchir les frontières ?",
    desc: "Créez votre profil candidat en 2 minutes pour commencez à postuler aux meilleurs bourses d'études parmis les destinations académiques les plus prestigieuses.",
    img: "/images/sbex/Untitled-3-01.jpg",
  },
  {
    title: "Des bourses d'études pour chaque profil",
    desc: "Licence, Master, Doctorat ou Formations diplômantes : saisissez de nouvelles opportunités de formations adaptées à votre profil. Ne perdez plus de temps, envoyer votre candidature directement en ligne.",
    img: "/images/sbex/Untitled-4-01.jpg",
  },
];

export default function SliderImage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ 
      delay: 7000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  ]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-14 md:py-5">
      <div className="wrapper">
        <div className="max-w-6xl mx-auto relative group">
          
          <div className="overflow-hidden rounded-[20px]" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 relative h-100 md:h-90">
                  
                  {/* Image en Pleine Largeur (Background) */}
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />

                  {/* Overlay Sombre pour la lisibilité du texte */}
                  <div className="absolute inset-0 bg-black/40 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                  {/* Contenu Texte (Caption) */}
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full z-10">
                    <div className="max-w-2xl">
                      <h3 className="font-bold text-white text-3xl md:text-4xl mb-4 leading-tight">
                        {slide.title}
                      </h3>
                      <p className="text-lg text-white/90 max-w-lg">
                        {slide.desc}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Navigation - Flèches */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
