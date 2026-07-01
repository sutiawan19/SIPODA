import PublicNavbar from "@/components/layout/PublicNavbar";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans text-neutral-900 relative overflow-hidden">
      {/* Background Ornament */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.02]">
        <img src="/logo-sipoda.png" alt="" className="w-[120%] max-w-[800px] object-contain blur-[1px]" />
      </div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <PublicNavbar />
      
        <main className="flex-grow py-12 px-6">
          <div className="max-w-3xl mx-auto animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-12">
              <div className="h-10 w-3/4 bg-neutral-200 rounded-lg mb-4"></div>
              <div className="h-5 w-1/2 bg-neutral-200 rounded-lg"></div>
            </div>

            {/* Form Box Skeleton */}
            <div className="space-y-8 bg-white p-5 sm:p-6 md:p-10 rounded-2xl border border-neutral-200 shadow-sm relative">
              
              {/* Progress Bar Skeleton */}
              <div className="pt-5 sm:pt-6 md:pt-10 pb-5 sm:pb-6 mb-8 border-b border-neutral-100 -mx-5 px-5 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 -mt-5 sm:-mt-6 md:-mt-10 rounded-t-2xl">
                <div className="flex justify-between mb-3">
                  <div className="h-4 w-32 bg-neutral-200 rounded-md"></div>
                  <div className="h-4 w-12 bg-neutral-200 rounded-md"></div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2.5">
                  <div className="bg-neutral-200 h-full rounded-full w-1/4"></div>
                </div>
              </div>

              {/* Form Fields Skeleton */}
              <div className="min-h-[400px]">
                <div className="mb-8 pb-4 border-b border-neutral-100">
                  <div className="h-6 w-24 bg-neutral-200 rounded-full mb-3"></div>
                  <div className="h-8 w-64 bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-4 w-full max-w-md bg-neutral-100 rounded-lg"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-5 w-24 bg-neutral-200 rounded-md mb-2"></div>
                    <div className="h-12 w-full bg-neutral-100 rounded-xl"></div>
                  </div>
                  <div>
                    <div className="h-5 w-24 bg-neutral-200 rounded-md mb-2"></div>
                    <div className="h-12 w-full bg-neutral-100 rounded-xl"></div>
                  </div>
                  <div>
                    <div className="h-5 w-24 bg-neutral-200 rounded-md mb-2"></div>
                    <div className="h-12 w-full bg-neutral-100 rounded-xl"></div>
                  </div>
                  <div>
                    <div className="h-5 w-24 bg-neutral-200 rounded-md mb-2"></div>
                    <div className="h-12 w-full bg-neutral-100 rounded-xl"></div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="h-5 w-32 bg-neutral-200 rounded-md mb-2"></div>
                    <div className="h-12 w-full bg-neutral-100 rounded-xl"></div>
                  </div>
                </div>
              </div>

              {/* Footer Skeleton */}
              <div className="flex flex-col-reverse sm:flex-row justify-between pt-8 mt-8 border-t border-neutral-100">
                <div className="hidden sm:block"></div>
                <div className="h-14 sm:h-12 w-full sm:w-40 bg-neutral-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
