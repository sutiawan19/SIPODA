"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProvinces, getRegencies, getDistricts, Region } from "@/lib/api-wilayah";
import { submitAssessment } from "./actions";
import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";
import Select from "react-select";

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    padding: '2px',
    borderRadius: '0.375rem',
    borderColor: state.isFocused ? '#171717' : '#d4d4d4',
    boxShadow: state.isFocused ? '0 0 0 1px #171717' : 'none',
    '&:hover': { borderColor: state.isFocused ? '#171717' : '#a3a3a3' }
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#e5e5e5' : state.isFocused ? '#f5f5f5' : 'white',
    color: '#171717',
    cursor: 'pointer',
    '&:active': { backgroundColor: '#d4d4d4' }
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 })
};

const DIMENSIONS = [
  {
    id: "tangibles",
    title: "1 - TANGIBLES (Bukti Fisik)",
    questions: [
      { id: "tangibles_1", text: "Seberapa baik pemanfaatan sarana dan prasarana pelayanan publik?" },
      { id: "tangibles_2", text: "Seberapa baik pemanfaatan teknologi dalam proses pelayanan?" },
      { id: "tangibles_3", text: "Seberapa baik pemanfaatan sumber daya manusia dalam meningkatkan kualitas pelayanan?" }
    ]
  },
  {
    id: "reliability",
    title: "2 - RELIABILITY (Keandalan)",
    questions: [
      { id: "reliability_1", text: "Seberapa baik pembagian tugas serta kewenangan dalam organisasi?" },
      { id: "reliability_2", text: "Seberapa baik prosedur pelayanan dalam mendukung kelancaran pelayanan?" },
      { id: "reliability_3", text: "Seberapa baik ketepatan waktu dalam penyelesaian pelayanan?" }
    ]
  },
  {
    id: "responsiveness",
    title: "3 - RESPONSIVENESS (Daya Tanggap)",
    questions: [
      { id: "responsiveness_1", text: "Seberapa baik arahan pemimpin dalam mendukung pelayanan?" },
      { id: "responsiveness_2", text: "Seberapa baik kerja sama antarbidang dalam menyelesaikan suatu masalah?" },
      { id: "responsiveness_3", text: "Seberapa baik komunikasi antarunit kerja?" }
    ]
  },
  {
    id: "assurance",
    title: "4 - ASSURANCE (Jaminan)",
    questions: [
      { id: "assurance_1", text: "Seberapa baik pengawasan terhadap pelaksanaan pelayanan?" },
      { id: "assurance_2", text: "Seberapa baik kompetensi pegawai?" },
      { id: "assurance_3", text: "Seberapa baik pengembangan dan pelatihan pegawai?" }
    ]
  },
  {
    id: "empathy",
    title: "5 - EMPATHY (Empati)",
    questions: [
      { id: "empathy_1", text: "Seberapa baik dukungan pemimpin dalam menyelesaikan kendala?" },
      { id: "empathy_2", text: "Seberapa baik evaluasi yang dilakukan pemimpin?" },
      { id: "empathy_3", text: "Seberapa baik jumlah pegawai yang tersedia?" }
    ]
  }
];

const LIKERT_OPTIONS = [
  { value: 1, label: "Sangat Tidak Baik" },
  { value: 2, label: "Tidak Baik" },
  { value: 3, label: "Cukup" },
  { value: 4, label: "Baik" },
  { value: 5, label: "Sangat Baik" }
];

