import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Melakukan query sederhana ke tabel untuk menjaga koneksi database tetap aktif
    // Limit 1 agar tidak memakan resource yang besar
    const { data, error } = await supabase
      .from('responses')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Keep-alive ping failed:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase pinged successfully',
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    console.error('Keep-alive ping error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
