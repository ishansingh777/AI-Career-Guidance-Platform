import { Request, Response } from "express";

export async function getMe(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  return res.json({ user });
}
