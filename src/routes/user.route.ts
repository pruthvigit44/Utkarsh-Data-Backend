import { Router } from "express";
import { createUser, getUser, updateUser } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/mobile/:mobile", getUser);
router.put("/mobile/:mobile", updateUser);

export default router;