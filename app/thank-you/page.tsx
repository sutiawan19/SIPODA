"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function ThankYouPage() {
  useEffect(() => {
    // Trigger confetti on page load
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-sm border border-neutral-200 p-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-neutral-950 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Terima Kasih!</h1>
        <p className="text-neutral-500 mb-8 leading-relaxed">
          Penilaian Anda telah berhasil dikirim. Masukan Anda akan sangat berguna untuk evaluasi dan peningkatan kualitas pelayanan publik.
        </p>

        <Link href="/">
          <Button variant="default" className="w-full">
            Kembali ke Form Penilaian
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
