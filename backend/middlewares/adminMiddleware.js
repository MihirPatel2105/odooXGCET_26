/**
 * Admin Only Middleware
 * Restrict access to Admin role only
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
