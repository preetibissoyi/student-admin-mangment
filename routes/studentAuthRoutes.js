const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Login student
// @route   POST /api/student/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if student exists
        const student = await Student.findOne({ email }).select('+password');
        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if password matches
        const isMatch = await student.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(student._id);

        res.json({
            success: true,
            data: {
                _id: student._id,
                studentName: student.studentName,
                email: student.email,
                collegeRollNumber: student.collegeRollNumber,
                examinationRollNumber: student.examinationRollNumber,
                batch: student.batch,
                stream: student.stream,
                examCode: student.examCode,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred during login',
            error: error.message
        });
    }
});

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.user._id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching profile',
            error: error.message
        });
    }
});

module.exports = router;
