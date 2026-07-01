"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Loader2, Trash2, Building2, User, Briefcase, Sparkles, Mail } from "lucide-react";
import { deleteMultipleResponses } from "@/app/admin/responses/actions";
import { useRouter } from "next/navigation";

interface ResponseDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null;
}

const DIMENSIONS = [
  {
    id: "sensing",
    title: "Dimensi 1. Sensing (Kemampuan Mengenali Perubahan)",
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

function getScoreData(score100: number) {
  if (score100 <= 20) {
    return { status: "Sangat Tidak Adaptif", recommendation: "Organisasi belum memiliki kemampuan adaptif yang memadai. Diperlukan perubahan secara menyeluruh melalui penguatan kemampuan mengenali perubahan, pemanfaatan peluang, transformasi proses kerja, pengembangan kompetensi pegawai, serta penyesuaian struktur organisasi.", rekomendasi: "Lakukan perombakan struktural dan mulai bangun budaya sadar pelayanan publik.", color: "text-rose-600", bg: "bg-rose-50", borderColor: "border-rose-200" };
  } else if (score100 <= 40) {
    return { status: "Kurang Adaptif", recommendation: "Organisasi belum mampu beradaptasi secara optimal. Diperlukan penguatan dalam pemantauan perubahan lingkungan, dukungan terhadap inovasi, peningkatan kolaborasi, dan penyempurnaan proses kerja.", rekomendasi: "Tingkatkan kolaborasi internal dan mulai manfaatkan teknologi dasar dalam proses kerja.", color: "text-amber-600", bg: "bg-amber-50", borderColor: "border-amber-200" };
  } else if (score100 <= 60) {
    return { status: "Cukup Adaptif", recommendation: "Organisasi memiliki kemampuan adaptif yang cukup, tetapi belum konsisten pada seluruh aspek. Organisasi perlu meningkatkan kemampuan dalam mengenali perubahan, mempercepat pengambilan keputusan, dan memperbaiki proses kerja secara berkelanjutan.", rekomendasi: "Menguatkan kualitas SDM melalui pelatihan kompetensi digital dan inovasi.", color: "text-[#1cb0f6]", bg: "bg-[#f3f9fc]", borderColor: "border-[#1cb0f6]" };
  } else if (score100 <= 80) {
    return { status: "Adaptif", recommendation: "Organisasi telah mampu beradaptasi terhadap perubahan, namun masih terdapat aspek yang perlu ditingkatkan agar kemampuan adaptif semakin optimal, terutama dalam memperkuat inovasi dan koordinasi organisasi.", rekomendasi: "Kembangkan sistem yang ada dan dorong inovasi yang lebih agresif dari setiap pegawai.", color: "text-indigo-600", bg: "bg-indigo-50", borderColor: "border-indigo-200" };
  } else {
    return { status: "Sangat Adaptif", recommendation: "Organisasi memiliki kemampuan yang sangat baik dalam mengenali perubahan, memanfaatkan peluang, dan melakukan transformasi secara berkelanjutan. Organisasi perlu mempertahankan kemampuan tersebut serta terus mengembangkan inovasi dan pembelajaran.", rekomendasi: "Mempertahankan dan membagikan praktik terbaik (best practices) kepada instansi lain.", color: "text-emerald-600", bg: "bg-emerald-50", borderColor: "border-emerald-200" };
  }
}

export function ResponseDetailDrawer({ isOpen, onClose, data }: ResponseDetailDrawerProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!data) return null;

  const handleConfirmDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus data ini secara permanen?")) return;
    setIsDeleting(true);
    try {
      await deleteMultipleResponses([data.db_id]);
      onClose();
      router.refresh();
    } catch (err: any) {
      alert("Gagal menghapus data.");
    } finally {
      setIsDeleting(false);
    }
  };

  const score100 = data ? (data.score / 5) * 100 : 0;
  const scoreInfo = getScoreData(score100);

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full bg-[#f3f9fc] font-sans">

        {/* Detail Header */}
        <div className="bg-white px-8 pt-10 pb-8 border-b-2 border-neutral-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-black text-neutral-400 mb-2 uppercase tracking-widest">Detail Penilaian SIPODA</p>
              <h2 className="text-5xl font-black text-neutral-900 tracking-tighter">{data.response_code.replace(/^ASM-/, "")}</h2>
              <p className="text-sm font-bold text-neutral-500 mt-2">{data.date}</p>
            </div>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-extrabold px-4 py-2 rounded-xl hover:bg-rose-50 transition-colors active:scale-95 border-2 border-transparent hover:border-rose-200"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 stroke-[3]" />}
              Hapus
            </button>
          </div>

          <div className={`rounded-2xl p-6 md:p-8 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm border-2 ${scoreInfo.bg} ${scoreInfo.borderColor}`}>
            <div>
              <p className={`text-sm font-black mb-1 uppercase tracking-widest ${scoreInfo.color}`}>Skor Keseluruhan</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black tracking-tighter ${scoreInfo.color}`}>{score100.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <Badge className={`px-4 py-1.5 text-sm border-2 font-black bg-white ${scoreInfo.color} ${scoreInfo.borderColor}`}>
                {scoreInfo.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-10">

          <section className="space-y-4">
            <div className={`p-6 md:p-8 rounded-2xl border-2 ${scoreInfo.bg} ${scoreInfo.borderColor} shadow-sm relative overflow-hidden`}>
              <div className="flex items-start gap-4 relative z-10">
                <div className={`mt-0.5 w-12 h-12 rounded-[1rem] flex shrink-0 items-center justify-center bg-white shadow-sm border-2 ${scoreInfo.borderColor} ${scoreInfo.color}`}>
                  <Sparkles className="w-6 h-6 stroke-2" />
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${scoreInfo.color}`}>REKOMENDASI TINDAKAN</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    {scoreInfo.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Metadata Grid */}
          <section>
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4 border-b-2 border-neutral-200 pb-2">Informasi Responden</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
                <User className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Nama</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">{data.nama}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
                <Briefcase className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Jabatan</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">{data.jabatan}</p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
                <Building2 className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Instansi</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">{data.inst}</p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
                <Mail className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div className="w-full">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Email</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1 break-all">{data.email || "-"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Scores Breakdown */}
          <section>
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4 border-b-2 border-neutral-200 pb-2">Rincian Penilaian per Dimensi</h3>
            <div className="space-y-6">
              {DIMENSIONS.map((dim) => {
                const total = dim.questions.reduce((sum, q) => sum + (data.answers[q.id] || 0), 0);
                const dimScore = (total / dim.questions.length).toFixed(1);

                return (
                  <div key={dim.id} className="bg-white border-2 border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-[#f3f9fc] px-6 py-4 border-b-2 border-neutral-100 flex justify-between items-center">
                      <h4 className="font-extrabold text-neutral-900">{dim.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="bg-[#1cb0f6] text-white px-3 py-1 rounded-xl text-sm font-black">{(parseFloat(dimScore) / 5 * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="divide-y-2 divide-neutral-100">
                      {dim.questions.map((q, idx) => {
                        const val = data.answers[q.id] || 0;
                        return (
                          <div key={q.id} className="px-6 py-4 flex justify-between gap-4 hover:bg-neutral-50 transition-colors">
                            <p className="text-sm text-neutral-600 leading-relaxed font-medium">{idx + 1}. {q.text}</p>
                            <span className="font-black text-neutral-900 tabular-nums shrink-0 bg-neutral-100 w-8 h-8 rounded-full flex items-center justify-center">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </Drawer>
  );
}
