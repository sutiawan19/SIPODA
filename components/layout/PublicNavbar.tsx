"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[70] bg-white border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-center">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 group">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
          <span className="font-semibold text-neutral-950 text-base tracking-tight truncate max-w-xs sm:max-w-md md:max-w-lg lg:max-w-full">
            Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik
          </span>
        </Link>
      </div>
    </header>
  );
}
