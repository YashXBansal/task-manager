import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { notFound, serverError } from "./utils/apiResponse";

import authRoutes from "./modules/auth/auth.routes";
import projectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";
import userRoutes from "./modules/users/user.routes";

const app: Express = express();

// Security & Utility Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health Check for Railway
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Catch 404
app.use((req, res) => {
  notFound(res, `Route ${req.originalUrl} not found`);
});

// Global Error Handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("❌ Global Error:", err);
    serverError(res, err.message || "An unexpected error occurred");
  },
);

export default app;
