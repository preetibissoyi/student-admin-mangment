const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Result = require('../models/Result');

// Authentication middleware
const authenticateStudent = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get student from token
            const student = await Student.findById(decoded.id).select('-password');
            
            if (!student) {
                return res.status(401).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Add student to request object
            req.student = student;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in authentication',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get student profile
router.get('/profile', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findById(req.student._id)
            .select('studentName examRollNumber examCode stream batch')
            .lean();

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: {
                studentName: student.studentName,
                examRollNumber: student.examRollNumber,
                examCode: student.examCode,
                stream: student.stream,
                batch: student.batch
            }
        });
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching student profile',
            error: error.message
        });
    }
});

// Get student marks
router.get('/marks', authenticateStudent, async (req, res) => {
    try {
        const results = await Result.find({ studentId: req.student._id })
            .select('examCode subjectCode marks grade semester')
            .sort({ semester: 1 })
            .lean();

        if (!results.length) {
            return res.status(404).json({
                success: false,
                message: 'No results found for this student'
            });
        }

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student marks',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Download examination card
router.get('/exam-card', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findById(req.student._id)
            .select('studentName examRollNumber examCode programType stream batch')
            .lean();

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Generate examination card data
        const examCard = {
            studentName: student.studentName,
            examRollNumber: student.examRollNumber,
            examCode: student.examCode,
            programType: student.programType,
            stream: student.stream,
            batch: student.batch,
            examDate: new Date().toISOString().split('T')[0], // You might want to get this from a config or database
            examCenter: 'Your Exam Center', // This should come from configuration
            examTime: '9:00 AM - 12:00 PM' // This should come from configuration
        };

        res.status(200).json({
            success: true,
            data: examCard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating examination card',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router; 