export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-20 animate-pulse">
      {/* Header Section */}
      <div className="pt-12 pb-6 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="h-10 w-64 bg-neutral-200 rounded-lg mb-4"></div>
        <div className="h-5 w-96 bg-neutral-100 rounded-lg"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-neutral-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="h-3 w-32 bg-neutral-200 rounded-full mb-4"></div>
              <div className="h-10 w-24 bg-neutral-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto space-y-12">
        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100"></div>
            <div className="h-6 w-32 bg-neutral-200 rounded-lg"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-48 bg-neutral-100 rounded-xl"></div>
            <div className="h-10 w-56 bg-neutral-100 rounded-xl"></div>
            <div className="h-10 w-56 bg-neutral-100 rounded-xl"></div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-neutral-100 bg-white rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px] flex flex-col">
            <div className="h-6 w-48 bg-neutral-200 rounded-lg mb-8"></div>
            <div className="flex-1 bg-neutral-50 rounded-xl"></div>
          </div>
          <div className="border border-neutral-100 bg-white rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px] flex flex-col">
            <div className="h-6 w-48 bg-neutral-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 w-full bg-neutral-50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
