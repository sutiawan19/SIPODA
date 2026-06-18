import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
          <div className="flex flex-col gap-4 max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-neutral-950 flex items-center justify-center rounded-[4px]">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="font-semibold text-lg text-neutral-950 tracking-tight">
                SurveyPublik
              </span>
            </Link>
            <p className="text-neutral-500 text-base leading-relaxed">
              Membangun pelayanan publik yang lebih baik dan transparan melalui umpan balik masyarakat.
            </p>
          </div>
          
          <nav className="flex flex-wrap gap-8 text-base font-medium">
            <Link href="/" className="text-neutral-500 hover:text-neutral-900 transition-colors">Beranda</Link>
            <Link href="/institutions" className="text-neutral-500 hover:text-neutral-900 transition-colors">Instansi</Link>
            <Link href="/admin/login" className="text-neutral-500 hover:text-neutral-900 transition-colors">Akses Admin</Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-neutral-100 text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} SurveyPublik. Hak Cipta Dilindungi.</p>
        </div>

      </div>
    </footer>
  );
}
