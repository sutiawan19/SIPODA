export default function ResponsesLoading() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-20 animate-pulse">
      {/* Header Section */}
      <div className="pt-12 pb-6 px-6 md:px-12 max-w-[1400px] mx-auto border-b border-neutral-100 mb-10">
        <div className="h-10 w-64 bg-neutral-200 rounded-lg mb-4"></div>
        <div className="h-5 w-96 bg-neutral-100 rounded-lg mb-4"></div>
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto space-y-12">
        <div className="flex flex-col gap-6">
          {/* Advanced Toolbar (Minimalist) */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-6 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100"></div>
              <div className="h-6 w-32 bg-neutral-200 rounded-lg"></div>
            </div>
          
            <div className="flex flex-wrap xl:flex-nowrap gap-3 w-full xl:w-auto">
              <div className="h-10 w-full sm:w-64 bg-neutral-100 rounded-xl"></div>
              <div className="h-10 w-full sm:w-56 bg-neutral-100 rounded-xl"></div>
              <div className="h-10 w-full md:w-48 bg-neutral-100 rounded-xl"></div>
              <div className="h-10 w-24 bg-neutral-100 rounded-xl"></div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-neutral-200 rounded-3xl p-1 min-h-[400px]">
            <div className="w-full bg-neutral-50 h-12 rounded-t-2xl border-b border-neutral-200"></div>
            <div className="space-y-2 p-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-16 w-full bg-neutral-50/50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
