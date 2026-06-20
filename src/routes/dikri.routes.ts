import { Router } from "express";
import { createDikri } from "../controllers/dikri.controller";

const router = Router();

router.post("/", createDikri);

export default router;
