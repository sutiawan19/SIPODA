"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Info, TrendingUp, AlertCircle } from "lucide-react";

// Helper function to get design tokens based on score
function getScoreData(score: number) {
  if (score < 2) {
    return {
      status: "Sangat Perlu Perbaikan",
      recommendation: "Perlu evaluasi menyeluruh dan tindak lanjut prioritas terhadap kualitas pelayanan.",
      textColor: "text-red-600",
      bgSoft: "bg-red-50",
      borderSoft: "border-red-100",
      barColor: "bg-red-500",
      Icon: AlertTriangle,
    };
  } else if (score < 3) {
    return {
      status: "Perlu Perbaikan",
      recommendation: "Perlu identifikasi hambatan utama dan perbaikan pada aspek pelayanan yang masih rendah.",
      textColor: "text-orange-600",
      bgSoft: "bg-orange-50",
      borderSoft: "border-orange-100",
      barColor: "bg-orange-500",
      Icon: AlertCircle,
    };
  } else if (score < 4) {
    return {
      status: "Cukup Baik",
      recommendation: "Pelayanan sudah cukup berjalan, namun beberapa aspek masih perlu ditingkatkan.",
      textColor: "text-amber-600",
      bgSoft: "bg-amber-50",
      borderSoft: "border-amber-100",
      barColor: "bg-amber-500",
      Icon: Info,
    };
  } else if (score < 4.5) {
    return {
      status: "Baik",
      recommendation: "Pertahankan kualitas pelayanan dan lakukan peningkatan secara berkala.",
      textColor: "text-blue-600",
      bgSoft: "bg-blue-50",
      borderSoft: "border-blue-100",
      barColor: "bg-blue-500",
      Icon: CheckCircle2,
    };
  } else {
    return {
      status: "Sangat Baik",
      recommendation: "Pertahankan praktik pelayanan yang baik dan dokumentasikan sebagai referensi.",
      textColor: "text-emerald-700",
      bgSoft: "bg-emerald-50",
      borderSoft: "border-emerald-100",
      barColor: "bg-emerald-600",
      Icon: TrendingUp,
    };
  }
}

// --- OPTION A: Score Card Focus ---
function OptionA({ score }: { score: number }) {
  const data = getScoreData(score);
  const percentage = ((score - 1) / 4) * 100; // 1-5 scale mapped to 0-100 width

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm w-full max-w-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            Skor Penilaian
          </span>
          <div className={`text-5xl font-black tracking-tighter ${data.textColor}`}>
            {score.toFixed(2)}
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full border ${data.bgSoft} ${data.borderSoft}`}>
          <span className={`text-xs font-bold uppercase tracking-wide ${data.textColor}`}>
            {data.status}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${data.barColor} transition-all duration-500`} 
            style={{ width: `${Math.max(0, percentage)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] font-bold text-neutral-400">
          <span>1.0</span>
          <span>5.0</span>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-5">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
          Rekomendasi Tindak Lanjut
        </span>
        <p className="text-sm font-medium text-neutral-700 leading-relaxed">
          {data.recommendation}
        </p>
      </div>
    </div>
  );
}

// --- OPTION B: Score Meter Focus ---
function OptionB({ score }: { score: number }) {
  const data = getScoreData(score);
  const percentage = ((score - 1) / 4) * 100;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm w-full max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-bold text-neutral-900">Kualitas Pelayanan:</span>
        <span className={`text-sm font-black uppercase tracking-wide ${data.textColor}`}>
          {data.status}
        </span>
      </div>

      <div className="relative mb-8 pt-4 pb-2">
        <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${data.barColor} transition-all duration-500`} 
            style={{ width: `${Math.max(0, percentage)}%` }}
          />
        </div>
        {/* Pointer */}
        <div 
          className="absolute top-1 -ml-3 w-6 h-6 bg-white border-2 border-neutral-900 rounded-full shadow-md flex items-center justify-center transition-all duration-500"
          style={{ left: `${Math.max(0, percentage)}%` }}
        >
          <div className={`w-2 h-2 rounded-full ${data.barColor}`} />
        </div>
        
        <div className="flex justify-between mt-3">
          <span className="text-xs font-bold text-neutral-400">1</span>
          <span className={`text-sm font-black absolute -bottom-5 transition-all duration-500 ${data.textColor}`} style={{ left: `calc(${Math.max(0, percentage)}% - 12px)` }}>
            {score.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-neutral-400">5</span>
        </div>
      </div>

      <div className={`mt-8 p-4 rounded-xl ${data.bgSoft} border ${data.borderSoft} flex gap-3 items-start`}>
        <data.Icon className={`w-5 h-5 mt-0.5 ${data.textColor} shrink-0`} />
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
            Rekomendasi Tindak Lanjut
          </span>
          <p className="text-sm font-medium text-neutral-800 leading-relaxed">
            {data.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- OPTION C: Assessment Health Card ---
function OptionC({ score }: { score: number }) {
  const data = getScoreData(score);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm w-full max-w-sm flex flex-col gap-3">
      <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <data.Icon className={`w-4 h-4 ${data.textColor}`} />
          <span className={`text-sm font-bold ${data.textColor}`}>
            {data.status}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-400 uppercase font-bold block">Skor</span>
          <span className="text-base font-black text-neutral-900">{score.toFixed(2)}</span>
        </div>
      </div>
      
      <div>
        <p className="text-xs text-neutral-600 font-medium leading-relaxed line-clamp-2">
          {data.recommendation}
        </p>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function PreviewDesignPage() {
  const [score, setScore] = useState<number>(3.45);

  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Preview Opsi Desain UI/UX</h1>
        <p className="text-neutral-500 mb-8">Geser slider di bawah ini untuk melihat bagaimana desain merespons skor yang berbeda.</p>
        
        {/* Global Controls */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm mb-12 sticky top-4 z-50">
          <label className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-sm font-bold text-neutral-700 uppercase tracking-wide">Ubah Skor Penilaian:</span>
              <span className="text-lg font-black text-neutral-900">{score.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="1" max="5" step="0.01" 
              value={score} 
              onChange={(e) => setScore(parseFloat(e.target.value))}
              className="w-full accent-neutral-900"
            />
            <div className="flex justify-between text-xs font-bold text-neutral-400">
              <span>1.0 (Sangat Perlu Perbaikan)</span>
              <span>5.0 (Sangat Baik)</span>
            </div>
          </label>
        </div>

        <div className="space-y-16">
          {/* Section A */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-neutral-900">Opsi A: Score Card Focus</h2>
              <p className="text-sm text-neutral-500">Terbaik untuk Dashboard / Halaman "Thank You". Menonjolkan skor besar dengan hierarki vertikal yang bersih.</p>
            </div>
            <OptionA score={score} />
          </section>

          {/* Section B */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-neutral-900">Opsi B: Score Meter Focus</h2>
              <p className="text-sm text-neutral-500">Terbaik untuk Halaman Detail Response. Menonjolkan posisi skor dalam spektrum meteran skala 1-5.</p>
            </div>
            <OptionB score={score} />
          </section>

          {/* Section C */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-neutral-900">Opsi C: Assessment Health Card</h2>
              <p className="text-sm text-neutral-500">Terbaik untuk Tabel Ranking / Widget Padat. Fokus utama pada indikator visual status kesehatan pelayanan.</p>
            </div>
            <OptionC score={score} />
          </section>
        </div>
      </div>
    </div>
  );
}
