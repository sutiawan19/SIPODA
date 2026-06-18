import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SurveyPublik — Platform Survei Kepuasan Pelayanan Publik",
  description:
    "Sampaikan penilaian Anda terhadap pelayanan publik. Bersama kita wujudkan pelayanan yang lebih baik untuk semua.",
  keywords: "survei kepuasan, pelayanan publik, pemerintah, feedback masyarakat",
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
