import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import { syncMissingToSheet } from "./utils/sheetService";

dotenv.config();

const PORT = process.env.PORT || 5000;
const SYNC_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      // Run once on startup, then every hour — non-blocking
      syncMissingToSheet().catch((err) => console.error("[Sync] Startup sync failed:", err));
      setInterval(() => {
        syncMissingToSheet().catch((err) => console.error("[Sync] Periodic sync failed:", err));
      }, SYNC_INTERVAL_MS);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();