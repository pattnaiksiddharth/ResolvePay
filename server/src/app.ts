import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import apiRouter from "./routes";

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration - only allow requests from configured client
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json());

// API routes mounted under /api
app.use("/api", apiRouter);

// Root health check fallback
app.use("/health", apiRouter);

// Fallback 404 handler for unmapped endpoints
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      status: 404,
    },
  });
});

// Global error handler
app.use(errorHandler);

export default app;
