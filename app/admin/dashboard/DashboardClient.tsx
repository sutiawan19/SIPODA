"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Search, ChevronDown, ChevronUp, FileText, CalendarDays, Filter } from "lucide-react";
import Link from "next/link";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DashboardClientProps {
  responses: any[];
  totalInstitutions: number;
}

type Period = 7 | 30 | 90 | 365 | 'custom' | 'all';

export function DashboardClient({ responses, totalInstitutions }: DashboardClientProps) {
  const [period, setPeriod] = useState<Period>('all');
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  const [globalInst, setGlobalInst] = useState<string>("All");
  const [globalReg, setGlobalReg] = useState<string>("All");

  const [instSearch, setInstSearch] = useState("");
  const [instSortConfig, setInstSortConfig] = useState<{ key: 'avg' | 'count', direction: 'asc' | 'desc' }>({ key: 'avg', direction: 'desc' });
  const [regionSearch, setRegionSearch] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allInstitutions = useMemo(() => {
    const insts = new Set(responses.map(r => r.institutions?.name).filter(Boolean));
    return Array.from(insts).sort() as string[];
  }, [responses]);

  const allRegions = useMemo(() => {
    const regs = new Set(responses.map(r => r.kabupaten_kota).filter(Boolean));
    return Array.from(regs).sort() as string[];
  }, [responses]);

  const filteredResponses = useMemo(() => {
    let filtered = responses;

    // Filter Date
    if (period === 'all') {
      // No date filter applied
    } else if (period !== 'custom') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - period);
      filtered = filtered.filter(r => new Date(r.created_at) >= cutoffDate);
    } else {
      if (customStartDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        filtered = filtered.filter(r => new Date(r.created_at) >= start);
      }
      if (customEndDate) {
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter(r => new Date(r.created_at) <= end);
      }
    }

    // Filter Instansi
    if (globalInst !== "All") {
      filtered = filtered.filter(r => r.institutions?.name === globalInst);
    }

    // Filter Wilayah
    if (globalReg !== "All") {
      filtered = filtered.filter(r => r.kabupaten_kota === globalReg);
    }

    return filtered;
  }, [responses, period, customStartDate, customEndDate, globalInst, globalReg]);

  // KPIs
  const totalPenilaian = filteredResponses.length;
  const avgNilai = totalPenilaian > 0 ? (filteredResponses.reduce((acc, r) => acc + (r.overall_score || 0), 0) / totalPenilaian).toFixed(2) : "0.00";
  const uniqueInsts = new Set(filteredResponses.map(r => r.inst_id)).size;

  // Trend
  const trendData = useMemo(() => {
    const map = new Map<string, number>();

    if (period === 'all') {
      if (filteredResponses.length > 0) {
        const dates = filteredResponses.map(r => new Date(r.created_at).getTime());
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const diffDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 90) {
          for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
            map.set(d.toISOString().split('T')[0], 0);
          }
        }
      }
    } else if (period !== 'custom') {
      for (let i = (period as number) - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        map.set(d.toISOString().split('T')[0], 0);
      }
    } else {
      if (filteredResponses.length > 0) {
        const dates = filteredResponses.map(r => new Date(r.created_at).getTime());
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        const diffDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 90) {
          for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
            map.set(d.toISOString().split('T')[0], 0);
          }
        }
      }
    }

    filteredResponses.forEach(r => {
      const date = r.created_at.split('T')[0];
      if (!map.has(date)) map.set(date, 0);
      map.set(date, map.get(date)! + 1);
    });

    let result = Array.from(map.entries()).map(([date, count]) => ({
      dateStr: date,
      date: new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      count
    }));

    if (period === 'custom' || period === 'all') {
      result.sort((a, b) => a.dateStr.localeCompare(b.dateStr));
    }

    return result;
  }, [filteredResponses, period]);

  // Inst Ranking
  const instRanking = useMemo(() => {
    const map = new Map<string, { totalScore: number, count: number }>();
    filteredResponses.forEach(r => {
      const name = r.institutions?.name || "Unknown";
      if (!map.has(name)) map.set(name, { totalScore: 0, count: 0 });
      map.get(name)!.totalScore += (r.overall_score || 0);
      map.get(name)!.count += 1;
    });
    let list = Array.from(map.entries()).map(([name, data]) => ({
      name,
      avg: data.count > 0 ? data.totalScore / data.count : 0,
      count: data.count
    }));

    if (instSearch) {
      list = list.filter(i => i.name.toLowerCase().includes(instSearch.toLowerCase()));
    }

    list.sort((a, b) => {
      if (a[instSortConfig.key] < b[instSortConfig.key]) return instSortConfig.direction === 'asc' ? -1 : 1;
      if (a[instSortConfig.key] > b[instSortConfig.key]) return instSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [filteredResponses, instSearch, instSortConfig]);

  const handleInstSort = (key: 'avg' | 'count') => {
    setInstSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Region Performance
  const regionPerformance = useMemo(() => {
    const map = new Map<string, { totalScore: number, count: number }>();
    filteredResponses.forEach(r => {
      const name = r.kecamatan || "Unknown";
      if (!map.has(name)) map.set(name, { totalScore: 0, count: 0 });
      map.get(name)!.totalScore += (r.overall_score || 0);
      map.get(name)!.count += 1;
    });
    let list = Array.from(map.entries()).map(([name, data]) => ({
      name,
      avg: data.count > 0 ? data.totalScore / data.count : 0,
      count: data.count
    }));

    if (regionSearch) {
      list = list.filter(r => r.name.toLowerCase().includes(regionSearch.toLowerCase()));
    }

    list.sort((a, b) => b.avg - a.avg);
    return list;
  }, [filteredResponses, regionSearch]);

  // Recent 
  const recentAssessments = useMemo(() => {
    return [...filteredResponses]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }, [filteredResponses]);

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-20">

      {/* Header Section */}
      <div className="pt-12 pb-6 px-6 md:px-12 max-w-[1400px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Dashboard Analitik</h1>
        <p className="text-neutral-500 text-base max-w-2xl leading-relaxed">
          Pantau kinerja dan kualitas pelayanan publik dari seluruh instansi secara langsung.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Total Responden</p>
            <p className="text-4xl font-bold tracking-tighter text-neutral-900">{totalPenilaian}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Rata-rata Nilai</p>
            <p className="text-4xl font-bold tracking-tighter text-neutral-900">{avgNilai}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Instansi Aktif</p>
            <p className="text-4xl font-bold tracking-tighter text-neutral-900">{uniqueInsts}</p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto space-y-12">

        {/* Minimalist Filter Bar */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-6 justify-between">
          <div className="flex items-center gap-3 text-neutral-900">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <Filter className="w-4 h-4 text-neutral-700" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Saring Data</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Period Filter */}
            <div className="w-full sm:w-48 h-[38px]">
              {mounted && (
                <Select
                  instanceId="period-select"
                  options={[
                    { value: "all", label: "Semua Waktu" },
                    { value: 7, label: "7 Hari Terakhir" },
                    { value: 30, label: "30 Hari Terakhir" },
                    { value: 90, label: "90 Hari Terakhir" },
                    { value: 365, label: "1 Tahun Terakhir" },
                    { value: "custom", label: "Kustom Tanggal" },
                  ]}
                  styles={{
                    control: (base, state) => ({ ...base, padding: '4px', borderRadius: '0.75rem', borderColor: state.isFocused ? '#171717' : '#e5e5e5', boxShadow: 'none', '&:hover': { borderColor: state.isFocused ? '#171717' : '#a3a3a3' }, backgroundColor: '#fafafa' }),
                    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#e5e5e5' : state.isFocused ? '#f5f5f5' : 'white', color: '#171717', cursor: 'pointer', '&:active': { backgroundColor: '#d4d4d4' } })
                  }}
                  value={{ value: period, label: period === 'all' ? 'Semua Waktu' : period === 'custom' ? 'Kustom Tanggal' : `${period} Hari Terakhir` }}
                  onChange={(selected: any) => setPeriod(selected.value)}
                  isSearchable={false}
                />
              )}
            </div>

            {period === 'custom' && (
              <>
                <DatePicker
                  selected={customStartDate ? new Date(customStartDate) : null}
                  onChange={(date: Date | null) => setCustomStartDate(date ? date.toISOString().split('T')[0] : "")}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Mulai"
                  className="w-full sm:w-32 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <span className="text-neutral-400 hidden sm:block">-</span>
                <DatePicker
                  selected={customEndDate ? new Date(customEndDate) : null}
                  onChange={(date: Date | null) => setCustomEndDate(date ? date.toISOString().split('T')[0] : "")}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Akhir"
                  className="w-full sm:w-32 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </>
            )}

            <div className="w-full sm:w-56 z-20 h-[38px]">
              {mounted && (
                <Select
                  instanceId="global-inst-select"
                  options={[
                    { value: "All", label: "Semua Instansi" },
                    ...allInstitutions.map(inst => ({ value: inst, label: inst }))
                  ]}
                  styles={{
                    control: (base, state) => ({ ...base, padding: '4px', borderRadius: '0.75rem', borderColor: state.isFocused ? '#171717' : '#e5e5e5', boxShadow: 'none', '&:hover': { borderColor: state.isFocused ? '#171717' : '#a3a3a3' }, backgroundColor: '#fafafa' }),
                    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#e5e5e5' : state.isFocused ? '#f5f5f5' : 'white', color: '#171717', cursor: 'pointer', '&:active': { backgroundColor: '#d4d4d4' } })
                  }}
                  value={{ value: globalInst, label: globalInst === "All" ? "Semua Instansi" : globalInst }}
                  onChange={(selected: any) => setGlobalInst(selected.value)}
                />
              )}
            </div>

            <div className="w-full sm:w-56 z-10 h-[38px]">
              {mounted && (
                <Select
                  instanceId="global-reg-select"
                  options={[
                    { value: "All", label: "Semua Wilayah" },
                    ...allRegions.map(reg => ({ value: reg, label: reg }))
                  ]}
                  styles={{
                    control: (base, state) => ({ ...base, padding: '4px', borderRadius: '0.75rem', borderColor: state.isFocused ? '#171717' : '#e5e5e5', boxShadow: 'none', '&:hover': { borderColor: state.isFocused ? '#171717' : '#a3a3a3' }, backgroundColor: '#fafafa' }),
                    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#e5e5e5' : state.isFocused ? '#f5f5f5' : 'white', color: '#171717', cursor: 'pointer', '&:active': { backgroundColor: '#d4d4d4' } })
                  }}
                  value={{ value: globalReg, label: globalReg === "All" ? "Semua Wilayah" : globalReg }}
                  onChange={(selected: any) => setGlobalReg(selected.value)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Assessment Trend - Full Width Borderless */}
        <div>
          <div className="mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold tracking-tight">Tren Kualitas Layanan</h2>
          </div>
          <div className="h-[400px] w-full bg-neutral-50/50 rounded-3xl p-6 border border-neutral-100">
            {trendData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                Tidak ada data pada periode ini.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#171717" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#171717" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a3a3a3' }} dy={15} minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a3a3a3' }} allowDecimals={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', fontSize: '13px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                    itemStyle={{ color: '#171717', fontWeight: 600 }}
                    cursor={{ stroke: '#e5e5e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Jumlah Penilaian"
                    stroke="#171717"
                    strokeWidth={3}
                    fill="url(#colorCount)"
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#171717' }}
                    activeDot={{ r: 6, fill: '#171717', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Institution Ranking */}
          <div>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Peringkat Instansi</h2>
                <p className="text-sm text-neutral-500 mt-1">Berdasarkan rata-rata nilai penilaian.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari instansi..."
                  value={instSearch}
                  onChange={e => setInstSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="overflow-hidden border border-neutral-200 rounded-3xl relative bg-white shadow-sm">
              <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th className="py-4 px-5 font-medium bg-neutral-50">Rank</th>
                      <th className="py-4 px-5 font-medium bg-neutral-50">Instansi</th>
                      <th className="py-4 px-5 font-medium cursor-pointer hover:text-neutral-900 transition-colors bg-neutral-50" onClick={() => handleInstSort('avg')}>
                        <div className="flex items-center gap-1">
                          Nilai
                          {instSortConfig.key === 'avg' && (instSortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                        </div>
                      </th>
                      <th className="py-4 px-5 font-medium cursor-pointer hover:text-neutral-900 transition-colors bg-neutral-50" onClick={() => handleInstSort('count')}>
                        <div className="flex items-center gap-1">
                          Total
                          {instSortConfig.key === 'count' && (instSortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {instRanking.map((inst, idx) => (
                      <tr key={inst.name} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 px-5 text-neutral-500 font-medium">#{idx + 1}</td>
                        <td className="py-4 px-5 text-neutral-900 font-medium whitespace-normal max-w-[180px]">{inst.name}</td>
                        <td className="py-4 px-5 font-semibold text-neutral-900">{inst.avg.toFixed(2)}</td>
                        <td className="py-4 px-5 text-neutral-500">{inst.count}</td>
                      </tr>
                    ))}
                    {instRanking.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-neutral-400">Tidak ada data instansi.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Regional Performance */}
          <div>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Sebaran Wilayah</h2>
                <p className="text-sm text-neutral-500 mt-1">Performa layanan berdasarkan kecamatan.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari wilayah..."
                  value={regionSearch}
                  onChange={e => setRegionSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="overflow-hidden border border-neutral-200 rounded-3xl relative bg-white shadow-sm">
              <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th className="py-4 px-5 font-medium bg-neutral-50">Rank</th>
                      <th className="py-4 px-5 font-medium bg-neutral-50">Wilayah</th>
                      <th className="py-4 px-5 font-medium bg-neutral-50">Nilai</th>
                      <th className="py-4 px-5 font-medium bg-neutral-50">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {regionPerformance.map((reg, idx) => (
                      <tr key={reg.name} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 px-5 text-neutral-500 font-medium">#{idx + 1}</td>
                        <td className="py-4 px-5 text-neutral-900 font-medium whitespace-normal max-w-[180px]">{reg.name}</td>
                        <td className="py-4 px-5 font-semibold text-neutral-900">{reg.avg.toFixed(2)}</td>
                        <td className="py-4 px-5 text-neutral-500">{reg.count}</td>
                      </tr>
                    ))}
                    {regionPerformance.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-neutral-400">Tidak ada data wilayah.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        {/* Recent Assessments - Clean Borderless style */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Penilaian Terbaru</h2>
            </div>
            <Link href="/admin/responses" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-black transition-all shadow-sm">
              Lihat Semua
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </Link>
          </div>

          <div className="overflow-hidden border border-neutral-200 rounded-3xl relative bg-white shadow-sm">
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-sm">
                  <tr>
                    <th className="py-4 px-6 font-medium bg-neutral-50">Tanggal</th>
                    <th className="py-4 px-6 font-medium bg-neutral-50">Jabatan</th>
                    <th className="py-4 px-6 font-medium bg-neutral-50">Instansi Dinilai</th>
                    <th className="py-4 px-6 font-medium bg-neutral-50">Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentAssessments.map(r => (
                    <tr key={r.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-6 text-neutral-500">
                        {new Date(r.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-6 font-medium text-neutral-900">{r.jabatan}</td>
                      <td className="py-4 px-6 text-neutral-700 truncate max-w-[200px]" title={r.institutions?.name}>{r.institutions?.name || "-"}</td>
                      <td className="py-4 px-6 font-bold text-neutral-900">
                        <div className="inline-flex items-center justify-center px-2.5 py-1 bg-neutral-100 rounded-lg">
                          {r.overall_score?.toFixed(2) || "0.00"}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recentAssessments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-neutral-400">Belum ada data penilaian.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
