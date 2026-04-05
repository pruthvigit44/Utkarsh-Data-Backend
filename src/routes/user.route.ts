import { Router } from "express";
import { createUser } from "../controllers/user.controller";

const userRouter = Router();

// ✅ POST: Submit form data
userRouter.post("/submit", createUser);

export default userRouter;