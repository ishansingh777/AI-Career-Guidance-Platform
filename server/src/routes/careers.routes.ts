import { Router } from "express";
import { getCareerBySlug, getAllCareers } from "../controllers/careers.controller.js";

const router = Router();

router.get("/", getAllCareers);
router.get("/:slug", getCareerBySlug);

export default router;

