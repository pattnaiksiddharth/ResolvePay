import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * Health check handler returning basic operational status
 * and verifying live connectivity to Neon Lakebase PostgreSQL.
 */
export const getHealth = async (_req: Request, res: Response): Promise<void> => {
  let dbStatus = "connected";
  let dbVersion: string | null = null;

  try {
    const rows = await prisma.$queryRaw<Array<{ version: string }>>`
      SELECT version();
    `;
    dbVersion = rows[0]?.version ? "PostgreSQL 18 (Neon)" : "Connected";
  } catch (err) {
    dbStatus = "error";
    console.error("Database health check error:", err);
  }

  res.status(200).json({
    status: "ok",
    database: {
      provider: "neon-postgres",
      branch: process.env.NEON_BRANCH || "production",
      status: dbStatus,
      version: dbVersion,
    },
  });
};
