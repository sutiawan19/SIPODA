import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-grow py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3 mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-neutral-200 rounded-xl p-6 h-48 flex flex-col">
                <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6 mb-auto"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/3 mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
