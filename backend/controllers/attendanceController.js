import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

/* =========================================
   API 1: CHECK-IN
========================================= */
export const checkIn = async (req, res) => {
  try {
    // Get employee from logged-in user
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found"
      });
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today"
      });
    }

    // Create attendance record
    const checkInTime = new Date();
    
    const attendance = await Attendance.create({
      employeeId: employee._id,
      date: today,
      checkIn: checkInTime,
      status: "PRESENT"
    });

    // Format time for response
    const formattedTime = checkInTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    res.status(201).json({
      success: true,
      message: "Check-in successful",
      checkInTime: formattedTime,
      attendance
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
   API 2: CHECK-OUT
========================================= */
export const checkOut = async (req, res) => {
  try {
    // Get employee from logged-in user
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found"
      });
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in found for today. Please check-in first."
      });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Check-in not found. Please check-in first."
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Already checked out today"
      });
    }

    // Set check-out time
    const checkOutTime = new Date();
    attendance.checkOut = checkOutTime;

    // Calculate work hours
    const diffMs = checkOutTime - attendance.checkIn;
    const workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    attendance.workHours = workHours;

    // Calculate extra hours (if more than 8 hours)
    if (workHours > 8) {
      attendance.extraHours = parseFloat((workHours - 8).toFixed(2));
    }

    // Update status based on work hours
    if (workHours < 4) {
      attendance.status = "HALF_DAY";
    } else {
      attendance.status = "PRESENT";
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      workHours: workHours,
      attendance
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
   API 3: GET OWN ATTENDANCE
========================================= */
export const getSelfAttendance = async (req, res) => {
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
    const { month, year } = req.query;

    let query = { employeeId: employee._id };

    // Default to current month if not provided
    let startDate, endDate;
    if (month && year) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    
    endDate.setHours(23, 59, 59, 999);
    query.date = { $gte: startDate, $lte: endDate };

    // Fetch attendance records
    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .lean();

    // Format response with working time details
    const formattedAttendance = attendance.map(record => ({
      _id: record._id,
      date: record.date.toISOString().split('T')[0],
      checkIn: record.checkIn ? record.checkIn.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) : null,
      checkOut: record.checkOut ? record.checkOut.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) : null,
      workHours: record.workHours || 0,
      extraHours: record.extraHours || 0,
      status: record.status
    }));

    // Calculate summary for payslip basis
    const presentDays = attendance.filter(a => a.status === "PRESENT").length;
    const halfDays = attendance.filter(a => a.status === "HALF_DAY").length;
    const leaveDays = attendance.filter(a => a.status === "LEAVE").length;
    const absentDays = attendance.filter(a => a.status === "ABSENT").length;
    
    // Calculate payable days (Present + Half_Day/2 + Approved Leaves)
    const payableDays = presentDays + (halfDays * 0.5) + leaveDays;

    res.status(200).json({
      success: true,
      count: formattedAttendance.length,
      attendance: formattedAttendance,
      summary: {
        totalDays: attendance.length,
        presentDays,
        halfDays,
        leaveDays,
        absentDays,
        payableDays: payableDays,
        unpaidDays: absentDays
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
   API 4: GET ALL ATTENDANCE (ADMIN)
========================================= */
export const getAllAttendance = async (req, res) => {
  try {
    // Get logged-in user's company
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser || !loggedInUser.companyId) {
      return res.status(400).json({
        success: false,
        message: "User company not found"
      });
    }

    // Get all employees from the same company
    const companyEmployees = await Employee.find({ 
      companyId: loggedInUser.companyId 
    }).select('_id');
    
    const employeeIds = companyEmployees.map(emp => emp._id);

    // Get query parameters for filtering
    const { month, year, employeeId } = req.query;

    let query = {
      employeeId: { $in: employeeIds } // Only show attendance from same company
    };

    // Filter by specific employee if provided
    if (employeeId) {
      query.employeeId = employeeId;
    }

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    // Fetch all attendance records
    const attendance = await Attendance.find(query)
      .populate({
        path: "employeeId",
        select: "employeeCode fullName department designation"
      })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance
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
   API 5: DATE-WISE ATTENDANCE FILTER (ADMIN)
========================================= */
export const getAttendanceByDate = async (req, res) => {
  try {    // Get logged-in user's company
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser || !loggedInUser.companyId) {
      return res.status(400).json({
        success: false,
        message: "User company not found"
      });
    }

    // Get all employees from the same company
    const companyEmployees = await Employee.find({ 
      companyId: loggedInUser.companyId 
    }).select('_id');
    
    const employeeIds = companyEmployees.map(emp => emp._id);

    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Please provide date in YYYY-MM-DD format"
      });
    }

    // Parse date
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Fetch attendance for the specific date and company
    const attendance = await Attendance.find({
      date: { $gte: searchDate, $lt: nextDay },
      employeeId: { $in: employeeIds } // Only show attendance from same company
    }).populate({
      path: "employeeId",
      select: "employeeCode fullName department designation"
    });

    res.status(200).json({
      success: true,
      date: date,
      count: attendance.length,
      attendance
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
   API 6: ATTENDANCE CORRECTION (ADMIN)
========================================= */
export const correctAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, checkIn, checkOut } = req.body;

    // Find attendance record
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    // Update fields
    if (status) {
      attendance.status = status;
    }

    if (checkIn) {
      attendance.checkIn = new Date(checkIn);
    }

    if (checkOut) {
      attendance.checkOut = new Date(checkOut);
    }

    // Recalculate work hours if both times are present
    if (attendance.checkIn && attendance.checkOut) {
      const diffMs = attendance.checkOut - attendance.checkIn;
      const workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
      attendance.workHours = workHours;

      // Calculate extra hours
      if (workHours > 8) {
        attendance.extraHours = parseFloat((workHours - 8).toFixed(2));
      } else {
        attendance.extraHours = 0;
      }

      // Auto-adjust status based on work hours if not explicitly set
      if (!req.body.status) {
        if (workHours < 4) {
          attendance.status = "HALF_DAY";
        } else {
          attendance.status = "PRESENT";
        }
      }
    }

    await attendance.save();

    await attendance.populate({
      path: "employeeId",
      select: "employeeCode fullName"
    });

    res.status(200).json({
      success: true,
      message: "Attendance corrected successfully",
      attendance
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
   API 7: GET TODAY'S ATTENDANCE (ADMIN)
   For viewing all employees present on current day
========================================= */
export const getTodayAttendance = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch today's attendance with employee details
    const attendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate({
      path: "employeeId",
      select: "employeeCode fullName department designation profileImage"
    }).sort({ checkIn: -1 });

    // Separate by status
    const present = attendance.filter(a => a.checkIn && a.status === "PRESENT");
    const halfDay = attendance.filter(a => a.status === "HALF_DAY");
    const onLeave = attendance.filter(a => a.status === "LEAVE");
    const absent = attendance.filter(a => a.status === "ABSENT");

    res.status(200).json({
      success: true,
      date: today.toISOString().split('T')[0],
      summary: {
        totalEmployees: attendance.length,
        present: present.length,
        halfDay: halfDay.length,
        onLeave: onLeave.length,
        absent: absent.length
      },
      attendance: {
        present,
        halfDay,
        onLeave,
        absent
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
   API 8: GET PAYABLE DAYS FOR EMPLOYEE
   Calculate payable days for payslip generation
========================================= */
export const getPayableDays = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;

    if (!employeeId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Please provide employeeId, month, and year"
      });
    }

    // Verify employee exists
    const employee = await Employee.findById(employeeId)
      .select("employeeCode fullName");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Get date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch attendance records for the month
    const attendance = await Attendance.find({
      employeeId: employeeId,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate attendance summary
    const presentDays = attendance.filter(a => a.status === "PRESENT").length;
    const halfDays = attendance.filter(a => a.status === "HALF_DAY").length;
    const leaveDays = attendance.filter(a => a.status === "LEAVE").length;
    const absentDays = attendance.filter(a => a.status === "ABSENT").length;

    // Calculate total working hours
    const totalWorkHours = attendance.reduce((sum, a) => sum + (a.workHours || 0), 0);
    const totalExtraHours = attendance.reduce((sum, a) => sum + (a.extraHours || 0), 0);

    // Calculate payable days
    // Formula: Present days + (Half days * 0.5) + Approved leave days
    const payableDays = presentDays + (halfDays * 0.5) + leaveDays;

    // Unpaid days = Absent days (these reduce salary)
    const unpaidDays = absentDays;

    // Total calendar days in month
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    res.status(200).json({
      success: true,
      employee: {
        id: employee._id,
        employeeCode: employee.employeeCode,
        fullName: employee.fullName
      },
      period: {
        month: parseInt(month),
        year: parseInt(year),
        totalDaysInMonth
      },
      attendance: {
        totalRecords: attendance.length,
        presentDays,
        halfDays,
        leaveDays,
        absentDays,
        totalWorkHours: parseFloat(totalWorkHours.toFixed(2)),
        totalExtraHours: parseFloat(totalExtraHours.toFixed(2))
      },
      payslipData: {
        payableDays: parseFloat(payableDays.toFixed(1)),
        unpaidDays: unpaidDays,
        deductionApplicable: unpaidDays > 0
      },
      message: unpaidDays > 0 
        ? `${unpaidDays} unpaid day(s) will reduce salary during payslip computation`
        : "No unpaid days. Full salary applicable."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
