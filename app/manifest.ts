import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)',
    short_name: 'SIPODA',
    description: 'Sistem Informasi Pengembangan Organisasi Digital Adaptif untuk membantu Organisasi Perangkat Daerah (OPD) melakukan evaluasi organisasi.',
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
