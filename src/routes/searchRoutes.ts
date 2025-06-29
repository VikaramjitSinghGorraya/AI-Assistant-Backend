import express from "express";
import { search } from "../controllers/searchController";
import { requireSignin } from "../controllers/authController";
const router = express();

router.post("/query", requireSignin, search);

export default router;
