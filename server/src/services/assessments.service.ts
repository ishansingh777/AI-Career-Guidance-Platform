import prisma from "../lib/prisma.js";

export async function saveAssessment(userId: number, title: string | undefined, responses: Array<{ questionId: number; answer: any; score?: number }>) {
  return prisma.assessment.create({
    data: {
      userId,
      title,
      completed: true,
      responses: {
        create: responses.map((r) => ({ questionId: r.questionId, answer: r.answer, score: r.score })),
      },
    },
    include: { responses: true },
  });
}
