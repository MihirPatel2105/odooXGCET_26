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
   EMPLOYEE SALARY ROUTES (READ-ONLY)
========================================= */

// Employee can view their own salary (read-only as per requirement)
router.get("/self", protect, async (req, res) => {
  try {
    const Employee = (await import("../models/Employee.js")).default;
    const Salary = (await import("../models/Salary.js")).default;
    
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found"
      });
    }

    const salary = await Salary.findOne({ employeeId: employee._id });
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary information not available"
      });
    }

    res.status(200).json({
      success: true,
      salary: {
        wageType: salary.wageType,
        wage: salary.wage,
        totalSalary: salary.totalSalary,
        components: salary.components
      },
      message: "Salary data is read-only for employees"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* =========================================
   ADMIN SALARY ROUTES (FULL CONTROL)
========================================= */

// Admin can create, view all, view specific, and update salary
router.post("/", protect, adminOnly, createSalary);
router.get("/", protect, adminOnly, getAllSalaries);
router.get("/:empId", protect, adminOnly, getSalaryByEmployee);
router.put("/:empId", protect, adminOnly, updateSalary);

export default router;
