"use client";

import { usePathname } from "next/navigation";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <AdminNavbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto">
        {children}
      </main>
    </div>
  );
}
