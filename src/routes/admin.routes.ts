import { Router } from "express";
import { getAdminStats, getRecentEntries } from "../controllers/admin.controller";

const router = Router();

router.get("/stats", getAdminStats);
router.get("/recent", getRecentEntries);

export default router;
