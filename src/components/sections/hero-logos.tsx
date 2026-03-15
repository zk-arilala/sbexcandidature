import Image from "next/image";
import React from "react";

export default function HeroLogos() {
  return (
    <div className="wrapper">
      <div className="max-w-254 relative z-30 mx-auto pt-14 pb-16">
        {/*<p className="text-center text-white/50 text-lg font-medium">
          Trusted by worlds largest companies including...
        </p>*/}
        <div className="flex flex-wrap justify-center items-center gap-7 md:gap-20">
          <Image
            src="/images/brands/logo_presidence_yellow.png"
            className="opacity-100 transition hover:opacity-100"
            alt=""
            width={150}
            height={32}
          />
          <Image
            src="/images/brands/logo_mesupres_blanc.png"
            className="opacity-100 transition hover:opacity-100"
            width={150}
            height={32}
            alt=""
          />
          <Image
            src="/images/brands/dbne.svg"
            className="opacity-50 transition hover:opacity-100"
            width={150}
            height={32}
            alt=""
          />
          <Image
            src="/images/brands/sbex.svg"
            className="opacity-50 transition hover:opacity-100"
            alt=""
            width={150}
            height={32}
          />
        </div>
      </div>
    </div>
  );
}
