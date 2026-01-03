import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

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

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    // Fetch attendance records
    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .lean();

    // Format response
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

    res.status(200).json({
      success: true,
      count: formattedAttendance.length,
      attendance: formattedAttendance
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
    // Get query parameters for filtering
    const { month, year, employeeId } = req.query;

    let query = {};

    // Filter by employee if provided
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
  try {
    const { date } = req.query;

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

    // Fetch attendance for the specific date
    const attendance = await Attendance.find({
      date: { $gte: searchDate, $lt: nextDay }
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
