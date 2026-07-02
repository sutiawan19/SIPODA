"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[70] bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-center">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 group">
          <img src="/logo-sipoda.png" alt="Logo" className="w-6 h-6 object-contain" />
          <span className="font-semibold text-slate-900 text-sm tracking-wide truncate max-w-xs sm:max-w-md md:max-w-lg lg:max-w-full uppercase">
            SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)
          </span>
        </Link>
      </div>
    </header>
  );
}
