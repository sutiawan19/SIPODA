"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import ProgressBar from "@/components/survey/ProgressBar";
import StarRating from "@/components/survey/StarRating";

import { submitSurvey } from "./actions";

interface SurveyClientProps {
  institution: any;
  questions: any[];
}

export function SurveyClient({ institution, questions }: SurveyClientProps) {
  const router = useRouter();

  const [ratings, setRatings] = useState<{questionId: string, score: number}[]>([]);
  const [kendala, setKendala] = useState("");
  const [saran, setSaran] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRatingChange = (questionId: string, score: number) => {
    setRatings((prev) => {
      const existing = prev.find((r) => r.questionId === questionId);
      if (existing) {
        return prev.map((r) => (r.questionId === questionId ? { ...r, score } : r));
      }
      return [...prev, { questionId, score }];
    });
  };

  const getScore = (questionId: string) => {
    return ratings.find((r) => r.questionId === questionId)?.score || 0;
  };

  const currentStep = ratings.length;
  const totalSteps = questions.length;
  const isComplete = totalSteps > 0 && currentStep === totalSteps;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await submitSurvey({
        institutionId: institution.id,
        ratings,
        kendala,
        saran
      });

      if (res.success) {
        router.push(`/thank-you/${res.submissionId}?inst=${institution.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-grow pt-12 pb-32">
        <div className="max-w-2xl mx-auto px-6">
          
          <Link href="/institutions" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Link>

          {/* Header Info */}
          <div className="mb-6 pt-12 pb-6">
            <h1 className="text-3xl font-bold text-neutral-950 mb-2 tracking-tight">{institution.name}</h1>
            <p className="text-neutral-500 text-lg leading-relaxed">{institution.description}</p>
          </div>

          {/* Sticky Progress Bar */}
          <div className="sticky top-16 z-40 bg-white py-4 border-b border-neutral-200 mb-12">
            <ProgressBar current={currentStep} total={totalSteps} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-950 mb-2">Penilaian Kepuasan Pelayanan</h2>
              <p className="text-neutral-500">Berikan penilaian berdasarkan pengalaman Anda saat menerima pelayanan.</p>
            </div>

            {/* Progressive Questions */}
            <AnimatePresence mode="popLayout">
              {questions.map((q, index) => {
                const isAnswered = getScore(q.id) > 0;
                const isNextToAnswer = index === currentStep;
                
                if (!isAnswered && !isNextToAnswer) return null;

                return (
                  <motion.div
                    key={q.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isAnswered ? 0.4 : 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="flex gap-6">
                      <div className="shrink-0 w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-500">
                        {index + 1}
                      </div>
                      <div className="flex-grow pt-1">
                        <h3 className="text-xl font-semibold text-neutral-950 mb-2">
                          {q.question || q.label}
                        </h3>
                        {q.description && <p className="text-neutral-500 mb-6">{q.description}</p>}
                        
                        <StarRating 
                          size="lg"
                          value={getScore(q.id)} 
                          onChange={(val) => handleRatingChange(q.id, val)} 
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Kendala & Saran Section (Appears after all questions are answered) */}
            {isComplete && (
              <div className="pt-8 border-t border-neutral-200 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Kendala */}
                <div>
                  <h3 className="text-xl font-semibold text-neutral-950 mb-2">
                    Kendala yang Dialami
                  </h3>
                  <label htmlFor="kendala" className="block text-neutral-500 mb-6">
                    Kendala apa saja yang Anda alami selama proses pelayanan? <span className="font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    id="kendala"
                    value={kendala}
                    onChange={(e) => setKendala(e.target.value)}
                    placeholder="Contoh: antrean terlalu lama, informasi kurang jelas, fasilitas ruang tunggu kurang nyaman, dan lainnya."
                    className="w-full min-h-[140px] p-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 resize-y text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>

                {/* Saran */}
                <div>
                  <h3 className="text-xl font-semibold text-neutral-950 mb-2">
                    Saran & Masukan
                  </h3>
                  <label htmlFor="saran" className="block text-neutral-500 mb-6">
                    Saran & Masukan untuk Pemerintah Daerah <span className="font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    id="saran"
                    value={saran}
                    onChange={(e) => setSaran(e.target.value)}
                    placeholder="Berikan saran atau masukan untuk membantu meningkatkan kualitas pelayanan publik."
                    className="w-full min-h-[140px] p-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 resize-y text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                {/* Submit CTA */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={!isComplete || isSubmitting}
                    className="w-full py-6 text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Kirim Penilaian
                      </>
                    )}
                  </Button>
                </div>

              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
