const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Register a new student
router.post('/register', async (req, res) => {
    try {
        // Handle both examRollNumber and examinationRollNumber
        if (req.body.examRollNumber && !req.body.examinationRollNumber) {
            req.body.examinationRollNumber = req.body.examRollNumber;
        }

        // Validate required fields
        const requiredFields = [
            'studentName',
            'email',
            'password',
            'collegeRollNumber',
            'examinationRollNumber',
            'batch',
            'stream'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate email format
        if (!req.body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate password length
        if (req.body.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check for existing student with specific fields
        const existingEmail = await Student.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'A student with this email already exists'
            });
        }

        const existingCollegeRoll = await Student.findOne({ collegeRollNumber: req.body.collegeRollNumber });
        if (existingCollegeRoll) {
            return res.status(400).json({
                success: false,
                message: 'A student with this college roll number already exists'
            });
        }

        const existingExamRoll = await Student.findOne({ examinationRollNumber: req.body.examinationRollNumber });
        if (existingExamRoll) {
            return res.status(400).json({
                success: false,
                message: 'A student with this exam roll number already exists'
            });
        }

        // Create new student
        const student = new Student({
            studentName: req.body.studentName,
            email: req.body.email,
            password: req.body.password,
            rollNumber: req.body.rollNumber || null,
            collegeRollNumber: req.body.collegeRollNumber,
            examinationRollNumber: req.body.examinationRollNumber,
            batch: req.body.batch,
            stream: req.body.stream
        });

        await student.save();

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: {
                studentName: student.studentName,
                email: student.email,
                rollNumber: student.rollNumber,
                collegeRollNumber: student.collegeRollNumber,
                examinationRollNumber: student.examinationRollNumber,
                examRollNumber: student.examRollNumber,
                batch: student.batch,
                stream: student.stream,
                examCode: student.examCode,
                createdAt: student.createdAt
            }
        });
    } catch (error) {
        console.error('Student registration error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during student registration',
            error: error.message
        });
    }
});

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching students',
            error: error.message
        });
    }
});

// Get student profile
router.get('/profile', async (req, res) => {
    try {
        // If ID is provided, view that student's profile
        if (req.query.id) {
            const student = await Student.findById(req.query.id)
                .select('-password');

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            return res.json({
                success: true,
                data: student
            });
        }

        res.status(400).json({
            success: false,
            message: 'Please provide a student ID'
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

// Get student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .select('-password');

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
        console.error('Error fetching student:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching student',
            error: error.message
        });
    }
});

// Update student profile
router.put('/:id', async (req, res) => {
    try {
        // Handle both examRollNumber and examinationRollNumber
        if (req.body.examRollNumber && !req.body.examinationRollNumber) {
            req.body.examinationRollNumber = req.body.examRollNumber;
        }

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Fields that can be updated
        const allowedUpdates = [
            'studentName',
            'email',
            'collegeRollNumber',
            'examinationRollNumber',
            'batch',
            'stream'
        ];

        // Check if any of the fields to update are unique and already exist
        if (req.body.email && req.body.email !== student.email) {
            const existingEmail = await Student.findOne({ email: req.body.email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'A student with this email already exists'
                });
            }
        }

        if (req.body.collegeRollNumber && req.body.collegeRollNumber !== student.collegeRollNumber) {
            const existingCollegeRoll = await Student.findOne({ collegeRollNumber: req.body.collegeRollNumber });
            if (existingCollegeRoll) {
                return res.status(400).json({
                    success: false,
                    message: 'A student with this college roll number already exists'
                });
            }
        }

        if (req.body.examinationRollNumber && req.body.examinationRollNumber !== student.examinationRollNumber) {
            const existingExamRoll = await Student.findOne({ examinationRollNumber: req.body.examinationRollNumber });
            if (existingExamRoll) {
                return res.status(400).json({
                    success: false,
                    message: 'A student with this exam roll number already exists'
                });
            }
        }

        // Update only allowed fields
        allowedUpdates.forEach(update => {
            if (req.body[update] !== undefined) {
                student[update] = req.body[update];
            }
        });

        await student.save();

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: {
                studentName: student.studentName,
                email: student.email,
                collegeRollNumber: student.collegeRollNumber,
                examinationRollNumber: student.examinationRollNumber,
                examRollNumber: student.examRollNumber,
                batch: student.batch,
                stream: student.stream,
                examCode: student.examCode,
                updatedAt: student.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating student',
            error: error.message
        });
    }
});

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        await student.remove();

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting student',
            error: error.message
        });
    }
});

module.exports = router;
