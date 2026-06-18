import { createClient } from "@/lib/supabase/server";
import { LandingClient } from "./LandingClient";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();

  // 1. Get total responses and average satisfaction
  const { data: responses } = await supabase
    .from('survey_responses')
    .select('overall_score');

  let totalResponses = 0;
  let averageSatisfaction = 0;

  if (responses && responses.length > 0) {
    totalResponses = responses.length;
    const sum = responses.reduce((acc, curr: any) => acc + (curr.overall_score || 0), 0);
    averageSatisfaction = sum / totalResponses;
  }

  // 2. Get active institutions count
  const { count: totalInstitutions } = await supabase
    .from('institutions')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const stats = {
    totalResponses,
    totalInstitutions: totalInstitutions || 0,
    averageSatisfaction
  };

  return <LandingClient stats={stats} />;
}
