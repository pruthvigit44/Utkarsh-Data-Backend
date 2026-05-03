import { Router } from "express";
import { getAdminStats, getRecentEntries, syncSheets, forceResyncSheets } from "../controllers/admin.controller";

const router = Router();

router.get("/stats", getAdminStats);
router.get("/recent", getRecentEntries);
router.post("/sync-sheets", syncSheets);
router.post("/force-resync", forceResyncSheets);

export default router;
