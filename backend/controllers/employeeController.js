import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateLoginId, generatePassword } from "../utils/generateLoginId.js";

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
      address,
      companyCode
    } = req.body;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required"
      });
    }

    // Get the logged-in user's company ID
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser || !loggedInUser.companyId) {
      return res.status(400).json({
        success: false,
        message: "User company not found"
      });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Set default date of joining if not provided
    const joiningDate = dateOfJoining || new Date();

    // Generate unique login ID automatically
    // Format: OIJODO20220001
    // OI → Company code (default: Odoo India)
    // JODO → First 2 letters of first name + first 2 letters of last name
    // 2022 → Year of joining
    // 0001 → Serial number
    const loginId = await generateLoginId(fullName, joiningDate, companyCode);

    // Auto-generate secure password
    const autoPassword = generatePassword();

    // Hash the auto-generated password
    const hashedPassword = await hashPassword(autoPassword);
    
    // Create user login with company ID
    const user = await User.create({
      loginId,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
      companyId: loggedInUser.companyId,
      isFirstLogin: true, // Force password change on first login
      isActive: true
    });

    // Create employee profile with company ID
    const employee = await Employee.create({
      userId: user._id,
      companyId: loggedInUser.companyId,
      employeeCode: loginId,
      fullName,
      phone,
      address,
      designation,
      department,
      dateOfJoining: joiningDate,
      status: "ACTIVE"
    });

    // Populate user data
    await employee.populate("userId", "email role loginId");

    res.status(201).json({
      success: true,
      employee,
      credentials: {
        loginId: loginId,
        email: email,
        temporaryPassword: autoPassword
      },
      message: `Employee created successfully. Login ID: ${loginId}. Temporary password has been generated. Employee must change password on first login.`
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
    // Get the logged-in user's company ID
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser || !loggedInUser.companyId) {
      return res.status(400).json({
        success: false,
        message: "User company not found"
      });
    }

    // Filter employees by company ID
    const employees = await Employee.find({ companyId: loggedInUser.companyId })
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
    // Get the logged-in user's company ID
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser || !loggedInUser.companyId) {
      return res.status(400).json({
        success: false,
        message: "User company not found"
      });
    }

    // Find employee by ID and company ID
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId: loggedInUser.companyId
    }).populate("userId", "email role loginId isActive");

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
    // Get the logged-in user's company ID
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser || !loggedInUser.companyId) {
      return res.status(400).json({
        success: false,
        message: "User company not found"
      });
    }

    // Find employee by ID and company ID
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId: loggedInUser.companyId
    });

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
    // Get the logged-in user's company ID
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser || !loggedInUser.companyId) {
      return res.status(400).json({
        success: false,
        message: "User company not found"
      });
    }

    // Find employee by ID and company ID
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId: loggedInUser.companyId
    });

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

/* =========================================
   GET EMPLOYEES DASHBOARD WITH STATUS (FOR CARDS)
========================================= */
export const getEmployeesDashboard = async (req, res) => {
  try {
    const Attendance = (await import("../models/Attendance.js")).default;
    const Leave = (await import("../models/Leave.js")).default;

    // Get the logged-in user's company ID
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser || !loggedInUser.companyId) {
      return res.status(400).json({
        success: false,
        message: "User company not found"
      });
    }

    // Get all active employees from the same company
    const employees = await Employee.find({ 
      status: "ACTIVE",
      companyId: loggedInUser.companyId 
    })
      .populate("userId", "email loginId")
      .select("employeeCode fullName profileImage designation department")
      .lean();

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's attendance for all employees
    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).lean();

    // Get approved leaves for today
    const todayLeaves = await Leave.find({
      status: "APPROVED",
      fromDate: { $lte: today },
      toDate: { $gte: today }
    }).lean();

    // Create attendance and leave maps for quick lookup
    const attendanceMap = {};
    todayAttendance.forEach(att => {
      attendanceMap[att.employeeId.toString()] = att;
    });

    const leaveMap = {};
    todayLeaves.forEach(leave => {
      leaveMap[leave.employeeId.toString()] = leave;
    });

    // Add status to each employee
    const employeesWithStatus = employees.map(emp => {
      const empId = emp._id.toString();
      let status = "absent"; // default: yellow dot
      let statusIcon = "yellow";

      // Check if on leave
      if (leaveMap[empId]) {
        status = "onLeave";
        statusIcon = "airplane";
      }
      // Check if present (checked in)
      else if (attendanceMap[empId] && attendanceMap[empId].checkIn) {
        status = "present";
        statusIcon = "green";
      }
      // Otherwise absent (no check-in, no leave)
      else {
        status = "absent";
        statusIcon = "yellow";
      }

      return {
        _id: emp._id,
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        profileImage: emp.profileImage || null,
        designation: emp.designation,
        department: emp.department,
        email: emp.userId?.email,
        loginId: emp.userId?.loginId,
        currentStatus: status,
        statusIcon: statusIcon
      };
    });

    res.status(200).json({
      success: true,
      count: employeesWithStatus.length,
      employees: employeesWithStatus
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
   GET CURRENT USER STATUS
========================================= */
export const getCurrentUserStatus = async (req, res) => {
  try {
    const Attendance = (await import("../models/Attendance.js")).default;
    const Leave = (await import("../models/Leave.js")).default;

    // Get employee from logged-in user
    const employee = await Employee.findOne({ userId: req.user._id })
      .populate("userId", "email loginId")
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found"
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check today's attendance
    const todayAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: today, $lt: tomorrow }
    }).lean();

    // Check if on leave today
    const todayLeave = await Leave.findOne({
      employeeId: employee._id,
      status: "APPROVED",
      fromDate: { $lte: today },
      toDate: { $gte: today }
    }).lean();

    let status = "absent";
    let statusIcon = "yellow";
    let canCheckIn = true;
    let canCheckOut = false;

    if (todayLeave) {
      status = "onLeave";
      statusIcon = "airplane";
      canCheckIn = false;
    } else if (todayAttendance) {
      if (todayAttendance.checkIn && todayAttendance.checkOut) {
        status = "checkedOut";
        statusIcon = "green";
        canCheckIn = false;
        canCheckOut = false;
      } else if (todayAttendance.checkIn) {
        status = "checkedIn";
        statusIcon = "green";
        canCheckIn = false;
        canCheckOut = true;
      }
    }

    res.status(200).json({
      success: true,
      employee: {
        _id: employee._id,
        fullName: employee.fullName,
        profileImage: employee.profileImage,
        employeeCode: employee.employeeCode,
        email: employee.userId?.email
      },
      currentStatus: status,
      statusIcon: statusIcon,
      canCheckIn: canCheckIn,
      canCheckOut: canCheckOut,
      attendance: todayAttendance || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
