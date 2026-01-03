import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

/* =========================================
   APPLY FOR LEAVE (EMPLOYEE)
========================================= */
export const applyLeave = async (req, res) => {
    try {
        const { leaveType, fromDate, toDate, reason, attachment } = req.body;

        // Get employee from logged-in user
        const employee = await Employee.findOne({ userId: req.user._id });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found"
            });
        }

        // Validate dates
        const from = new Date(fromDate);
        const to = new Date(toDate);

        if (to < from) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        // Calculate total days
        const diffTime = Math.abs(to - from);
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Create leave request
        const leave = await Leave.create({
            employeeId: employee._id,
            leaveType,
            fromDate: from,
            toDate: to,
            totalDays,
            reason,
            attachment,
            status: "PENDING"
        });

        await leave.populate("employeeId", "employeeCode fullName department");

        res.status(201).json({
            success: true,
            leave,
            message: "Leave request submitted successfully"
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
   GET OWN LEAVES (EMPLOYEE)
   Employees can view ONLY their own time-off records
========================================= */
export const getSelfLeaves = async (req, res) => {
    try {
        // Get employee from logged-in user
        const employee = await Employee.findOne({ userId: req.user._id });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found"
            });
        }

        // Get query parameters for filtering
        const { status, year } = req.query;

        let query = { employeeId: employee._id };

        // Filter by status if provided
        if (status) {
            query.status = status.toUpperCase();
        }

        // Filter by year if provided
        if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            query.fromDate = { $gte: startDate, $lte: endDate };
        }

        const leaves = await Leave.find(query)
            .sort({ createdAt: -1 })
            .lean();

        // Calculate statistics
        const pending = leaves.filter(l => l.status === "PENDING").length;
        const approved = leaves.filter(l => l.status === "APPROVED").length;
        const rejected = leaves.filter(l => l.status === "REJECTED").length;

        res.status(200).json({
            success: true,
            count: leaves.length,
            statistics: {
                pending,
                approved,
                rejected,
                totalDaysRequested: leaves
                    .filter(l => l.status === "APPROVED")
                    .reduce((sum, l) => sum + l.totalDays, 0)
            },
            leaves
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
   GET ALL LEAVES (ADMIN/HR)
   Admins and HR Officers can view ALL employee time-off records
========================================= */
export const getAllLeaves = async (req, res) => {
    try {
        // Get query parameters for filtering
        const { status, employeeId, leaveType, year } = req.query;

        let query = {};

        // Filter by employee
        if (employeeId) {
            query.employeeId = employeeId;
        }

        // Filter by status
        if (status) {
            query.status = status.toUpperCase();
        }

        // Filter by leave type
        if (leaveType) {
            query.leaveType = leaveType.toUpperCase();
        }

        // Filter by year
        if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            query.fromDate = { $gte: startDate, $lte: endDate };
        }

        const leaves = await Leave.find(query)
            .populate({
                path: "employeeId",
                select: "employeeCode fullName department designation"
            })
            .sort({ createdAt: -1 });

        // Calculate statistics
        const pending = leaves.filter(l => l.status === "PENDING").length;
        const approved = leaves.filter(l => l.status === "APPROVED").length;
        const rejected = leaves.filter(l => l.status === "REJECTED").length;

        res.status(200).json({
            success: true,
            count: leaves.length,
            statistics: {
                pending,
                approved,
                rejected
            },
            leaves
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
   APPROVE LEAVE (ADMIN/HR)
   Admins and HR Officers can approve leave requests
========================================= */
export const approveLeave = async (req, res) => {
    try {
        const { adminComment } = req.body;

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        if (leave.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: `Leave request already ${leave.status.toLowerCase()}`
            });
        }

        leave.status = "APPROVED";
        if (adminComment) {
            leave.adminComment = adminComment;
        }

        await leave.save();

        await leave.populate({
            path: "employeeId",
            select: "employeeCode fullName department"
        });

        res.status(200).json({
            success: true,
            leave,
            message: "Leave request approved successfully"
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
   REJECT LEAVE (ADMIN/HR)
   Admins and HR Officers can reject leave requests
========================================= */
export const rejectLeave = async (req, res) => {
    try {
        const { adminComment } = req.body;

        if (!adminComment) {
            return res.status(400).json({
                success: false,
                message: "Admin comment is required when rejecting leave"
            });
        }

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        if (leave.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: `Leave request already ${leave.status.toLowerCase()}`
            });
        }

        leave.status = "REJECTED";
        leave.adminComment = adminComment;

        await leave.save();

        await leave.populate({
            path: "employeeId",
            select: "employeeCode fullName department"
        });

        res.status(200).json({
            success: true,
            leave,
            message: "Leave request rejected"
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
   GET LEAVE BALANCE (EMPLOYEE)
   View remaining leave balance
========================================= */
export const getLeaveBalance = async (req, res) => {
    try {
        // Get employee from logged-in user
        const employee = await Employee.findOne({ userId: req.user._id });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found"
            });
        }

        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

        // Get approved leaves for current year
        const approvedLeaves = await Leave.find({
            employeeId: employee._id,
            status: "APPROVED",
            fromDate: { $gte: startDate, $lte: endDate }
        });

        // Calculate used leaves by type
        const paidUsed = approvedLeaves
            .filter(l => l.leaveType === "PAID")
            .reduce((sum, l) => sum + l.totalDays, 0);

        const sickUsed = approvedLeaves
            .filter(l => l.leaveType === "SICK")
            .reduce((sum, l) => sum + l.totalDays, 0);

        const unpaidUsed = approvedLeaves
            .filter(l => l.leaveType === "UNPAID")
            .reduce((sum, l) => sum + l.totalDays, 0);

        // Standard leave allocation (can be customized)
        const paidAllowance = 20; // 20 paid leaves per year
        const sickAllowance = 10; // 10 sick leaves per year
        const unpaidAllowance = 5; // 5 unpaid leaves per year

        res.status(200).json({
            success: true,
            year: currentYear,
            leaveBalance: {
                paid: {
                    total: paidAllowance,
                    used: paidUsed,
                    remaining: paidAllowance - paidUsed
                },
                sick: {
                    total: sickAllowance,
                    used: sickUsed,
                    remaining: sickAllowance - sickUsed
                },
                unpaid: {
                    total: unpaidAllowance,
                    used: unpaidUsed,
                    remaining: unpaidAllowance - unpaidUsed
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
