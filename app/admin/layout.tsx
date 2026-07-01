"use client";

import { usePathname } from "next/navigation";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f3f9fc] flex flex-col font-sans selection:bg-[#1cb0f6] selection:text-white">
      <AdminNavbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto">
        {children}
      </main>
    </div>
  );
}
