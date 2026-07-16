export type Recommendation = {
  title: string;
  slug: string;
  score: number;
  reason: string;
  futureDemand: number;
  automationRisk: number;
  growthRate: number;
  salaryIndiaMin: number;
  salaryIndiaMax: number;
  requiredSkills: string[];
  image?: string | null;
};

