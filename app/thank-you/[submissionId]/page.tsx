import Link from "next/link";
import { Check, BarChart3, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ThankYouClient } from "./ThankYouClient";

export const dynamic = 'force-dynamic'

export default async function ThankYouPage({ params, searchParams }: { params: Promise<{ submissionId: string }>, searchParams: Promise<{ inst?: string }> }) {
  const { submissionId } = await params;
  const { inst: instId } = await searchParams;
  const supabase = await createClient();

  let institution = null;
  if (instId) {
    const { data } = await supabase
      .from('institutions')
      .select('id, name')
      .eq('id', instId)
      .single();
    institution = data;
  }

  let displayId = submissionId;
  const { data: responseData } = await supabase
    .from('survey_responses')
    .select('response_code')
    .eq('id', submissionId)
    .single();

  if ((responseData as any)?.response_code) {
    displayId = (responseData as any).response_code;
  }

  return <ThankYouClient submissionId={displayId} institution={institution} />
}


