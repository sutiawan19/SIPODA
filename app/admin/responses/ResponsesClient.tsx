"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx-js-style";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, RotateCcw, ChevronLeft, ChevronRight, Loader2, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ResponseDetailDrawer } from "@/components/admin/ResponseDetailDrawer";
import { Select } from "@/components/ui/Select";
import { deleteMultipleResponses } from "./actions";

const FADE_UP = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } }
};

const QUESTION_MAPPING: Record<string, string> = {
  sensing_1: "Organisasi secara rutin memantau perubahan kebutuhan masyarakat terhadap pelayanan",
  sensing_2: "Organisasi secara aktif memantau perkembangan teknologi digital yang relevan dengan pelaksanaan tugas organisasi",
  sensing_3: "Organisasi mampu mengidentifikasi perubahan kebijakan atau regulasi yang memengaruhi pelaksanaan tugas",
  sensing_4: "Data hasil evaluasi pelayanan dimanfaatkan untuk mengidentifikasi kebutuhan perbaikan",
  sensing_5: "Masukan dari masyarakat digunakan untuk mengenali kebutuhan peningkatan kualitas pelayanan",
  sensing_6: "Organisasi secara aktif mengidentifikasi peluang inovasi melalui perkembangan teknologi dan informasi",
  sensing_7: "Pimpinan mendorong pemanfaatan data dan informasi sebagai dasar memahami perubahan lingkungan strategis",
  sensing_8: "Organisasi memiliki mekanisme yang efektif untuk mendeteksi permasalahan pelayanan sejak dini",
  seizing_1: "Organisasi mampu menerapkan teknologi digital untuk meningkatkan kualitas pelayanan",
  seizing_2: "Ide atau gagasan baru dari pegawai memperoleh dukungan untuk diimplementasikan",
  seizing_3: "Organisasi mampu mengambil keputusan secara cepat ketika terdapat peluang untuk meningkatkan kinerja pelayanan",
  seizing_4: "Organisasi menyediakan sumber daya yang diperlukan untuk mendukung penerapan inovasi digital",
  seizing_5: "Teknologi baru dimanfaatkan untuk meningkatkan efisiensi pelaksanaan pekerjaan",
  seizing_6: "Organisasi mendorong setiap unit kerja untuk mengembangkan inovasi dalam pelaksanaan tugas",
  seizing_7: "Perubahan kebutuhan masyarakat segera direspons melalui penyesuaian layanan yang diberikan",
  seizing_8: "Keputusan strategis didasarkan pada data dan informasi yang akurat",
  transforming_1: "Organisasi mampu menyesuaikan prosedur kerja ketika terjadi perubahan kebutuhan pelayanan",
  transforming_2: "Struktur kerja dapat disesuaikan untuk mendukung pelaksanaan tugas secara lebih efektif",
  transforming_3: "Mekanisme koordinasi antarunit kerja dapat disesuaikan ketika menghadapi perubahan kebutuhan organisasi",
  transforming_4: "Hasil evaluasi digunakan sebagai dasar untuk memperbaiki proses kerja organisasi",
  transforming_5: "Perubahan teknologi diikuti dengan penyesuaian cara kerja organisasi",
  transforming_6: "Organisasi mendorong budaya kerja yang terbuka terhadap perubahan dan inovasi",
  transforming_7: "Pegawai diberikan kesempatan untuk berpartisipasi dalam proses perubahan dan pengembangan organisasi",
  transforming_8: "Organisasi mampu mempertahankan kualitas pelayanan melalui penyesuaian struktur, proses kerja, dan pemanfaatan teknologi ketika menghadapi perubahan lingkungan."
};

interface ResponsesClientProps {
  initialResponses: any[];
}

