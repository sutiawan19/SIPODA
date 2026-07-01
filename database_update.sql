-- SCRIPT MIGRASI DATABASE (PENILAIAN RESTRUKTURISASI)
-- Jalankan script ini di menu "SQL Editor" pada Supabase Dashboard Anda.

-- 1. Hapus data lama karena struktur berubah drastis dan tidak relevan lagi
TRUNCATE TABLE survey_responses CASCADE;

-- 2. Tambahkan kolom baru ke tabel survey_responses
ALTER TABLE survey_responses
DROP COLUMN IF EXISTS institution_id,
DROP COLUMN IF EXISTS kecamatan,
ADD COLUMN nama text NOT NULL,
ADD COLUMN instansi text NOT NULL,
ADD COLUMN email text,
ADD COLUMN jabatan text NOT NULL,

-- Catatan: 
-- Tabel survey_answers dan survey_questions tidak lagi kita gunakan secara aktif
-- karena 10 pertanyaan SERVQUAL akan di-hardcode di dalam aplikasi.

-- ====================================================================================
-- 3. PERBARUI DATA INSTANSI
-- Hapus data instansi lama yang tidak relevan
TRUNCATE TABLE institutions CASCADE;

-- Masukkan data instansi pemerintahan (Dinas/Badan) yang baru
-- Silakan edit atau tambahkan nama instansi di bawah ini sesuai dengan kebutuhan Anda
INSERT INTO institutions (name, is_active) VALUES
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
