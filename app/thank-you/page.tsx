"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import confetti from "canvas-confetti";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function getScoreData(score: number) {
  if (score <= 20) {
    return {
      status: "Sangat Tidak Setuju",
      recommendation: "Menyusun ulang visi, misi serta tujuan yang berbasis kualitas pelayanan publik.",
      textColor: "text-rose-600",
      bgSoft: "bg-rose-50",
      borderSoft: "border-rose-100",
      barColor: "bg-rose-500",
    };
  } else if (score <= 40) {
    return {
      status: "Tidak Setuju",
      recommendation: "Lakukan survei kepuasan kepada masyarakat untuk dasar perbaikan pelayanan.",
      textColor: "text-amber-600",
      bgSoft: "bg-amber-50",
      borderSoft: "border-amber-100",
      barColor: "bg-amber-500",
    };
  } else if (score <= 60) {
    return {
      status: "Cukup",
      recommendation: "Menguatkan kualitas SDM melalui berbagai pelatihan berbasis kompetensi.",
      textColor: "text-violet-600",
      bgSoft: "bg-violet-50",
      borderSoft: "border-violet-100",
      barColor: "bg-violet-500",
    };
  } else if (score <= 80) {
    return {
      status: "Setuju",
      recommendation: "Mengembangkan sistem serta inovasi pelayanan publik.",
      textColor: "text-blue-600",
      bgSoft: "bg-blue-50",
      borderSoft: "border-blue-100",
      barColor: "bg-blue-500",
    };
  } else {
    return {
      status: "Sangat Setuju",
      recommendation: "Mempertahankan dan mengembangkan inovasi pelayanan publik berkelanjutan.",
      textColor: "text-emerald-600",
      bgSoft: "bg-emerald-50",
      borderSoft: "border-emerald-100",
      barColor: "bg-emerald-500",
    };
  }
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseFloat(scoreParam) : null;
  const data = score !== null ? getScoreData(score) : null;

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
        className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-10 text-center relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 w-full h-1.5 ${data ? data.barColor : 'bg-neutral-900'}`}></div>
        <div className="flex justify-center mb-6 mt-2">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-black/5 ${data ? data.barColor : 'bg-neutral-950'}`}>
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">Terima Kasih!</h1>
        <p className="text-neutral-500 mb-8 leading-relaxed text-sm">
          Penilaian Anda telah berhasil dikirim. Masukan Anda akan sangat berguna untuk evaluasi dan peningkatan kualitas pelayanan publik.
        </p>

        {score !== null && data !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            {(() => {
              const percentage = score; // 0-100 scale
              
              return (
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm w-full text-left">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                        Skor Penilaian
                      </span>
                      <div className={`text-5xl font-black tracking-tighter ${data.textColor}`}>
                        {score}%
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md border ${data.bgSoft} ${data.borderSoft}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${data.textColor}`}>
                        {data.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${data.barColor} transition-all duration-1000 ease-out`} 
                        style={{ width: `${Math.max(0, percentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] font-bold text-neutral-400">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1.5">
                      Rekomendasi Tindak Lanjut
                    </span>
                    <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                      {data.recommendation}
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        <Link href="/">
          <Button variant="outline" className="w-full py-6 text-sm font-semibold rounded-xl border-neutral-200 hover:bg-neutral-50 text-neutral-700">
            Kembali ke Form Penilaian
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans">
        <div className="w-8 h-8 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
