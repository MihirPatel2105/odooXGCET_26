import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import { calculateSalary } from "../utils/calculateSalary.js";

export const createSalary = async (req, res) => {
    try {
        // Constraint: Only admin can create salary
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ 
                message: "Access denied. Only admin can create salary information." 
            });
        }

        const { employeeId, wageType, wage, components } = req.body;

        // Constraint: Validate employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Constraint: Check if salary already exists for employee
        const existingSalary = await Salary.findOne({ employeeId });
        if (existingSalary) {
            return res.status(400).json({ 
                message: "Salary already exists for this employee. Use update instead." 
            });
        }

        // Constraint: Validate wage type
        if (!["MONTHLY", "YEARLY"].includes(wageType)) {
            return res.status(400).json({ 
                message: "Wage type must be either MONTHLY or YEARLY" 
            });
        }

        // Constraint: Validate wage is positive
        if (wage <= 0) {
            return res.status(400).json({ 
                message: "Wage must be a positive number" 
            });
        }

        // Constraint: Validate component percentages
        if (components) {
            const { basicPercentage, hraPercentage, allowances } = components;
            
            if (basicPercentage && (basicPercentage < 0 || basicPercentage > 100)) {
                return res.status(400).json({ 
                    message: "Basic percentage must be between 0 and 100" 
                });
            }

            if (hraPercentage && (hraPercentage < 0 || hraPercentage > 100)) {
                return res.status(400).json({ 
                    message: "HRA percentage must be between 0 and 100" 
                });
            }

            // Constraint: Validate allowance values are non-negative
            if (allowances) {
                for (const [key, value] of Object.entries(allowances)) {
                    if (typeof value === 'number' && value < 0) {
                        return res.status(400).json({ 
                            message: `Allowance ${key} cannot be negative` 
                        });
                    }
                }
            }
        }

        const totalSalary = calculateSalary(req.body);
        const salary = await Salary.create({ ...req.body, totalSalary });
        
        res.status(201).json({
            success: true,
            message: "Salary created successfully",
            data: salary
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error creating salary", 
            error: error.message 
        });
    }
};

export const getSalaryByEmployee = async (req, res) => {
    try {
        // Constraint: Only admin can view salary information
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ 
                message: "Access denied. Only admin can view salary information." 
            });
        }

        const salary = await Salary.findOne({ employeeId: req.params.empId })
            .populate("employeeId", "firstName lastName employeeId");

        if (!salary) {
            return res.status(404).json({ 
                message: "Salary information not found for this employee" 
            });
        }

        res.json({
            success: true,
            data: salary
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching salary", 
            error: error.message 
        });
    }
};

export const updateSalary = async (req, res) => {
    try {
        // Constraint: Only admin can update salary
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ 
                message: "Access denied. Only admin can update salary information." 
            });
        }

        const { wageType, wage, components } = req.body;

        // Constraint: Check if salary exists
        const existingSalary = await Salary.findOne({ employeeId: req.params.empId });
        if (!existingSalary) {
            return res.status(404).json({ 
                message: "Salary not found. Create salary first." 
            });
        }

        // Constraint: Validate wage type if provided
        if (wageType && !["MONTHLY", "YEARLY"].includes(wageType)) {
            return res.status(400).json({ 
                message: "Wage type must be either MONTHLY or YEARLY" 
            });
        }

        // Constraint: Validate wage is positive if provided
        if (wage !== undefined && wage <= 0) {
            return res.status(400).json({ 
                message: "Wage must be a positive number" 
            });
        }

        // Constraint: Validate component percentages if provided
        if (components) {
            const { basicPercentage, hraPercentage, allowances } = components;
            
            if (basicPercentage !== undefined && (basicPercentage < 0 || basicPercentage > 100)) {
                return res.status(400).json({ 
                    message: "Basic percentage must be between 0 and 100" 
                });
            }

            if (hraPercentage !== undefined && (hraPercentage < 0 || hraPercentage > 100)) {
                return res.status(400).json({ 
                    message: "HRA percentage must be between 0 and 100" 
                });
            }

            // Constraint: Validate allowance values are non-negative
            if (allowances) {
                for (const [key, value] of Object.entries(allowances)) {
                    if (typeof value === 'number' && value < 0) {
                        return res.status(400).json({ 
                            message: `Allowance ${key} cannot be negative` 
                        });
                    }
                }
            }
        }

        const totalSalary = calculateSalary(req.body);
        const salary = await Salary.findOneAndUpdate(
            { employeeId: req.params.empId },
            { ...req.body, totalSalary },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Salary updated successfully",
            data: salary
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating salary", 
            error: error.message 
        });
    }
};

export const getAllSalaries = async (req, res) => {
    try {
        // Constraint: Only admin can view all salaries
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ 
                message: "Access denied. Only admin can view salary information." 
            });
        }

        const salaries = await Salary.find()
            .populate("employeeId", "firstName lastName employeeId email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: salaries.length,
            data: salaries
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching salaries", 
            error: error.message 
        });
    }
};
