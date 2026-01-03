import mongoose from "mongoose";
const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    leaveType: {
        type: String,
        enum: ["PAID", "SICK", "UNPAID"],
        required: true
    },
    fromDate: Date,
    toDate: Date,
    totalDays: Number,
    reason: String,
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    adminComment: String,
    attachment: String
}, { timestamps: true });
export default mongoose.model("Leave", leaveSchema);