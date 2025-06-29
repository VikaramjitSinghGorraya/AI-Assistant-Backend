import express from "express";
import {
  getConversations,
  deleteConversation,
} from "../controllers/conversationController";
import { requireSignin } from "../controllers/authController";
const router = express.Router();

router.get("/getConversations", requireSignin, getConversations);
router.get("/deleteConversation/:conversationId", deleteConversation);

export default router;
