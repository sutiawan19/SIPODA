"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import { LogOut, LayoutDashboard, Users } from "lucide-react";

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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-10 h-full">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <img src="/logo-sipoda.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Admin SIPODA
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8 h-full">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center h-full text-sm font-medium transition-colors border-b-2 pt-[2px] ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Floating Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-[280px]">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg rounded-full px-2 py-2 flex justify-around items-center text-slate-500">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${
                  isActive ? "text-blue-600" : "hover:text-slate-800"
                }`}
              >
                <div className={`p-1.5 rounded-full ${isActive ? "bg-blue-50" : "transparent"}`}>
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
