import { Router } from "express";
import { getCareerBySlug } from "../controllers/careers.controller.js";

const router = Router();

router.get("/:slug", getCareerBySlug);

export default router;

