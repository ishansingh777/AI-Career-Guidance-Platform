export type AINormalizedError = {
  message: string;
  code?: string;
};

export type UserContext = {
  id: number | string;
  name?: string | null;
  email?: string | null;
};

export type LatestAssessmentContext = {
  id: number | string;
  title?: string | null;
  score?: number | null;
  completedAt?: string | null;
  responses?: Array<{ questionId: number; answer: unknown; score?: number | null }>;
};

export type RecommendationContext = {
  title: string;
  slug: string;
  score: number;
  reason?: string | null;
  description?: string | null;
  dailyWork?: string | null;
  requiredSkills?: string[];
  salaryIndiaMin?: number | null;
  salaryIndiaMax?: number | null;
  salaryGlobalMin?: number | null;
  salaryGlobalMax?: number | null;
  futureDemand?: number | null;
  growthRate?: number | null;
  automationRisk?: number | null;
  roadmap?: unknown;
  learningResources?: unknown;
};

export type SelectedCareerContext = {
  slug: string;
  title?: string | null;
  description?: string | null;
  dailyWork?: string | null;
  requiredSkills?: string[];
  salaryIndiaMin?: number | null;
  salaryIndiaMax?: number | null;
  salaryGlobalMin?: number | null;
  salaryGlobalMax?: number | null;
  futureDemand?: number | null;
  growthRate?: number | null;
  automationRisk?: number | null;
  roadmap?: unknown;
  learningResources?: unknown;
  recommendationReason?: string | null;
};

export type ConversationMessageContext = {
  role: string;
  content: string;
  createdAt?: string | null;
};

export type CareerAdviceInput = {
  user: UserContext;
  latestAssessment: LatestAssessmentContext | null;
  recommendations: RecommendationContext[];
  selectedCareer: SelectedCareerContext | null;
};

export type CareerAdviceOutput = {
  careerAdvice: string;
  keySkills: string[];
  nextSteps: Array<{ week: string; actions: string[] }>;
  risksAndMitigations?: string[];
};

export type RoadmapInput = CareerAdviceInput;

export type RoadmapOutput = {
  roadmap: Array<{ phase: string; duration: string; goals: string[] }>;
};

export type CareerQuestionInput = {
  user: UserContext;
  latestAssessment: LatestAssessmentContext | null;
  recommendations: RecommendationContext[];
  selectedCareer: SelectedCareerContext | null;
  conversationHistory?: ConversationMessageContext[];
  question: string;
};

export type CareerQuestionOutput = {
  answer: string;
  followUpQuestions?: string[];
};

export interface AIProvider {
  generateCareerAdvice(input: CareerAdviceInput): Promise<CareerAdviceOutput>;
  generateRoadmap(input: RoadmapInput): Promise<RoadmapOutput>;
  answerCareerQuestion(input: CareerQuestionInput): Promise<CareerQuestionOutput>;
}