const JABATAN_OPTIONS = [
  { label: "Top Management", options: [{ value: "Sekda", label: "Sekda" }] },
  {
    label: "Middle Management", options: [
      { value: "Asisten Sekda & Staf Ahli Bupati", label: "Asisten Sekda & Staf Ahli Bupati" },
      { value: "Inspektur Daerah", label: "Inspektur Daerah" },
      { value: "Kepala Dinas/Kepala Badan", label: "Kepala Dinas/Kepala Badan" },
      { value: "Sekretaris Dinas/Badan", label: "Sekretaris Dinas/Badan" },
      { value: "Kepala Bagian (Kabag)", label: "Kepala Bagian (Kabag)" },
      { value: "Kepala Bidang (Kabid)", label: "Kepala Bidang (Kabid)" },
      { value: "Camat", label: "Camat" }
    ]
  },
  {
    label: "Lower Management", options: [
      { value: "Kepala Sub Bagian (Kasubag)", label: "Kepala Sub Bagian (Kasubag)" },
      { value: "Kepala Seksi (Kasi)", label: "Kepala Seksi (Kasi)" },
      { value: "Lurah", label: "Lurah" },
      { value: "Kepala Sub Bidang (Kasubid)", label: "Kepala Sub Bidang (Kasubid)" },
      { value: "Jabatan Fungsional Tertentu (JFT)", label: "Jabatan Fungsional Tertentu (JFT)" },
      { value: "Jabatan Pelaksana (Staf)", label: "Jabatan Pelaksana (Staf)" }
    ]
  }
];

