import { SidebarProvider } from "@/context/AdminSidebarContext";
import Sidebar from "@/components/admin/Sidebar";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminHeader from "@/components/admin/Header";
import { SessionProvider } from "@/context/SessionContext";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
             <AdminHeader />
             <main className="p-4 md:p-8 overflow-y-auto">
              <SessionProvider>
                {children}
              </SessionProvider>
             </main>
          </div>
        </div>
      </AdminGuard>
    </SidebarProvider>
  );
}
