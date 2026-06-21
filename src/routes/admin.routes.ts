import { Router } from "express";
import {
  getAdminStats,
  getRecentEntries,
  syncSheets,
  forceResyncSheets,
  getDikriAdminStats,
  getDikriRecentEntries,
  getCombinedStats,
  getRecentSubmittedPaginated,
  getDikriRecentSubmittedPaginated,
} from "../controllers/admin.controller";

const router = Router();

router.get("/stats", getAdminStats);
router.get("/recent", getRecentEntries);
router.post("/sync-sheets", syncSheets);
router.post("/force-resync", forceResyncSheets);

router.get("/dikri-stats", getDikriAdminStats);
router.get("/dikri-recent", getDikriRecentEntries);
router.get("/combined-stats", getCombinedStats);
router.get("/recent-submitted", getRecentSubmittedPaginated);
router.get("/dikri-recent-submitted", getDikriRecentSubmittedPaginated);

export default router;
