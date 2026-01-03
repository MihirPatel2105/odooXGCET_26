import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getSelfEmployee,
  updateEmployee,
  disableEmployee,
  getEmployeesDashboard,
  getCurrentUserStatus
} from "../controllers/employeeController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* EMPLOYEE ROUTES - Must be before /:id to avoid conflict */
router.get("/self/profile", protect, getSelfEmployee);
router.get("/self/status", protect, getCurrentUserStatus);

/* DASHBOARD ROUTE - For employee cards with status */
router.get("/dashboard", protect, getEmployeesDashboard);

/* ADMIN ROUTES */
router.post("/", protect, adminOnly, createEmployee);
router.get("/", protect, adminOnly, getAllEmployees);
router.get("/:id", protect, adminOnly, getEmployeeById);
router.put("/:id", protect, adminOnly, updateEmployee);
router.delete("/:id", protect, adminOnly, disableEmployee);

export default router;
