"use client";

import { use, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Copy, Check } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ShareModal } from "@/components/ui/ShareModal";

import { MOCK_RESULT, MOCK_INSTITUTIONS } from "@/lib/constants/mockData";
import { formatNumber, formatRating } from "@/lib/utils/formatters";

// Minimal monochrome gradient
const COLORS = ['#e5e5e5', '#a3a3a3', '#737373', '#404040', '#171717'];
const SENTIMENT_COLORS = ['#171717', '#d4d4d4']; // Positive, Negative

export default function InstitutionResultsPage({ params }: { params: Promise<{ institutionId: string }> }) {
  const { institutionId } = use(params);
  
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const result = useMemo(() => {
    if (institutionId === "disdukcapil") return MOCK_RESULT.disdukcapil;
    
    const inst = MOCK_INSTITUTIONS.find(i => i.id === institutionId);
    if (!inst) return null;

    return {
      institutionId: inst.id,
      institutionName: inst.name,
      averageRating: inst.rating,
      satisfactionRate: inst.satisfactionRate,
      totalResponses: inst.totalResponses,
      distribution: [
        { score: 1, count: Math.floor(inst.totalResponses * 0.05) },
        { score: 2, count: Math.floor(inst.totalResponses * 0.1) },
        { score: 3, count: Math.floor(inst.totalResponses * 0.2) },
        { score: 4, count: Math.floor(inst.totalResponses * 0.4) },
        { score: 5, count: Math.floor(inst.totalResponses * 0.25) },
      ],
      positiveCount: Math.floor(inst.totalResponses * (inst.satisfactionRate / 100)),
      negativeCount: inst.totalResponses - Math.floor(inst.totalResponses * (inst.satisfactionRate / 100)),
    };
  }, [institutionId]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Hasil tidak ditemukan</h1>
        <Link href="/institutions">
          <Button variant="outline">Kembali</Button>
        </Link>
      </div>
    );
  }

  const pieData = [
    { name: 'Puas', value: result.positiveCount, color: SENTIMENT_COLORS[0] },
    { name: 'Perlu Perbaikan', value: result.negativeCount, color: SENTIMENT_COLORS[1] },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-grow pt-16 pb-32"
      >
        <div className="max-w-4xl mx-auto px-6">
          
          <Link href="/institutions" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Instansi
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-neutral-950 mb-3 tracking-tight">{result.institutionName}</h1>
              <p className="text-neutral-500 text-lg">Ringkasan Hasil Survei</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Tersalin" : "Salin Tautan"}
              </Button>
              <Button variant="default" onClick={() => setIsShareOpen(true)}>
                <Share2 className="w-4 h-4 mr-2" /> Bagikan
              </Button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden mb-12">
            <div className="bg-white p-8">
              <p className="text-sm font-medium text-neutral-500 mb-2">Total Responden</p>
              <p className="text-4xl font-bold text-neutral-950">{formatNumber(result.totalResponses)}</p>
            </div>
            <div className="bg-white p-8">
              <p className="text-sm font-medium text-neutral-500 mb-2">Rata-rata Penilaian</p>
              <p className="text-4xl font-bold text-neutral-950">{formatRating(result.averageRating)} <span className="text-xl font-medium text-neutral-300">/ 5.0</span></p>
            </div>
            <div className="bg-white p-8">
              <p className="text-sm font-medium text-neutral-500 mb-2">Tingkat Kepuasan</p>
              <p className="text-4xl font-bold text-neutral-950">{result.satisfactionRate}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Chart 1: Rating Distribution */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-950 mb-6">Distribusi Penilaian</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.distribution} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="score" type="category" tickFormatter={(val) => `Bintang ${val}`} width={80} axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 14}} />
                    <Tooltip 
                      cursor={{fill: '#f5f5f5'}}
                      contentStyle={{borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: 'none'}}
                      formatter={(value) => [formatNumber(value as number), 'Responden']}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                      {result.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.score - 1]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sentiment Ratio */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-950 mb-6">Rasio Sentimen</h3>
              <div className="h-[300px] w-full flex flex-col items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: 'none'}}
                      formatter={(value) => [formatNumber(value as number), 'Responden']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                  <span className="text-4xl font-bold text-neutral-950">{result.satisfactionRate}%</span>
                  <span className="text-sm font-medium text-neutral-500 mt-1">Puas</span>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-950"></div>
                  <span className="text-sm font-medium text-neutral-600">Puas ({formatNumber(result.positiveCount)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-300"></div>
                  <span className="text-sm font-medium text-neutral-600">Perlu Perbaikan ({formatNumber(result.negativeCount)})</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.main>

      <Footer />
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        url={pageUrl} 
        title={`Hasil Survei Kepuasan: ${result.institutionName}`} 
      />
    </div>
  );
}
