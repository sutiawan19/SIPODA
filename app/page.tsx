import AssessmentClient from './AssessmentClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SIPODA (Sistem Informasi Pengembangan Organisasi Digital Adaptif)',
  description: 'Sistem Informasi Pengembangan Organisasi Digital Adaptif untuk membantu Organisasi Perangkat Daerah (OPD) dalam melakukan evaluasi organisasi secara objektif.',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return <AssessmentClient />
}
