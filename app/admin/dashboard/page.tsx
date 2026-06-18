"use client";

import { motion } from "framer-motion";
import { Users, Star, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { ADMIN_TREND_DATA, ADMIN_RECENT_SUBMISSIONS } from "@/lib/constants/mockAdminData";
import { formatNumber } from "@/lib/utils/formatters";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-950 mb-2 tracking-tight">Dashboard Overview</h1>
        <p className="text-neutral-500">Ringkasan performa dan metrik kepuasan pelayanan publik.</p>
      </div>

      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Responden", value: 12543, formatter: formatNumber, icon: Users, trend: "+12.5%" },
            { label: "Rata-rata Kepuasan", value: 42, formatter: (v: number) => (v/10).toFixed(1), icon: Star, trend: "+0.2" },
            { label: "Survei Selesai (Minggu Ini)", value: 892, formatter: formatNumber, icon: TrendingUp, trend: "+5.1%" },
            { label: "Laporan Perlu Perhatian", value: 45, formatter: (v: number) => v.toString(), icon: AlertCircle, trend: "-2.4%" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} variants={FADE_UP} className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4 text-neutral-500">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-bold text-neutral-950 tracking-tight">
                    <AnimatedCounter value={stat.value} formatter={stat.formatter} />
                  </div>
                  <div className="flex items-center text-xs font-medium text-neutral-500 mb-1">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stat.trend}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart */}
          <motion.div variants={FADE_UP} className="lg:col-span-2 p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-950 mb-6">Tren Partisipasi (30 Hari)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ADMIN_TREND_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#171717" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}
                  />
                  <Area type="monotone" dataKey="responses" stroke="#171717" strokeWidth={2} fillOpacity={1} fill="url(#colorResp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div variants={FADE_UP} className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-950">Terbaru Masuk</h3>
              <button className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Lihat Semua</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {ADMIN_RECENT_SUBMISSIONS.map((sub, i) => (
                  <div key={i} className="flex flex-col pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm text-neutral-950">{sub.inst}</span>
                      <span className="text-xs text-neutral-400">{sub.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500 font-mono">{sub.id}</span>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
                        <span className="text-sm font-medium text-neutral-900">{sub.score.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

    </div>
  );
}
