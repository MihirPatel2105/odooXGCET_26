import express from "express";
import { getDashboardStats, getEmployeeDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* =========================================
   DASHBOARD ROUTES
========================================= */

// Employee dashboard with quick-access cards
router.get("/employee", protect, getEmployeeDashboard);

// Admin dashboard statistics
router.get("/admin", protect, adminOnly, getDashboardStats);

export default router;
