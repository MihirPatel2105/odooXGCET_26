import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

dotenv.config();

const generateTestAttendance = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all employees
    const employees = await Employee.find();
    console.log(`Found ${employees.length} employees`);

    if (employees.length === 0) {
      console.log('No employees found. Please create employees first.');
      process.exit(0);
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create attendance for each employee
    for (const employee of employees) {
      // Check if attendance already exists
      const existing = await Attendance.findOne({
        employeeId: employee._id,
        date: today
      });

      if (existing) {
        console.log(`Attendance already exists for ${employee.fullName}`);
        continue;
      }

      // Random check-in time between 8:00 AM and 10:00 AM
      const checkInHour = 8 + Math.floor(Math.random() * 2);
      const checkInMinute = Math.floor(Math.random() * 60);
      const checkInTime = new Date(today);
      checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

      // Random check-out time between 5:00 PM and 7:00 PM
      const checkOutHour = 17 + Math.floor(Math.random() * 2);
      const checkOutMinute = Math.floor(Math.random() * 60);
      const checkOutTime = new Date(today);
      checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);

      // Calculate work hours
      const workMs = checkOutTime - checkInTime;
      const workHours = workMs / (1000 * 60 * 60);
      const extraHours = Math.max(0, workHours - 8);

      const attendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        workHours: workHours.toFixed(2),
        extraHours: extraHours.toFixed(2),
        status: 'PRESENT'
      });

      console.log(`✓ Created attendance for ${employee.fullName} - Check In: ${checkInTime.toLocaleTimeString()}, Check Out: ${checkOutTime.toLocaleTimeString()}`);
    }

    console.log('\nTest attendance data generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

generateTestAttendance();
