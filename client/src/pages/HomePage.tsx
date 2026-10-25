import React from "react";
import { Shield, Layers, Sparkles, Database } from "lucide-react";
import { HealthStatusCard } from "../components/HealthStatusCard";
import { useHealthCheck } from "../hooks/useHealthCheck";

export const HomePage: React.FC = () => {
  const health = useHealthCheck();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Stack Portfolio Project</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          ResolvePay{" "}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Complaint Portal
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          An enterprise-grade financial dispute and resolution management platform built with strict
          server-side authorization and synthetic demo data.
        </p>
      </section>

      {/* Live Health Status Monitor */}
      <section className="max-w-4xl mx-auto">
        <HealthStatusCard health={health} />
      </section>

      {/* Architecture Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 text-brand-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Separated Concerns</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Clean architectural boundaries separating UI components, routes, business logic services,
            and Prisma repositories.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Server-Side Enforced</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            All permission checks, SLAs, and Zod schema validations are strictly executed on the Node.js
            server before storage.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">100% Synthetic Data</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Safe demo profiles, synthetic transactions, complaint audits, and SLA timelines generated
            cleanly with Prisma seeders.
          </p>
        </div>
      </section>

      {/* Tech Stack Chips */}
      <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 max-w-4xl mx-auto text-center">
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">
          Core Technologies Powering ResolvePay
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-slate-300">
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">React 18</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">TypeScript</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">Tailwind CSS</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">Vite Proxy</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">Node.js Express</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">Prisma ORM</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">Zod Validation</span>
        </div>
      </section>
    </div>
  );
};
