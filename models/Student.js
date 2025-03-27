const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    collegeRollNumber: {
        type: String,
        required: [true, 'College roll number is required'],
        unique: true,
        trim: true
    },
    programType: {
        type: String,
        required: [true, 'Program type is required'],
        enum: ['UG', 'PG']
    },
    stream: {
        type: String,
        required: [true, 'Stream is required'],
        trim: true
    },
    batch: {
        type: String,
        required: [true, 'Batch is required'],
        trim: true
    },
    examinationRollNumber: {
        type: String,
        required: [true, 'Examination roll number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Examination roll number cannot be empty'
        }
    },
    examCode: {
        type: String,
        unique: true,
        trim: true
    },
    profilePhoto: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, { timestamps: true });

// Function to generate random alphanumeric code
const generateExamCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Hash password before saving
studentSchema.pre('save', async function (next) {
    try {
        // Hash password if it's modified
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 12);
        }

        // Generate exam code if it's a new student
        if (this.isNew) {
            let isUnique = false;
            let examCode;
            
            // Keep trying until we get a unique code
            while (!isUnique) {
                examCode = generateExamCode();
                const existingStudent = await this.constructor.findOne({ examCode });
                if (!existingStudent) {
                    isUnique = true;
                }
            }
            
            this.examCode = examCode;
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Add index for faster queries
studentSchema.index({ collegeRollNumber: 1 }, { unique: true });
studentSchema.index({ examinationRollNumber: 1 }, { unique: true });
studentSchema.index({ email: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
