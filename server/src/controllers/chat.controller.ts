import { Request, Response } from "express";
import { chatService } from "../services/chat.service.js";

export async function chatWithAI(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const { message, careerSlug } = req.body as { message?: string; careerSlug?: string };
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await chatService.chatWithAI({
      userId: user.id,
      message,
      careerSlug: careerSlug ?? null,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    // Map expected errors to the contract.
    const code = err?.code;
    if (code === "CAREER_NOT_FOUND") {
      return res.status(404).json({ error: "Career not found" });
    }

    console.error(err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}

