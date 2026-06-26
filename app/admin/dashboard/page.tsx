import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './DashboardClient'

import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard Admin | Penilaian Restrukturisasi Berbasis Kualitas Pelayanan Publik',
  description: 'Dashboard administrator.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch all responses with new schema
  const { data: responses, error } = await supabase
    .from('survey_responses')
    .select(`
      id,
      created_at,
      response_code,
      overall_score,
      answers,
      jabatan,
      kecamatan,
      institutions ( name )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Supabase Error stringified:", JSON.stringify(error))
  }

  const allResponses = (responses as any[]) || []
  
  const { count: totalInstitutions } = await supabase
    .from('institutions')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  return <DashboardClient responses={allResponses} totalInstitutions={totalInstitutions || 0} />
}
