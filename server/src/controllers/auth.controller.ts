import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const { user, token } = await authService.registerUser({ email, password, name });
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const { user, token } = await authService.loginUser({ email, password });
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function logout(req: Request, res: Response) {
  // Stateless logout: client should delete token. Return 204 No Content.
  // If you prefer server-side revocation, implement a RevokedToken table and store the token.
  return res.status(204).send();
}
