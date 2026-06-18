export const ADMIN_TREND_DATA = [
  { name: '1 Jun', responses: 45, satisfaction: 4.1 },
  { name: '5 Jun', responses: 52, satisfaction: 4.2 },
  { name: '10 Jun', responses: 38, satisfaction: 4.0 },
  { name: '15 Jun', responses: 65, satisfaction: 4.4 },
  { name: '20 Jun', responses: 48, satisfaction: 4.3 },
  { name: '25 Jun', responses: 59, satisfaction: 4.5 },
  { name: '30 Jun', responses: 72, satisfaction: 4.6 },
];

export interface DetailedResponse {
  id: string;
  date: string;
  inst: string;
  score: number;
  sentiment: string;
  scores: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  kendala: string;
  saran: string;
  adminNote?: string;
}

export const ADMIN_ALL_RESPONSES: DetailedResponse[] = [
  { 
    id: 'R-8923', date: '2026-06-18', inst: 'Disdukcapil', score: 4.8, sentiment: 'Sangat Puas',
    scores: { q1: 5, q2: 4, q3: 5, q4: 5, q5: 5 },
    kendala: '',
    saran: 'Pelayanan sudah sangat baik, pertahankan!'
  },
  { 
    id: 'R-8922', date: '2026-06-18', inst: 'RSUD', score: 2.2, sentiment: 'Tidak Puas',
    scores: { q1: 3, q2: 2, q3: 2, q4: 2, q5: 2 },
    kendala: 'Antrean terlalu panjang, saya menunggu 3 jam untuk dipanggil.',
    saran: 'Mohon sistem antrean diperbaiki.'
  },
  { 
    id: 'R-8921', date: '2026-06-17', inst: 'Dinas Sosial', score: 4.0, sentiment: 'Puas',
    scores: { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4 },
    kendala: 'Informasi awal agak membingungkan.',
    saran: 'Buat poster panduan di pintu masuk.'
  },
  { 
    id: 'R-8920', date: '2026-06-17', inst: 'Disdukcapil', score: 5.0, sentiment: 'Sangat Puas',
    scores: { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 },
    kendala: '',
    saran: ''
  },
  { 
    id: 'R-8919', date: '2026-06-16', inst: 'Bapenda', score: 3.8, sentiment: 'Puas',
    scores: { q1: 4, q2: 3, q3: 4, q4: 4, q5: 4 },
    kendala: 'AC ruang tunggu kurang dingin.',
    saran: 'Tolong perbaiki AC nya.'
  },
  { 
    id: 'R-8918', date: '2026-06-16', inst: 'Disdukcapil', score: 1.2, sentiment: 'Sangat Tidak Puas',
    scores: { q1: 1, q2: 1, q3: 2, q4: 1, q5: 1 },
    kendala: 'Petugas tidak ramah, proses sangat berbelit.',
    saran: 'Harus ada evaluasi menyeluruh.'
  },
  { 
    id: 'R-8917', date: '2026-06-15', inst: 'RSUD', score: 4.2, sentiment: 'Puas',
    scores: { q1: 4, q2: 4, q3: 4, q4: 5, q5: 4 },
    kendala: '',
    saran: ''
  },
  { 
    id: 'R-8916', date: '2026-06-15', inst: 'Dinas Pendidikan', score: 3.2, sentiment: 'Cukup Puas',
    scores: { q1: 3, q2: 3, q3: 4, q4: 3, q5: 3 },
    kendala: 'Syarat dokumen terlalu banyak fotokopi.',
    saran: 'Bisakah beralih ke digital?'
  },
  { 
    id: 'R-8915', date: '2026-06-14', inst: 'Dinas Kesehatan', score: 4.9, sentiment: 'Sangat Puas',
    scores: { q1: 5, q2: 5, q3: 5, q4: 5, q5: 4.5 },
    kendala: '',
    saran: 'Mantap.'
  },
  { 
    id: 'R-8914', date: '2026-06-14', inst: 'Disdukcapil', score: 2.8, sentiment: 'Cukup Puas',
    scores: { q1: 3, q2: 2, q3: 3, q4: 3, q5: 3 },
    kendala: 'Prosesnya lambat.',
    saran: 'Perbanyak loket pelayanan.'
  },
];

const EXTRA_RESPONSES: DetailedResponse[] = Array.from({ length: 45 }).map((_, i) => {
  const isSatisfied = Math.random() > 0.3;
  const score = isSatisfied ? 3.5 + Math.random() * 1.5 : 1 + Math.random() * 2;
  let sentiment = 'Puas';
  if (score >= 4.5) sentiment = 'Sangat Puas';
  else if (score >= 3.5) sentiment = 'Puas';
  else if (score >= 2.5) sentiment = 'Cukup Puas';
  else if (score >= 1.5) sentiment = 'Tidak Puas';
  else sentiment = 'Sangat Tidak Puas';

  return {
    id: `R-${8913 - i}`,
    date: `2026-06-${Math.floor(1 + Math.random() * 18).toString().padStart(2, '0')}`,
    inst: ['Disdukcapil', 'RSUD', 'Dinas Sosial', 'Dinas Pendidikan', 'Dinas Kesehatan', 'Bapenda'][Math.floor(Math.random() * 6)],
    score: score,
    sentiment: sentiment,
    scores: { q1: score, q2: score, q3: score, q4: score, q5: score },
    kendala: isSatisfied ? '' : 'Pelayanan agak lambat hari ini.',
    saran: isSatisfied ? 'Pertahankan!' : 'Tolong dipercepat.'
  };
});

export const ADMIN_ALL_RESPONSES_EXTENDED = [...ADMIN_ALL_RESPONSES, ...EXTRA_RESPONSES];
export const ADMIN_RECENT_SUBMISSIONS = ADMIN_ALL_RESPONSES_EXTENDED.slice(0, 5);
