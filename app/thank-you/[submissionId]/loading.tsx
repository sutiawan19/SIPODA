import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center animate-pulse">
          <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-8"></div>
          <div className="h-8 bg-neutral-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-full mx-auto mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6 mx-auto mb-12"></div>
          
          <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 mb-8">
            <div className="h-4 bg-neutral-200 rounded w-1/3 mx-auto mb-2"></div>
            <div className="h-6 bg-neutral-200 rounded w-2/3 mx-auto"></div>
          </div>
          
          <div className="h-12 bg-neutral-200 rounded-xl w-48 mx-auto"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
