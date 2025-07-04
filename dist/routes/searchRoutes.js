"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchController_1 = require("../controllers/searchController");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.default)();
router.post("/query", authController_1.requireSignin, searchController_1.search);
exports.default = router;
