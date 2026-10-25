import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

const router = Router();

// Handle root and /health paths
router.get("/", getHealth);
router.get("/health", getHealth);

export default router;
