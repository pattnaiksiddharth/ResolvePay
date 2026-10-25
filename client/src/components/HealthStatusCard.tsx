import React from "react";
import { Activity, CheckCircle2, AlertCircle, RefreshCw, Cpu } from "lucide-react";
import { HealthState } from "../hooks/useHealthCheck";

interface HealthStatusCardProps {
  health: HealthState & { refresh: () => void };
}

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ health }) => {
  const isOk = health.data?.status === "ok";

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-brand-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">System Health Monitor</h2>
          </div>
          <p className="text-sm text-slate-400">
            Real-time verification of Express backend and Vite proxy gateway
          </p>
        </div>

        <button
          onClick={health.refresh}
          disabled={health.loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all shadow-glow hover:shadow-brand-500/30 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${health.loading ? "animate-spin" : ""}`} />
          <span>{health.loading ? "Pinging..." : "Refresh Status"}</span>
        </button>
      </div>

      {/* Main Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Connection State */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
            Connection State
          </span>
          <div className="flex items-center gap-3">
            {health.loading ? (
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
            ) : isOk ? (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-white">
                {health.loading ? "Verifying..." : isOk ? "Connected & Healthy" : "Connection Error"}
              </p>
              <p className="text-xs text-slate-400">
                {isOk ? "Status code 200 OK" : "Server not responding"}
              </p>
            </div>
          </div>
        </div>

        {/* Latency */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
            Round-Trip Latency
          </span>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                {health.latencyMs !== null ? `${health.latencyMs} ms` : "—"}
              </p>
              <p className="text-xs text-slate-400">Proxy overhead included</p>
            </div>
          </div>
        </div>

        {/* Last Verified */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
            Last Checked
          </span>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                {health.lastChecked
                  ? health.lastChecked.toLocaleTimeString()
                  : "Never"}
              </p>
              <p className="text-xs text-slate-400">Auto-polled on load</p>
            </div>
          </div>
        </div>
      </div>

      {/* Neon Database Live Banner */}
      {health.data?.database && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-semibold text-white">Neon PostgreSQL:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
              {health.data.database.version || "Connected"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Branch:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono font-medium">
              {health.data.database.branch}
            </span>
          </div>
        </div>
      )}

      {/* Response Payload & Details */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[11px]">
              GET
            </span>
            <span className="text-slate-300">/api/health</span>
            <span className="text-slate-500">&rarr;</span>
            <span className="text-indigo-400">http://localhost:5000/api/health</span>
          </div>
          <span className="text-slate-500">JSON</span>
        </div>

        {health.error ? (
          <div className="text-rose-400 py-1">
            <p className="font-semibold mb-1">❌ Request Failed:</p>
            <p>{health.error}</p>
            <p className="text-slate-400 mt-2 text-[11px] font-sans">
              💡 Tip: Make sure your server is running on port 5000 (<code className="text-indigo-300">cd server &amp;&amp; npm run dev</code>).
            </p>
          </div>
        ) : (
          <pre className="text-emerald-400 overflow-x-auto py-1">
            {JSON.stringify(health.data || { status: "checking..." }, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
