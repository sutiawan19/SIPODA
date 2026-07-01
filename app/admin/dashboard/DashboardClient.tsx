"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Eye, CalendarDays } from "lucide-react";
import Link from "next/link";
import Select from "react-select";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ResponseDetailDrawer } from "@/components/admin/ResponseDetailDrawer";

interface DashboardClientProps {
  responses: any[];
  totalInstitutions: number;
}

type Period = 7 | 30 | 365 | 'today' | 'all';

function getCategoryData(score100: number) {
  if (score100 <= 20) return { status: "Tidak Adaptif", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
  if (score100 <= 40) return { status: "Kurang Adaptif", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" };
  if (score100 <= 60) return { status: "Cukup Adaptif", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" };
  if (score100 <= 80) return { status: "Adaptif", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" };
  return { status: "Sangat Adaptif", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" };
}

export function DashboardClient({ responses }: DashboardClientProps) {
  const [period, setPeriod] = useState<Period>('all');
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredResponses = useMemo(() => {
    let filtered = responses;

    if (period === 'all') {
      // No filter
    } else if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(r => new Date(r.created_at) >= today);
    } else {
      const cutoffDate = new Date();
      if (period === 365) {
        // "Tahun Ini" could mean YTD or 365 days. We'll use YTD based on typical user intent for "Tahun Ini" (This Year).
        cutoffDate.setMonth(0, 1);
        cutoffDate.setHours(0, 0, 0, 0);
      } else {
        cutoffDate.setDate(cutoffDate.getDate() - period);
      }
      filtered = filtered.filter(r => new Date(r.created_at) >= cutoffDate);
    }
    return filtered;
  }, [responses, period]);

  const todayResponsesCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return responses.filter(r => new Date(r.created_at) >= today).length;
  }, [responses]);

  // KPIs
  const totalPenilaian = filteredResponses.length;
  
  // Avg Score
  const rawAvg = totalPenilaian > 0 ? (filteredResponses.reduce((acc, r) => acc + (r.overall_score || 0), 0) / totalPenilaian) : 0;
  const avgNilai100 = (rawAvg / 5) * 100;
  const globalCat = getCategoryData(avgNilai100);

  // Dominant Category
  const dominantCategory = useMemo(() => {
    if (totalPenilaian === 0) return { name: "-", count: 0, catData: null };
    const counts: Record<string, number> = {};
    filteredResponses.forEach(r => {
      const s100 = r.overall_score ? (r.overall_score / 5) * 100 : 0;
      const cat = getCategoryData(s100).status;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    
    let maxCat = "";
    let maxCount = 0;
    for (const [cat, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        maxCat = cat;
      }
    }
    
    // Reverse map to get color (approximate using middle score)
    let approxScore = 0;
    if (maxCat === "Tidak Adaptif") approxScore = 10;
    else if (maxCat === "Kurang Adaptif") approxScore = 30;
    else if (maxCat === "Cukup Adaptif") approxScore = 50;
    else if (maxCat === "Adaptif") approxScore = 70;
    else if (maxCat === "Sangat Adaptif") approxScore = 90;

    return { name: maxCat, count: maxCount, catData: getCategoryData(approxScore) };
  }, [filteredResponses, totalPenilaian]);

  // Trend Data
  const trendData = useMemo(() => {
    const map = new Map<string, number>();

    const today = new Date();
    today.setHours(0,0,0,0);
    
    let minDate = new Date(today);
    let maxDate = new Date(today);

    if (period === 'today') {
      minDate = new Date(today);
    } else if (typeof period === 'number') {
      if (period === 365) {
        minDate.setMonth(0, 1);
      } else {
        minDate.setDate(minDate.getDate() - (period - 1));
      }
    } else {
      // period === 'all'
      if (filteredResponses.length > 0) {
        const dates = filteredResponses.map(r => new Date(r.created_at).getTime());
        minDate = new Date(Math.min(...dates));
        minDate.setHours(0,0,0,0);
      }
      
      // Ensure at least 6 days ago (7 days total span) so it looks like a chart
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      
      if (minDate > sevenDaysAgo) {
        minDate = sevenDaysAgo;
      }
    }

    const diffDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24));
    
    // Pad missing days
    if (diffDays <= 366) {
      for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        map.set(`${y}-${m}-${day}`, 0);
      }
    }

    filteredResponses.forEach(r => {
      const d = new Date(r.created_at);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const date = `${y}-${m}-${day}`;
      
      if (map.has(date) || diffDays > 366) {
        if (!map.has(date)) map.set(date, 0);
        map.set(date, map.get(date)! + 1);
      }
    });

    let result = Array.from(map.entries()).map(([dateStr, count]) => {
      const [y, m, d] = dateStr.split('-');
      const dateObj = new Date(Number(y), Number(m)-1, Number(d));
      return {
        dateStr,
        date: dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        count
      };
    });

    result.sort((a, b) => a.dateStr.localeCompare(b.dateStr));
    return result;
  }, [filteredResponses, period]);

  // Recent Assessments
  const recentAssessments = useMemo(() => {
    return [...filteredResponses]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }, [filteredResponses]);

  return (
    <div className="min-h-screen bg-transparent font-sans text-neutral-900 pb-20">

      {/* Dashboard Header + Global Filter */}
      <div className="pt-12 pb-8 px-6 md:px-12 max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-start justify-between gap-6 border-b-2 border-neutral-100 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-neutral-900">Dashboard SIPODA</h1>
          <p className="text-neutral-500 font-bold text-base max-w-xl leading-relaxed">
            Monitoring hasil penilaian kemampuan adaptif organisasi.
          </p>
        </div>
        
        <div className="w-full md:w-56 shrink-0 z-30">
          {mounted && (
            <Select
              instanceId="global-period-select"
              options={[
                { value: "all", label: "Semua Data" },
                { value: "today", label: "Hari Ini" },
                { value: 7, label: "7 Hari Terakhir" },
                { value: 30, label: "30 Hari Terakhir" },
                { value: 365, label: "Tahun Ini" },
              ]}
              styles={{
                control: (base, state) => ({ ...base, padding: '2px', borderRadius: '1rem', borderColor: state.isFocused ? '#1cb0f6' : '#e5e5e5', borderWidth: '2px', boxShadow: 'none', '&:hover': { borderColor: state.isFocused ? '#1cb0f6' : '#a3a3a3' }, backgroundColor: 'white' }),
                option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#e5e5e5' : state.isFocused ? '#f5f5f5' : 'white', color: '#171717', cursor: 'pointer', fontWeight: 600, '&:active': { backgroundColor: '#d4d4d4' } }),
                singleValue: (base) => ({ ...base, fontWeight: 700 })
              }}
              value={{ value: period, label: period === 'all' ? 'Semua Data' : period === 'today' ? 'Hari Ini' : period === 365 ? 'Tahun Ini' : `${period} Hari Terakhir` }}
              onChange={(selected: any) => setPeriod(selected.value)}
              isSearchable={false}
            />
          )}
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto space-y-10">

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Total Responden
            </p>
            <div>
              <p className="text-5xl font-black tracking-tighter text-[#1cb0f6]">{totalPenilaian}</p>
              <p className="text-sm text-neutral-500 mt-2 font-bold leading-relaxed">Jumlah seluruh responden yang telah mengisi kuesioner.</p>
            </div>
          </div>

          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">
              Responden Hari Ini
            </p>
            <div>
              <p className="text-5xl font-black tracking-tighter text-[#1cb0f6]">{todayResponsesCount}</p>
              <p className="text-sm text-neutral-500 mt-2 font-bold leading-relaxed">Jumlah data kuesioner yang masuk hari ini.</p>
            </div>
          </div>


          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Kategori Dominan</p>
            <div>
              <p className={`text-3xl md:text-4xl font-black tracking-tighter mb-2 truncate ${totalPenilaian > 0 ? "text-[#1cb0f6]" : "text-neutral-900"}`}>
                {dominantCategory.name}
              </p>
              <p className="text-sm text-neutral-500 font-bold leading-relaxed">
                {totalPenilaian > 0 ? `${dominantCategory.count} Responden di kategori ini.` : "Belum ada kategori dominan."}
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Trend (Simple Line Chart) */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight text-neutral-900 mb-1">Tren Penilaian</h2>
            <p className="text-neutral-500 font-bold text-sm">Jumlah responden yang mengisi berdasarkan periode yang dipilih.</p>
          </div>
          
          <div className="w-full h-[300px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 700 }}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#e5e5e5', strokeWidth: 2, strokeDasharray: '5 5' }}
                    contentStyle={{ borderRadius: '1rem', border: '2px solid #e5e5e5', boxShadow: 'none', fontWeight: 700, padding: '12px' }}
                    labelStyle={{ color: '#737373', marginBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Responden"
                    stroke="#1cb0f6" 
                    strokeWidth={4}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#1cb0f6" }}
                    activeDot={{ r: 6, strokeWidth: 3, fill: "#1cb0f6", stroke: "#fff" }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 font-bold">
                <CalendarDays className="w-8 h-8 mb-3 opacity-50" />
                Tidak ada data tren untuk periode ini.
              </div>
            )}
          </div>
        </div>

        {/* Latest Assessments Table */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900">Penilaian Terbaru</h2>
            </div>
            <Link href="/admin/responses" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-extrabold bg-white text-neutral-700 border-2 border-neutral-200 rounded-2xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors active:scale-95 shadow-sm">
              Lihat Semua
            </Link>
          </div>

          <div className="overflow-hidden border-2 border-neutral-200 rounded-2xl relative bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f3f9fc] text-neutral-600 text-xs uppercase tracking-widest font-extrabold border-b-2 border-neutral-200">
                  <tr>
                    <th className="py-5 px-6 w-32">Tanggal</th>
                    <th className="py-5 px-6">Instansi</th>
                    <th className="py-5 px-6">Jabatan</th>
                    <th className="py-5 px-6 w-24">Skor</th>
                    <th className="py-5 px-6 w-40 text-center">Kategori</th>
                    <th className="py-5 px-6 w-32 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-100">
                  {recentAssessments.map(r => {
                    const score100 = r.overall_score ? (r.overall_score / 5) * 100 : 0;
                    const cat = getCategoryData(score100);
                    
                    return (
                      <tr key={r.id} className="hover:bg-[#f3f9fc]/50 transition-colors group">
                        <td className="py-4 px-6 font-bold text-neutral-500">
                          {new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6 font-black text-neutral-900 truncate max-w-[200px]" title={r.instansi}>
                          {r.instansi || "-"}
                        </td>
                        <td className="py-4 px-6 font-bold text-neutral-600 truncate max-w-[150px]" title={r.jabatan}>
                          {r.jabatan || "-"}
                        </td>
                        <td className="py-4 px-6 font-black text-neutral-900 text-base">
                          {score100.toFixed(1)}%
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-black rounded-xl border-2 ${cat.bg} ${cat.color} ${cat.border}`}>
                              {cat.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => setSelectedResponse(r)}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold bg-[#f3f9fc] text-[#1cb0f6] rounded-xl hover:bg-[#e1f1fa] active:scale-95 transition-all"
                          >
                            <Eye className="w-4 h-4 mr-2 stroke-[3]" /> Detail
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {recentAssessments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-neutral-400 font-bold">Belum ada data penilaian.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <ResponseDetailDrawer
        isOpen={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
        data={selectedResponse}
      />
    </div>
  );
}
