"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";
import SearchInput from "@/components/institution/SearchInput";
import InstitutionCard from "@/components/institution/InstitutionCard";
import { MOCK_INSTITUTIONS } from "@/lib/constants/mockData";

const CATEGORIES = ["Semua", "Administrasi", "Kesehatan", "Perizinan", "Perpajakan", "Sosial", "Pendidikan"];

export default function SelectInstitutionPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredInstitutions = useMemo(() => {
    return MOCK_INSTITUTIONS.filter((inst) => {
      const matchSearch = inst.name.toLowerCase().includes(search.toLowerCase()) || 
                          inst.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "Semua" || inst.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-grow pt-16 pb-32"
      >
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-neutral-950 mb-4 tracking-tight">Pilih Instansi</h1>
            <p className="text-neutral-500 max-w-2xl text-lg">
              Silakan pilih instansi atau dinas yang baru saja Anda kunjungi untuk memberikan penilaian pelayanan.
            </p>
          </div>

          <div className="mb-8">
            <SearchInput 
              placeholder="Cari nama instansi..." 
              onChange={setSearch} 
            />
          </div>

          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === cat
                    ? "bg-neutral-950 text-white border-neutral-950"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="min-h-[400px]">
            {filteredInstitutions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInstitutions.map((inst) => (
                  <div key={inst.id}>
                    <InstitutionCard institution={inst} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-neutral-200 rounded-xl">
                <div className="text-neutral-400 mb-4 text-2xl">🔍</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Instansi tidak ditemukan</h3>
                <p className="text-neutral-500 max-w-sm mb-6">
                  Coba gunakan kata kunci pencarian yang lain atau pilih kategori "Semua".
                </p>
                <button 
                  onClick={() => { setSearch(""); setActiveCategory("Semua"); }}
                  className="text-neutral-900 font-medium hover:underline underline-offset-4"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>

        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
