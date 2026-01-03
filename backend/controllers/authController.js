import User from "../models/User.js";
import Employee from "../models/Employee.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

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
    console.log("Stored password hash (first 20 chars):", user.password.substring(0, 20));
    console.log("Entered password length:", password.length);
    const isPasswordMatch = await comparePassword(password, user.password);
    console.log("Password match:", isPasswordMatch);

    if (!isPasswordMatch) {
      console.log("Login failed for user:", user.email, "- password mismatch");
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

/**
 * @desc    Forgot Password - Send reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address"
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address"
      });
    }

    // Generate reset token
    const crypto = await import('crypto');
    const resetToken = crypto.default.randomBytes(32).toString('hex');

    // Hash token and set to user
    const hashedToken = crypto.default.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Send email
    try {
      const { sendEmail } = await import('../utils/sendEmail.js');
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #667eea; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { background-color: white; padding: 30px; border: 1px solid #ddd; }
              .button { display: inline-block; padding: 12px 24px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>You have requested to reset your password for your OdooXGCET account.</p>
                <p>Please click the button below to reset your password:</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <p>Or copy and paste this link in your browser:</p>
                <p>${resetUrl}</p>
                <p><strong>This link will expire in 30 minutes.</strong></p>
                <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email"
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error('Email error:', emailError);
      return res.status(500).json({
        success: false,
        message: "Error sending email. Please try again later."
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
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Hash token from params
    const crypto = await import('crypto');
    const hashedToken = crypto.default.createHash('sha256').update(resetToken).digest('hex');

    // Find user by token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    // Set new password
    const hashedNewPassword = await hashPassword(newPassword);
    console.log('Hashing new password for reset');
    
    user.password = hashedNewPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.isFirstLogin = false;

    await user.save({ validateBeforeSave: false });
    
    console.log('Password reset successful for user:', user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
