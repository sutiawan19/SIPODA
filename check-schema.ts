import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkSchema() {
  const { data, error } = await supabase.from('survey_questions').select('*').limit(1)
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Columns found:', Object.keys(data[0] || {}))
    console.log('First row:', data[0])
  }
}

checkSchema()
