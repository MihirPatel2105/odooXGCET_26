import express from "express";
import {
  createSalary,
  getSalaryByEmployee,
  updateSalary,
  getAllSalaries
} from "../controllers/salaryController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* =========================================
   ADMIN SALARY ROUTES
========================================= */

// All salary routes are admin-only
router.post("/", protect, adminOnly, createSalary);
router.get("/", protect, adminOnly, getAllSalaries);
router.get("/:empId", protect, adminOnly, getSalaryByEmployee);
router.put("/:empId", protect, adminOnly, updateSalary);

export default router;
