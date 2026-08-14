import api from "./axios";

export type Career = {
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
  salaryGlobalMin: number | null;
  salaryGlobalMax: number | null;
  futureDemand: number;
  automationRisk: number;
  growthRate: number;
  image: string | null;
  // include other fields as needed
};

export async function getCareers(): Promise<Career[]> {
  const res = await api.get("/careers");
  return res.data;
}

export async function getCareerBySlug(slug: string): Promise<Career> {
  const res = await api.get(`/careers/${slug}`);
  return res.data;
}
