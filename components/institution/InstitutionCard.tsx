"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, BarChart2, Edit3, Share2 } from "lucide-react";
import { Institution } from "@/types";
import { formatNumber } from "@/lib/utils/formatters";
import { Card } from "@/components/ui/Card";
import { ShareModal } from "@/components/ui/ShareModal";

interface InstitutionCardProps {
  institution: Institution;
}

export default function InstitutionCard({ institution }: InstitutionCardProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/survey/${institution.id}`);
  }, [institution.id]);

  return (
    <div className="block group h-full outline-none">
      <Card className="h-full flex flex-col hover:border-neutral-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <div className="p-6 flex flex-col flex-grow">
          {/* Header */}
          {institution.category && (
            <div className="flex items-start mb-4">
              <span className="text-xs font-medium px-2 py-1 border border-neutral-200 rounded-md text-neutral-700">
                {institution.category}
              </span>
            </div>
          )}

          {/* Body */}
          <h3 className="font-semibold text-neutral-900 text-lg mb-2 line-clamp-2 group-hover:underline underline-offset-4">
            {institution.name}
          </h3>
          <p className="text-sm text-neutral-500 mb-6 line-clamp-2 flex-grow leading-relaxed">
            {institution.description}
          </p>

          {/* Footer Stats */}
          <div className="pt-4 mt-auto mb-4 flex items-center text-xs text-neutral-500">
            <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">
              <Users className="w-3.5 h-3.5" />
              <span className="font-medium text-neutral-700">{formatNumber(institution.totalResponses)}</span> ulasan
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-2 mt-auto">
            <Link
              href={`/survey/${institution.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Isi Survei
            </Link>
            <Link
              href={`/results/${institution.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white text-neutral-700 border border-neutral-200 text-xs font-medium rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Hasil
            </Link>
            <button
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center justify-center p-2 bg-white text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              title="Bagikan Survei"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={shareUrl}
        title={`Survei Kepuasan: ${institution.name}`}
      />
    </div>
  );
}
