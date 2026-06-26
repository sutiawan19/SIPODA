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
  description: "Website Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi organisasi berdasarkan indikator kualitas pelayanan publik secara objektif, cepat, dan terukur.",
  keywords: ["Penilaian Restrukturisasi", "Kualitas Pelayanan Publik", "Evaluasi OPD", "Organisasi Perangkat Daerah", "SERVQUAL", "Evaluasi Pelayanan Publik", "Sistem Penilaian Organisasi Pemerintah"],
  authors: [{ name: "Admin" }],
  creator: "Admin",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://penilaianpelayanan.vercel.app",
    title: "Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik",
    description: "Website Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi organisasi berdasarkan indikator kualitas pelayanan publik secara objektif, cepat, dan terukur.",
    siteName: "Penilaian Restrukturisasi",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Logo Penilaian Restrukturisasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik",
    description: "Website Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi organisasi berdasarkan indikator kualitas pelayanan publik secara objektif, cepat, dan terukur.",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik",
              "description": "Website Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi organisasi berdasarkan indikator kualitas pelayanan publik secara objektif, cepat, dan terukur.",
              "applicationCategory": "GovernmentApplication",
              "operatingSystem": "All",
              "url": "https://penilaianpelayanan.vercel.app"
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
