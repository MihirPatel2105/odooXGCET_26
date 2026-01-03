import User from "../models/User.js";
import Employee from "../models/Employee.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { sendPasswordResetEmail } from "../utils/sendEmail.js";
import { validatePassword, validateEmail } from "../utils/validators.js";
import crypto from "crypto";

/**
 * @desc    Login User (supports both email and loginId/employeeCode)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { loginIdOrEmail, password } = req.body;

    console.log("Login attempt:", { loginIdOrEmail, passwordLength: password?.length });

    // Validation
    if (!loginIdOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide login credentials"
      });
    }

    let user = null;

    // First, try to find user by email
    user = await User.findOne({ email: loginIdOrEmail.toLowerCase() });
    console.log("User found by email:", user ? "Yes" : "No");

    // If not found by email, try to find by loginId
    if (!user) {
      user = await User.findOne({ loginId: loginIdOrEmail.toUpperCase() });
      console.log("User found by loginId:", user ? "Yes" : "No");
    }

    // If still not found, try to find employee by employeeCode and get user
    if (!user) {
      const employee = await Employee.findOne({ 
        employeeCode: loginIdOrEmail.toUpperCase() 
      });

      if (employee && employee.userId) {
        user = await User.findById(employee.userId);
        console.log("User found via employee:", user ? "Yes" : "No");
      }
    }

    // Check if user exists
    if (!user) {
      console.log("User not found");
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
    console.log("Comparing passwords...");
    const isPasswordMatch = await comparePassword(password, user.password);
    console.log("Password match:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Get employee details if exists
    const employee = await Employee.findOne({ userId: user._id });

    // Return response
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      },
      employee: employee ? {
        _id: employee._id,
        employeeCode: employee.employeeCode,
        fullName: employee.fullName,
        department: employee.department,
        designation: employee.designation
      } : null,
      message: user.isFirstLogin 
        ? "First login detected. Please change your password." 
        : "Login successful"
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

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
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

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
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

/**
 * @desc    Forgot Password - Send reset link to email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email address"
      });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address"
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and save to database
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Get employee name if exists
    const employee = await Employee.findOne({ userId: user._id });
    const userName = employee ? employee.fullName : 'User';

    try {
      await sendPasswordResetEmail(email, userName, resetUrl);
      
      res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email"
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error('Failed to send reset email:', emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later."
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @desc    Reset Password using token from link
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { token } = req.params;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password and confirmation"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Hash the token from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link. Please request a new one."
      });
    }

    // Update password
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now login with your new password."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};;
