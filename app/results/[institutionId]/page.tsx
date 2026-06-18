import { createClient } from '@/lib/supabase/server'
import { ResultsClient } from './ResultsClient'

export const dynamic = 'force-dynamic'

export default async function InstitutionResultsPage({ params }: { params: Promise<{ institutionId: string }> }) {
  const { institutionId } = await params
  const supabase = await createClient()

  const { data: institution } = await supabase
    .from('institutions')
    .select('id, name')
    .eq('id', institutionId)
    .single()

  if (!institution) {
    return <ResultsClient result={null} />
  }

  const { data: responses } = await supabase
    .from('survey_responses')
    .select('overall_score')
    .eq('institution_id', institutionId)

  const totalResponses = responses ? responses.length : 0

  let averageRating = 0
  let satisfactionRate = 0
  let positiveCount = 0
  let negativeCount = 0
  const distribution = [
    { score: 1, count: 0 },
    { score: 2, count: 0 },
    { score: 3, count: 0 },
    { score: 4, count: 0 },
    { score: 5, count: 0 },
  ]

  if (responses && totalResponses > 0) {
    const allResponses = responses as any[];
    const sum = allResponses.reduce((acc, curr) => acc + (curr.overall_score || 0), 0)
    averageRating = Number((sum / totalResponses).toFixed(1))

    allResponses.forEach(r => {
      // Calculate distribution using rounded scores
      const roundedScore = Math.max(1, Math.min(5, Math.round(r.overall_score || 0)))
      distribution[roundedScore - 1].count++

      // Positive is >= 3.5
      if ((r.overall_score || 0) >= 3.5) {
        positiveCount++
      } else {
        negativeCount++
      }
    })

    satisfactionRate = Math.round((positiveCount / totalResponses) * 100)
  }

  const inst: any = institution;
  const result = {
    institutionId: inst.id,
    institutionName: inst.name,
    averageRating,
    satisfactionRate,
    totalResponses,
    distribution,
    positiveCount,
    negativeCount
  }

  return <ResultsClient result={result} />
}
