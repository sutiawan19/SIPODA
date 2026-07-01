-- ==========================================
-- SCRIPT INISIALISASI DATABASE SUPABASE BARU
-- ==========================================
-- Jalankan seluruh script ini di menu "SQL Editor" pada Supabase Dashboard Anda.

-- Aktifkan ekstensi untuk UUID (jika belum aktif)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Buat tabel institutions
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 2. Buat tabel survey_questions 
-- (Tabel ini ada di tipe data aplikasi, meskipun mungkin tidak digunakan aktif)
CREATE TABLE IF NOT EXISTS public.survey_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    label TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 3. Buat tabel survey_responses
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_code TEXT NOT NULL,
    nama TEXT NOT NULL,
    instansi TEXT NOT NULL,
    jabatan TEXT NOT NULL,
    email TEXT,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    overall_score NUMERIC NOT NULL DEFAULT 0,
    obstacle TEXT,
    suggestion TEXT
);

-- 4. Buat tabel survey_answers 
-- (Tabel ini ada di tipe data aplikasi, meskipun mungkin tidak digunakan aktif)
CREATE TABLE IF NOT EXISTS public.survey_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_id UUID NOT NULL REFERENCES public.survey_responses(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    score INTEGER NOT NULL
);

-- ====================================================================================
-- 5. MASUKKAN DATA AWAL INSTANSI
-- ====================================================================================
INSERT INTO public.institutions (name, is_active) VALUES
  ('Sekretariat Daerah', true),
  ('Inspektorat Daerah', true),
  ('Dinas Pendidikan', true),
  ('Dinas Kesehatan', true),
  ('Dinas Pekerjaan Umum dan Penataan Ruang', true),
  ('Dinas Sosial', true),
  ('Dinas Kependudukan dan Pencatatan Sipil', true),
  ('Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu', true),
  ('Dinas Perhubungan', true),
  ('Dinas Komunikasi dan Informatika', true),
  ('Badan Kepegawaian dan Pengembangan Sumber Daya Manusia', true),
  ('Badan Perencanaan Pembangunan Daerah', true),
  ('Badan Pendapatan Daerah', true),
  ('Badan Penanggulangan Bencana Daerah', true),
  ('Satuan Polisi Pamong Praja', true);
