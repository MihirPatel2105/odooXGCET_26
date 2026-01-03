export const calculateSalary = (data) => {
    const { components = {}, deductions = {} } = data;

    const componentTotal =
        (components.basic || 0) +
        (components.hra || 0) +
        (components.allowance || 0) +
        (components.bonus || 0);

    const deductionTotal =
        (deductions.pf || 0) +
        (deductions.tax || 0) +
        (deductions.other || 0);

    return componentTotal - deductionTotal;
};
