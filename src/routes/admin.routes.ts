import { Router } from "express";
import { getAdminStats, getRecentEntries, syncSheets } from "../controllers/admin.controller";

const router = Router();

router.get("/stats", getAdminStats);
router.get("/recent", getRecentEntries);
router.post("/sync-sheets", syncSheets);

export default router;
