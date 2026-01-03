import mongoose from "mongoose";
const salarySchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    wageType: {
        type: String,
        enum: ["MONTHLY", "YEARLY"],
        required: true
    },
    baseSalary: Number,
    components: {
        basic: Number,
        hra: Number,
        allowance: Number,
        bonus: Number
    },
    deductions: {
        pf: Number,
        tax: Number,
        other: Number
    },
    totalSalary: Number
}, { timestamps: true });
export default mongoose.model("Salary", salarySchema);