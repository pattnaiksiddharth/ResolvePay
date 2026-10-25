import { useCallback, useEffect, useState } from "react";
import { fetchHealth, HealthResponse } from "../lib/api";

export interface HealthState {
  data: HealthResponse | null;
  loading: boolean;
  error: string | null;
  latencyMs: number | null;
  lastChecked: Date | null;
}

/**
 * Custom hook to monitor backend health state with manual refresh capability
 */
export function useHealthCheck() {
  const [state, setState] = useState<HealthState>({
    data: null,
    loading: true,
    error: null,
    latencyMs: null,
    lastChecked: null,
  });

  const checkHealth = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data, latencyMs } = await fetchHealth();
      setState({
        data,
        loading: false,
        error: null,
        latencyMs,
        lastChecked: new Date(),
      });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to connect to backend",
        latencyMs: null,
        lastChecked: new Date(),
      });
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return { ...state, refresh: checkHealth };
}
