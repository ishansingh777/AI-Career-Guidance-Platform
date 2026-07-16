import { Request, Response } from "express";
import { getCareerDetails } from "../services/careers.service.js";

export async function getCareerBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ error: "Slug is required" });

    const result = await getCareerDetails({ slug });

    if (!result) {
      return res.status(404).json({ error: "Career not found" });
    }

    return res.status(200).json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}

