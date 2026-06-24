'use server'

import { createClient } from '@/lib/supabase/server'

interface AssessmentPayload {
  nama_penilai: string;
  jabatan: string;
  provinsi: string;
  kabupaten_kota: string;
  kecamatan: string;
  institution_id: string; // instansi yang dinilai
  answers: any;
  obstacle: string;
  suggestion: string;
}

// We will not use random string anymore, we will calculate based on count inside submitAssessment

export async function submitAssessment(payload: AssessmentPayload) {
  const supabase = await createClient()

  // Calculate overall score from answers
  // answers object has format: { "tangibles_1": 5, "tangibles_2": 4, ... }
  const answerValues = Object.values(payload.answers) as number[];
  const sum = answerValues.reduce((acc, val) => acc + val, 0);
  const overall_score = answerValues.length > 0 ? Number((sum / answerValues.length).toFixed(2)) : 0;

  const { count } = await supabase
    .from('survey_responses')
    .select('*', { count: 'exact', head: true });

  const nextNumber = (count || 0) + 1;
  const responseCode = `ASM-${nextNumber.toString().padStart(4, '0')}`;

  const { data, error } = await supabase
    .from('survey_responses')
    .insert({
      response_code: responseCode,
      institution_id: payload.institution_id,
      nama_penilai: payload.nama_penilai,
      jabatan: payload.jabatan,
      provinsi: payload.provinsi,
      kabupaten_kota: payload.kabupaten_kota,
      kecamatan: payload.kecamatan,
      answers: payload.answers,
      overall_score: overall_score,
      obstacle: payload.obstacle || null,
      suggestion: payload.suggestion || null
    })
    .select()
    .single();

  if (error) {
    console.error('Submit Error:', error)
    throw new Error('Gagal menyimpan penilaian. Pastikan skema database sudah diperbarui.')
  }

  return { success: true, responseCode }
}
