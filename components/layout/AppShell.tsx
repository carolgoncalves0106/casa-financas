import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24 lg:pb-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
