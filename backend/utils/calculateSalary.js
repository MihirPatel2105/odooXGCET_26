/**
 * Calculate total salary based on components and deductions
 * Implements automatic calculation based on defined wage and percentages
 * 
 * @param {Object} data - Salary data with wage, components, and deductions
 * @returns {Number} - Total calculated salary (gross - deductions)
 */
export const calculateSalary = (data) => {
    const { wage = 0, components = {}, deductions = {} } = data;

    // Calculate Basic Amount (percentage of wage)
    const basicPercentage = components.basicPercentage || 50;
    const basicAmount = (wage * basicPercentage) / 100;

    // Calculate HRA (percentage of basic)
    const hraPercentage = components.hraPercentage || 50;
    const hraAmount = (basicAmount * hraPercentage) / 100;

    // Calculate allowances (fixed amounts)
    const allowances = components.allowances || {};
    const totalAllowances = 
        (allowances.standardAllowance || 0) +
        (allowances.performanceBonus || 0) +
        (allowances.leaveEncashment || 0);

    // Calculate Gross Salary
    const grossSalary = basicAmount + hraAmount + totalAllowances;

    // Calculate PF Contribution (percentage of basic)
    const pfPercentage = deductions.pfPercentage || 12;
    const pfContribution = (basicAmount * pfPercentage) / 100;

    // Calculate Total Deductions
    const totalDeductions =
        pfContribution +
        (deductions.professionalTax || 200) +
        (deductions.otherDeductions || 0);

    // Net Salary = Gross Salary - Total Deductions
    const netSalary = grossSalary - totalDeductions;

    // Constraint: Ensure net salary is not negative
    return Math.max(0, netSalary);
};

/**
 * Validate salary component percentages
 * 
 * @param {Object} components - Salary components
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateSalaryComponents = (components) => {
    const errors = [];

    if (components.basicPercentage !== undefined) {
        if (components.basicPercentage < 0 || components.basicPercentage > 100) {
            errors.push("Basic percentage must be between 0 and 100");
        }
    }

    if (components.hraPercentage !== undefined) {
        if (components.hraPercentage < 0 || components.hraPercentage > 100) {
            errors.push("HRA percentage must be between 0 and 100");
        }
    }

    if (components.allowances) {
        Object.entries(components.allowances).forEach(([key, value]) => {
            if (typeof value === 'number' && value < 0) {
                errors.push(`${key} cannot be negative`);
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Validate deduction percentages and amounts
 * 
 * @param {Object} deductions - Salary deductions
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateDeductions = (deductions) => {
    const errors = [];

    if (deductions.pfPercentage !== undefined) {
        if (deductions.pfPercentage < 0 || deductions.pfPercentage > 100) {
            errors.push("PF percentage must be between 0 and 100");
        }
    }

    if (deductions.professionalTax !== undefined && deductions.professionalTax < 0) {
        errors.push("Professional tax cannot be negative");
    }

    if (deductions.otherDeductions !== undefined && deductions.otherDeductions < 0) {
        errors.push("Other deductions cannot be negative");
    }

    return {
        valid: errors.length === 0,
        errors
    };
};
