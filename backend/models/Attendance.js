import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: Date,
    checkOut: Date,
    workHours: Number,
    extraHours: Number,
    status: {
        type: String,
        enum: ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"],
        default: "PRESENT"
    }
}, { timestamps: true });
export default mongoose.model("Attendance", attendanceSchema);