import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import assessmentsRoutes from "./routes/assessments.routes.js";
import recommendationsRoutes from "./routes/recommendations.routes.js";
import careersRoutes from "./routes/careers.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();




const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/assessments", assessmentsRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/careers", careersRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {


  res.send("Career AI Backend Running 🚀");
});

export default app;