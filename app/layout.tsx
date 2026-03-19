import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Poppins } from 'next/font/google';
import './globals.css';
import { ToasterProvider } from './providers/toaster';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header/header';
import { SessionProvider } from '@/context/SessionContext';
import { Toaster } from 'sonner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: "SBEX - Plateforme de candidature aux bourses d'études extérieurs",
  description: "Plateforme de dépôt de candidature aux bourse d'études internationales",
};

export const viewport = {
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`bg-gray-50 min-h-screen flex flex-col ${poppins.className}`} suppressHydrationWarning>
        <SessionProvider>
          <Header />

          <ThemeProvider disableTransitionOnChange>
            {/*<ToasterProvider />*/}
            <div className="isolate flex flex-col flex-1 relative z-40">
              <SessionProvider>
              {children}
              </SessionProvider>
            </div>
          </ThemeProvider>

          <Footer />
        </SessionProvider>

        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
