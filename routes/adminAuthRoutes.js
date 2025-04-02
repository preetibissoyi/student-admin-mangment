const express = require('express');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
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
            success: true,
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
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in admin registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt received:', { email: req.body.email });
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            console.log('Missing credentials');
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if admin exists && password is correct
        const admin = await Admin.findOne({ email }).select('+password');
        console.log('Admin found:', admin ? 'Yes' : 'No');

        if (!admin) {
            console.log('Admin not found');
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordCorrect = await admin.matchPassword(password);
        console.log('Password correct:', isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log('Invalid password');
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        console.log('Login successful, sending response');
        res.status(200).json({
            success: true,
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
        res.status(500).json({
            success: false,
            message: 'Error in admin login',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router; 