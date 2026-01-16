import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  console.log(`Primary ${process.pid} running`);
  console.log(`Forking ${cpuCount} workers`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  (async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (PID: ${process.pid})`);
    });
  })();
}
