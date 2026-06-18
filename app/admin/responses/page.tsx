"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, RotateCcw, ChevronLeft, ChevronRight, Loader2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ADMIN_ALL_RESPONSES_EXTENDED, DetailedResponse } from "@/lib/constants/mockAdminData";
import { ResponseDetailDrawer } from "@/components/admin/ResponseDetailDrawer";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function AdminResponsesPage() {
  const [search, setSearch] = useState("");
  const [instFilter, setInstFilter] = useState("Semua Instansi");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [dateFilter, setDateFilter] = useState("Semua Waktu");
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedResponse, setSelectedResponse] = useState<DetailedResponse | null>(null);

  const handleExport = () => {
    const worksheetData = filteredData.map(row => ({
      "ID Pengiriman": row.id,
      "Tanggal": row.date,
      "Instansi": row.inst,
      "Skor Kepuasan": row.score,
      "Status": row.sentiment,
      "Q1: Kemudahan Persyaratan": row.scores.q1,
      "Q2: Kecepatan Waktu": row.scores.q2,
      "Q3: Biaya Pelayanan": row.scores.q3,
      "Q4: Kompetensi Petugas": row.scores.q4,
      "Q5: Fasilitas": row.scores.q5,
      "Kendala": row.kendala || "Tidak ada kendala",
      "Saran": row.saran || "Tidak ada saran"
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Responden");
    
    XLSX.writeFile(workbook, `Data_Responden_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleReset = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSearch("");
      setInstFilter("Semua Instansi");
      setStatusFilter("Semua Status");
      setDateFilter("Semua Waktu");
      setCurrentPage(1);
      setIsLoading(false);
    }, 400);
  };

  const filteredData = useMemo(() => {
    return ADMIN_ALL_RESPONSES_EXTENDED.filter((item) => {
      const matchSearch = item.inst.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase());
      const matchInst = instFilter === "Semua Instansi" || item.inst === instFilter;
      const matchStatus = statusFilter === "Semua Status" || item.sentiment === statusFilter;
      // Date filter mock (since dates are static in mock data, we just pass true for "Semua Waktu" or fake it)
      const matchDate = dateFilter === "Semua Waktu" || true; 

      return matchSearch && matchInst && matchStatus && matchDate;
    });
  }, [search, instFilter, statusFilter, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Sangat Puas": return <Badge variant="success">{sentiment}</Badge>;
      case "Puas": return <Badge variant="default">{sentiment}</Badge>;
      case "Cukup Puas": return <Badge variant="neutral">{sentiment}</Badge>;
      case "Tidak Puas": return <Badge variant="warning">{sentiment}</Badge>;
      case "Sangat Tidak Puas": return <Badge variant="danger">{sentiment}</Badge>;
      default: return <Badge variant="default">{sentiment}</Badge>;
    }
  };

  return (
    <div className="p-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-950 mb-2 tracking-tight">Data Responden</h1>
          <p className="text-neutral-500">Analisis dan kelola laporan</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="shrink-0 bg-white shadow-sm hover:bg-neutral-50">
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.div variants={FADE_UP} className="bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col">
          
          {/* Advanced Toolbar */}
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari ID respon atau instansi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                />
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-4">
                {/* Institution Filter */}
                <select
                  value={instFilter}
                  onChange={(e) => setInstFilter(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 appearance-none transition-all cursor-pointer"
                >
                  <option>Semua Instansi</option>
                  <option>Disdukcapil</option>
                  <option>RSUD</option>
                  <option>Dinas Sosial</option>
                  <option>Dinas Pendidikan</option>
                  <option>Dinas Kesehatan</option>
                  <option>Bapenda</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 appearance-none transition-all cursor-pointer"
                >
                  <option>Semua Status</option>
                  <option>Sangat Puas</option>
                  <option>Puas</option>
                  <option>Cukup Puas</option>
                  <option>Tidak Puas</option>
                  <option>Sangat Tidak Puas</option>
                </select>

                {/* Date Filter */}
                <div className="relative w-full md:w-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                  </div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full md:w-auto pl-10 pr-8 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 appearance-none transition-all cursor-pointer"
                  >
                    <option>Semua Waktu</option>
                    <option>Hari Ini</option>
                    <option>7 Hari Terakhir</option>
                    <option>Bulan Ini</option>
                  </select>
                </div>

                {/* Reset */}
                <Button variant="ghost" onClick={handleReset} className="px-3 shrink-0 text-neutral-500 hover:text-neutral-900">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto relative min-h-[400px]">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-900" />
              </div>
            )}
            
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white border-b border-neutral-200 text-neutral-500 font-medium sticky top-0 z-0">
                <tr>
                  <th className="px-6 py-4 font-medium">Response ID</th>
                  <th className="px-6 py-4 font-medium">Submission Date</th>
                  <th className="px-6 py-4 font-medium">Institution</th>
                  <th className="px-6 py-4 font-medium">Overall Score</th>
                  <th className="px-6 py-4 font-medium">Satisfaction Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginatedData.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-neutral-500">
                      <div className="flex flex-col items-center">
                        <Filter className="w-8 h-8 text-neutral-300 mb-3" />
                        <p>Tidak ada data yang sesuai dengan filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedResponse(row)}
                      className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono text-neutral-900 font-medium group-hover:text-neutral-600 transition-colors">{row.id}</td>
                      <td className="px-6 py-4 text-neutral-600">{row.date}</td>
                      <td className="px-6 py-4 font-medium text-neutral-900">{row.inst}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-neutral-900">{row.score.toFixed(1)}</span>
                        <span className="text-neutral-400"> / 5</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(row.sentiment)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-neutral-500 hover:text-neutral-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResponse(row);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" /> Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between text-sm">
            <span className="text-neutral-500">
              Menampilkan {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredData.length, currentPage * itemsPerPage)} dari {filteredData.length} data
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* Response Detail Drawer */}
      <ResponseDetailDrawer 
        isOpen={!!selectedResponse} 
        onClose={() => setSelectedResponse(null)} 
        data={selectedResponse} 
      />

    </div>
  );
}
