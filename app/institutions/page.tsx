import { createClient } from '@/lib/supabase/server'
import { SelectInstitutionClient } from './SelectInstitutionClient'

export const dynamic = 'force-dynamic'

export default async function SelectInstitutionPage() {
  const supabase = await createClient()
  
  const { data: institutions, error: instError } = await supabase
    .from('institutions')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const { data: responses, error: respError } = await supabase
    .from('survey_responses')
    .select('institution_id, overall_score')

  if (instError) console.error("Error fetching institutions:", instError);
  if (respError) console.error("Error fetching responses:", respError);

  const instWithStats = ((institutions as any[]) || []).map(inst => {
    const instResponses = ((responses as any[]) || []).filter(r => r.institution_id === inst.id)
    const totalResponses = instResponses.length
    
    let rating = 0
    let satisfactionRate = 0
    
    if (totalResponses > 0) {
      const sum = instResponses.reduce((acc, curr) => acc + (curr.overall_score || 0), 0)
      rating = Number((sum / totalResponses).toFixed(1))
      
      const positiveResponses = instResponses.filter(r => (r.overall_score || 0) >= 3.5).length
      satisfactionRate = Math.round((positiveResponses / totalResponses) * 100)
    }

    return {
      ...(typeof inst === 'object' && inst !== null ? inst : {}),
      rating,
      totalResponses,
      satisfactionRate
    }
  })

  return <SelectInstitutionClient initialInstitutions={instWithStats} />
}
