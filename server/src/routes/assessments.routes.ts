import { Router } from "express";
import { createAssessment } from "../controllers/assessments.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createAssessment);

export default router;
