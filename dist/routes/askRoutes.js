"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const askController_1 = require("../controllers/askController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/question", authController_1.requireSignin, askController_1.ask);
exports.default = router;
