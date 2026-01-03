import express from "express";
import {
  loginUser,
  getLoggedInUser,
  changePassword,
  firstLoginReset,
  logoutUser
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/login", loginUser);

// Protected Routes (Require Authentication)
router.get("/me", protect, getLoggedInUser);
router.post("/change-password", protect, changePassword);
router.post("/first-login-reset", protect, firstLoginReset);
router.post("/logout", protect, logoutUser);

export default router;
