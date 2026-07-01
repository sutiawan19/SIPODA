"use client";

import Link from "next/link";
import { Download, Home, Sparkles, Trophy, CheckCircle2, Target, TrendingUp, AlertCircle, Eye, Zap, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function getScoreData(score: number) {
  if (score <= 20) {
    return {
      status: "Sangat Tidak Adaptif",
      recommendation: "Organisasi belum memiliki kemampuan adaptif yang memadai. Diperlukan perubahan secara menyeluruh melalui penguatan kemampuan mengenali perubahan, pemanfaatan peluang, transformasi proses kerja, pengembangan kompetensi pegawai, serta penyesuaian struktur organisasi.",
      textColor: "text-rose-500",
      bgSoft: "bg-rose-50",
      borderSoft: "border-rose-200",
      Icon: AlertCircle
    };
  } else if (score <= 40) {
    return {
      status: "Kurang Adaptif",
      recommendation: "Organisasi belum mampu beradaptasi secara optimal. Diperlukan penguatan dalam pemantauan perubahan lingkungan, dukungan terhadap inovasi, peningkatan kolaborasi, dan penyempurnaan proses kerja.",
      textColor: "text-amber-500",
      bgSoft: "bg-amber-50",
      borderSoft: "border-amber-200",
      Icon: TrendingUp
    };
  } else if (score <= 60) {
    return {
      status: "Cukup Adaptif",
      recommendation: "Organisasi memiliki kemampuan adaptif yang cukup, tetapi belum konsisten pada seluruh aspek. Organisasi perlu meningkatkan kemampuan dalam mengenali perubahan, mempercepat pengambilan keputusan, dan memperbaiki proses kerja secara berkelanjutan.",
      textColor: "text-[#1cb0f6]",
      bgSoft: "bg-[#ddf4ff]",
      borderSoft: "border-[#1cb0f6]",
      Icon: Target
    };
  } else if (score <= 80) {
    return {
      status: "Adaptif",
      recommendation: "Organisasi telah mampu beradaptasi terhadap perubahan, namun masih terdapat aspek yang perlu ditingkatkan agar kemampuan adaptif semakin optimal, terutama dalam memperkuat inovasi dan koordinasi organisasi.",
      textColor: "text-indigo-500",
      bgSoft: "bg-indigo-50",
      borderSoft: "border-indigo-200",
      Icon: CheckCircle2
    };
  } else {
    return {
      status: "Sangat Adaptif",
      recommendation: "Organisasi memiliki kemampuan yang sangat baik dalam mengenali perubahan, memanfaatkan peluang, dan melakukan transformasi secara berkelanjutan. Organisasi perlu mempertahankan kemampuan tersebut serta terus mengembangkan inovasi dan pembelajaran.",
      textColor: "text-emerald-500",
      bgSoft: "bg-emerald-50",
      borderSoft: "border-emerald-200",
      Icon: Trophy
    };
  }
}

function parseDims(dimsString: string | null) {
  if (!dimsString) return [];
  return dimsString.split('|').map(d => {
    const [title, pct] = d.split('_');
    return { title, pct: parseInt(pct, 10) || 0 };
  });
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const dimsString = searchParams.get("dims");
  const score = scoreParam ? parseFloat(scoreParam) : null;
  const data = score !== null ? getScoreData(score) : null;
  const dimsList = parseDims(dimsString);
  const router = useRouter();

  useEffect(() => {
    if (score === null || isNaN(score)) {
      router.replace("/");
    }
  }, [score, router]);

  useEffect(() => {
    if (score === null || isNaN(score)) return;

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, [score]);

  const handlePrint = async () => {
    try {
      const element = document.getElementById("pdf-certificate");
      if (!element) return;
      
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      // Set scale manually to ensure high resolution
      const scale = 2;
      const dataUrl = await toPng(element, { 
        cacheBust: true, 
        pixelRatio: scale, 
        backgroundColor: '#f3f9fc' 
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // We want to scale it down a bit. Let's add a generous margin (e.g. 25mm on each side)
      const marginX = 25; 
      let drawWidth = pdfWidth - (marginX * 2);
      let drawHeight = (element.offsetHeight * drawWidth) / element.offsetWidth;

      // Ensure it fits vertically as well
      const marginY = 25;
      if (drawHeight > pdfHeight - (marginY * 2)) {
         drawHeight = pdfHeight - (marginY * 2);
         drawWidth = (element.offsetWidth * drawHeight) / element.offsetHeight;
      }

      // Calculate center coordinates
      const x = (pdfWidth - drawWidth) / 2;
      const y = (pdfHeight - drawHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, drawWidth, drawHeight);
      pdf.save('Hasil_Penilaian_SIPODA.pdf');

    } catch (err) {
      console.error(err);
      alert(`Gagal mengunduh PDF: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const StatusIcon = data?.Icon || Target;

  return (
    <div className="min-h-screen bg-[#f3f9fc] flex flex-col font-sans selection:bg-[#1cb0f6] selection:text-white pb-20">
      {/* HEADER */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md w-full px-4 py-4 sm:py-6 flex items-center justify-center gap-4 z-50 border-b-2 border-neutral-100 shadow-sm">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-widest uppercase text-[#1cb0f6]">Hasil Penilaian</h1>
      </header>

      <main className="flex-grow flex items-start justify-center p-4 sm:p-8 pt-8 sm:pt-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto flex flex-col gap-6"
        >
          {/* UNIFIED CERTIFICATE CARD */}
          {data && score !== null && (
            <div id="pdf-certificate" className="pt-24 px-4 pb-4 sm:px-8 sm:pb-8 -mx-4 sm:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+4rem)] bg-[#f3f9fc]">
              <div className="bg-white border-2 border-neutral-200 rounded-[2rem] p-6 sm:p-12 shadow-sm relative w-full text-center">
                
                {/* Mascot Peeking from Top */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-20 z-10">
                 <motion.img 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                   src="/mascot_cheering.png" alt="Mascot" className="w-32 h-32 sm:w-40 sm:h-40 object-contain" 
                 />
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-12 sm:mt-16 mb-2">Kerja Bagus!</h2>
              <p className="text-neutral-500 font-bold mb-10">Berikut adalah sertifikat hasil evaluasi adaptasi organisasi Anda.</p>

              {/* MAIN SCORE & BADGE (No Boxes) */}
              <div className="flex flex-col items-center justify-center mb-10">
                <div className={`text-8xl sm:text-9xl font-black mb-4 ${data.textColor} tracking-tighter drop-shadow-sm`}>
                  {score}%
                </div>
                <div className={`flex items-center justify-center gap-2 text-xl sm:text-2xl font-extrabold ${data.textColor} bg-white px-6 py-3 rounded-full border-2 ${data.borderSoft}`}>
                  <StatusIcon className={`w-6 h-6 sm:w-7 sm:h-7 stroke-[3]`} />
                  <span>{data.status}</span>
                </div>
              </div>

              <hr className="border-t-2 border-neutral-100 my-8 w-3/4 mx-auto" />

              {/* CLEAN DIMENSIONS LIST (Rows, not boxes) */}
              {dimsList.length > 0 && (
                <div className="flex flex-col gap-5 w-full text-left mb-10 px-0 sm:px-4">
                  {dimsList.map((dim, idx) => {
                    let DimIcon = Target;
                    let iconColor = "text-[#1cb0f6]";
                    
                    if (dim.title.toLowerCase().includes("sensing") || idx === 0) {
                      DimIcon = Eye;
                    } else if (dim.title.toLowerCase().includes("seizing") || idx === 1) {
                      DimIcon = Zap;
                      iconColor = "text-indigo-500";
                    } else {
                      DimIcon = RefreshCcw;
                      iconColor = "text-emerald-500";
                    }

                    return (
                      <div key={idx} className="flex items-center justify-between py-2 group">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center border-2 border-neutral-100 group-hover:bg-neutral-100 transition-colors ${iconColor}`}>
                            <DimIcon className="w-6 h-6 stroke-[3]" />
                          </div>
                          <span className="font-extrabold text-neutral-700 text-sm sm:text-base uppercase tracking-widest">{dim.title}</span>
                        </div>
                        <div className="font-black text-2xl sm:text-3xl text-neutral-900">{dim.pct}%</div>
                      </div>
                    );
                  })}
                </div>
              )}

              <hr className="border-t-2 border-neutral-100 my-8 w-3/4 mx-auto" />

              {/* RECOMMENDATION TEXT (Flowing naturally) */}
              <div className="flex flex-col items-center text-center mt-6">
                <Sparkles className={`w-8 h-8 ${data.textColor} mb-4`} />
                <h3 className="text-lg font-extrabold text-neutral-400 uppercase tracking-widest mb-4">Rekomendasi Tindakan</h3>
                <p className="text-neutral-700 leading-relaxed font-bold text-base sm:text-lg">
                  {data.recommendation}
                </p>
              </div>

            </div>
            </div>
          )}

          {/* ACTION BUTTONS (Outside the card, at the bottom) */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
            <button 
              onClick={handlePrint} 
              className="w-full flex-1 py-5 text-sm sm:text-base font-extrabold uppercase tracking-wide rounded-2xl flex items-center justify-center gap-3 transition-all bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-b-4 border-b-[#1899d6] active:border-b-0 active:translate-y-1 shadow-sm"
            >
              <Download className="w-6 h-6 stroke-[3]" /> Simpan PDF
            </button>
            <Link href="/" className="w-full flex-1">
              <button 
                className="w-full py-5 text-sm sm:text-base font-extrabold uppercase tracking-wide rounded-2xl flex items-center justify-center gap-3 transition-all bg-white hover:bg-neutral-50 text-neutral-600 border-2 border-neutral-200 border-b-4 border-b-neutral-300 active:border-b-2 active:translate-y-[2px]"
              >
                <Home className="w-6 h-6 stroke-[3]" /> Beranda
              </button>
            </Link>
          </div>

        </motion.div>
      </main>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f3f9fc] flex items-center justify-center p-6 font-sans">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-[#1cb0f6] rounded-full animate-spin"></div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
