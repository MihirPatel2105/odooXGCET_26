import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/hashPassword.js";

/* =========================================
   CREATE EMPLOYEE (ADMIN)
========================================= */
export const createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      designation,
      department,
      dateOfJoining,
      address
    } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Generate unique login ID
    const loginId = `EMP${Date.now()}`;

    // Create user login (hash the default password)
    const hashedPassword = await hashPassword("Temp@123");
    
    const user = await User.create({
      loginId,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
      isFirstLogin: true,
      isActive: true
    });

    // Create employee profile
    const employee = await Employee.create({
      userId: user._id,
      employeeCode: loginId,
      fullName,
      phone,
      address,
      designation,
      department,
      dateOfJoining: dateOfJoining || new Date(),
      status: "ACTIVE"
    });

    // Populate user data
    await employee.populate("userId", "email role loginId");

    res.status(201).json({
      success: true,
      employee,
      message: "Employee created successfully. Default password: Temp@123"
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
   GET ALL EMPLOYEES (ADMIN)
========================================= */
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "email role loginId isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees
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
   GET EMPLOYEE BY ID (ADMIN)
========================================= */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("userId", "email role loginId isActive");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      employee
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
   GET SELF PROFILE (EMPLOYEE)
========================================= */
export const getSelfEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      userId: req.user._id
    }).populate("userId", "email loginId");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      employee
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
   UPDATE EMPLOYEE (ADMIN)
========================================= */
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Update employee fields
    const allowedUpdates = [
      "fullName",
      "phone",
      "address",
      "designation",
      "department",
      "dateOfJoining",
      "profileImage",
      "status"
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    });

    await employee.save();

    await employee.populate("userId", "email role loginId");

    res.status(200).json({
      success: true,
      employee,
      message: "Employee updated successfully"
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
   DISABLE EMPLOYEE (ADMIN)
========================================= */
export const disableEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Disable employee
    employee.status = "INACTIVE";
    await employee.save();

    // Also disable user account
    await User.findByIdAndUpdate(employee.userId, {
      isActive: false
    });

    res.status(200).json({
      success: true,
      message: "Employee disabled successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
