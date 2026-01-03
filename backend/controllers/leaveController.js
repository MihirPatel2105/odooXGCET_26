import Leave from "../models/Leave.js";

export const applyLeave = async (req, res) => {
    const leave = await Leave.create({
        employeeId: req.user.employeeId,
        ...req.body
    });
    res.status(201).json(leave);
};

export const getSelfLeaves = async (req, res) => {
    const leaves = await Leave.find({ employeeId: req.user.employeeId });
    res.json(leaves);
};

export const getAllLeaves = async (req, res) => {
    const leaves = await Leave.find().populate("employeeId");
    res.json(leaves);
};

export const approveLeave = async (req, res) => {
    const leave = await Leave.findByIdAndUpdate(
        req.params.id,
        { status: "APPROVED" },
        { new: true }
    );
    res.json(leave);
};

export const rejectLeave = async (req, res) => {
    const leave = await Leave.findByIdAndUpdate(
        req.params.id,
        { status: "REJECTED", adminComment: req.body.comment },
        { new: true }
    );
    res.json(leave);
};
