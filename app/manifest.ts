import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik',
    short_name: 'Penilaian OPD',
    description: 'Website Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi organisasi berdasarkan indikator kualitas pelayanan publik secara objektif, cepat, dan terukur.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
