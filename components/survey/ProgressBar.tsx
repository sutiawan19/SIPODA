"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs font-medium text-neutral-500">
        <span>Langkah {current} dari {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-1 w-full bg-neutral-100 rounded-none overflow-hidden">
        <div
          className="h-full bg-neutral-900 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
