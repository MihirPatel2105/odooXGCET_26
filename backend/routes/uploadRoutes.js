import express from "express";
import { uploadLogo, uploadDocument } from "../controllers/uploadController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const router = express.Router();

/* =========================================
   UPLOAD ROUTES
========================================= */

// Upload logo (Admin only)
router.post("/logo", protect, adminOnly, uploadToCloudinary, uploadLogo);

// Upload document (Protected - any authenticated user)
router.post("/document", protect, uploadToCloudinary, uploadDocument);

export default router;
