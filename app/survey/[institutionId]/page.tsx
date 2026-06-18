import { createClient } from '@/lib/supabase/server'
import { SurveyClient } from './SurveyClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SurveyFormPage({ params }: { params: Promise<{ institutionId: string }> }) {
  const { institutionId } = await params
  const supabase = await createClient()

  // Fetch institution
  const { data: institution } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', institutionId)
    .single()

  if (!institution) {
    notFound()
  }

  // Fetch questions
  const { data: questions, error: questionsError } = await supabase
    .from('survey_questions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (questionsError) console.error("Error fetching survey_questions:", questionsError);

  return <SurveyClient institution={institution} questions={questions || []} />
}
