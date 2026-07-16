import { Request, Response } from "express";
import { RecommendationService } from "../services/recommendations/RecommendationService.js";

const recommendationService = new RecommendationService();

export async function getRecommendations(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const results = await recommendationService.getTopCareerMatches({ userId: user.id });
    return res.json({ recommendations: results });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}

