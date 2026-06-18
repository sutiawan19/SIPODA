"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Users } from "lucide-react";

export function AdminNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Data Responden", href: "/admin/responses", icon: Users },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-10">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-neutral-950 flex items-center justify-center rounded-[4px]">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="font-semibold text-lg text-neutral-950 tracking-tight">
                AdminPanel
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-2">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop logout */}
            <Link
              href="/admin/login"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Floating Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px]">
        <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-full px-6 py-3 flex justify-between items-center text-neutral-400">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-white" : "hover:text-neutral-200"
                }`}
              >
                <div className={`p-1.5 rounded-full ${isActive ? "bg-white/10" : "transparent"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium tracking-wide">
                  {link.name === "Data Responden" ? "Responden" : link.name}
                </span>
              </Link>
            );
          })}
          
          <div className="w-[1px] h-8 bg-neutral-800 mx-1" />

          <Link
            href="/admin/login"
            className="flex flex-col items-center gap-1 text-neutral-400 hover:text-red-400 transition-colors"
          >
            <div className="p-1.5 rounded-full transparent">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">Keluar</span>
          </Link>
        </div>
      </div>
    </>
  );
}
