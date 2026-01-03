import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { loginIdOrEmail, password } = req.body;

    // Validation
    if (!loginIdOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide login credentials"
      });
    }

    // Find user by loginId OR email
    const user = await User.findOne({
      $or: [{ loginId: loginIdOrEmail }, { email: loginIdOrEmail }]
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please contact admin."
      });
    }

    // Compare password
    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return response
    res.status(200).json({
      success: true,
      token,
      role: user.role,
      isFirstLogin: user.isFirstLogin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @desc    Get Logged-in User Details
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getLoggedInUser = async (req, res) => {
  try {
    // req.user is attached by protect middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        loginId: user.loginId,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @desc    Change Password
 * @route   POST /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new password"
      });
    }

    // Fetch user from database (with password)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Compare old password
    const isPasswordMatch = await comparePassword(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    // Hash new password
    user.password = await hashPassword(newPassword);

    // Set first login to false
    user.isFirstLogin = false;

    // Save user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @desc    First Login Password Reset
 * @route   POST /api/auth/first-login-reset
 * @access  Private
 */
export const firstLoginReset = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // Validation
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password"
      });
    }

    // Fetch user from database
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify user is on first login
    if (!user.isFirstLogin) {
      return res.status(400).json({
        success: false,
        message: "This action is only for first-time login"
      });
    }

    // Hash new password
    user.password = await hashPassword(newPassword);

    // Set first login to false
    user.isFirstLogin = false;

    // Save user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login again."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @desc    Logout User
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = async (req, res) => {
  try {
    // Logout is handled on client-side by clearing token
    // Optional: Implement token blacklisting here for future enhancement

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
