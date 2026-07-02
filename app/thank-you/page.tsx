"use client";

import Link from "next/link";
import { Download, Home, Sparkles, Trophy, CheckCircle2, Target, TrendingUp, AlertCircle, Eye, Zap, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function getScoreData(score: number) {
  if (score <= 20) {
    return {
      status: "Sangat Tidak Adaptif",
      recommendation: "Organisasi belum memiliki kemampuan adaptif yang memadai. Diperlukan perubahan secara menyeluruh melalui penguatan kemampuan mengenali perubahan, pemanfaatan peluang, transformasi proses kerja, pengembangan kompetensi pegawai, serta penyesuaian struktur organisasi.",
      textColor: "text-rose-600",
      bgSoft: "bg-rose-50",
      borderSoft: "border-rose-200",
      Icon: AlertCircle
    };
  } else if (score <= 40) {
    return {
      status: "Kurang Adaptif",
      recommendation: "Organisasi belum mampu beradaptasi secara optimal. Diperlukan penguatan dalam pemantauan perubahan lingkungan, dukungan terhadap inovasi, peningkatan kolaborasi, dan penyempurnaan proses kerja.",
      textColor: "text-orange-600",
      bgSoft: "bg-orange-50",
      borderSoft: "border-orange-200",
      Icon: TrendingUp
    };
  } else if (score <= 60) {
    return {
      status: "Cukup Adaptif",
      recommendation: "Organisasi memiliki kemampuan adaptif yang cukup, tetapi belum konsisten pada seluruh aspek. Organisasi perlu meningkatkan kemampuan dalam mengenali perubahan, mempercepat pengambilan keputusan, dan memperbaiki proses kerja secara berkelanjutan.",
      textColor: "text-yellow-600",
      bgSoft: "bg-yellow-50",
      borderSoft: "border-yellow-200",
      Icon: Target
    };
  } else if (score <= 80) {
    return {
      status: "Adaptif",
      recommendation: "Organisasi telah mampu beradaptasi terhadap perubahan, namun masih terdapat aspek yang perlu ditingkatkan agar kemampuan adaptif semakin optimal, terutama dalam memperkuat inovasi dan koordinasi organisasi.",
      textColor: "text-blue-600",
      bgSoft: "bg-blue-50",
      borderSoft: "border-blue-200",
      Icon: CheckCircle2
    };
  } else {
    return {
      status: "Sangat Adaptif",
      recommendation: "Organisasi memiliki kemampuan yang sangat baik dalam mengenali perubahan, memanfaatkan peluang, dan melakukan transformasi secara berkelanjutan. Organisasi perlu mempertahankan kemampuan tersebut serta terus mengembangkan inovasi dan pembelajaran.",
      textColor: "text-emerald-600",
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


  const handlePrint = async () => {
    try {
      const element = document.getElementById("pdf-certificate");
      if (!element) return;
      
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const scale = 2;
      const dataUrl = await toPng(element, { 
        cacheBust: true, 
        pixelRatio: scale, 
        backgroundColor: '#f8fafc' 
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const marginX = 25; 
      let drawWidth = pdfWidth - (marginX * 2);
      let drawHeight = (element.offsetHeight * drawWidth) / element.offsetWidth;

      const marginY = 25;
      if (drawHeight > pdfHeight - (marginY * 2)) {
         drawHeight = pdfHeight - (marginY * 2);
         drawWidth = (element.offsetWidth * drawHeight) / element.offsetHeight;
      }

      const x = (pdfWidth - drawWidth) / 2;
      const y = (pdfHeight - drawHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, drawWidth, drawHeight);
      pdf.save('Sertifikat_Evaluasi_SIPODA.pdf');

    } catch (err) {
      console.error(err);
      alert(`Gagal mengunduh PDF: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const StatusIcon = data?.Icon || Target;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-20">
      {/* HEADER */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md w-full px-4 py-4 flex items-center justify-center gap-3 z-50 border-b border-slate-200 shadow-sm">
        <img src="/logo-sipoda.png" alt="Logo" className="w-6 h-6 object-contain" />
        <h1 className="text-sm font-semibold tracking-wide uppercase text-slate-900">Hasil Evaluasi</h1>
      </header>

      <main className="flex-grow flex items-start justify-center p-4 sm:p-8 pt-8 sm:pt-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto flex flex-col gap-6"
        >
          {/* UNIFIED CERTIFICATE CARD */}
          {data && score !== null && (
            <div id="pdf-certificate" className="p-2 sm:p-4 bg-slate-50">
              <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-lg relative w-full text-center">
                
              {/* Title */}
              <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Evaluasi Selesai</h2>
                <p className="text-slate-500 font-medium text-sm sm:text-base">Berikut adalah ringkasan hasil evaluasi adaptasi organisasi Anda.</p>
              </div>

              {/* MAIN SCORE & BADGE */}
              <div className="flex flex-col items-center justify-center mb-12">
                <div className={`text-6xl sm:text-7xl font-bold mb-6 ${data.textColor} tracking-tight`}>
                  {score}%
                </div>
                <div className={`flex items-center justify-center gap-2 text-sm sm:text-base font-semibold ${data.textColor} bg-white px-5 py-2.5 rounded-md border ${data.borderSoft} shadow-sm`}>
                  <StatusIcon className={`w-5 h-5`} />
                  <span>{data.status}</span>
                </div>
              </div>

              <hr className="border-t border-slate-100 my-10 w-4/5 mx-auto" />

              {/* CLEAN DIMENSIONS LIST */}
              {dimsList.length > 0 && (
                <div className="flex flex-col gap-4 w-full text-left mb-10 px-0 sm:px-4">
                  {dimsList.map((dim, idx) => {
                    let DimIcon = Target;
                    let iconColor = "text-blue-600";
                    
                    if (dim.title.toLowerCase().includes("sensing") || idx === 0) {
                      DimIcon = Eye;
                    } else if (dim.title.toLowerCase().includes("seizing") || idx === 1) {
                      DimIcon = Zap;
                      iconColor = "text-indigo-600";
                    } else {
                      DimIcon = RefreshCcw;
                      iconColor = "text-emerald-600";
                    }

                    return (
                      <div key={idx} className="flex items-center justify-between py-3 group border-b border-slate-50 last:border-transparent">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-100 transition-colors ${iconColor}`}>
                            <DimIcon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-slate-700 text-sm sm:text-base tracking-wide">{dim.title}</span>
                        </div>
                        <div className="font-bold text-lg sm:text-xl text-slate-900">{dim.pct}%</div>
                      </div>
                    );
                  })}
                </div>
              )}

              <hr className="border-t border-slate-100 my-10 w-4/5 mx-auto" />

              {/* RECOMMENDATION TEXT */}
              <div className="flex flex-col items-center text-center mt-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <Sparkles className={`w-6 h-6 ${data.textColor} mb-3`} />
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Rekomendasi Strategis</h3>
                <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base">
                  {data.recommendation}
                </p>
              </div>

            </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full px-2 sm:px-4">
            <button 
              onClick={handlePrint} 
              className="w-full flex-1 py-3 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Download className="w-5 h-5" /> Unduh Laporan PDF
            </button>
            <Link href="/" className="w-full flex-1">
              <button 
                className="w-full py-3 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm"
              >
                <Home className="w-5 h-5" /> Kembali ke Beranda
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
