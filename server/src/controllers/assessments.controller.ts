import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// Create a new assessment with responses. Expects body { title?, responses: [{ questionId, answer, score? }] }
export async function createAssessment(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const { title, responses } = req.body as { title?: string; responses: Array<{ questionId: number; answer: any; score?: number }> };
    if (!responses || !Array.isArray(responses) || responses.length === 0) return res.status(400).json({ error: "Responses are required" });

    // Ensure referenced questions exist; if not, create placeholder questions.
    const processedResponses: Array<{ questionId: number; answer: any; score?: number }> = [];
    for (const r of responses) {
      let qId = r.questionId;
      if (typeof qId === "number") {
        const existing = await prisma.question.findUnique({ where: { id: qId } });
        if (!existing) {
          const createdQ = await prisma.question.create({ data: { text: `Imported question ${qId}`, type: "OPEN_ENDED" } });
          qId = createdQ.id;
        }
      } else {
        const createdQ = await prisma.question.create({ data: { text: `Imported question`, type: "OPEN_ENDED" } });
        qId = createdQ.id;
      }
      processedResponses.push({ questionId: qId, answer: r.answer, score: r.score });
    }

    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        title,
        completed: true,
        responses: {
          create: processedResponses.map((r) => ({ questionId: r.questionId, answer: r.answer, score: r.score })),
        },
      },
      include: { responses: true },
    });

    return res.status(201).json({ assessment });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
