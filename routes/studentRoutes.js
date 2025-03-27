const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const upload = require('../middleware/upload');

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-jwt-key-change-this-in-production');
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Helper function to generate unique examination roll number
const generateUniqueExamRollNumber = async () => {
    let isUnique = false;
    let examinationRollNumber;
    
    while (!isUnique) {
        // Generate a random 6-digit number
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        examinationRollNumber = `EX-${randomNum}`;
        
        // Check if this roll number already exists
        const existingStudent = await Student.findOne({ examinationRollNumber });
        if (!existingStudent) {
            isUnique = true;
        }
    }
    
    return examinationRollNumber;
};

// ✅ Student Registration Route (Fixed)
router.post('/', protect, upload.single('profilePhoto'), async (req, res) => {
    try {
        let {
            studentName,
            collegeRollNumber,
            programType,
            stream,
            batch,
            email,
            password,
        } = req.body;

        // Log the raw request body
        console.log('Raw request body:', req.body);
        console.log('Raw request files:', req.files);
        console.log('Raw request file:', req.file);

        // Trim all string inputs
        studentName = studentName?.trim();
        collegeRollNumber = collegeRollNumber?.trim();
        stream = stream?.trim();
        batch = batch?.trim();
        email = email?.trim().toLowerCase();

        console.log('Processed student data:', {
            studentName,
            collegeRollNumber,
            programType,
            stream,
            batch,
            email,
            hasPassword: !!password,
            hasFile: !!req.file
        });

        // ✅ Validate required fields
        const missingFields = [];
        if (!studentName) missingFields.push('studentName');
        if (!collegeRollNumber) missingFields.push('collegeRollNumber');
        if (!programType) missingFields.push('programType');
        if (!stream) missingFields.push('stream');
        if (!batch) missingFields.push('batch');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            return res.status(400).json({
                status: 'fail',
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // ✅ Ensure program type is valid
        if (!['UG', 'PG'].includes(programType)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Program type must be either UG or PG'
            });
        }

        // ✅ Generate unique examination roll number
        const examinationRollNumber = await generateUniqueExamRollNumber();

        // ✅ Check if email already exists
        const existingEmail = await Student.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already registered'
            });
        }

        // ✅ Check if college roll number already exists
        const existingCollegeRoll = await Student.findOne({ collegeRollNumber });
        if (existingCollegeRoll) {
            return res.status(400).json({
                status: 'fail',
                message: 'College roll number already exists'
            });
        }

        // ✅ Handle Profile Photo Upload
        const profilePhoto = req.file ? `/uploads/students/${req.file.filename}` : null;

        // ✅ Create Student Record
        const student = await Student.create({
            studentName,
            email,
            password,
            collegeRollNumber,
            programType,
            stream,
            batch,
            examinationRollNumber,
            profilePhoto,
            createdBy: req.admin._id
        });

        res.status(201).json({
            status: 'success',
            message: 'Student created successfully',
            data: {
                student: {
                    id: student._id,
                    studentName: student.studentName,
                    email: student.email,
                    collegeRollNumber: student.collegeRollNumber,
                    programType: student.programType,
                    stream: student.stream,
                    batch: student.batch,
                    examinationRollNumber: student.examinationRollNumber,
                    examCode: student.examCode, 
                    profilePhoto: student.profilePhoto,
                    createdAt: student.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Error creating student:', error);
        
        // ✅ Handle Duplicate Key Errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            let message = '';
            switch(field) {
                case 'email':
                    message = 'Email already registered';
                    break;
                case 'collegeRollNumber':
                    message = 'College roll number already exists';
                    break;
                case 'examinationRollNumber':
                    message = 'Error generating examination roll number. Please try again.';
                    break;
                case 'examCode':
                    message = 'Error generating exam code. Please try again.';
                    break;
                default:
                    message = `${field} already exists`;
            }
            return res.status(400).json({
                status: 'fail',
                message
            });
        }
        
        // ✅ Handle Validation Errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: messages.join(', ')
            });
        }
        
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});
// Get all students
router.get('/', protect, async (req, res) => {
    try {
        const students = await Student.find({ createdBy: req.admin._id });
        
        res.status(200).json({
            status: 'success',
            results: students.length,
            data: {
                students: students.map(student => ({
                    id: student._id,
                    studentName: student.studentName,
                    collegeRollNumber: student.collegeRollNumber,
                    programType: student.programType,
                    stream: student.stream,
                    batch: student.batch,
                    examinationRollNumber: student.examinationRollNumber,
                    examCode: student.examCode,
                    profilePhoto: student.profilePhoto
                }))
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});

// Get single student
router.get('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findOne({
            _id: req.params.id,
            createdBy: req.admin._id
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                student: {
                    id: student._id,
                    studentName: student.studentName,
                    collegeRollNumber: student.collegeRollNumber,
                    programType: student.programType,
                    stream: student.stream,
                    batch: student.batch,
                    examinationRollNumber: student.examinationRollNumber,
                    examCode: student.examCode,
                    profilePhoto: student.profilePhoto
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});

// Update student
router.patch('/:id', protect, upload.single('profilePhoto'), async (req, res) => {
    try {
        const {
            studentName,
            collegeRollNumber,
            programType,
            stream,
            batch,
            examinationRollNumber,
            examCode
        } = req.body;

        const updateData = {
            studentName,
            collegeRollNumber,
            programType,
            stream,
            batch,
            examinationRollNumber,
            examCode
        };

        if (req.file) {
            updateData.profilePhoto = `/uploads/students/${req.file.filename}`;
        }

        const student = await Student.findOneAndUpdate(
            {
                _id: req.params.id,
                createdBy: req.admin._id
            },
            updateData,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                student: {
                    id: student._id,
                    studentName: student.studentName,
                    collegeRollNumber: student.collegeRollNumber,
                    programType: student.programType,
                    stream: student.stream,
                    batch: student.batch,
                    examinationRollNumber: student.examinationRollNumber,
                    examCode: student.examCode,
                    profilePhoto: student.profilePhoto
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});

// Delete student
router.delete('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.admin._id
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});

module.exports = router; 