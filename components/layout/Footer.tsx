import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-4">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex justify-center items-center text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
        </div>

      </div>
    </footer>
  );
}
