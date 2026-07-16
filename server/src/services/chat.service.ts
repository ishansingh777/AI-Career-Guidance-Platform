import prisma from "../lib/prisma.js";
import { getAIProvider } from "../lib/ai/index.js";
import type { CareerQuestionInput, CareerQuestionOutput, RecommendationContext } from "../lib/ai/provider.js";
import { RecommendationService } from "./recommendations/RecommendationService.js";

class ChatServiceError extends Error {
  public code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "ChatServiceError";
    this.code = code;
  }
}

function toUserContext(user: any) {
  return {
    id: user?.id,
    name: user?.name ?? null,
    email: user?.email ?? null,
  };
}

const recommendationService = new RecommendationService();

export class ChatService {
  async chatWithAI({
    userId,
    message,
    careerSlug,
  }: {
    userId: number | string;
    message: string;
    careerSlug: string | null;
  }): Promise<{
    reply: string;
    citations: any[];
    careerSlug: string | null;
    timestamp: string;
    usage: { promptTokens: number; completionTokens: number };
  }> {
    const startedAt = Date.now();

    // Latest completed assessment
    const assessment = await prisma.assessment.findFirst({
      where: { userId: userId as any, completed: true },
      orderBy: { createdAt: "desc" },
      include: { responses: true },
    });

    const freshRecommendations = assessment
      ? await recommendationService.getTopCareerMatches({ userId: String(userId) })
      : [];

    const latestRecommendations = freshRecommendations.length
      ? []
      : await prisma.recommendation.findMany({
          where: { userId: userId as any },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            score: true,
            reason: true,
            career: { select: { title: true, slug: true } },
          },
        });

    const baseRecommendations: RecommendationContext[] = freshRecommendations.length
      ? freshRecommendations.map((r) => ({
          title: r.title,
          slug: r.slug,
          score: r.score,
          reason: r.reason,
        }))
      : latestRecommendations
          .filter((r) => r.career)
          .map((r) => ({
            title: r.career.title,
            slug: r.career.slug,
            score: r.score,
            reason: r.reason ?? null,
          }));

    const recommendationSlugs = baseRecommendations.map((r) => r.slug);
    const recommendationCareers = recommendationSlugs.length
      ? await prisma.career.findMany({
          where: { slug: { in: recommendationSlugs } },
          select: {
            slug: true,
            description: true,
            dailyWork: true,
            requiredSkills: true,
            salaryIndiaMin: true,
            salaryIndiaMax: true,
            salaryGlobalMin: true,
            salaryGlobalMax: true,
            futureDemand: true,
            growthRate: true,
            automationRisk: true,
            roadmap: true,
            learningResources: true,
          },
        })
      : [];

    const recommendationCareerBySlug = new Map(recommendationCareers.map((career) => [career.slug, career]));
    const recommendations: RecommendationContext[] = baseRecommendations.map((recommendation) => ({
      ...recommendation,
      ...(recommendationCareerBySlug.get(recommendation.slug) ?? {}),
    }));

    const user = await prisma.user.findUnique({
      where: { id: userId as any },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      // Controller already checks auth; this should be extremely rare.
      throw new ChatServiceError("User not found", "USER_NOT_FOUND");
    }

    let selectedCareer:
      | ({ slug: string; title?: string | null } & Record<string, any>)
      | null = null;

    if (careerSlug) {
      const career = await prisma.career.findUnique({
        where: { slug: careerSlug },
        select: {
          slug: true,
          title: true,
          description: true,
          dailyWork: true,
          requiredSkills: true,
          roadmap: true,
          learningResources: true,
          futureDemand: true,
          growthRate: true,
          automationRisk: true,
          salaryIndiaMin: true,
          salaryIndiaMax: true,
          salaryGlobalMin: true,
          salaryGlobalMax: true,
        },
      });

      if (!career) {
        throw new ChatServiceError("Career not found", "CAREER_NOT_FOUND");
      }

      // Keep the contract compatible with SelectedCareerContext (slug/title),
      // while still providing richer fields for promptBuilder.
      selectedCareer = {
        slug: career.slug,
        title: career.title,
        description: career.description,
        dailyWork: career.dailyWork,
        requiredSkills: career.requiredSkills,
        roadmap: career.roadmap,
        learningResources: career.learningResources,
        futureDemand: career.futureDemand,
        growthRate: career.growthRate,
        automationRisk: career.automationRisk,
        salaryIndiaMin: career.salaryIndiaMin,
        salaryIndiaMax: career.salaryIndiaMax,
        salaryGlobalMin: career.salaryGlobalMin,
        salaryGlobalMax: career.salaryGlobalMax,
        recommendationReason: recommendations.find((r) => r.slug === career.slug)?.reason ?? null,
      };
    }

    const latestChat = await prisma.chat.findFirst({
      where: { userId: userId as any },
      orderBy: { updatedAt: "desc" },
      select: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { role: true, content: true, createdAt: true },
        },
      },
    });

    const conversationHistory = latestChat?.messages
      ? [...latestChat.messages]
          .reverse()
          .map((message) => ({
            role: String(message.role).toLowerCase(),
            content: message.content,
            createdAt: message.createdAt.toISOString(),
          }))
      : [];

    const provider = getAIProvider();

    const input: CareerQuestionInput = {
      user: toUserContext(user),
      latestAssessment: assessment
        ? {
            id: assessment.id,
            title: assessment.title,
            score: assessment.score,
            completedAt: assessment.updatedAt ? assessment.updatedAt.toISOString() : null,
            responses: (assessment.responses ?? []).map((r) => ({
              questionId: r.questionId,
              answer: r.answer,
              score: r.score,
            })),
          }
        : null,
      recommendations,
      selectedCareer,
      conversationHistory,
      question: message,
    };

    const t0 = Date.now();
    const aiOutput: CareerQuestionOutput = await provider.answerCareerQuestion(input);

    const latencyMs = Date.now() - t0;

    // Provider currently returns no usage token info.
    // Keep response shape stable for frontend.
    const result = {
      reply: aiOutput.answer,
      citations: [] as any[],
      careerSlug: selectedCareer?.slug ?? careerSlug,
      timestamp: new Date().toISOString(),
      usage: { promptTokens: 0, completionTokens: 0 },
    };

    // Logging without leaking prompts/keys.
    console.log("[chat]", {
      userId,
      careerSlug: careerSlug ?? null,
      latencyMs,
    });

    const totalLatencyMs = Date.now() - startedAt;
    console.log("[chat] total", { userId, careerSlug: careerSlug ?? null, totalLatencyMs });

    return result;
  }
}

export const chatService = new ChatService();

