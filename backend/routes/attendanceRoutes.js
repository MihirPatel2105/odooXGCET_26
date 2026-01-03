import express from "express";
import {
  checkIn,
  checkOut,
  getSelfAttendance,
  getAllAttendance,
  getAttendanceByDate,
  correctAttendance,
  getTodayAttendance,
  getPayableDays
} from "../controllers/attendanceController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* =========================================
   EMPLOYEE ROUTES
========================================= */

// Check-in (Employee)
router.post("/check-in", protect, checkIn);

// Check-out (Employee)
router.post("/check-out", protect, checkOut);

// Get own attendance (Employee) - defaults to current month
router.get("/self", protect, getSelfAttendance);

/* =========================================
   ADMIN ROUTES
========================================= */

// Get all attendance (Admin)
router.get("/all", protect, adminOnly, getAllAttendance);

// Get today's attendance summary (Admin)
router.get("/today", protect, adminOnly, getTodayAttendance);

// Get attendance by date (Admin)
router.get("/date/:date", protect, adminOnly, getAttendanceByDate);

// Get payable days for payslip generation (Admin)
router.get("/payable-days", protect, adminOnly, getPayableDays);

// Correct attendance (Admin)
router.put("/correct/:attendanceId", protect, adminOnly, correctAttendance);

export default router;
