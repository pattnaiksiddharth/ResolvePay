import React from "react";
import { ShieldCheck, Database, Server } from "lucide-react";

interface NavbarProps {
  isHealthy: boolean;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isHealthy, isLoading }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-glow">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">ResolvePay</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Synthetic Demo
              </span>
            </div>
            <p className="text-xs text-slate-400">Financial Dispute Management</p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300">Backend API:</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLoading
                    ? "bg-amber-400 animate-pulse"
                    : isHealthy
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"
                }`}
              />
              <span
                className={
                  isLoading
                    ? "text-amber-400"
                    : isHealthy
                    ? "text-emerald-400"
                    : "text-rose-400"
                }
              >
                {isLoading ? "Checking..." : isHealthy ? "Online" : "Offline"}
              </span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 px-2.5 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Port 5000 &bull; Proxy /api</span>
          </div>
        </div>
      </div>
    </header>
  );
};
