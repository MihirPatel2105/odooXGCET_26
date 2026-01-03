import Company from "../models/Company.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

/* =========================================
   COMPANY SIGNUP/REGISTRATION
   First admin registers their company
========================================= */
export const signupCompany = async (req, res) => {
    try {
        const { 
            companyName, 
            companyCode, 
            logo, 
            name, 
            email, 
            phone, 
            password, 
            confirmPassword 
        } = req.body;

        // Validation
        if (!companyName || !companyCode || !name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Check password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if company code already exists
        const existingCompany = await Company.findOne({ 
            $or: [
                { companyCode: companyCode.toUpperCase() },
                { email: email.toLowerCase() }
            ]
        });

        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: "Company code or email already registered"
            });
        }

        // Check if user email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create company
        const company = await Company.create({
            companyName,
            companyCode: companyCode.toUpperCase(),
            logo: logo || "",
            email: email.toLowerCase(),
            phone
        });

        // Create admin user
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "ADMIN",
            isFirstLogin: false, // Admin sets their own password during signup
            companyId: company._id
        });

        // Update company with creator
        company.createdBy = user._id;
        await company.save();

        // Create employee profile for admin
        const employee = await Employee.create({
            userId: user._id,
            companyId: company._id,
            employeeCode: `${companyCode.toUpperCase()}-ADMIN-001`,
            fullName: name,
            email: email.toLowerCase(),
            mobileNumber: phone,
            department: "Administration",
            designation: "Company Administrator",
            employeeType: "FULL_TIME",
            dateOfJoining: new Date(),
            status: "ACTIVE"
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Company registered successfully",
            data: {
                company: {
                    _id: company._id,
                    companyName: company.companyName,
                    companyCode: company.companyCode,
                    logo: company.logo,
                    email: company.email,
                    phone: company.phone
                },
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role
                },
                employee: {
                    _id: employee._id,
                    employeeCode: employee.employeeCode,
                    fullName: employee.fullName,
                    department: employee.department,
                    designation: employee.designation
                },
                token
            }
        });
    } catch (error) {
        console.error("Company signup error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error registering company"
        });
    }
};

/* =========================================
   GET COMPANY DETAILS
========================================= */
export const getCompanyDetails = async (req, res) => {
    try {
        // Get company from authenticated user
        const user = await User.findById(req.user._id).populate("companyId");

        if (!user || !user.companyId) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            company: user.companyId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================================
   UPDATE COMPANY DETAILS (ADMIN ONLY)
========================================= */
export const updateCompanyDetails = async (req, res) => {
    try {
        const { companyName, logo, email, phone } = req.body;

        // Get company from authenticated admin user
        const user = await User.findById(req.user._id);

        if (!user || !user.companyId) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        // Update company
        const company = await Company.findById(user.companyId);

        if (companyName) company.companyName = companyName;
        if (logo !== undefined) company.logo = logo;
        if (email) company.email = email.toLowerCase();
        if (phone) company.phone = phone;

        await company.save();

        res.status(200).json({
            success: true,
            message: "Company details updated successfully",
            company
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
