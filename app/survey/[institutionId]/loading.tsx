import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <PublicNavbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2 mx-auto"></div>
          <div className="h-8 bg-neutral-200 rounded w-3/4 mb-8 mx-auto"></div>
          
          <div className="space-y-6">
            <div className="h-20 bg-neutral-100 rounded-xl w-full"></div>
            <div className="h-20 bg-neutral-100 rounded-xl w-full"></div>
            <div className="h-20 bg-neutral-100 rounded-xl w-full"></div>
            <div className="h-20 bg-neutral-100 rounded-xl w-full"></div>
          </div>
          
          <div className="h-12 bg-neutral-200 rounded-lg w-full mt-8"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
