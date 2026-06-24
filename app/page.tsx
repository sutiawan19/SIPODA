import { createClient } from '@/lib/supabase/server'
import AssessmentClient from './AssessmentClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  // Fetch institutions to be used as "Instansi yang Dinilai"
  const { data: institutions } = await supabase
    .from('institutions')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  return <AssessmentClient institutions={institutions || []} />
}
