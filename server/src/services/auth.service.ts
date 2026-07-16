import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const SALT_ROUNDS = 10;

export async function registerUser({ email, password, name }: { email: string; password: string; name?: string }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: string; iat: number; exp: number };
  } catch (err) {
    return null;
  }
}
