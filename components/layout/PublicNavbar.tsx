"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-neutral-950 flex items-center justify-center">
            {/* Minimal geometric logo */}
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="font-semibold text-neutral-950 text-base tracking-tight">
            SurveyPublik
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">
            Beranda
          </Link>
          <Link href="/institutions" className="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">
            Instansi
          </Link>
          <Link
            href="/admin/login"
            className="text-sm text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            Admin
          </Link>
          <Link
            href="/institutions"
            className="px-4 py-2 bg-neutral-950 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors"
          >
            Mulai Survei
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2 text-neutral-500 hover:text-neutral-900 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm text-neutral-700 py-2 border-b border-neutral-100">
            Beranda
          </Link>
          <Link href="/institutions" onClick={() => setOpen(false)} className="text-sm text-neutral-700 py-2 border-b border-neutral-100">
            Instansi
          </Link>
          <Link href="/admin/login" onClick={() => setOpen(false)} className="text-sm text-neutral-700 py-2 border-b border-neutral-100">
            Admin
          </Link>
          <Link
            href="/institutions"
            onClick={() => setOpen(false)}
            className="w-full py-3 bg-neutral-950 text-white text-sm font-medium rounded-md text-center mt-2"
          >
            Mulai Survei
          </Link>
        </div>
      )}
    </header>
  );
}
