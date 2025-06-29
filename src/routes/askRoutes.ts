import express from "express";
import { ask } from "../controllers/askController";
import { requireSignin } from "../controllers/authController";

const router = express.Router();

router.post("/question", requireSignin, ask);

export default router;
