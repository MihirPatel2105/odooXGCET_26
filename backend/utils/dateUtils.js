export const startOfDay = (date = new Date()) => {
    return new Date(date.setHours(0, 0, 0, 0));
};

export const endOfDay = (date = new Date()) => {
    return new Date(date.setHours(23, 59, 59, 999));
};

export const calculateDaysBetween = (from, to) => {
    const diff = new Date(to) - new Date(from);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};
