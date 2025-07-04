"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversationController_1 = require("../controllers/conversationController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get("/getConversations", authController_1.requireSignin, conversationController_1.getConversations);
router.get("/deleteConversation/:conversationId", conversationController_1.deleteConversation);
exports.default = router;
