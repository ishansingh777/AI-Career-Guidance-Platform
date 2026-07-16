import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Career AI Backend is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

export default router;