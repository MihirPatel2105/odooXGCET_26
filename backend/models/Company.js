import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    companyCode: {
        type: String,
        unique: true,
        required: true
    },
    logo: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
export default mongoose.model("Company", companySchema);