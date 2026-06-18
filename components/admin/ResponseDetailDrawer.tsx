"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Printer, Download, MessageSquare, AlertCircle } from "lucide-react";
import { DetailedResponse } from "@/lib/constants/mockAdminData";
import { SURVEY_QUESTIONS } from "@/lib/constants/questions";

interface ResponseDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: DetailedResponse | null;
}

export function ResponseDetailDrawer({ isOpen, onClose, data }: ResponseDetailDrawerProps) {
  if (!data) return null;

  // Analysis Logic
  const scoreEntries = Object.entries(data.scores);
  const maxScore = Math.max(...scoreEntries.map(([, v]) => v));
  const minScore = Math.min(...scoreEntries.map(([, v]) => v));
  
  const highestQ = scoreEntries.find(([, v]) => v === maxScore)?.[0];
  const lowestQ = scoreEntries.find(([, v]) => v === minScore)?.[0];

  const highestLabel = SURVEY_QUESTIONS.find(q => q.id.replace('q', '') === highestQ?.replace('q', '') || q.id === highestQ || q.id.startsWith(highestQ || ''))?.label || "Indikator Terbaik";
  const lowestLabel = SURVEY_QUESTIONS.find(q => q.id.replace('q', '') === lowestQ?.replace('q', '') || q.id === lowestQ || q.id.startsWith(lowestQ || ''))?.label || "Indikator Terendah";

  const getVariant = (score: number) => {
    if (score >= 4.5) return "success";
    if (score >= 3.5) return "default";
    if (score >= 2.5) return "neutral";
    return "warning";
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full bg-neutral-50">
        
        {/* Detail Header */}
        <div className="bg-white px-8 pt-10 pb-8 border-b border-neutral-200">
          <p className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-widest">Detail Responden</p>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-950 font-mono tracking-tight">{data.id}</h2>
              <p className="text-neutral-500 mt-1">{data.date} • {data.inst}</p>
            </div>
          </div>

          {/* Satisfaction Overview */}
          <div className="bg-neutral-950 rounded-xl p-6 text-white mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-neutral-400 text-sm font-medium mb-1">Skor Kepuasan Keseluruhan</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tighter">{data.score.toFixed(1)}</span>
                <span className="text-xl text-neutral-500">/ 5</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-neutral-400 text-sm font-medium mb-2">Status</p>
              <Badge variant={getVariant(data.score)} className="px-4 py-1.5 text-sm bg-white text-neutral-950 border-transparent">
                {data.sentiment}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">
          
          {/* Question Breakdown */}
          <section>
            <h3 className="text-lg font-semibold text-neutral-950 mb-6">Rincian Pertanyaan</h3>
            <div className="space-y-4">
              {SURVEY_QUESTIONS.map((q, i) => {
                const qKey = `q${i + 1}` as keyof typeof data.scores;
                const score = data.scores[qKey];
                return (
                  <div key={q.id} className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-medium text-neutral-400 mb-1">Pertanyaan {i + 1}</p>
                        <p className="font-medium text-neutral-900">{q.label}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-neutral-900">{score}</span>
                        <span className="text-neutral-400 text-sm"> / 5</span>
                      </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-900" style={{ width: `${(score / 5) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Service Quality Analysis */}
          <section>
            <h3 className="text-lg font-semibold text-neutral-950 mb-6">Analisis Kualitas Pelayanan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-lg border border-neutral-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-neutral-900" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Penilaian Tertinggi</span>
                </div>
                <p className="font-medium text-neutral-900 mb-1">{highestLabel}</p>
                <p className="text-2xl font-bold text-neutral-950 mb-4">{maxScore.toFixed(1)} <span className="text-sm font-normal text-neutral-400">/ 5</span></p>
                <p className="text-sm text-neutral-500">Area yang paling diapresiasi pengguna.</p>
              </div>
              <div className="bg-white p-5 rounded-lg border border-neutral-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Penilaian Terendah</span>
                </div>
                <p className="font-medium text-neutral-900 mb-1">{lowestLabel}</p>
                <p className="text-2xl font-bold text-neutral-950 mb-4">{minScore.toFixed(1)} <span className="text-sm font-normal text-neutral-400">/ 5</span></p>
                <p className="text-sm text-neutral-500">Area yang masih memiliki peluang untuk ditingkatkan.</p>
              </div>
            </div>
          </section>

          {/* Kendala & Saran */}
          <section className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-950 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-neutral-400" />
                Kendala yang Dialami
              </h3>
              <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm text-neutral-700 leading-relaxed">
                {data.kendala || <span className="text-neutral-400 italic">Tidak ada kendala yang disampaikan.</span>}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-950 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neutral-400" />
                Saran & Masukan untuk Pemerintah Daerah
              </h3>
              <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm text-neutral-700 leading-relaxed">
                {data.saran || <span className="text-neutral-400 italic">Tidak ada saran yang diberikan.</span>}
              </div>
            </div>
          </section>

        </div>

        {/* Drawer Footer */}
        <div className="bg-white p-6 border-t border-neutral-200 flex justify-end items-center gap-4">
          <Button variant="default" onClick={onClose}>Tutup</Button>
        </div>

      </div>
    </Drawer>
  );
}
