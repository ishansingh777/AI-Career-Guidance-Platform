import prisma from "../lib/prisma.js";

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

function safeJsonToObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return {};
}

export async function getCareerDetails({ slug }: { slug: string }):
  Promise<CareerDetailsResponse | null> {
  // 1) Fetch career by slug
  const career = await prisma.career.findUnique({
    where: { slug },
  });

  if (!career) return null;

  // 2) Fetch related careers (4-6) from same category, excluding current
  const relatedCareersRaw = await prisma.career.findMany({
    where: {
      category: career.category,
      slug: { not: career.slug },
    },
    select: {
      title: true,
      slug: true,
      image: true,
      futureDemand: true,
      growthRate: true,
    },
    take: 6,
  });

  // 3) Map Prisma fields to the frontend response shape
  // Note: Prisma Career does NOT define softSkills/technicalSkills columns.
  // Return [] as required.
  const roadmap = safeJsonToObject(career.roadmap);
  const resources = safeJsonToObject(career.learningResources);

  // profile is Json? in Prisma; map to `reason`
  const reason = career.profile && typeof career.profile === "object" ? (career.profile as any) : null;

  // Some Prisma numeric fields are nullable (Int?). Keep nulls.
  const response: CareerDetailsResponse = {
    title: career.title,
    slug: career.slug,
    category: career.category,
    description: career.description ?? null,
    dailyWork: career.dailyWork ?? null,
    futureDemand: career.futureDemand ?? null,
    automationRisk: career.automationRisk ?? null,
    growthRate: career.growthRate ?? null,

    salaryIndiaMin: career.salaryIndiaMin ?? null,
    salaryIndiaMax: career.salaryIndiaMax ?? null,
    salaryGlobalMin: career.salaryGlobalMin ?? null,
    salaryGlobalMax: career.salaryGlobalMax ?? null,

    requiredSkills: career.requiredSkills ?? [],
    softSkills: [],
    technicalSkills: [],

    roadmap,
    resources,

    image: career.image ?? null,

    reason,
    relatedCareers: relatedCareersRaw.slice(0, 6).map((c) => ({
      title: c.title,
      slug: c.slug,
      image: c.image ?? null,
      futureDemand: c.futureDemand ?? null,
      growthRate: c.growthRate ?? null,
    })),
  };

  return response;
}

