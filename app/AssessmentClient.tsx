"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Send } from "lucide-react";
import { submitAssessment } from "./actions";
import Link from "next/link";

const DIMENSIONS = [
  {
    id: "sensing",
    title: "Dimensi 1. Sensing (Kemampuan Mengenali Perubahan)",
    mascotMsg: "Yuk, kita cek gimana kemampuan Sensing organisasimu!",
    questions: [
      { id: "sensing_1", text: "Organisasi secara rutin memantau perubahan kebutuhan masyarakat terhadap pelayanan" },
      { id: "sensing_2", text: "Organisasi secara aktif memantau perkembangan teknologi digital yang relevan dengan pelaksanaan tugas organisasi" },
      { id: "sensing_3", text: "Organisasi mampu mengidentifikasi perubahan kebijakan atau regulasi yang memengaruhi pelaksanaan tugas" },
      { id: "sensing_4", text: "Data hasil evaluasi pelayanan dimanfaatkan untuk mengidentifikasi kebutuhan perbaikan" },
      { id: "sensing_5", text: "Masukan dari masyarakat digunakan untuk mengenali kebutuhan peningkatan kualitas pelayanan" },
      { id: "sensing_6", text: "Organisasi secara aktif mengidentifikasi peluang inovasi melalui perkembangan teknologi dan informasi" },
      { id: "sensing_7", text: "Pimpinan mendorong pemanfaatan data dan informasi sebagai dasar memahami perubahan lingkungan strategis" },
      { id: "sensing_8", text: "Organisasi memiliki mekanisme yang efektif untuk mendeteksi permasalahan pelayanan sejak dini" }
    ]
  },
  {
    id: "seizing",
    title: "Dimensi 2. Seizing (Kemampuan Memanfaatkan Peluang)",
    mascotMsg: "Lanjut ke dimensi Seizing! Udah siap?",
    questions: [
      { id: "seizing_1", text: "Organisasi mampu menerapkan teknologi digital untuk meningkatkan kualitas pelayanan" },
      { id: "seizing_2", text: "Ide atau gagasan baru dari pegawai memperoleh dukungan untuk diimplementasikan" },
      { id: "seizing_3", text: "Organisasi mampu mengambil keputusan secara cepat ketika terdapat peluang untuk meningkatkan kinerja pelayanan" },
      { id: "seizing_4", text: "Organisasi menyediakan sumber daya yang diperlukan untuk mendukung penerapan inovasi digital" },
      { id: "seizing_5", text: "Teknologi baru dimanfaatkan untuk meningkatkan efisiensi pelaksanaan pekerjaan" },
      { id: "seizing_6", text: "Organisasi mendorong setiap unit kerja untuk mengembangkan inovasi dalam pelaksanaan tugas" },
      { id: "seizing_7", text: "Perubahan kebutuhan masyarakat segera direspons melalui penyesuaian layanan yang diberikan" },
      { id: "seizing_8", text: "Keputusan strategis didasarkan pada data dan informasi yang akurat" }
    ]
  },
  {
    id: "transforming",
    title: "Dimensi 3. Transforming (Kemampuan Melakukan Transformasi)",
    mascotMsg: "Satu langkah lagi! Ayo nilai kemampuan Transforming!",
    questions: [
      { id: "transforming_1", text: "Organisasi mampu menyesuaikan prosedur kerja ketika terjadi perubahan kebutuhan pelayanan" },
      { id: "transforming_2", text: "Struktur kerja dapat disesuaikan untuk mendukung pelaksanaan tugas secara lebih efektif" },
      { id: "transforming_3", text: "Mekanisme koordinasi antarunit kerja dapat disesuaikan ketika menghadapi perubahan kebutuhan organisasi" },
      { id: "transforming_4", text: "Hasil evaluasi digunakan sebagai dasar untuk memperbaiki proses kerja organisasi" },
      { id: "transforming_5", text: "Perubahan teknologi diikuti dengan penyesuaian cara kerja organisasi" },
      { id: "transforming_6", text: "Organisasi mendorong budaya kerja yang terbuka terhadap perubahan dan inovasi" },
      { id: "transforming_7", text: "Pegawai diberikan kesempatan untuk berpartisipasi dalam proses perubahan dan pengembangan organisasi" },
      { id: "transforming_8", text: "Organisasi mampu mempertahankan kualitas pelayanan melalui penyesuaian struktur, proses kerja, dan pemanfaatan teknologi ketika menghadapi perubahan lingkungan." }
    ]
  }
];

