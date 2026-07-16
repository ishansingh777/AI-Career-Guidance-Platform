import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { chatWithAI } from "../controllers/chat.controller.js";

const router = Router();

router.post("/", requireAuth, chatWithAI);

export default router;

