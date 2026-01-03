import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    loginId: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["EMPLOYEE", "ADMIN"],
        default: "EMPLOYEE"
    },
    isFirstLogin: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
export default mongoose.model("User", userSchema);