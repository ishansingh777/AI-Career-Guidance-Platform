import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service.js";
import prisma from "../lib/prisma.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing authorization header" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "Invalid authorization format" });

  const payload = verifyToken(parts[1]);
  if (!payload) return res.status(401).json({ error: "Invalid or expired token" });

  // fetch user without password
  console.log("===== AUTH DEBUG =====");
  console.log("Decoded JWT:", payload);
  console.log("userId:", payload?.userId);
  console.log("typeof userId:", typeof payload?.userId);
  console.log("Prisma query where.id:", payload?.userId);


  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true, avatarUrl: true, bio: true, createdAt: true, updatedAt: true },
  });
  if (!user) return res.status(401).json({ error: "User not found" });

  // attach full user (safe fields) to request
  (req as any).user = user;
  next();
}
