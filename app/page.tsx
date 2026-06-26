import { createClient } from '@/lib/supabase/server'
import AssessmentClient from './AssessmentClient'

import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik',
  description: 'Website Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik untuk membantu Organisasi Perangkat Daerah (OPD) dalam melakukan evaluasi organisasi berdasarkan indikator kualitas pelayanan publik.',
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  const supabase = await createClient()

  // Fetch institutions to be used as "Instansi yang Dinilai"
  const { data: institutions } = await supabase
    .from('institutions')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  return <AssessmentClient institutions={institutions || []} />
}
