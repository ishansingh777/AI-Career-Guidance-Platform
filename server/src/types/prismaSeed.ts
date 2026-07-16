export type CareerSeed = {
  slug: string;
  title: string;
  category: string;
  description: string;
  dailyWork: string;
  requiredSkills: string[];
  preferredInterests: string[];
  requiredSubjects: string[];
  personalityTraits: string[];
  salaryIndiaMin: number;
  salaryIndiaMax: number;
  salaryGlobalMin?: number;
  salaryGlobalMax?: number;
  futureDemand: number; // 1-10
  automationRisk: number; // 1-10
  growthRate: number; // %
  roadmap: any;
  learningResources: any;
  certifications: string[];
  projectIdeas: string[];
  companiesHiring: string[];
  image?: string | null;
};

