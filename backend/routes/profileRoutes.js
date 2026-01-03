import express from "express";
import {
  getProfile,
  updateResume,
  updatePrivateInfo,
  getSalaryInfo,
  updateSalaryInfo
} from "../controllers/profileController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* =========================================
   PROFILE ROUTES
========================================= */

// Get own profile (Employee) or any profile (Admin)
router.get("/", protect, getProfile);
router.get("/:employeeId", protect, getProfile);

// Update resume/about info
router.put("/resume", protect, updateResume);
router.put("/resume/:employeeId", protect, adminOnly, updateResume);

// Update private information
router.put("/private-info", protect, updatePrivateInfo);
router.put("/private-info/:employeeId", protect, adminOnly, updatePrivateInfo);

/* =========================================
   SALARY ROUTES
========================================= */

// Get salary info (Employee can view own, Admin can view any)
router.get("/salary/:employeeId", protect, getSalaryInfo);

// Update salary info (Admin only)
router.put("/salary/:employeeId", protect, adminOnly, updateSalaryInfo);

export default router;
