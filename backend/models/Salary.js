import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: [true, "Employee ID is required"],
        unique: true // Constraint: One salary record per employee
    },
    wageType: {
        type: String,
        enum: {
            values: ["MONTHLY", "YEARLY"],
            message: "Wage type must be either MONTHLY or YEARLY"
        },
        required: [true, "Wage type is required"]
    },
    wage: {
        type: Number,
        required: [true, "Wage amount is required"],
        min: [0, "Wage cannot be negative"]
    },
    workingDaysPerWeek: {
        type: Number,
        min: [1, "Working days must be at least 1"],
        max: [7, "Working days cannot exceed 7"],
        default: 5
    },
    // Salary Components with percentage and fixed values
    components: {
        // Basic component (percentage of wage)
        basicPercentage: {
            type: Number,
            min: [0, "Basic percentage cannot be negative"],
            max: [100, "Basic percentage cannot exceed 100"],
            default: 50
        },
        basicAmount: Number, // Calculated value
        
        // HRA component (percentage of basic)
        hraPercentage: {
            type: Number,
            min: [0, "HRA percentage cannot be negative"],
            max: [100, "HRA percentage cannot exceed 100"],
            default: 50
        },
        hraAmount: Number, // Calculated value
        
        // Standard allowances (fixed amounts)
        allowances: {
            standardAllowance: {
                type: Number,
                min: [0, "Standard allowance cannot be negative"],
                default: 0
            },
            performanceBonus: {
                type: Number,
                min: [0, "Performance bonus cannot be negative"],
                default: 0
            },
            leaveEncashment: {
                type: Number,
                min: [0, "Leave encashment cannot be negative"],
                default: 0
            }
        }
    },
    
    // Professional Fund (PF) Deduction
    deductions: {
        pfContribution: {
            type: Number,
            min: [0, "PF contribution cannot be negative"],
            default: 0
        },
        pfPercentage: {
            type: Number,
            min: [0, "PF percentage cannot be negative"],
            max: [100, "PF percentage cannot exceed 100"],
            default: 12
        },
        professionalTax: {
            type: Number,
            min: [0, "Professional tax cannot be negative"],
            default: 200
        },
        otherDeductions: {
            type: Number,
            min: [0, "Other deductions cannot be negative"],
            default: 0
        }
    },
    
    // Calculated total salary
    totalSalary: {
        type: Number,
        required: true,
        min: [0, "Total salary cannot be negative"]
    },
    
    // Computation configuration
    computationType: {
        type: String,
        enum: ["FIXED_AMOUNT", "PERCENTAGE"],
        default: "PERCENTAGE"
    },
    
    // Metadata
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    notes: String
    
}, { 
    timestamps: true,
    // Constraint: Ensure unique employee salary record
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Constraint: Index for fast lookups
salarySchema.index({ employeeId: 1 });

// Pre-save middleware: Calculate component amounts automatically
salarySchema.pre('save', function(next) {
    // Constraint: Calculate basic amount from percentage
    if (this.components.basicPercentage && this.wage) {
        this.components.basicAmount = (this.wage * this.components.basicPercentage) / 100;
    }
    
    // Constraint: Calculate HRA from basic amount
    if (this.components.hraPercentage && this.components.basicAmount) {
        this.components.hraAmount = (this.components.basicAmount * this.components.hraPercentage) / 100;
    }
    
    // Constraint: Calculate PF contribution from basic
    if (this.deductions.pfPercentage && this.components.basicAmount) {
        this.deductions.pfContribution = (this.components.basicAmount * this.deductions.pfPercentage) / 100;
    }
    
    next();
});

// Virtual field: Total gross salary (before deductions)
salarySchema.virtual('grossSalary').get(function() {
    const basic = this.components.basicAmount || 0;
    const hra = this.components.hraAmount || 0;
    const allowances = this.components.allowances || {};
    const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + (val || 0), 0);
    
    return basic + hra + totalAllowances;
});

// Virtual field: Total deductions
salarySchema.virtual('totalDeductions').get(function() {
    const deductions = this.deductions || {};
    return (deductions.pfContribution || 0) + 
           (deductions.professionalTax || 0) + 
           (deductions.otherDeductions || 0);
});

export default mongoose.model("Salary", salarySchema);