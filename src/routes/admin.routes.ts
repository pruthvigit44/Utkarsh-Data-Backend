import { Router } from "express";
import {
  getAdminStats,
  getRecentEntries,
  syncSheets,
  forceResyncSheets,
  getDikriAdminStats,
  getDikriRecentEntries,
  getCombinedStats,
} from "../controllers/admin.controller";

const router = Router();

router.get("/stats", getAdminStats);
router.get("/recent", getRecentEntries);
router.post("/sync-sheets", syncSheets);
router.post("/force-resync", forceResyncSheets);

router.get("/dikri-stats", getDikriAdminStats);
router.get("/dikri-recent", getDikriRecentEntries);
router.get("/combined-stats", getCombinedStats);

export default router;
