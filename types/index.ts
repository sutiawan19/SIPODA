export interface Institution {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  rating: number;
  totalResponses: number;
  satisfactionRate: number;
}

export interface SurveyQuestion {
  id: string;
  label: string;
  description: string;
  emoji?: string;
  type?: string;
}

export interface SurveyRating {
  questionId: string;
  score: number;
}

export interface SurveySubmission {
  institutionId: string;
  ratings: SurveyRating[];
  recommendation: boolean | null;
  suggestion: string;
  submittedAt: string;
}

export interface SurveyResult {
  institutionId: string;
  institutionName: string;
  averageRating: number;
  satisfactionRate: number;
  totalResponses: number;
  distribution: { score: number; count: number }[];
  positiveCount: number;
  negativeCount: number;
}
