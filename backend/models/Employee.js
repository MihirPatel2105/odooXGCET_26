import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    employeeCode: {
        type: String,
        unique: true,
        required: true
    },
    fullName: String,
    phone: String,
    address: String,
    designation: String,
    department: String,
    dateOfJoining: Date,
    profileImage: String,
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
export default mongoose.model("Employee", employeeSchema);