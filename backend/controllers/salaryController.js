import Salary from "../models/Salary.js";
import { calculateSalary } from "../utils/calculateSalary.js";

export const createSalary = async (req, res) => {
    const totalSalary = calculateSalary(req.body);
    const salary = await Salary.create({ ...req.body, totalSalary });
    res.status(201).json(salary);
};

export const getSalaryByEmployee = async (req, res) => {
    const salary = await Salary.findOne({ employeeId: req.params.empId });
    res.json(salary);
};

export const updateSalary = async (req, res) => {
    const totalSalary = calculateSalary(req.body);
    const salary = await Salary.findOneAndUpdate(
        { employeeId: req.params.empId },
        { ...req.body, totalSalary },
        { new: true }
    );
    res.json(salary);
};

export const getAllSalaries = async (req, res) => {
    const salaries = await Salary.find().populate("employeeId");
    res.json(salaries);
};
