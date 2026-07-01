import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://penilaianpelayanan.vercel.app'),
  title: {
    template: "%s | SIPODA",
    default: "SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)",
  },
  description: "Sistem Informasi Pengembangan Organisasi Digital Adaptif untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi kemampuan adaptasi organisasi di era digital secara objektif, cepat, dan terukur.",
  keywords: ["SIPODA", "Organisasi Digital Adaptif", "Sensing", "Seizing", "Transforming", "Evaluasi OPD", "Organisasi Perangkat Daerah", "Sistem Penilaian Organisasi Pemerintah"],
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
    title: "SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)",
    description: "Sistem Informasi Pengembangan Organisasi Digital Adaptif untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi kemampuan adaptasi organisasi di era digital secara objektif, cepat, dan terukur.",
    siteName: "SIPODA",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Logo SIPODA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)",
    description: "Sistem Informasi Pengembangan Organisasi Digital Adaptif untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi kemampuan adaptasi organisasi di era digital secara objektif, cepat, dan terukur.",
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
              "name": "SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)",
              "description": "Sistem Informasi Pengembangan Organisasi Digital Adaptif untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi kemampuan adaptasi organisasi di era digital secara objektif, cepat, dan terukur.",
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
