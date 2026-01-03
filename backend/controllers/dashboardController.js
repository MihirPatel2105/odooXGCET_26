import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import User from "../models/User.js";

/* =========================================
   ADMIN DASHBOARD STATS
========================================= */
export const getDashboardStats = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments({ status: "ACTIVE" });
        const pendingLeaves = await Leave.countDocuments({ status: "PENDING" });
        
        // Today's attendance
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayAttendance = await Attendance.countDocuments({
            date: { $gte: today }
        });

        // Recent activity - last 5 leave requests
        const recentLeaves = await Leave.find()
            .populate("employeeId", "employeeCode fullName")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalEmployees,
                pendingLeaves,
                todayAttendance,
                recentLeaves
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================================
   EMPLOYEE DASHBOARD DATA
========================================= */
export const getEmployeeDashboard = async (req, res) => {
    try {
        // Get employee from logged-in user
        const employee = await Employee.findOne({ userId: req.user._id });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found"
            });
        }

        // Get today's attendance status
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayAttendance = await Attendance.findOne({
            employeeId: employee._id,
            date: { $gte: today }
        });

        // Get pending leave requests
        const pendingLeaves = await Leave.countDocuments({
            employeeId: employee._id,
            status: "PENDING"
        });

        // Get this month's attendance summary
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const attendanceRecords = await Attendance.find({
            employeeId: employee._id,
            date: { $gte: startOfMonth }
        });

        const presentDays = attendanceRecords.filter(a => a.status === "PRESENT").length;
        const absentDays = attendanceRecords.filter(a => a.status === "ABSENT").length;
        const halfDays = attendanceRecords.filter(a => a.status === "HALF_DAY").length;

        // Get leave balance
        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

        const approvedLeaves = await Leave.find({
            employeeId: employee._id,
            status: "APPROVED",
            fromDate: { $gte: yearStart, $lte: yearEnd }
        });

        const paidUsed = approvedLeaves
            .filter(l => l.leaveType === "PAID")
            .reduce((sum, l) => sum + l.totalDays, 0);

        res.status(200).json({
            success: true,
            dashboard: {
                profile: {
                    fullName: employee.fullName,
                    employeeCode: employee.employeeCode,
                    department: employee.department,
                    designation: employee.designation
                },
                todayAttendance: {
                    status: todayAttendance?.status || "NOT_MARKED",
                    checkInTime: todayAttendance?.checkInTime || null,
                    checkOutTime: todayAttendance?.checkOutTime || null
                },
                monthlyAttendance: {
                    present: presentDays,
                    absent: absentDays,
                    halfDay: halfDays
                },
                leaves: {
                    pending: pendingLeaves,
                    leaveBalance: 20 - paidUsed // Assuming 20 paid leaves per year
                },
                quickActions: [
                    { name: "View Profile", route: "/profile" },
                    { name: "Mark Attendance", route: "/attendance" },
                    { name: "Apply Leave", route: "/leaves/apply" },
                    { name: "View Salary", route: "/salary" }
                ]
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
