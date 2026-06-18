import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-grow flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain mb-4 animate-pulse" />
        <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse"></div>
      </main>
      <Footer />
    </div>
  );
}
