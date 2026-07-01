import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './DashboardClient'

import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard Admin | SIPODA',
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
      nama,
      instansi,
      jabatan,
      email
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Supabase Error stringified:", JSON.stringify(error))
  }

  const allResponses = (responses as any[]) || []
  
  // Calculate total unique institutions from responses
  const uniqueInstitutions = new Set(allResponses.map(r => r.instansi).filter(Boolean));

  return <DashboardClient responses={allResponses} totalInstitutions={uniqueInstitutions.size} />
}
