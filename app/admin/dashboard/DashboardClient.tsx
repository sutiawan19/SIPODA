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
  if (score100 <= 20) return { status: "Tidak Adaptif", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" };
  if (score100 <= 40) return { status: "Kurang Adaptif", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" };
  if (score100 <= 60) return { status: "Cukup Adaptif", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" };
  if (score100 <= 80) return { status: "Adaptif", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" };
  return { status: "Sangat Adaptif", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

      {/* Dashboard Header + Global Filter */}
      <div className="mb-8 pt-8 pb-6 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-slate-900">Dashboard Evaluasi</h1>
            <p className="text-slate-500 font-medium text-sm max-w-xl leading-relaxed">
              Monitoring hasil penilaian kemampuan adaptif organisasi secara aktual.
            </p>
          </div>
          
          <div className="w-full md:w-64 shrink-0 z-30">
            {mounted && (
              <Select
                instanceId="global-period-select"
                options={[
                  { value: "all", label: "Semua Waktu" },
                  { value: "today", label: "Hari Ini" },
                  { value: 7, label: "7 Hari Terakhir" },
                  { value: 30, label: "30 Hari Terakhir" },
                  { value: 365, label: "Tahun Ini" },
                ]}
                styles={{
                  control: (base, state) => ({ ...base, padding: '2px', borderRadius: '0.5rem', borderColor: state.isFocused ? '#2563eb' : '#e2e8f0', borderWidth: '1px', boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none', '&:hover': { borderColor: state.isFocused ? '#2563eb' : '#cbd5e1' }, backgroundColor: 'white' }),
                  option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f8fafc' : 'white', color: state.isSelected ? '#1e40af' : '#334155', cursor: 'pointer', fontSize: '14px', '&:active': { backgroundColor: '#dbeafe' } }),
                  singleValue: (base) => ({ ...base, fontSize: '14px', color: '#0f172a' })
                }}
                value={{ value: period, label: period === 'all' ? 'Semua Waktu' : period === 'today' ? 'Hari Ini' : period === 365 ? 'Tahun Ini' : `${period} Hari Terakhir` }}
                onChange={(selected: any) => setPeriod(selected.value)}
                isSearchable={false}
              />
            )}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto space-y-8">

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Total Responden
            </p>
            <div>
              <p className="text-4xl font-bold tracking-tight text-slate-900 mb-1">{totalPenilaian}</p>
              <p className="text-sm text-slate-500">Jumlah seluruh partisipan kuesioner.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Responden Hari Ini
            </p>
            <div>
              <p className="text-4xl font-bold tracking-tight text-slate-900 mb-1">{todayResponsesCount}</p>
              <p className="text-sm text-slate-500">Data masuk pada hari ini.</p>
            </div>
          </div>


          <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Kategori Dominan</p>
            <div>
              <p className={`text-2xl font-bold tracking-tight mb-1 truncate ${totalPenilaian > 0 ? "text-slate-900" : "text-slate-400"}`}>
                {dominantCategory.name}
              </p>
              <p className="text-sm text-slate-500">
                {totalPenilaian > 0 ? `${dominantCategory.count} Responden masuk di kategori ini.` : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Trend (Simple Line Chart) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Tren Penilaian</h2>
              <p className="text-slate-500 text-sm">Volume pengisian kuesioner berdasarkan periode waktu.</p>
            </div>
          </div>
          
          <div className="w-full h-[320px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px', padding: '10px' }}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Responden"
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2, fill: "#fff", stroke: "#2563eb" }}
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#2563eb" }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <CalendarDays className="w-10 h-10 mb-3 text-slate-300" />
                <p className="text-sm font-medium">Tidak ada data untuk periode ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Latest Assessments Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Data Responden Terbaru</h2>
              <p className="text-sm text-slate-500 mt-1">10 data penilaian terakhir yang masuk ke dalam sistem.</p>
            </div>
            <Link href="/admin/responses" className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
              Lihat Selengkapnya
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6 w-32 font-medium">Tanggal</th>
                  <th className="py-3 px-6 font-medium">Instansi</th>
                  <th className="py-3 px-6 font-medium">Jabatan</th>
                  <th className="py-3 px-6 w-24 font-medium">Skor</th>
                  <th className="py-3 px-6 w-40 text-center font-medium">Kategori</th>
                  <th className="py-3 px-6 w-32 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAssessments.map(r => {
                  const score100 = r.overall_score ? (r.overall_score / 5) * 100 : 0;
                  const cat = getCategoryData(score100);
                  
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 text-slate-500">
                        {new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-900 truncate max-w-[200px]" title={r.instansi}>
                        {r.instansi || "-"}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 truncate max-w-[150px]" title={r.jabatan}>
                        {r.jabatan || "-"}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-900">
                        {score100.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                            {cat.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button 
                          onClick={() => setSelectedResponse(r)}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> Detail
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {recentAssessments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">Belum ada data yang masuk.</td>
                  </tr>
                )}
              </tbody>
            </table>
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
