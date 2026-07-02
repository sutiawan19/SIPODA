import { createClient } from '@/lib/supabase/server'
import { ResponsesClient } from './ResponsesClient'

import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Data Penilaian | Dashboard Admin',
  description: 'Data hasil penilaian.',
  robots: {
    index: false,
    follow: false,
  },
}

function formatCustomDate(dateString: string) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const dayName = days[d.getDay()];
  const day = d.getDate().toString().padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  
  return `${dayName}, ${day} ${month} ${year} pukul ${hours}.${minutes}`;
}

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
      instansi,
      jabatan,
      lama_bekerja,
      answers,
      obstacle,
      suggestion
    `)
    .order('created_at', { ascending: false })

  // Map to format that client expects or can easily render
  const formattedResponses = (responses || []).map((r: any) => ({
    id: r.id,
    response_code: r.response_code,
    date: formatCustomDate(r.created_at),
    rawDate: r.created_at,
    inst: r.instansi,
    jabatan: r.jabatan,
    lamaBekerja: r.lama_bekerja,
    score: r.overall_score || 0,
    answers: r.answers || {},
    kendala: r.obstacle,
    saran: r.suggestion
  }))

  return (
    <ResponsesClient 
      initialResponses={formattedResponses}
    />
  )
}
