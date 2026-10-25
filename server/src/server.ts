import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`🚀 ResolvePay Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.log(`📡 Health check available at: http://localhost:${env.PORT}/api/health`);
  console.log(`📡 Local IP fallback: http://127.0.0.1:${env.PORT}/api/health`);
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
