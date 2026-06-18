import { createClient } from '@/lib/supabase/server'
import { ResponsesClient } from './ResponsesClient'

export const dynamic = 'force-dynamic'

export default async function AdminResponsesPage() {
  const supabase = await createClient()

  const { data: questions } = await supabase.from('survey_questions').select('*').order('sort_order')
  const { data: institutions } = await supabase.from('institutions').select('*')
  
  const { data: responses } = await supabase
    .from('survey_responses')
    .select(`
      id,
      created_at,
      response_code,
      overall_score,
      obstacle,
      suggestion,
      institutions ( name ),
      survey_answers ( question_id, score )
    `)
    .order('created_at', { ascending: false })

  // Map to the format expected by the client
  const mappedResponses = ((responses as any[]) || []).map(r => {
    
    // Determine sentiment
    let sentiment = 'Cukup Puas'
    if (r.overall_score >= 4.5) sentiment = 'Sangat Puas'
    else if (r.overall_score >= 3.5) sentiment = 'Puas'
    else if (r.overall_score >= 2.5) sentiment = 'Cukup Puas'
    else if (r.overall_score >= 1.5) sentiment = 'Tidak Puas'
    else sentiment = 'Sangat Tidak Puas'

    const scoresMap: Record<string, number> = {}
    if (r.survey_answers && Array.isArray(r.survey_answers)) {
      r.survey_answers.forEach((ans: any) => {
        scoresMap[ans.question_id] = ans.score
      })
    }

    return {
      rawId: r.id,
      id: r.response_code || '-',
      date: new Date(r.created_at).toLocaleDateString('id-ID'),
      inst: r.institutions ? (r.institutions as any).name : 'Unknown',
      score: r.overall_score,
      sentiment,
      scores: scoresMap,
      kendala: r.obstacle || '',
      saran: r.suggestion || ''
    }
  })

  return (
    <ResponsesClient 
      initialResponses={mappedResponses} 
      questions={questions || []} 
      institutions={institutions || []} 
    />
  )
}
