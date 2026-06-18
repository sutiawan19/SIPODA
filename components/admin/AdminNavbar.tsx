"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Data Responden", href: "/admin/responses" },
  ];

  return (
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

        <Link 
          href="/admin/login"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </Link>
      </div>
    </header>
  );
}
