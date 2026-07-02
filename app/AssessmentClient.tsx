"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { submitAssessment } from "./actions";
import Link from "next/link";
import Select from "react-select";

const DIMENSIONS = [
  {
    id: "sensing",
    title: "Dimensi 1: Sensing (Kemampuan Mengenali Perubahan)",
    mascotMsg: "Mari kita mulai dengan mengevaluasi kemampuan organisasi dalam memantau dan mengenali perubahan lingkungan.",
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
    title: "Dimensi 2: Seizing (Kemampuan Memanfaatkan Peluang)",
    mascotMsg: "Selanjutnya, kita akan menilai bagaimana organisasi Anda memanfaatkan peluang dan mengambil keputusan strategis.",
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
    title: "Dimensi 3: Transforming (Kemampuan Melakukan Transformasi)",
    mascotMsg: "Bagian terakhir. Mari kita evaluasi kemampuan organisasi dalam beradaptasi dan melakukan transformasi berkelanjutan.",
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
  { value: 1, label: "Tidak Pernah" },
  { value: 2, label: "Jarang" },
  { value: 3, label: "Kadang-Kadang" },
  { value: 4, label: "Sering" },
  { value: 5, label: "Selalu" }
];

const INSTANSI_OPTIONS = [
  "Dinas Pendidikan",
  "Dinas Kesehatan",
  "Dinas Pekerjaan Umum dan Penataan Ruang",
  "Dinas Perumahan, Kawasan Permukiman dan Pertanahan",
  "Dinas Sosial",
  "Dinas Kependudukan dan Pencatatan Sipil",
  "Dinas Tenaga Kerja dan Transmigrasi",
  "Dinas Lingkungan Hidup dan Kehutanan",
  "Dinas Koperasi, Usaha Kecil Menengah, Perdagangan dan Perindustrian",
  "Dinas Pariwisata, Kebudayaan, Kepemudaan dan Olahraga",
  "Dinas Pemberdayaan Masyarakat dan Desa",
  "Dinas Pengendalian Penduduk, Keluarga Berencana, Pemberdayaan Perempuan dan Perlindungan Anak",
  "Dinas Perhubungan",
  "Dinas Komunikasi, Informatika, Persandian dan Statistik",
  "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
  "Dinas Pangan dan Pertanian",
  "Dinas Perikanan dan Peternakan",
  "Dinas Arsip dan Perpustakaan Daerah",
  "Satuan Polisi Pamong Praja",
  "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia",
  "Badan Pendapatan Daerah",
  "Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah"
];

const JABATAN_OPTIONS = [
  "Kepala Dinas",
  "Sekretaris Dinas",
  "Kepala Bidang (Kabid)",
  "Kepala Subbagian (Kasubbag)",
  "Kepala Seksi (Kasi)",
  "Analis Kebijakan",
  "Analis Kepegawaian",
  "Analis Perencanaan",
  "Perencana",
  "Pranata Komputer",
  "Pengelola Data",
  "Pengelola Keuangan",
  "Pengadministrasi Umum",
  "Staf/Pelaksana",
  "Jabatan Fungsional (misalnya Auditor, Arsiparis, Pranata Humas, Statistisi, dll.)",
  "Lainnya"
];

const LAMA_BEKERJA_OPTIONS = [
  "0-5 tahun",
  "5-10 tahun",
  "Lainnya"
];

const instansiSelectOptions = INSTANSI_OPTIONS.map(opt => ({ value: opt, label: opt }));
const jabatanSelectOptions = JABATAN_OPTIONS.map(opt => ({ value: opt, label: opt }));
const lamaBekerjaSelectOptions = LAMA_BEKERJA_OPTIONS.map(opt => ({ value: opt, label: opt }));

const reactSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    padding: '2px',
    borderRadius: '0.375rem',
    borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    '&:hover': { borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1' },
    backgroundColor: 'white',
    fontSize: '16px'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f8fafc' : 'white',
    color: state.isSelected ? '#1e40af' : '#334155',
    cursor: 'pointer',
    fontSize: '16px',
    '&:active': { backgroundColor: '#dbeafe' }
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: '16px',
    color: '#0f172a'
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: '16px',
    color: '#94a3b8'
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 })
};

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
  const [instansi, setInstansi] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [jabatanLainnya, setJabatanLainnya] = useState("");
  const [email, setEmail] = useState(""); // Used for Lama Bekerja
  const [emailLainnya, setEmailLainnya] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Section 2 State
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const findFirstIncompleteStep = () => {
    if (!instansi || !jabatan || !email) return 0;
    if (jabatan === "Lainnya" && !jabatanLainnya) return 0;
    if (email === "Lainnya" && !emailLainnya) return 0;
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
        setErrorMessage(`Terdapat ${missing.length} pertanyaan yang belum Anda jawab pada halaman ini.`);
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
      setErrorMessage(`Terdapat ${missing.length} pertanyaan yang belum Anda jawab pada halaman ini.`);
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
    const finalJabatan = jabatan === "Lainnya" ? jabatanLainnya : jabatan;
    const finalEmail = email === "Lainnya" ? emailLainnya : email;

    try {
      const payload = {
        instansi,
        jabatan: finalJabatan,
        lama_bekerja: finalEmail || undefined,
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

  let isNextEnabled = true;
  if (currentStep === 0) {
    isNextEnabled = !!(instansi && jabatan && email);
    if (jabatan === "Lainnya" && !jabatanLainnya) isNextEnabled = false;
    if (email === "Lainnya" && !emailLainnya) isNextEnabled = false;
  } else if (currentStep > 0 && currentStep <= DIMENSIONS.length) {
    const currentDim = DIMENSIONS[currentStep - 1];
    isNextEnabled = currentDim.questions.every(q => !!answers[q.id]);
  }

  // Mascot removed from formal design, but if we want to keep it as a subtle illustration:
  // We can just use it without the speech bubble, or use a professional icon instead.
  // For now, we will replace the gamified mascot with a clean header.

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white relative pb-24">
      {/* HEADER: Top Bar + Progress Bar */}
      {!showWelcome && (
        <header className="sticky top-0 z-50 w-full flex flex-col shadow-sm">
          {/* Top Bar */}
          <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 w-full">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-start gap-3">
              <img src="/logo-sipoda.png" alt="Logo SIPODA" className="h-6 sm:h-7 object-contain shrink-0" />
              <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base line-clamp-2 text-left sm:truncate">SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)</span>
            </div>
          </div>
          
          {/* Progress Bar Area */}
          <div className="bg-slate-50/95 backdrop-blur-md border-b border-slate-200 w-full">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
              <div className="flex-grow relative h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                >
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-500 whitespace-nowrap uppercase tracking-wider">
                {currentStep} / {totalSteps - 1}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="step-welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-12 sm:mt-16"
            >
              <div className="max-w-3xl mx-auto flex flex-row items-center justify-start mb-8 gap-4 sm:gap-6 px-2 sm:px-0">
                <img src="/logo-sipoda.png" alt="Logo SIPODA" className="h-10 sm:h-14 object-contain shrink-0" />
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 text-left leading-snug">
                  SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)
                </h1>
              </div>
              
              <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-12 shadow-sm relative">
                
                <div className="text-slate-700 font-normal leading-relaxed text-justify space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Selamat Datang!</h3>
                  <p>Terima kasih atas kesediaan Bapak/Ibu/Saudara(i) untuk berpartisipasi dalam pengisian instrumen ini.</p>
                  <p>SIPODA (Sistem Pengukuran Pengembangan Organisasi Adaptif) merupakan instrumen yang dirancang untuk mengukur tingkat kemampuan adaptif organisasi dalam menghadapi perubahan di era digital. Hasil pengukuran diharapkan dapat memberikan gambaran mengenai kondisi adaptivitas organisasi sebagai dasar dalam melakukan evaluasi dan pengembangan organisasi secara berkelanjutan.</p>
                  <p>Penyusunan instrumen SIPODA merujuk pada teori Dynamic Capabilities yang dikemukakan oleh David J. Teece (2007). Teori ini menjelaskan bahwa organisasi yang adaptif memiliki kemampuan untuk mengenali perubahan, memanfaatkan peluang, dan melakukan transformasi secara berkelanjutan agar mampu menghadapi dinamika lingkungan.</p>
                  <p>Berdasarkan teori tersebut, instrumen ini mengukur tiga dimensi utama, yaitu:</p>
                  
                  <ul className="list-none space-y-4 my-6">
                    <li className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0 mt-0.5 text-sm">1</div>
                      <div><strong>Sensing</strong>, yaitu kemampuan organisasi dalam mengenali perubahan, peluang, dan tantangan yang muncul di lingkungan internal maupun eksternal.</div>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0 mt-0.5 text-sm">2</div>
                      <div><strong>Seizing</strong>, yaitu kemampuan organisasi dalam mengambil keputusan dan memanfaatkan peluang sebagai respons terhadap perubahan.</div>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0 mt-0.5 text-sm">3</div>
                      <div><strong>Transforming</strong>, yaitu kemampuan organisasi dalam melakukan penyesuaian, pembaruan, serta perbaikan secara berkelanjutan agar tetap adaptif terhadap perubahan lingkungan.</div>
                    </li>
                  </ul>
                  
                  <div className="bg-blue-50/50 p-6 rounded-xl text-blue-900 my-6 text-left border border-blue-100 flex gap-4 items-start">
                    <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">
                      Instrumen ini <strong>tidak digunakan</strong> untuk menilai kinerja individu maupun pegawai. Seluruh jawaban yang diberikan akan dijaga kerahasiaannya dan hanya digunakan untuk keperluan penyusunan dan analisis instrumen.
                    </p>
                  </div>
                  
                  <p>Mohon memberikan jawaban sesuai dengan kondisi yang sebenarnya berdasarkan pengalaman Bapak/Ibu/Saudara(i) selama bekerja di organisasi.</p>
                  <p>Terima kasih atas partisipasi dan kerja sama Bapak/Ibu/Saudara(i).</p>
                  <p className="font-semibold mt-6 text-slate-900">Selamat mengisi!</p>
                </div>
                
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={() => { setShowWelcome(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-full sm:w-auto px-10 py-3.5 text-base font-semibold rounded-lg flex items-center justify-center transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                  >
                    Mulai Evaluasi
                  </button>
                </div>
              </div>
            </motion.div>
          ) : currentStep === 0 ? (
            <motion.div
              key="step-info"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-10"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">Informasi Penilai</h1>
              
              <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div id="field-instansi">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Instansi <span className="text-rose-500">*</span></label>
                  {mounted && (
                    <Select
                      instanceId="select-instansi"
                      options={instansiSelectOptions}
                      styles={reactSelectStyles}
                      value={instansi ? { value: instansi, label: instansi } : null}
                      onChange={(selected: any) => { 
                        setInstansi(selected?.value || ""); 
                        setMissingFields(m => m.filter(x => x !== 'field-instansi')); 
                      }}
                      placeholder="Cari / Pilih Instansi..."
                      isSearchable={true}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  )}
                </div>

                <div id="field-jabatan">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Jabatan <span className="text-rose-500">*</span></label>
                  {mounted && (
                    <Select
                      instanceId="select-jabatan"
                      options={jabatanSelectOptions}
                      styles={reactSelectStyles}
                      value={jabatan ? { value: jabatan, label: jabatan } : null}
                      onChange={(selected: any) => { 
                        setJabatan(selected?.value || ""); 
                        setMissingFields(m => m.filter(x => x !== 'field-jabatan')); 
                      }}
                      placeholder="Cari / Pilih Jabatan..."
                      isSearchable={true}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  )}
                  {jabatan === "Lainnya" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={jabatanLainnya}
                        onChange={(e) => { setJabatanLainnya(e.target.value); setMissingFields(m => m.filter(x => x !== 'field-jabatan-lainnya')); }}
                        placeholder="Sebutkan jabatan Anda"
                        className="w-full p-3 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 transition-colors placeholder:text-slate-400 text-base"
                      />
                    </div>
                  )}
                </div>

                <div id="field-email">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Lama Bekerja <span className="text-rose-500">*</span></label>
                  {mounted && (
                    <Select
                      instanceId="select-lama-bekerja"
                      options={lamaBekerjaSelectOptions}
                      styles={reactSelectStyles}
                      value={email ? { value: email, label: email } : null}
                      onChange={(selected: any) => { 
                        setEmail(selected?.value || ""); 
                        setMissingFields(m => m.filter(x => x !== 'field-email')); 
                      }}
                      placeholder="Cari / Pilih Lama Bekerja..."
                      isSearchable={true}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  )}
                  {email === "Lainnya" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={emailLainnya}
                        onChange={(e) => { setEmailLainnya(e.target.value); setMissingFields(m => m.filter(x => x !== 'field-email-lainnya')); }}
                        placeholder="Sebutkan lama bekerja Anda"
                        className="w-full p-3 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 transition-colors placeholder:text-slate-400 text-base"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : currentStep > 0 && currentStep <= DIMENSIONS.length ? (
            <motion.div
              key={`dim-${currentStep}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-6 flex flex-col"
            >
              
              <div className="mb-8 max-w-3xl mx-auto w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{DIMENSIONS[currentStep - 1].title}</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {DIMENSIONS[currentStep - 1].mascotMsg}
                </p>
              </div>

              <div className="space-y-6 w-full max-w-3xl mx-auto">
                {DIMENSIONS[currentStep - 1].questions.map((q, idx) => {
                  const globalIndex = DIMENSIONS.slice(0, currentStep - 1).reduce((acc, d) => acc + d.questions.length, 0) + idx + 1;
                  const isMissing = missingFields.includes(`field-${q.id}`);
                  return (
                    <div id={`field-${q.id}`} key={q.id} className={`bg-white border rounded-xl p-6 sm:p-8 transition-colors shadow-sm ${isMissing ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}>
                      <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-6 leading-relaxed flex items-start gap-4">
                        <span className="text-slate-400 tabular-nums">{globalIndex}.</span>
                        <span>{q.text}</span>
                      </h3>

                      {isMissing && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 -mt-2 inline-flex items-center gap-2 text-rose-600 text-sm font-medium"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Pertanyaan ini wajib dijawab.
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
                                flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-3 sm:gap-0 p-4 sm:p-4
                                border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20
                                ${isSelected 
                                  ? 'bg-blue-50 border-blue-600 text-blue-700' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                                }
                              `}
                            >
                              <div className={`
                                w-6 h-6 sm:mb-3 rounded-full border flex items-center justify-center flex-shrink-0
                                ${isSelected 
                                  ? 'border-blue-600 bg-blue-600' 
                                  : 'border-slate-300 bg-white'
                                }
                              `}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                              </div>
                              <span className={`
                                font-medium text-sm text-left sm:text-center leading-snug sm:whitespace-nowrap
                                ${isSelected ? 'text-blue-700' : 'text-slate-600'}
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
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur-md z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:py-4 flex justify-between items-center gap-4">
            
            <button 
              onClick={() => {
                if (currentStep === 0) {
                  setShowWelcome(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  handlePrev();
                }
              }} 
              className="font-medium px-4 sm:px-6 py-2.5 rounded-md transition-all text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200"
            >
              Kembali
            </button>

          {currentStep < totalSteps - 1 ? (
            <button 
              onClick={handleNext}
              className={`
                font-medium px-8 sm:px-12 py-2.5 rounded-md transition-all min-w-[140px]
                ${isNextEnabled 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                  : 'bg-blue-300 text-white cursor-default'
                }
              `}
            >
              Selanjutnya
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                font-medium px-8 sm:px-12 py-2.5 rounded-md transition-all min-w-[140px] flex items-center justify-center gap-2
                ${(!isSubmitting)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim Penilaian"}
            </button>
          )}

        </div>
      </div>
      )}

      {/* Custom Error Popup Modal */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-sm p-6 text-center border border-slate-200 shadow-xl"
          >
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Informasi Belum Lengkap</h3>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">{errorMessage}</p>
            <button onClick={() => {
              const step = findFirstIncompleteStep();
              if (step !== -1 && step !== currentStep) {
                setCurrentStep(step);
              }
              setShowErrorPopup(false);
            }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-all">
              Perbaiki Sekarang
            </button>
          </motion.div>
        </div>
      )}

      {/* Custom Confirmation Popup Modal */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-sm p-6 text-center border border-slate-200 shadow-xl"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-5 h-5 ml-0.5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Kirim Hasil Penilaian?</h3>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">Pastikan seluruh data yang Anda masukkan telah sesuai. Data yang telah dikirim tidak dapat diubah kembali.</p>
            <div className="flex flex-col gap-3">
              <button onClick={executeSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-all flex items-center justify-center">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Konfirmasi & Kirim"}
              </button>
              <button onClick={() => setShowConfirmPopup(false)} className="w-full bg-white text-slate-600 border border-slate-300 font-medium py-3 rounded-md hover:bg-slate-50 transition-all">
                Tinjau Ulang
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
