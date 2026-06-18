'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function submitSurvey(data: {
  institutionId: string
  ratings: { questionId: string; score: number }[]
  kendala: string
  saran: string
}) {
  const supabase = await createClient()

  // Calculate overall score
  const totalScore = data.ratings.reduce((acc, curr) => acc + curr.score, 0)
  const overallScore = data.ratings.length > 0 ? Number((totalScore / data.ratings.length).toFixed(1)) : 0

  const responseId = crypto.randomUUID()

  // Insert response
  const { error: responseError } = await supabase
    .from('survey_responses')
    .insert({
      id: responseId,
      institution_id: data.institutionId,
      overall_score: overallScore,
      obstacle: data.kendala || null,
      suggestion: data.saran || null,
    } as any)

  if (responseError) {
    console.error('Error inserting response:', responseError)
    throw new Error('Gagal mengirim penilaian.')
  }

  // Insert answers
  const answersToInsert = data.ratings.map(rating => ({
    response_id: responseId,
    question_id: rating.questionId,
    score: rating.score
  }))

  const { error: answersError } = await supabase
    .from('survey_answers')
    .insert(answersToInsert as any)

  if (answersError) {
    console.error('Error inserting answers:', answersError)
    throw new Error('Gagal menyimpan detail penilaian.')
  }

  return { success: true, submissionId: responseId }
}
