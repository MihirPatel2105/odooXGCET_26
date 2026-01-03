import express from "express";
import {
  applyLeave,
  getSelfLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave
} from "../controllers/leaveController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* =========================================
   EMPLOYEE LEAVE ROUTES
========================================= */

// Employee can apply for leave and view their own leaves
router.post("/", protect, applyLeave);
router.get("/self", protect, getSelfLeaves);

/* =========================================
   ADMIN LEAVE ROUTES
========================================= */

// Admin can view all leaves and approve/reject them
router.get("/", protect, adminOnly, getAllLeaves);
router.put("/:id/approve", protect, adminOnly, approveLeave);
router.put("/:id/reject", protect, adminOnly, rejectLeave);

export default router;
