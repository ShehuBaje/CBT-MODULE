import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import { sendSuccessResponse } from "./utils/successResponse.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { seedAdmin } from "./seedAdmin.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);

app.get("/", async (req, res) => {
  try {
    const dbVersion = await prisma.$queryRaw`SELECT version();`;
    sendSuccessResponse(res, "CBT Module API running successfully", { db: dbVersion });
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(500).json({ success: false, message: "DB connection failed" });
  }
});

app.use(notFound);
app.use(errorHandler);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const startServer = async () => {
  try {
    await seedAdmin();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Error starting server:", err.message);
  }
};

startServer();