export function ResponsesClient({ initialResponses }: ResponsesClientProps) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Semua Waktu");

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map(row => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Yakin ingin menghapus ${selectedIds.length} data penilaian? Data yang dihapus tidak dapat dikembalikan.`)) return;

    setIsDeleting(true);
    try {
      await deleteMultipleResponses(selectedIds);
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    const worksheetData = filteredData.map(row => {
      const score100 = (row.score / 5) * 100;
      
      let status = "Sangat Tidak Adaptif";
      if (score100 > 20 && score100 <= 40) status = "Kurang Adaptif";
      else if (score100 > 40 && score100 <= 60) status = "Cukup Adaptif";
      else if (score100 > 60 && score100 <= 80) status = "Adaptif";
      else if (score100 > 80) status = "Sangat Adaptif";

      let sensingTotal = 0, sensingCount = 0;
      let seizingTotal = 0, seizingCount = 0;
      let transformingTotal = 0, transformingCount = 0;

      Object.keys(row.answers || {}).forEach(k => {
        if (k.startsWith('sensing_')) { sensingTotal += row.answers[k]; sensingCount++; }
        if (k.startsWith('seizing_')) { seizingTotal += row.answers[k]; seizingCount++; }
        if (k.startsWith('transforming_')) { transformingTotal += row.answers[k]; transformingCount++; }
      });

      const getDimPct = (total: number, count: number) => count > 0 ? ((total / count) / 5 * 100).toFixed(1) + "%" : "0.0%";

      const exportRow: any = {
        "ID Penilaian": row.response_code.replace(/^ASM-/, ""),
        "Waktu Pengisian": row.date,
        "Instansi": row.inst,
        "Jabatan": row.jabatan,
        "Lama Bekerja": row.lamaBekerja || "-",
        "Skor Keseluruhan (%)": score100.toFixed(1) + "%",
        "Kategori": status,
        "Skor Sensing (%)": getDimPct(sensingTotal, sensingCount),
        "Skor Seizing (%)": getDimPct(seizingTotal, seizingCount),
        "Skor Transforming (%)": getDimPct(transformingTotal, transformingCount)
      };

      // Append SERVQUAL answers
      Object.keys(row.answers || {}).forEach(k => {
        const title = QUESTION_MAPPING[k] || k;
        exportRow[title] = row.answers[k];
      });

      return exportRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // 1. Set column widths
    const wscols = [
      { wch: 15 }, // ID Penilaian
      { wch: 35 }, // Waktu Pengisian
      { wch: 30 }, // Instansi
      { wch: 20 }, // Jabatan
      { wch: 25 }, // Lama Bekerja
      { wch: 22 }, // Skor Keseluruhan (%)
      { wch: 22 }, // Kategori
      { wch: 20 }, // Skor Sensing (%)
      { wch: 20 }, // Skor Seizing (%)
      { wch: 25 }  // Skor Transforming (%)
    ];
    // Add widths for the question columns
    for (let i = 0; i < Object.keys(QUESTION_MAPPING).length; i++) {
      wscols.push({ wch: 50 }); // Give question columns wide width
    }
    worksheet['!cols'] = wscols;

    // 2. Style cells (Headers and Content)
    const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1:A1");
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        if (R === 0) {
          // Header styling
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "2563EB" } }, // Formal Blue
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
              top: { style: "thin", color: { rgb: "CBD5E1" } },
              bottom: { style: "thin", color: { rgb: "CBD5E1" } },
              left: { style: "thin", color: { rgb: "CBD5E1" } },
              right: { style: "thin", color: { rgb: "CBD5E1" } }
            }
          };
        } else {
          // Data row styling
          let hAlign = "left";
          if (C > 5) {
            hAlign = "center"; // Scores and Questions
          }

          worksheet[cellAddress].s = {
            alignment: { vertical: "center", horizontal: hAlign, wrapText: true },
            border: {
              top: { style: "thin", color: { rgb: "E2E8F0" } },
              bottom: { style: "thin", color: { rgb: "E2E8F0" } },
              left: { style: "thin", color: { rgb: "E2E8F0" } },
              right: { style: "thin", color: { rgb: "E2E8F0" } }
            }
          };
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Penilaian");

    XLSX.writeFile(workbook, `Data_Penilaian_SIPODA_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleReset = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSearch("");
      setDateFilter("Semua Waktu");
      setCurrentPage(1);
      setIsLoading(false);
    }, 400);
  };

  const filteredData = useMemo(() => {
    return initialResponses.filter((item) => {
      const searchStr = search.toLowerCase();
      const matchSearch = item.inst?.toLowerCase().includes(searchStr) ||
        item.nama?.toLowerCase().includes(searchStr) ||
        item.response_code?.toLowerCase().includes(searchStr);
      const matchDate = dateFilter === "Semua Waktu" || true; // Note: actual date filtering logic is mock for now

      return matchSearch && matchDate;
    });
  }, [initialResponses, search, dateFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

      {/* Header Section */}
      <div className="mb-8 pt-8 pb-6 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Data Penilaian</h1>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
              Kelola dan ekspor keseluruhan data hasil penilaian yang masuk ke sistem.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteSelected}
              disabled={isDeleting || selectedIds.length === 0}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all shadow-sm ${selectedIds.length > 0
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent"
                }`}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
              Hapus {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </button>
            <button onClick={handleExport} className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              <Download className="w-4 h-4 mr-1.5" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto space-y-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } }
          }}
          className="flex flex-col gap-6"
        >
          {/* Advanced Toolbar (Minimalist) */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-6 justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                <Filter className="w-4 h-4 text-slate-600" />
              </div>
              <span className="font-semibold text-lg tracking-tight">Penyaringan Data</span>
            </div>

            <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 w-full xl:w-auto">

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari ID, Nama, Instansi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-wrap md:flex-nowrap items-center gap-3 relative z-30 w-full sm:w-auto">
                {/* Date Filter */}
                <div className="w-full sm:w-48">
                  <Select
                    value={dateFilter}
                    onChange={setDateFilter}
                    icon={<Calendar className="w-4 h-4 text-slate-500" />}
                    options={[
                      { label: "Semua Waktu", value: "Semua Waktu" },
                      { label: "Hari Ini", value: "Hari Ini" },
                      { label: "7 Hari Terakhir", value: "7 Hari Terakhir" },
                      { label: "Bulan Ini", value: "Bulan Ini" }
                    ]}
                  />
                </div>

                {/* Reset */}
                <button onClick={handleReset} className="px-4 py-2 shrink-0 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors flex items-center gap-2 text-sm font-medium">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl relative min-h-[400px] bg-white shadow-sm">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}

            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 relative z-0">
                <tr>
                  <th className="py-3 px-6 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      checked={paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-6 w-24">ID Penilaian</th>
                  <th className="py-3 px-6">Waktu Pengisian</th>
                  <th className="py-3 px-6">Instansi</th>
                  <th className="py-3 px-6 w-20 text-center">Skor</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center">
                        <Filter className="w-8 h-8 text-slate-300 mb-3" />
                        <p className="font-medium">Tidak ada data yang sesuai dengan kriteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedResponse(row)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          checked={selectedIds.includes(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{row.response_code.replace(/^ASM-/, "")}</td>
                      <td className="px-6 py-4 text-slate-600">{row.date}</td>
                      <td className="px-6 py-4 text-slate-700 max-w-[200px] truncate">{row.inst}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 rounded text-sm font-semibold text-slate-900">
                          {((row.score / 5) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResponse(row);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between text-sm px-1 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-slate-500 font-medium">
              <span className="whitespace-nowrap">Menampilkan {filteredData.length === 0 ? 0 : Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredData.length, currentPage * itemsPerPage)} dari <span className="text-slate-900 font-semibold">{filteredData.length}</span> data</span>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span>Tampilkan</span>
                <div className="w-[85px] z-20">
                  <Select
                    value={String(itemsPerPage)}
                    onChange={(val) => {
                      setItemsPerPage(Number(val));
                      setCurrentPage(1);
                    }}
                    options={[
                      { label: "10", value: "10" },
                      { label: "25", value: "25" },
                      { label: "50", value: "50" },
                      { label: "100", value: "100" }
                    ]}
                    position="top"
                  />
                </div>
                <span>per halaman</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="inline-flex items-center justify-center p-2 border border-slate-300 text-slate-600 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="inline-flex items-center justify-center p-2 border border-slate-300 text-slate-600 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Response Detail Drawer */}
      <ResponseDetailDrawer
        isOpen={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
        data={selectedResponse}
      />

    </div>
  );
}
