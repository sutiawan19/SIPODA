import { SurveyQuestion } from "@/types";

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "q1_persyaratan",
    label: "Kemudahan Persyaratan Pelayanan",
    description: "Seberapa puas Anda dengan kemudahan persyaratan yang diperlukan untuk mendapatkan pelayanan?",
    type: "rating"
  },
  {
    id: "q2_waktu",
    label: "Kecepatan Waktu Pelayanan",
    description: "Seberapa puas Anda dengan kecepatan waktu pelayanan yang diberikan?",
    type: "rating"
  },
  {
    id: "q3_biaya",
    label: "Biaya Pelayanan",
    description: "Seberapa puas Anda dengan biaya pelayanan yang ditetapkan?",
    type: "rating"
  },
  {
    id: "q4_kompetensi",
    label: "Kompetensi Petugas Pelayanan",
    description: "Seberapa puas Anda dengan kemampuan petugas dalam memberikan pelayanan?",
    type: "rating"
  },
  {
    id: "q5_fasilitas",
    label: "Fasilitas Pelayanan",
    description: "Seberapa puas Anda dengan fasilitas yang tersedia selama proses pelayanan?",
    type: "rating"
  }
];
