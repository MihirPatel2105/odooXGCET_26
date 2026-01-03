import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect Middleware - Verify JWT and attach user to request
 * Usage: Add to routes that require authentication
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret_key"
      );

      // Fetch user from database (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account is inactive"
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token"
    });
  }
};

/**
 * Admin Only Middleware - Restrict access to Admin role only
 * Usage: Add after protect middleware for admin-only routes
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }
};
