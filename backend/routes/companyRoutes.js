import express from "express";
import { 
    signupCompany, 
    getCompanyDetails, 
    updateCompanyDetails 
} from "../controllers/companyController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* =========================================
   PUBLIC ROUTES
========================================= */

// Company signup/registration (no auth required)
router.post("/signup", signupCompany);

/* =========================================
   AUTHENTICATED ROUTES
========================================= */

// Get company details (any authenticated user)
router.get("/", protect, getCompanyDetails);

/* =========================================
   ADMIN ONLY ROUTES
========================================= */

// Update company details (admin only)
router.put("/", protect, adminOnly, updateCompanyDetails);

export default router;
