import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  //poweredByHeader: false, //cacher les indices sur la technologie utilisée

  /*async headers() { 
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security', //Force le navigateur à utiliser uniquement le HTTPS (pendant 2 ans ici)
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options', //Empêche d'autres sites d'intégrer votre site dans une <iframe>, protégeant vos utilisateurs du vol de clics.
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',  //Force le navigateur à respecter le type de contenu envoyé (évite qu'un fichier texte soit interprété comme un script).
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',  //Indique au navigateur que votre site n'a pas besoin d'accéder à la caméra ou au micro, bloquant toute tentative d'exploitation malveillante.
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },*/

  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // selon le besoins
    },
  },
};


export default nextConfig;
