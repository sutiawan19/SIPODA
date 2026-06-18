"use client";

import { use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, BarChart3, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { MOCK_INSTITUTIONS } from "@/lib/constants/mockData";

export default function ThankYouPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = use(params);
  const searchParams = useSearchParams();
  const instId = searchParams.get("inst");

  const institution = MOCK_INSTITUTIONS.find((i) => i.id === instId);

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#171717', '#525252', '#a3a3a3', '#e5e5e5'],
      disableForReducedMotion: true
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-grow flex flex-col items-center justify-center p-6"
      >
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
            <Check className="w-8 h-8 text-neutral-900" />
          </div>

          <h1 className="text-4xl font-bold text-neutral-950 mb-4 tracking-tight">Terima Kasih</h1>
          <p className="text-neutral-500 mb-10 text-lg">
            Penilaian Anda telah berhasil dikirimkan secara aman dan akan digunakan untuk memperbaiki kualitas layanan publik.
          </p>

          {institution && (
            <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-lg mb-10 text-left">
              <div className="text-sm font-medium text-neutral-500 mb-1">Instansi</div>
              <div className="font-semibold text-neutral-950 text-lg">{institution.name}</div>
              <div className="text-sm font-medium text-neutral-500 mt-6 mb-1">ID Pengiriman</div>
              <div className="font-mono text-neutral-700">{submissionId.toUpperCase()}</div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link href={instId ? `/results/${instId}` : "/institutions"}>
              <Button variant="default" className="w-full py-6" size="lg">
                <BarChart3 className="w-4 h-4 mr-2" />
                Lihat Hasil Survei Instansi
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full py-6 border-transparent hover:border-neutral-200 text-neutral-500 hover:text-neutral-900" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
