  export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

  export interface Database {
    public: {
      Tables: {
        institutions: {
          Row: {
            id: string
            created_at: string
            name: string
            description: string | null
            category: string | null
            address: string | null
            is_active: boolean
          }
          Insert: {
            id?: string
            created_at?: string
            name: string
            description?: string | null
            category?: string | null
            address?: string | null
            is_active?: boolean
          }
          Update: {
            id?: string
            created_at?: string
            name?: string
            description?: string | null
            category?: string | null
            address?: string | null
            is_active?: boolean
          }
        }
        survey_questions: {
          Row: {
            id: string
            created_at: string
            label: string
            description: string | null
            sort_order: number
            is_active: boolean
          }
          Insert: {
            id?: string
            created_at?: string
            label: string
            description?: string | null
            sort_order?: number
            is_active?: boolean
          }
          Update: {
            id?: string
          created_at?: string
          label?: string
          description?: string | null
          sort_order?: number
          is_active?: boolean
        }
      }
      survey_responses: {
        Row: {
          id: string
          created_at: string
          response_code: string
          nama: string
          instansi: string
          jabatan: string
          email: string | null
          answers: Json
          overall_score: number
          obstacle: string | null
          suggestion: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          response_code: string
          nama: string
          instansi: string
          jabatan: string
          email?: string | null
          answers: Json
          overall_score: number
          obstacle?: string | null
          suggestion?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          response_code?: string
          nama?: string
          instansi?: string
          jabatan?: string
          email?: string | null
          answers?: Json
          overall_score?: number
          obstacle?: string | null
          suggestion?: string | null
        }
      }
      survey_answers: {
        Row: {
          id: string
          created_at: string
          response_id: string
          question_id: string
          score: number
        }
        Insert: {
          id?: string
          created_at?: string
          response_id: string
          question_id: string
          score: number
        }
        Update: {
          id?: string
          created_at?: string
          response_id?: string
          question_id?: string
          score?: number
        }
      }
    }
  }
}
