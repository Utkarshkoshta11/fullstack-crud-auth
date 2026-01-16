import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

/**
 * PRIMARY PROCESS
 * Only responsible for forking workers
 */
if (isProduction && cluster.isPrimary) {
  const cpuCount = os.cpus().length;

  console.log(`Primary process ${process.pid} is running`);
  console.log(`Forking ${cpuCount} worker processes...`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Worker ${worker.process.pid} exited (code: ${code}, signal: ${signal}). Restarting...`
    );
    cluster.fork();
  });
} else {
  /**
   * WORKER PROCESS
   * Each worker runs its own Express server
   */
  (async () => {
    try {
      await connectDB();

      app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started server on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  })();
}
