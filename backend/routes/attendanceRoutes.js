import express from "express";
import {
  checkIn,
  checkOut,
  getSelfAttendance,
  getAllAttendance,
  getAttendanceByDate,
  correctAttendance
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

// Get own attendance (Employee)
router.get("/self", protect, getSelfAttendance);

/* =========================================
   ADMIN ROUTES
========================================= */

// Get all attendance (Admin)
router.get("/all", protect, adminOnly, getAllAttendance);

// Get attendance by date (Admin)
router.get("/date", protect, adminOnly, getAttendanceByDate);

// Correct attendance (Admin)
router.put("/correct/:attendanceId", protect, adminOnly, correctAttendance);

export default router;
