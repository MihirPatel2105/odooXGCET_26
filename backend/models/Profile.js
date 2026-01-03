import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    skills: [String],
    certifications: [String],
    experience: String,
    emergencyContact: {
        name: String,
        phone: String
    }
}, { timestamps: true });
export default mongoose.model("Profile", profileSchema);