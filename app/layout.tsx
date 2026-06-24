import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://penilaianpelayanan.vercel.app'),
  title: {
    default: "Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik",
    template: "%s | Pelayanan Publik"
  },
  description: "Platform evaluasi internal kualitas layanan antar instansi pemerintahan untuk mewujudkan pelayanan publik yang lebih baik dan transparan.",
  keywords: ["survei pelayanan publik", "evaluasi instansi", "kualitas layanan", "pemerintah", "restrukturisasi pelayanan", "penilaian kinerja", "feedback masyarakat"],
  authors: [{ name: "Admin" }],
  creator: "Admin",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://penilaianpelayanan.vercel.app",
    title: "Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik",
    description: "Sampaikan penilaian Anda terhadap pelayanan publik. Bersama kita wujudkan pelayanan yang lebih baik.",
    siteName: "Survei Pelayanan Publik",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Logo Survei Pelayanan Publik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Penilaian Restrukturisasi Kualitas Pelayanan Publik",
    description: "Evaluasi internal kualitas layanan antar instansi pemerintahan.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
