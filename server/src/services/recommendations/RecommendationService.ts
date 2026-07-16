import prisma from "../../lib/prisma.js";
import { buildRecommendationWeights } from "./weights.js";


import { scoreCareersForAssessment } from "./scoring/scoreCareersForAssessment.js";

export type TopCareerMatch = {
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

export class RecommendationService {
  async getTopCareerMatches({ userId }: { userId: string }): Promise<TopCareerMatch[]> {
    // Load latest completed assessment
    const assessment = await prisma.assessment.findFirst({
      where: { userId: userId as any, completed: true },
      orderBy: { createdAt: "desc" },
      include: { responses: true },
    });



    if (!assessment) return [];

    // Load careers
    // Current Prisma schema does not yet include recommendation-ready career fields
    // (futureDemand, automationRisk, etc.). Fetch only what exists for now.
    const careers = await prisma.career.findMany({
      select: {
        slug: true,
        title: true,
        description: true,
        dailyWork: true,
        category: true,
        image: true,
        futureDemand: true,
        automationRisk: true,
        growthRate: true,
        salaryIndiaMin: true,
        salaryIndiaMax: true,
        requiredSkills: true,
        personalityTraits: true,
        preferredInterests: true,
      },
    });





    const weights = buildRecommendationWeights();
    const results = scoreCareersForAssessment({ assessment: assessment as any, careers: careers as any, weights });


    return results;
  }
}

