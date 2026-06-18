'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
    if (error.message.toLowerCase().includes("invalid login")) {
      errorMessage = "Email atau kata sandi yang Anda masukkan salah.";
    } else if (error.message.toLowerCase().includes("rate limit")) {
      errorMessage = "Terlalu banyak percobaan. Silakan tunggu beberapa saat lagi.";
    }
    return { error: errorMessage }
  }

  revalidatePath('/admin/dashboard', 'layout')
  redirect('/admin/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
