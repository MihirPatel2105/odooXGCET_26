import express from "express";
import {
  applyLeave,
  getSelfLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getLeaveBalance
} from "../controllers/leaveController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* =========================================
   EMPLOYEE LEAVE ROUTES
   Employees can view ONLY their own time-off records
========================================= */

// Employee can apply for leave and view their own leaves
router.post("/", protect, applyLeave);                    // Apply for leave
router.get("/self", protect, getSelfLeaves);              // Get own leaves
router.get("/balance", protect, getLeaveBalance);         // Get leave balance

/* =========================================
   ADMIN LEAVE ROUTES
   Admins and HR Officers can view ALL time-off records & approve/reject them
========================================= */

// Admin can view all leaves and approve/reject them
router.get("/", protect, adminOnly, getAllLeaves);
router.put("/:id/approve", protect, adminOnly, approveLeave);
router.put("/:id/reject", protect, adminOnly, rejectLeave);

export default router;
