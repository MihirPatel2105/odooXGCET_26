import Profile from "../models/Profile.js";
import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";

/* =========================================
   GET PROFILE (EMPLOYEE - SELF / ADMIN - ANY)
========================================= */
export const getProfile = async (req, res) => {
  try {
    const employeeId = req.params.employeeId || null;
    
    let employee;

    // If employeeId is provided and user is admin, get that employee's profile
    if (employeeId && req.user.role === "ADMIN") {
      employee = await Employee.findById(employeeId);
    } else {
      // Otherwise, get own profile
      employee = await Employee.findOne({ userId: req.user._id });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Get profile data
    let profile = await Profile.findOne({ employeeId: employee._id });

    // If profile doesn't exist, create empty one
    if (!profile) {
      profile = await Profile.create({
        employeeId: employee._id,
        skills: [],
        certifications: [],
        experience: "",
        emergencyContact: { name: "", phone: "" }
      });
    }

    // Populate employee basic info
    await employee.populate("userId", "email loginId");

    res.status(200).json({
      success: true,
      profile: {
        employee,
        resume: {
          skills: profile.skills,
          certifications: profile.certifications,
          experience: profile.experience
        },
        privateInfo: {
          phone: employee.phone,
          address: employee.address,
          emergencyContact: profile.emergencyContact
        }
      }
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
   UPDATE RESUME / ABOUT INFO
========================================= */
export const updateResume = async (req, res) => {
  try {
    const { skills, certifications, experience, fullName, bio } = req.body;

    // Get employee
    let employee;
    if (req.params.employeeId && req.user.role === "ADMIN") {
      employee = await Employee.findById(req.params.employeeId);
    } else {
      employee = await Employee.findOne({ userId: req.user._id });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Update employee basic info (fullName)
    if (fullName) {
      employee.fullName = fullName;
      await employee.save();
    }

    // Update or create profile
    let profile = await Profile.findOne({ employeeId: employee._id });

    if (!profile) {
      profile = await Profile.create({
        employeeId: employee._id,
        skills: skills || [],
        certifications: certifications || [],
        experience: experience || ""
      });
    } else {
      if (skills) profile.skills = skills;
      if (certifications) profile.certifications = certifications;
      if (experience) profile.experience = experience;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      profile: {
        fullName: employee.fullName,
        skills: profile.skills,
        certifications: profile.certifications,
        experience: profile.experience
      }
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
   UPDATE PRIVATE INFORMATION
========================================= */
export const updatePrivateInfo = async (req, res) => {
  try {
    const { phone, address, emergencyContact } = req.body;

    // Get employee
    let employee;
    if (req.params.employeeId && req.user.role === "ADMIN") {
      employee = await Employee.findById(req.params.employeeId);
    } else {
      employee = await Employee.findOne({ userId: req.user._id });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Update employee contact info
    if (phone) employee.phone = phone;
    if (address) employee.address = address;
    await employee.save();

    // Update profile emergency contact
    let profile = await Profile.findOne({ employeeId: employee._id });

    if (!profile) {
      profile = await Profile.create({
        employeeId: employee._id,
        emergencyContact: emergencyContact || { name: "", phone: "" }
      });
    } else {
      if (emergencyContact) {
        profile.emergencyContact = emergencyContact;
        await profile.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Private information updated successfully",
      privateInfo: {
        phone: employee.phone,
        address: employee.address,
        emergencyContact: profile.emergencyContact
      }
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
   GET SALARY INFORMATION (ADMIN ONLY / EMPLOYEE READ-ONLY)
========================================= */
export const getSalaryInfo = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Check access - Admin can view any, Employee can view only own
    let employee;
    if (req.user.role === "ADMIN") {
      employee = await Employee.findById(employeeId);
    } else {
      // Employee viewing own salary
      employee = await Employee.findOne({ userId: req.user._id });
      
      // Verify the requested employeeId matches their own
      if (employeeId && employeeId !== employee._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only view your own salary information."
        });
      }
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Get salary data
    const salary = await Salary.findOne({ employeeId: employee._id });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary information not found"
      });
    }

    res.status(200).json({
      success: true,
      salary: {
        employeeCode: employee.employeeCode,
        fullName: employee.fullName,
        wageType: salary.wageType,
        baseSalary: salary.baseSalary,
        components: salary.components,
        deductions: salary.deductions,
        totalSalary: salary.totalSalary
      }
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
   UPDATE SALARY INFORMATION (ADMIN ONLY)
========================================= */
export const updateSalaryInfo = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const { wageType, baseSalary, components, deductions } = req.body;

    // Find employee
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Calculate total salary
    const totalComponents = 
      (components?.basic || 0) + 
      (components?.hra || 0) + 
      (components?.allowance || 0) + 
      (components?.bonus || 0);

    const totalDeductions = 
      (deductions?.pf || 0) + 
      (deductions?.tax || 0) + 
      (deductions?.other || 0);

    const totalSalary = (baseSalary || 0) + totalComponents - totalDeductions;

    // Update or create salary
    let salary = await Salary.findOne({ employeeId: employee._id });

    if (!salary) {
      salary = await Salary.create({
        employeeId: employee._id,
        wageType: wageType || "MONTHLY",
        baseSalary: baseSalary || 0,
        components: components || {},
        deductions: deductions || {},
        totalSalary
      });
    } else {
      if (wageType) salary.wageType = wageType;
      if (baseSalary) salary.baseSalary = baseSalary;
      if (components) salary.components = components;
      if (deductions) salary.deductions = deductions;
      salary.totalSalary = totalSalary;
      await salary.save();
    }

    res.status(200).json({
      success: true,
      message: "Salary information updated successfully",
      salary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
