"use client";

import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Building2, Users, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { formatNumber } from "@/lib/utils/formatters";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

const FADE_IN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

interface LandingClientProps {
  stats: {
    totalResponses: number;
    totalInstitutions: number;
    averageSatisfaction: number;
  };
}

export function LandingClient({ stats }: LandingClientProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 bg-neutral-950 flex items-center justify-center relative">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-neutral-900"
                />
                <div className="w-4 h-4 bg-white rounded-full relative z-10" />
              </div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-bold text-2xl tracking-tight text-neutral-950"
              >
                SurveyPublik
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden py-20">
          
          {/* Elegant Background Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Minimalist Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
            {/* Subtle glow spot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-neutral-100/80 rounded-[100%] blur-3xl opacity-50"></div>
          </div>

          <div className="max-w-5xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">
            <motion.div 
              initial="hidden"
              animate="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="max-w-4xl flex flex-col items-center"
            >
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-neutral-600 text-xs font-semibold mb-8 border border-neutral-200 uppercase tracking-widest shadow-sm">
                  Platform Resmi Umpan Balik Publik
                </div>
              </motion.div>

              <motion.h1 
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-neutral-950 tracking-tight leading-[1.1] mb-8"
              >
                Suara Anda membangun pelayanan yang lebih baik.
              </motion.h1>
              
              <motion.p 
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="text-lg md:text-xl text-neutral-500 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Bantu pemerintah meningkatkan kualitas layanan dengan memberikan penilaian dan masukan yang jujur atas pengalaman Anda di berbagai instansi. Cepat, mudah, dan transparan.
              </motion.p>

              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
                <Link
                  href="/institutions"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-950 text-white rounded-xl font-semibold text-base hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                >
                  Mulai Survei
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-900 border border-neutral-200 rounded-xl font-semibold text-base hover:bg-neutral-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 border-y border-neutral-200 bg-neutral-50 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8"
            >
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col border-l border-neutral-200 pl-8">
                <div className="flex items-center gap-2 text-neutral-400 mb-6">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold text-sm tracking-wide uppercase">Responden</span>
                </div>
                <div className="text-6xl font-bold text-neutral-950 mb-2 tracking-tighter">
                  <AnimatedCounter value={stats.totalResponses} formatter={formatNumber} />+
                </div>
                <div className="text-neutral-500">Warga berpartisipasi</div>
              </motion.div>

              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col border-l border-neutral-200 pl-8">
                <div className="flex items-center gap-2 text-neutral-400 mb-6">
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold text-sm tracking-wide uppercase">Instansi</span>
                </div>
                <div className="text-6xl font-bold text-neutral-950 mb-2 tracking-tighter">
                  <AnimatedCounter value={stats.totalInstitutions} />
                </div>
                <div className="text-neutral-500">Instansi terdaftar</div>
              </motion.div>

              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col border-l border-neutral-200 pl-8">
                <div className="flex items-center gap-2 text-neutral-400 mb-6">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold text-sm tracking-wide uppercase">Kepuasan</span>
                </div>
                <div className="text-6xl font-bold text-neutral-950 mb-2 tracking-tighter">
                  <AnimatedCounter value={stats.averageSatisfaction * 10} formatter={(v: number) => (v/10).toFixed(1)} />
                </div>
                <div className="text-neutral-500">Nilai rata-rata (skala 5)</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-40 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mb-24">
                <h2 className="text-4xl md:text-5xl font-bold text-neutral-950 mb-6 tracking-tighter">Mengapa masukan Anda penting</h2>
                <p className="text-neutral-500 text-xl max-w-2xl leading-relaxed">
                  Suara Anda secara langsung digunakan oleh pimpinan instansi untuk mengevaluasi dan memperbaiki standar pelayanan masyarakat.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-16">
                {[
                  {
                    title: "Transparansi Penuh",
                    desc: "Hasil survei dapat diakses oleh publik. Kami percaya pada keterbukaan data dan akuntabilitas mutlak.",
                  },
                  {
                    title: "Evaluasi Objektif",
                    desc: "Membantu mengidentifikasi instansi mana yang perlu perbaikan segera berdasarkan keluhan warga secara faktual.",
                  },
                  {
                    title: "Apresiasi Kinerja",
                    desc: "Berikan penghargaan kepada instansi dan petugas yang telah melayani dengan sangat baik dan sepenuh hati.",
                  }
                ].map((item, i) => (
                  <motion.div key={i} variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col">
                    <div className="text-neutral-300 font-bold text-7xl mb-6 tracking-tighter">
                      0{i + 1}
                    </div>
                    <h3 className="text-2xl font-semibold text-neutral-950 mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-neutral-500 leading-relaxed text-lg">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Bottom */}
        <section className="py-40 bg-neutral-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={FADE_IN_ANIMATION_VARIANTS}
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
                Siap memberikan penilaian?
              </h2>
              <p className="text-neutral-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto tracking-tight">
                Hanya butuh waktu kurang dari 2 menit. Tidak perlu membuat akun atau login.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
                <Link
                  href="/institutions"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-950 rounded-xl font-semibold text-base hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Mulai Beri Penilaian
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </>
  );
}
