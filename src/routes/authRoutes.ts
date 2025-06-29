import express from "express";
import {
  signup,
  signin,
  signout,
  isLoggedIn,
  requireSignin,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/isLoggedIn", requireSignin, isLoggedIn);

export default router;
