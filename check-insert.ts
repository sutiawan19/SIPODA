import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkInsert() {
  const { data: instData } = await supabase.from('institutions').select('id').limit(1)
  const instId = instData?.[0]?.id

  if (!instId) {
    console.error('No institution found to test with')
    return
  }

  console.log('Testing insert for institution:', instId)

  const { data, error } = await supabase
    .from('survey_responses')
    .insert({
      institution_id: instId,
      response_code: 'TEST-1234',
      overall_score: 5,
      obstacle: 'test',
      suggestion: 'test'
    })
    .select('id')
    .single()

  if (error) {
    console.error('Insert Error:', JSON.stringify(error, null, 2))
  } else {
    console.log('Insert Success:', data)
  }
}

checkInsert()
