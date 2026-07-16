export type CareerDetailsResponse = {
  title: string;
  slug: string;
  category: string;
  description: string | null;
  dailyWork: string | null;

  futureDemand: number | null;
  automationRisk: number | null;
  growthRate: number | null;

  salaryIndiaMin: number | null;
  salaryIndiaMax: number | null;
  salaryGlobalMin: number | null;
  salaryGlobalMax: number | null;

  requiredSkills: string[];
  softSkills: string[];
  technicalSkills: string[];

  roadmap: Record<string, unknown>;
  resources: Record<string, unknown>;

  image: string | null;
  reason: Record<string, unknown> | null;

  relatedCareers: Array<{
    title: string;
    slug: string;
    image: string | null;
    futureDemand: number | null;
    growthRate: number | null;
  }>;
};

