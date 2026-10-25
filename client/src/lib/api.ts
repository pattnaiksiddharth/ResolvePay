/**
 * Client API utilities
 * All /api requests are proxied via Vite dev server to Express at http://localhost:5000
 */

export interface HealthResponse {
  status: "ok" | string;
  database?: {
    provider: string;
    branch: string;
    status: string;
    version: string | null;
  };
}

/**
 * Calls the backend health check endpoint
 */
export async function fetchHealth(): Promise<{ data: HealthResponse; latencyMs: number }> {
  const startTime = performance.now();
  
  // Uses relative /api/health path; Vite proxy forwards to backend
  const response = await fetch("/api/health", {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  const latencyMs = Math.round(performance.now() - startTime);

  if (!response.ok) {
    throw new Error(`Health check failed with HTTP ${response.status}: ${response.statusText}`);
  }

  const data: HealthResponse = await response.json();
  return { data, latencyMs };
}
