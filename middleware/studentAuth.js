const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Get token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if student still exists
    const currentStudent = await Student.findById(decoded.id);
    if (!currentStudent) {
        return next(new AppError('The student belonging to this token no longer exists.', 401));
    }

    // Grant access to protected route
    req.student = currentStudent;
    next();
}); 