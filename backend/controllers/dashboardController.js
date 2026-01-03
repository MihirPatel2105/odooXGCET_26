import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";

export const getDashboardStats = async (req, res) => {
    const employees = await Employee.countDocuments();
    const leavesPending = await Leave.countDocuments({ status: "PENDING" });
    const todayAttendance = await Attendance.countDocuments({
        date: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    res.json({ employees, leavesPending, todayAttendance });
};
