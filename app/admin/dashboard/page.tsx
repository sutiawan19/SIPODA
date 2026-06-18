import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: responses } = await supabase
    .from('survey_responses')
    .select(`
      id,
      created_at,
      response_code,
      overall_score,
      obstacle,
      suggestion,
      institutions ( name )
    `)
    .order('created_at', { ascending: false })

  const { count: instCount } = await supabase
    .from('institutions')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  const allResponses = (responses as any[]) || []
  const totalResponses = allResponses.length
  
  const sum = allResponses.reduce((acc, r) => acc + (r.overall_score || 0), 0)
  const averageScore = totalResponses > 0 ? sum / totalResponses : 0

  const needsImprovement = allResponses.filter(r => r.overall_score < 3).length

  const recentSubmissions = allResponses.slice(0, 5).map(r => ({
    id: r.response_code,
    inst: r.institutions ? (r.institutions as any).name : 'Unknown',
    date: new Date(r.created_at).toLocaleDateString('id-ID'),
    score: r.overall_score || 0
  }))

  const recentComplaints = allResponses
    .filter(r => r.obstacle && r.obstacle.trim() !== '')
    .slice(0, 5)
    .map(r => ({
      text: r.obstacle,
      inst: (r.institutions as any)?.name || 'Unknown',
      date: new Date(r.created_at).toLocaleDateString('id-ID')
    }))

  const recentSuggestions = allResponses
    .filter(r => r.suggestion && r.suggestion.trim() !== '')
    .slice(0, 5)
    .map(r => ({
      text: r.suggestion,
      inst: (r.institutions as any)?.name || 'Unknown',
      date: new Date(r.created_at).toLocaleDateString('id-ID')
    }))

  // Basic trend grouping by date
  const trendMap = new Map<string, number>()
  // prefill last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    trendMap.set(dateStr, 0)
  }

  allResponses.forEach(r => {
    if (!r.created_at) return;
    const d = r.created_at.split('T')[0]
    if (trendMap.has(d)) {
      trendMap.set(d, trendMap.get(d)! + 1)
    }
  })

  const trendData = Array.from(trendMap.entries()).map(([date, count]) => ({
    name: date.split('-').slice(1).join('/'), // MM/DD
    responses: count
  }))

  return (
    <DashboardClient 
      stats={{
        totalResponses,
        averageScore,
        activeInstitutions: instCount || 0,
        needsImprovement
      }}
      trendData={trendData}
      recentSubmissions={recentSubmissions}
      topComplaints={recentComplaints}
      topSuggestions={recentSuggestions}
    />
  )
}
