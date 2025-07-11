"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/signup", authController_1.signup);
router.post("/signin", authController_1.signin);
router.get("/signout", authController_1.signout);
router.get("/isLoggedIn", authController_1.requireSignin, authController_1.isLoggedIn);
exports.default = router;