const LIKERT_OPTIONS = [
  { value: 1, label: "Sangat Tidak Setuju" },
  { value: 2, label: "Tidak Setuju" },
  { value: 3, label: "Netral" },
  { value: 4, label: "Setuju" },
  { value: 5, label: "Sangat Setuju" }
];

export default function AssessmentClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); 
  const totalSteps = DIMENSIONS.length + 1; // Step 0 is intro, 1-3 are dimensions

  // Section 1 State
  const [nama, setNama] = useState("");
  const [instansi, setInstansi] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [email, setEmail] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Section 2 State
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const findFirstIncompleteStep = () => {
    if (!nama || !instansi || !jabatan) return 0;
    for (let i = 0; i < DIMENSIONS.length; i++) {
      const dim = DIMENSIONS[i];
      const hasUnanswered = dim.questions.some(q => !answers[q.id]);
      if (hasUnanswered) return i + 1;
    }
    return -1;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      const missing: string[] = [];
      if (!nama) missing.push('field-nama');
      if (!instansi) missing.push('field-instansi');
      if (!jabatan) missing.push('field-jabatan');

      if (missing.length > 0) {
        setMissingFields(missing);
        setErrorMessage("Harap lengkapi semua isian wajib (bertanda bintang) sebelum melanjutkan.");
        setShowErrorPopup(true);
        return;
      }
    } else {
      const currentDim = DIMENSIONS[currentStep - 1];
      const missing = currentDim.questions.filter(q => !answers[q.id]).map(q => `field-${q.id}`);

      if (missing.length > 0) {
        setMissingFields(missing);
        setErrorMessage(`Ada ${missing.length} pertanyaan yang belum Anda jawab di halaman ini.`);
        setShowErrorPopup(true);
        
        // Scroll to the first missing question
        setTimeout(() => {
          document.getElementById(missing[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }
    }

    setMissingFields([]);
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    const currentDim = DIMENSIONS[currentStep - 1];
    const missing = currentDim.questions.filter(q => !answers[q.id]).map(q => `field-${q.id}`);

    if (missing.length > 0) {
      setMissingFields(missing);
      setErrorMessage(`Ada ${missing.length} pertanyaan yang belum Anda jawab di halaman ini.`);
      setShowErrorPopup(true);
      setTimeout(() => {
        document.getElementById(missing[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setMissingFields([]);
    setShowConfirmPopup(true);
  };

  const executeSubmit = async () => {
    setShowConfirmPopup(false);
    setIsSubmitting(true);
    try {
      const payload = {
        nama,
        instansi,
        jabatan,
        email: email || undefined,
        answers
      };
      await submitAssessment(payload);

      const answerValues = Object.values(answers) as number[];
      const sum = answerValues.reduce((a, b) => a + b, 0);
      const maxScore = answerValues.length * 5;
      const percentage = Math.round((sum / maxScore) * 100);

      // Hitung dimensi
      const dimScores = DIMENSIONS.map(dim => {
        let dimSum = 0;
        dim.questions.forEach(q => { dimSum += (answers[q.id] || 0) });
        const cleanTitle = dim.title.replace(/^\d+\s*-\s*/, '');
        const dimMax = dim.questions.length * 5;
        const dimPct = Math.round((dimSum / dimMax) * 100);
        return { title: cleanTitle, score: dimSum, pct: dimPct };
      });

      const dimString = dimScores.map(d => `${d.title}_${d.pct}`).join('|');
      const sortedDims = [...dimScores].sort((a, b) => a.score - b.score);
      const lowestDim = sortedDims[0].title;
      const highestDim = sortedDims[sortedDims.length - 1].title;

      router.push(`/thank-you?score=${percentage}&highest=${encodeURIComponent(highestDim)}&lowest=${encodeURIComponent(lowestDim)}&dims=${encodeURIComponent(dimString)}`);
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan.");
      setIsSubmitting(false);
    }
  };

  // Determine if next button should visually appear enabled (we'll allow clicking anyway to show validation)
  let isNextEnabled = true;
  if (currentStep === 0) {
    isNextEnabled = !!(nama && instansi && jabatan);
  } else if (currentStep > 0 && currentStep <= DIMENSIONS.length) {
    const currentDim = DIMENSIONS[currentStep - 1];
    isNextEnabled = currentDim.questions.every(q => !!answers[q.id]);
  }

  // Which mascot to show?
  const mascotSrc = currentStep % 2 === 0 ? "/mascot_cheering.png" : "/mascot_blue_owl.png";

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-neutral-800 selection:bg-[#1cb0f6] selection:text-white relative">
      {/* HEADER: Progress Bar */}
      {!showWelcome && (
        <header className="sticky top-0 bg-white/95 backdrop-blur-md w-full px-4 py-4 sm:py-6 flex items-center gap-4 z-50 border-b-2 border-neutral-100">
          <div className="max-w-4xl mx-auto w-full flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all flex-shrink-0"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
            </Link>
            <div className="flex-grow relative h-4 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 bottom-0 bg-[#1cb0f6] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
              >
                <div className="absolute top-1 left-3 right-3 h-1 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 sm:px-6 pb-40">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="step-welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-8 sm:mt-12"
            >
              <div className="flex flex-col items-center justify-center mb-24 sm:mb-28 gap-4">
                <img src="/logo-sipoda.png" alt="Logo SIPODA" className="h-16 sm:h-20 object-contain drop-shadow-sm" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 text-center tracking-tight leading-snug">
                  (Sistem Informasi Pengembangan Organisasi Digital Adaptif)
                </h1>
              </div>
              
              <div className="max-w-3xl mx-auto bg-white border-2 border-neutral-200 rounded-[2rem] p-6 sm:p-12 shadow-sm relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-16 z-10">
                   <motion.img 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                     src="/mascot_blue_owl.png" alt="Mascot" className="w-28 h-28 object-contain" 
                   />
                </div>
                
                <div className="text-neutral-700 font-medium leading-relaxed text-justify mt-8 space-y-4">
                  <h3 className="text-2xl font-extrabold text-neutral-900 text-center mb-8">Selamat Datang!</h3>
                  <p>Terima kasih atas kesediaan Bapak/Ibu/Saudara(i) untuk berpartisipasi dalam penelitian ini.</p>
                  <p>Kuesioner ini disusun untuk memperoleh gambaran mengenai tingkat adaptivitas organisasi dalam menghadapi perubahan di era digital.</p>
                  <p>Penelitian ini bertujuan untuk mengetahui sejauh mana organisasi memiliki kemampuan dalam mengenali perubahan (sensing), memanfaatkan peluang (seizing), dan melakukan transformasi (transforming) sebagai upaya meningkatkan kemampuan organisasi dalam menghadapi perubahan lingkungan.</p>
                  
                  <div className="bg-[#ddf4ff] p-5 rounded-2xl text-[#1cb0f6] my-6 text-left border-2 border-[#1cb0f6]">
                    Kuesioner ini <strong>bukan</strong> digunakan untuk menilai kinerja individu maupun kinerja pegawai, melainkan untuk memperoleh gambaran mengenai kemampuan organisasi dalam beradaptasi terhadap perubahan yang terjadi. Seluruh jawaban yang diberikan akan dijaga kerahasiaannya dan hanya digunakan untuk kepentingan penelitian.
                  </div>
                  
                  <p>Untuk memperoleh gambaran yang komprehensif, kuesioner ini mengukur tiga dimensi utama kemampuan adaptif organisasi, yaitu:</p>
                  <ul className="list-none space-y-4 my-6">
                    <li className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-xl bg-[#1cb0f6] text-white flex items-center justify-center font-black flex-shrink-0 mt-1">1</div>
                      <div><strong>Sensing</strong>, yaitu kemampuan organisasi dalam mengenali perubahan lingkungan, perkembangan teknologi, perubahan kebijakan, serta mengidentifikasi peluang dan risiko yang dapat memengaruhi organisasi.</div>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black flex-shrink-0 mt-1">2</div>
                      <div><strong>Seizing</strong>, yaitu kemampuan organisasi dalam mengambil keputusan, memanfaatkan peluang, menyediakan sumber daya, serta mendorong inovasi sebagai respons terhadap perubahan.</div>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black flex-shrink-0 mt-1">3</div>
                      <div><strong>Transforming</strong>, yaitu kemampuan organisasi dalam melakukan perubahan melalui penyesuaian struktur, penyempurnaan proses kerja, pengembangan kompetensi pegawai, serta evaluasi dan perbaikan secara berkelanjutan.</div>
                    </li>
                  </ul>
                  
                  <p>Mohon memberikan jawaban sesuai dengan kondisi yang sebenarnya berdasarkan pengalaman Bapak/Ibu/Saudara(i) selama bekerja di organisasi.</p>
                  
                  <div className="text-center text-lg font-extrabold text-neutral-900 mt-8 mb-4">
                    Terima kasih atas partisipasi dan kerja samanya.<br/>Selamat mengisi!
                  </div>
                </div>
                
                <div className="mt-10 flex justify-center">
                  <button 
                    onClick={() => { setShowWelcome(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-full sm:w-auto px-12 py-5 text-base sm:text-lg font-extrabold uppercase tracking-wide rounded-2xl flex items-center justify-center gap-3 transition-all bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-b-4 border-b-[#1899d6] active:border-b-0 active:translate-y-1 shadow-sm"
                  >
                    Mulai Penilaian
                  </button>
                </div>
              </div>
            </motion.div>
          ) : currentStep === 0 ? (
            <motion.div
              key="step-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-8"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-8 text-center tracking-tight">Siapkan Profil Anda!</h1>
              
              <div className="max-w-2xl mx-auto bg-white border-2 border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div id="field-nama">
                  <label className="block text-sm font-extrabold text-neutral-700 mb-2 uppercase tracking-wide">Nama <span className="text-[#1cb0f6]">*</span></label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => { setNama(e.target.value); setMissingFields(m => m.filter(x => x !== 'field-nama')); }}
                    placeholder="Ketik nama Anda di sini"
                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:border-[#1cb0f6] focus:bg-white outline-none font-bold text-neutral-800 transition-colors placeholder:font-medium text-lg"
                  />
                </div>

                <div id="field-instansi">
                  <label className="block text-sm font-extrabold text-neutral-700 mb-2 uppercase tracking-wide">Instansi <span className="text-[#1cb0f6]">*</span></label>
                  <input
                    type="text"
                    value={instansi}
                    onChange={(e) => { setInstansi(e.target.value); setMissingFields(m => m.filter(x => x !== 'field-instansi')); }}
                    placeholder="Contoh: Dinas Kesehatan"
                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:border-[#1cb0f6] focus:bg-white outline-none font-bold text-neutral-800 transition-colors placeholder:font-medium text-lg"
                  />
                </div>

                <div id="field-jabatan">
                  <label className="block text-sm font-extrabold text-neutral-700 mb-2 uppercase tracking-wide">Jabatan <span className="text-[#1cb0f6]">*</span></label>
                  <input
                    type="text"
                    value={jabatan}
                    onChange={(e) => { setJabatan(e.target.value); setMissingFields(m => m.filter(x => x !== 'field-jabatan')); }}
                    placeholder="Contoh: Kepala Bidang"
                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:border-[#1cb0f6] focus:bg-white outline-none font-bold text-neutral-800 transition-colors placeholder:font-medium text-lg"
                  />
                </div>

                <div id="field-email">
                  <label className="block text-sm font-extrabold text-neutral-700 mb-2 uppercase tracking-wide">Email <span className="text-neutral-400 normal-case font-medium">(Opsional)</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:border-[#1cb0f6] focus:bg-white outline-none font-bold text-neutral-800 transition-colors placeholder:font-medium text-lg"
                  />
                </div>
              </div>
            </motion.div>
          ) : currentStep > 0 && currentStep <= DIMENSIONS.length ? (
            <motion.div
              key={`dim-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-4 flex flex-col"
            >
              {/* Mascot Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 sm:gap-6 mb-8 w-full max-w-2xl mx-auto">
                <motion.img 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  src={mascotSrc} alt="Mascot" className="w-24 h-24 sm:w-32 sm:h-32 object-contain flex-shrink-0" 
                />
                
                {/* Speech Bubble */}
                <div className="relative bg-white border-2 border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-sm w-full">
                  {/* Triangle pointer for desktop */}
                  <div className="hidden sm:block absolute -left-3 top-8 w-4 h-4 bg-white border-b-2 border-l-2 border-neutral-200 transform rotate-45"></div>
                  {/* Triangle pointer for mobile */}
                  <div className="block sm:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-neutral-200 transform rotate-45"></div>
                  
                  <p className="text-lg sm:text-xl font-extrabold text-neutral-800 leading-snug">
                    {DIMENSIONS[currentStep - 1].mascotMsg}
                  </p>
                </div>
              </div>

              <div className="mb-6 text-center max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1cb0f6] tracking-tight mb-2">{DIMENSIONS[currentStep - 1].title}</h2>
              </div>

              <div className="space-y-6 w-full max-w-3xl mx-auto">
                {DIMENSIONS[currentStep - 1].questions.map((q, idx) => {
                  const globalIndex = DIMENSIONS.slice(0, currentStep - 1).reduce((acc, d) => acc + d.questions.length, 0) + idx + 1;
                  const isMissing = missingFields.includes(`field-${q.id}`);
                  return (
                    <div id={`field-${q.id}`} key={q.id} className={`bg-white border-2 rounded-3xl p-5 sm:p-8 transition-colors ${isMissing ? 'border-[#1cb0f6] bg-[#ddf4ff]/30' : 'border-neutral-200'}`}>
                      <h3 className="text-lg sm:text-xl font-extrabold text-neutral-800 mb-6 leading-relaxed flex items-start gap-4">
                        <span className="text-[#1cb0f6] mt-0.5">{globalIndex}.</span>
                        <span>{q.text}</span>
                      </h3>

                      {isMissing && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 -mt-2 inline-flex items-center gap-2 bg-[#ddf4ff] text-[#1cb0f6] px-4 py-2 rounded-xl font-bold text-sm"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#1cb0f6] text-white flex items-center justify-center text-xs font-black">!</span>
                          Silakan pilih salah satu jawaban
                        </motion.div>
                      )}

                      <div className="flex flex-col sm:grid sm:grid-cols-5 gap-3">
                        {LIKERT_OPTIONS.map((opt) => {
                          const isSelected = answers[q.id] === opt.value;
                          return (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => {
                                setAnswers(prev => ({ ...prev, [q.id]: opt.value }));
                                setMissingFields(m => m.filter(x => x !== `field-${q.id}`));
                              }}
                              className={`
                                flex flex-row sm:flex-col items-center justify-between sm:justify-center p-4 sm:p-3
                                border-2 border-b-4 rounded-2xl transition-all active:border-b-2 active:translate-y-[2px]
                                ${isSelected 
                                  ? 'bg-[#ddf4ff] border-[#1cb0f6] border-b-[#1899d6]' 
                                  : 'bg-white border-neutral-200 border-b-neutral-300 hover:bg-neutral-50'
                                }
                              `}
                            >
                              <div className={`
                                w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl sm:mb-2
                                font-black text-xl border-2
                                ${isSelected 
                                  ? 'bg-white text-[#1cb0f6] border-[#1cb0f6]' 
                                  : 'bg-neutral-100 text-neutral-400 border-transparent'
                                }
                              `}>
                                {opt.value}
                              </div>
                              <span className={`
                                font-bold text-sm sm:text-xs text-right sm:text-center leading-tight
                                ${isSelected ? 'text-[#1cb0f6]' : 'text-neutral-500'}
                              `}>
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* FOOTER ACTION BAR */}
      {!showWelcome && (
        <div className="fixed bottom-0 left-0 right-0 border-t-2 border-neutral-200 bg-white z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5 flex justify-between items-center gap-4">
            
            <button 
              onClick={() => {
                if (currentStep === 0) {
                  setShowWelcome(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  handlePrev();
                }
              }} 
              className="font-extrabold uppercase tracking-widest px-4 sm:px-6 py-4 rounded-2xl transition-all text-neutral-400 hover:bg-neutral-100 active:scale-95"
            >
              Kembali
            </button>

          {currentStep < totalSteps - 1 ? (
            <button 
              onClick={handleNext}
              className={`
                font-extrabold uppercase tracking-wide px-8 sm:px-12 py-4 rounded-2xl border-b-4 transition-all min-w-[150px]
                ${isNextEnabled 
                  ? 'bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-b-[#1899d6] active:border-b-0 active:translate-y-1' 
                  : 'bg-[#1cb0f6]/70 text-white border-b-[#1cb0f6]/80' // still looks clickable but slightly muted
                }
              `}
            >
              Lanjut
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                font-extrabold uppercase tracking-wide px-8 sm:px-12 py-4 rounded-2xl border-b-4 transition-all min-w-[150px] flex items-center justify-center gap-2
                ${(!isSubmitting)
                  ? 'bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-b-[#1899d6] active:border-b-0 active:translate-y-1' 
                  : 'bg-neutral-200 text-neutral-400 border-b-neutral-300 cursor-not-allowed'
                }
              `}
            >
              Kirim
            </button>
          )}

        </div>
      </div>
      )}

      {/* Custom Error Popup Modal */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-sm p-6 text-center border-2 border-neutral-200"
          >
            <div className="w-16 h-16 bg-[#ddf4ff] text-[#1cb0f6] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <span className="text-3xl font-black">!</span>
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900 mb-2">Ops, Belum Lengkap!</h3>
            <p className="text-neutral-500 font-medium mb-8">{errorMessage}</p>
            <button onClick={() => {
              const step = findFirstIncompleteStep();
              if (step !== -1 && step !== currentStep) {
                setCurrentStep(step);
              }
              setShowErrorPopup(false);
            }} className="w-full bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold uppercase tracking-wide py-4 rounded-2xl border-b-4 border-b-[#1899d6] active:border-b-0 active:translate-y-1 transition-all">
              Perbaiki Sekarang
            </button>
          </motion.div>
        </div>
      )}

      {/* Custom Confirmation Popup Modal */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-sm p-6 text-center border-2 border-neutral-200"
          >
            <div className="w-16 h-16 bg-[#1cb0f6] text-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <Send className="w-8 h-8 ml-1" />
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900 mb-2">Kirim Penilaian?</h3>
            <p className="text-neutral-500 font-medium mb-8">Pastikan semua jawaban sudah benar. Data yang dikirim tidak bisa diubah lagi.</p>
            <div className="flex flex-col gap-3">
              <button onClick={executeSubmit} className="w-full bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold uppercase tracking-wide py-4 rounded-2xl border-b-4 border-b-[#1899d6] active:border-b-0 active:translate-y-1 transition-all">
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin mx-auto" /></> : "Ya, Kirim Sekarang!"}
              </button>
              <button onClick={() => setShowConfirmPopup(false)} className="w-full bg-white text-neutral-500 font-extrabold uppercase tracking-wide py-4 rounded-2xl hover:bg-neutral-50 transition-all">
                Cek Lagi Nanti
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
