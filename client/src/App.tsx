import React from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { useHealthCheck } from "./hooks/useHealthCheck";

export const App: React.FC = () => {
  const health = useHealthCheck();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation header */}
      <Navbar isHealthy={health.data?.status === "ok"} isLoading={health.loading} />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <HomePage />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} ResolvePay &bull; Synthetic Demo Portfolio Project &bull; No Real Financial Data</p>
      </footer>
    </div>
  );
};

export default App;
