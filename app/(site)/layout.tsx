import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header/header';
import { SessionProvider } from '@/context/SessionContext';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark:bg-[#101828] flex flex-col flex-1">
      <div className="isolate flex-1 flex flex-col">
        <SessionProvider>
        {children}
        </SessionProvider>
      </div>
    </div>
  );
}
