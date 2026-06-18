import Link from "next/link";
import { Users } from "lucide-react";
import { Institution } from "@/types";
import { formatNumber } from "@/lib/utils/formatters";
import { Card } from "@/components/ui/Card";

interface InstitutionCardProps {
  institution: Institution;
}

export default function InstitutionCard({ institution }: InstitutionCardProps) {
  return (
    <Link href={`/survey/${institution.id}`} className="block group h-full outline-none">
      <Card className="h-full flex flex-col hover:border-neutral-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <div className="p-6 flex flex-col flex-grow">
          {/* Header */}
          <div className="flex items-start mb-4">
            <span className="text-xs font-medium px-2 py-1 border border-neutral-200 rounded-md text-neutral-600">
              {institution.category}
            </span>
          </div>

          {/* Body */}
          <h3 className="font-semibold text-neutral-900 text-lg mb-2 line-clamp-2 group-hover:underline underline-offset-4">
            {institution.name}
          </h3>
          <p className="text-sm text-neutral-500 mb-6 line-clamp-2 flex-grow leading-relaxed">
            {institution.description}
          </p>

          {/* Footer */}
          <div className="pt-4 border-t border-neutral-100 mt-auto flex items-center text-xs text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{formatNumber(institution.totalResponses)} ulasan</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
