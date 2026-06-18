import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
      <p className="text-neutral-500 font-medium">Memuat data dasbor...</p>
    </div>
  );
}
