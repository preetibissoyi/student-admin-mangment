const express = require('express');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const router = express.Router();

// Admin Registration
router.post('/register', catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return next(new AppError('Email already registered', 400));
    }

    // Create new admin
    const admin = await Admin.create({
        name,
        email,
        password,
        role: 'admin'
    });

    // Generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '1d'
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        }
    });
}));

// Admin Login
router.post('/login', catchAsync(async (req, res, next) => {
    try {
        console.log('Login attempt received:', { email: req.body.email });
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            console.log('Missing credentials');
            return next(new AppError('Please provide email and password', 400));
        }

        // Check if admin exists && password is correct
        const admin = await Admin.findOne({ email }).select('+password');
        console.log('Admin found:', admin ? 'Yes' : 'No');

        if (!admin) {
            console.log('Admin not found');
            return next(new AppError('Invalid email or password', 401));
        }

        // Check password
        const isPasswordCorrect = await admin.comparePassword(password);
        console.log('Password correct:', isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log('Invalid password');
            return next(new AppError('Invalid email or password', 401));
        }

        // Generate token
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        console.log('Login successful, sending response');
        res.status(200).json({
            status: 'success',
            token,
            data: {
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            }
        });
    } catch (error) {
        console.error('Login error details:', error);
        next(new AppError('An error occurred during login', 500));
    }
}));

module.exports = router; 