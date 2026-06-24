"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import { LogOut, LayoutDashboard, Users, LineChart } from "lucide-react";

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Data Responden", href: "/admin/responses", icon: Users },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-10 h-full">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
              <span className="font-semibold text-lg text-neutral-950 tracking-tight">
                AdminPanel
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 h-full">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center h-full text-sm font-medium transition-colors border-b-2 pt-[2px] ${
                      isActive
                        ? "border-neutral-900 text-neutral-900"
                        : "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Floating Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-[280px]">
        <div className="bg-white/90 backdrop-blur-md border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full px-2 py-2 flex justify-around items-center text-neutral-500">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${
                  isActive ? "text-neutral-900" : "hover:text-neutral-800"
                }`}
              >
                <div className={`p-1.5 rounded-full ${isActive ? "bg-neutral-100" : "transparent"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium tracking-wide">
                  {link.name === "Data Responden" ? "Responden" : link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
