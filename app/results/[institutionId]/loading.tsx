import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-grow pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-neutral-200 rounded w-1/2 mb-6"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-neutral-200 rounded-lg w-32"></div>
              <div className="h-12 bg-neutral-200 rounded-lg w-48"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-40 bg-neutral-100 rounded-2xl border border-neutral-200"></div>
            <div className="h-40 bg-neutral-100 rounded-2xl border border-neutral-200"></div>
          </div>

          {/* Chart Skeleton */}
          <div className="h-80 bg-neutral-100 rounded-2xl border border-neutral-200 animate-pulse"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
