import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getRecommendations } from "../controllers/recommendations.controller.js";

const router = Router();

router.get("/", requireAuth, getRecommendations);

export default router;

