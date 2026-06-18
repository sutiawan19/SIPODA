'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteResponse(responseId: string) {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Delete answers first to avoid foreign key constraints (if cascade delete is not set in DB)
  const { error: answersError } = await supabase
    .from('survey_answers')
    .delete()
    .eq('response_id', responseId)

  if (answersError) {
    console.error('Error deleting answers:', answersError)
    throw new Error('Gagal menghapus detail jawaban.')
  }

  // Delete response
  const { error: responseError } = await supabase
    .from('survey_responses')
    .delete()
    .eq('id', responseId)

  if (responseError) {
    console.error('Error deleting response:', responseError)
    throw new Error('Gagal menghapus penilaian.')
  }

  revalidatePath('/admin/responses')
  revalidatePath('/admin/dashboard')
  
  return { success: true }
}
