"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import { login } from "./actions";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      
      <Link href="/" className="absolute top-8 left-8 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Beranda
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[400px]"
      >
        <div className="bg-white p-10 border border-neutral-200 rounded-2xl shadow-sm text-center">
          
          <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain mx-auto mb-8" />

          <h1 className="text-2xl font-bold text-neutral-950 mb-2 tracking-tight">Masuk ke Dasbor</h1>
          <p className="text-neutral-500 text-sm mb-8">Masukkan kredensial Anda untuk mengakses area pengelola instansi.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Password</label>
              <input 
                type="password" 
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            
            <Button type="submit" size="lg" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memverifikasi...</>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </form>

        </div>
        
        <p className="text-center text-sm text-neutral-400 mt-8">
          Gunakan kredensial yang telah didaftarkan.
        </p>

      </motion.div>
    </div>
  );
}
