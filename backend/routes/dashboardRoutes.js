import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* =========================================
   DASHBOARD ROUTES
========================================= */

// Get dashboard statistics (Admin only)
router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;