export default function AssessmentClient({ institutions }: { institutions: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = DIMENSIONS.length + 1;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Section 1 State
  const [jabatan, setJabatan] = useState("");
  const [instansiDinilai, setInstansiDinilai] = useState("");

  const [districts, setDistricts] = useState<Region[]>([]);
  const [selectedDistName, setSelectedDistName] = useState("");

  // Section 2 State
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    getDistricts('3211').then(setDistricts);
  }, []);

  const findFirstIncompleteStep = () => {
    if (!jabatan || !selectedDistName || !instansiDinilai) return 0;
    for (let i = 0; i < DIMENSIONS.length; i++) {
      const dim = DIMENSIONS[i];
      const hasUnanswered = dim.questions.some(q => !answers[q.id]);
      if (hasUnanswered) return i + 1;
    }
    return -1;
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentStep === 0) {
      const missing = [];
      if (!jabatan) missing.push('field-jabatan');
      if (!selectedDistName) missing.push('field-kecamatan');
      if (!instansiDinilai) missing.push('field-instansi');

      if (missing.length > 0) {
        setMissingFields(missing);

        // Scroll to the first missing field
        setTimeout(() => {
          document.getElementById(missing[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        return;
      }
    } else {
      const currentDim = DIMENSIONS[currentStep - 1];
      const missing = currentDim.questions.filter(q => !answers[q.id]).map(q => `field-${q.id}`);

      if (missing.length > 0) {
        setMissingFields(missing);

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const currentDim = DIMENSIONS[currentStep - 1];
    const missing = currentDim.questions.filter(q => !answers[q.id]).map(q => `field-${q.id}`);

    if (missing.length > 0) {
      setMissingFields(missing);
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
        jabatan,
        kecamatan: selectedDistName,
        institution_id: instansiDinilai,
        answers
      };
      await submitAssessment(payload);

      const answerValues = Object.values(answers) as number[];
      const sum = answerValues.reduce((a, b) => a + b, 0);
      const maxScore = answerValues.length * 5;
      const percentage = Math.round((sum / maxScore) * 100);

      // Hitung dimensi tertinggi dan terendah beserta persentasenya
      const dimScores = DIMENSIONS.map(dim => {
        let dimSum = 0;
        dim.questions.forEach(q => { dimSum += (answers[q.id] || 0) });
        // Clean title (remove "1 - " prefix)
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const LIKERT_OPTIONS = [
    { value: 1, label: "Sangat Tidak Baik" },
    { value: 2, label: "Tidak Baik" },
    { value: 3, label: "Cukup" },
    { value: 4, label: "Baik" },
    { value: 5, label: "Sangat Baik" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans text-neutral-900 relative">
      {/* Elegant Background Ornaments */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#17171708_1px,transparent_1px),linear-gradient(to_bottom,#17171708_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        {/* Top/Bottom Fade for Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/80 via-transparent to-neutral-50"></div>

        {/* Top Right Logo Watermark */}
        <div className="hidden md:block absolute -top-32 -right-32 w-96 h-96 opacity-[0.03] rotate-12 transform">
          <img src="/logo.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Bottom Left Logo Watermark */}
        <div className="absolute top-[60%] -left-48 w-[500px] h-[500px] opacity-[0.02] -rotate-12 transform">
          <img src="/logo.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neutral-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-neutral-300/30 rounded-full blur-[120px] mix-blend-multiply opacity-30"></div>

        {/* Elegant Accent Line */}
        <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-neutral-200 to-transparent"></div>
        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-neutral-200 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        <PublicNavbar />

        <main className="flex-grow py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <h1 className="text-3xl font-bold tracking-tight mb-4">Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik</h1>
              {currentStep === 0 && (
                <div className="text-neutral-700 text-sm md:text-base leading-relaxed space-y-4 text-justify">
                  <p>
                    Website Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik merupakan sistem yang dirancang untuk membantu Organisasi Perangkat Daerah (OPD) dalam melakukan evaluasi dan penilaian restrukturisasi organisasi berdasarkan indikator kualitas pelayanan publik. Sistem ini bertujuan meningkatkan efektivitas organisasi serta kualitas pelayanan kepada masyarakat melalui proses penilaian yang lebih cepat, objektif, dan terukur.
                  </p>
                  <p>
                    Data dan penilaian yang diberikan akan menjadi bahan evaluasi dalam mendukung perbaikan tata kelola pemerintahan yang lebih efektif, transparan, dan berorientasi pada kebutuhan masyarakat. Mohon mengisi seluruh pertanyaan secara objektif sesuai dengan kondisi yang sebenarnya agar hasil evaluasi dapat digunakan sebagai dasar pengambilan keputusan dan pengembangan organisasi di masa mendatang.
                  </p>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-sm">
                    <p className="font-semibold mb-2">Penilaian dalam website ini menggunakan 5 dimensi kualitas pelayanan (SERVQUAL):</p>
                    <ol className="list-decimal list-outside ml-4 space-y-1">
                      <li><strong>Tangibles (bukti fisik)</strong><br />Berisikan mengenai fasilitas, sarana, teknologi serta penampilan petugas.</li>
                      <li><strong>Reliability (keandalan)</strong><br />Kemampuan instansi untuk memberikan layanan dengan cepat, akurat serta sesuai dengan janji.</li>
                      <li><strong>Responsiveness (ketanggapan)</strong><br />Kesadaran serta kesiagapan pegawai dalam membantu masyarakat dalam pelayanan.</li>
                      <li><strong>Assurance (jaminan)</strong><br />Pengetahuan serta sikap pegawai yang menumbuhkan rasa aman dan percaya masyarakat.</li>
                      <li><strong>Empathy (empati)</strong><br />Sikap tulus serta perhatian organisasi publik dalam memahami kebutuhan Masyarakat.</li>
                    </ol>
                    <p className="mt-3 text-neutral-500 font-medium">Jumlah pertanyaan dalam survei ini berjumlah 15 pertanyaan dengan masing-masing dimensi 3 pertanyaan.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8 bg-white p-5 sm:p-6 md:p-10 rounded-2xl border border-neutral-200 shadow-sm relative">

              {/* Progress Bar */}
              <div className="sticky top-[64px] bg-white/90 backdrop-blur-md z-[60] pt-5 sm:pt-6 md:pt-10 pb-5 sm:pb-6 mb-8 border-b border-neutral-100 -mx-5 px-5 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 -mt-5 sm:-mt-6 md:-mt-10 rounded-t-2xl">
                <div className="flex justify-between text-xs md:text-sm font-semibold text-neutral-500 mb-3 uppercase tracking-wider">
                  <span>Langkah Penilaian</span>
                  <span className="text-neutral-900">{currentStep + 1} / {totalSteps}</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-neutral-900 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}></div>
                </div>
              </div>

              <div className="min-h-[400px]">
                {/* SECTION 1 */}
                {currentStep === 0 && (
                  <motion.section
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-bold mb-8 pb-4 border-b border-neutral-100 text-neutral-900">Informasi Penilai</h2>

                    <div className="space-y-6">
                      <div className="z-50 relative mb-6" id="field-jabatan">
                        <label className="block text-sm font-semibold text-neutral-800 mb-2">Jabatan <span className="text-red-500">*</span></label>
                        {mounted && (
                          <Select
                            instanceId="jabatan-select"
                            options={JABATAN_OPTIONS}
                            styles={customSelectStyles}
                            placeholder="Pilih jabatan Anda"
                            value={jabatan ? { label: jabatan, value: jabatan } : null}
                            onChange={(selected: any) => { setJabatan(selected.value); setMissingFields(m => m.filter(x => x !== 'field-jabatan')); }}
                            menuPortalTarget={document.body}
                          />
                        )}
                        {missingFields.includes('field-jabatan') && <span className="text-red-500 text-xs mt-1 block">Wajib dipilih</span>}
                      </div>

                      <div className="grid grid-cols-1 gap-5 z-40 relative">
                        <div id="field-kecamatan">
                          <label className="block text-sm font-semibold text-neutral-800 mb-2">Kecamatan <span className="text-red-500">*</span></label>
                          {mounted && (
                            <Select
                              instanceId="kecamatan-select"
                              options={districts.map(d => ({ value: d.name, label: d.name }))}
                              styles={customSelectStyles}
                              placeholder="Ketik atau pilih Kecamatan..."
                              value={selectedDistName ? { value: selectedDistName, label: selectedDistName } : null}
                              onChange={(selected: any) => {
                                setSelectedDistName(selected?.value || "");
                                setMissingFields(m => m.filter(x => x !== 'field-kecamatan'));
                              }}
                              isSearchable
                              noOptionsMessage={() => "Tidak ada data"}
                              menuPortalTarget={document.body}
                            />
                          )}
                          {missingFields.includes('field-kecamatan') && <span className="text-red-500 text-xs mt-1 block">Wajib dipilih</span>}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-neutral-100 relative z-10" id="field-instansi">
                        <label className="block text-sm font-semibold text-neutral-800 mb-2">
                          Instansi yang Dinilai <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-neutral-500 mb-3">Pilih instansi pelayanan publik yang Anda evaluasi hari ini.</p>
                        {mounted && (
                          <Select
                            instanceId="inst-dinilai-select"
                            options={institutions.map(inst => ({ value: inst.id, label: inst.name }))}
                            styles={{
                              ...customSelectStyles,
                              control: (base, state) => ({
                                ...customSelectStyles.control(base, state),
                                padding: '6px'
                              })
                            }}
                            placeholder="Ketik atau pilih instansi..."
                            value={instansiDinilai ? { value: instansiDinilai, label: institutions.find(i => i.id === instansiDinilai)?.name || "" } : null}
                            onChange={(selected: any) => {
                              setInstansiDinilai(selected?.value || "");
                              setMissingFields(m => m.filter(x => x !== 'field-instansi'));
                            }}
                            isSearchable
                            menuPortalTarget={document.body}
                          />
                        )}
                        {missingFields.includes('field-instansi') && <span className="text-red-500 text-xs mt-1 block">Wajib dipilih</span>}
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* SECTION 2 (Dimensions) */}
                {currentStep > 0 && currentStep <= DIMENSIONS.length && (() => {
                  const dim = DIMENSIONS[currentStep - 1];
                  return (
                    <motion.section
                      key={`step-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-8 pb-4 border-b border-neutral-100">
                        <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-bold tracking-wider uppercase mb-3">Dimensi Penilaian</span>
                        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">{dim.title}</h2>
                        <p className="text-sm text-neutral-500 mt-2">Beri penilaian dengan skala 1 (Sangat Tidak Baik) hingga 5 (Sangat Baik).</p>
                      </div>

                      <div className="space-y-8">
                        {dim.questions.map((q, idx) => {
                          const globalIndex = DIMENSIONS.slice(0, currentStep - 1).reduce((acc, d) => acc + d.questions.length, 0) + idx + 1;
                          const isMissing = missingFields.includes(`field-${q.id}`);
                          return (
                            <div id={`field-${q.id}`} key={q.id} className={`bg-neutral-50/50 p-5 md:p-6 border rounded-2xl transition-all ${isMissing ? 'border-red-400 bg-red-50/30 ring-4 ring-red-50' : 'border-neutral-100'}`}>
                              <p className="text-base md:text-lg font-medium text-neutral-800 mb-6 leading-relaxed flex items-start gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5 ${isMissing ? 'bg-red-100 text-red-600' : 'bg-neutral-200 text-neutral-700'}`}>{globalIndex}</span>
                                {q.text}
                              </p>
                              {isMissing && <p className="text-red-500 text-sm font-semibold mb-4 -mt-3 ml-9">Pertanyaan ini wajib diisi sebelum melanjutkan.</p>}
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
                                      className={`flex flex-row sm:flex-col items-center justify-start sm:justify-center py-3.5 px-5 sm:px-2 border rounded-xl transition-all active:scale-95 gap-4 sm:gap-0 ${isSelected ? 'bg-neutral-950 border-neutral-950 text-white shadow-md scale-[1.02]' : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'}`}
                                    >
                                      <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full sm:bg-transparent sm:w-auto sm:h-auto ${isSelected ? 'bg-white text-neutral-950 sm:text-white' : 'bg-neutral-100 text-neutral-700 sm:bg-transparent'}`}>
                                        <span className="font-bold text-lg">{opt.value}</span>
                                      </div>
                                      <span className="text-sm sm:text-[10px] sm:uppercase tracking-wider sm:mt-2 text-left sm:text-center opacity-90 font-medium sm:font-normal leading-tight">{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.section>
                  );
                })()}
              </div>

              {/* Navigation Footer */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 pt-8 mt-8 border-t border-neutral-100 relative z-10">
                {currentStep > 0 ? (
                  <Button type="button" variant="outline" onClick={handlePrev} className="rounded-xl w-full sm:w-auto h-14 sm:h-12 text-base sm:text-sm font-semibold">
                    Kembali
                  </Button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {currentStep < totalSteps - 1 ? (
                  <Button type="button" onClick={handleNext} className="rounded-xl px-8 shadow-md w-full sm:w-auto h-14 sm:h-12 text-base sm:text-sm font-semibold">
                    Selanjutnya
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl px-8 shadow-md w-full sm:w-auto sm:min-w-[200px] h-14 sm:h-12 text-base sm:text-sm font-semibold">
                    {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Mengirim...</> : "Kirim Penilaian"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Custom Error Popup Modal */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center border border-neutral-200"
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">!</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Penilaian Belum Lengkap</h3>
            <p className="text-sm text-neutral-500 mb-6">{errorMessage}</p>
            <Button onClick={() => {
              const step = findFirstIncompleteStep();
              if (step !== -1) {
                setCurrentStep(step);
              }
              setShowErrorPopup(false);
            }} className="w-full rounded-xl">
              Mengerti, Arahkan ke Pertanyaan
            </Button>
          </motion.div>
        </div>
      )}

      {/* Custom Confirmation Popup Modal */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center border border-neutral-200"
          >
            <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Kirim Penilaian?</h3>
            <p className="text-sm text-neutral-500 mb-6">Apakah Anda sudah yakin dengan semua penilaian yang Anda berikan? Data yang sudah dikirim tidak dapat diubah kembali.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setShowConfirmPopup(false)} variant="outline" className="w-full rounded-xl font-semibold">
                Cek Ulang
              </Button>
              <Button onClick={executeSubmit} className="w-full rounded-xl font-semibold bg-neutral-900">
                Ya, Kirim
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
