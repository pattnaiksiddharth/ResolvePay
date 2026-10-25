import { Router } from "express";
import healthRoutes from "./health.routes";

const apiRouter = Router();

// Mount health routes under /health so GET /api/health is handled cleanly
apiRouter.use("/health", healthRoutes);
apiRouter.use(healthRoutes);

export default apiRouter;
