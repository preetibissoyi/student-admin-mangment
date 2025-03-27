const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const UpdateRequest = require('../models/UpdateRequest');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Student Login
router.post('/login', catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const student = await Student.findOne({ email }).select('+password');
    if (!student || !(await student.comparePassword(password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    const token = jwt.sign(
        { id: student._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    student.password = undefined;
    res.status(200).json({
        status: 'success',
        token,
        data: { student }
    });
}));

// Authentication Middleware
const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentStudent = await Student.findById(decoded.id);
    if (!currentStudent) {
        return next(new AppError('The student belonging to this token no longer exists.', 401));
    }
    req.student = currentStudent;
    next();
});

// Get Student Profile
router.get('/profile', protect, catchAsync(async (req, res, next) => {
    const student = await Student.findById(req.student._id).select('-password');
    res.status(200).json({
        status: 'success',
        data: { student }
    });
}));

// Request Profile Update
router.post('/profile/update-request', protect, catchAsync(async (req, res, next) => {
    const { field, newValue } = req.body;
    const student = await Student.findById(req.student._id);
    
    if (!student[field]) {
        return next(new AppError('Invalid field for update', 400));
    }

    const updateRequest = await UpdateRequest.create({
        student: student._id,
        requestedBy: student._id,
        field,
        oldValue: student[field],
        newValue
    });

    res.status(201).json({
        status: 'success',
        data: { updateRequest }
    });
}));

// Get Update Request History
router.get('/profile/update-history', protect, catchAsync(async (req, res, next) => {
    const updateRequests = await UpdateRequest.find({ student: req.student._id })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        data: { updateRequests }
    });
}));

// Get Pending Update Requests
router.get('/profile/pending-requests', protect, catchAsync(async (req, res, next) => {
    const pendingRequests = await UpdateRequest.find({
        student: req.student._id,
        status: 'pending'
    });

    res.status(200).json({
        status: 'success',
        data: { pendingRequests }
    });
}));

// Update Password
router.patch('/profile/update-password', protect, catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const student = await Student.findById(req.student._id).select('+password');

    if (!(await student.comparePassword(currentPassword))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    student.password = newPassword;
    await student.save();

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully'
    });
}));

module.exports = router; 