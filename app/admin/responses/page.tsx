import { createClient } from '@/lib/supabase/server'
import { ResponsesClient } from './ResponsesClient'

export const dynamic = 'force-dynamic'

export default async function AdminResponsesPage() {
  const supabase = await createClient()

  // Fetch responses with the new schema columns
  const { data: responses } = await supabase
    .from('survey_responses')
    .select(`
      id,
      created_at,
      response_code,
      overall_score,
      nama_penilai,
      jabatan,
      provinsi,
      kabupaten_kota,
      kecamatan,
      answers,
      obstacle,
      suggestion,
      institutions ( name )
    `)
    .order('created_at', { ascending: false })

  // Still fetch institutions for the filter dropdown
  const { data: institutions } = await supabase
    .from('institutions')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  // Map to format that client expects or can easily render
  const formattedResponses = (responses || []).map((r: any) => ({
    id: r.id,
    response_code: r.response_code,
    date: new Date(r.created_at).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    }),
    rawDate: r.created_at,
    inst: r.institutions?.name || 'Unknown',
    nama_penilai: r.nama_penilai,
    jabatan: r.jabatan,
    provinsi: r.provinsi,
    kabupaten_kota: r.kabupaten_kota,
    kecamatan: r.kecamatan,
    score: r.overall_score || 0,
    answers: r.answers || {},
    kendala: r.obstacle,
    saran: r.suggestion
  }))

  return (
    <ResponsesClient 
      initialResponses={formattedResponses}
      institutions={institutions || []}
    />
  )
}
