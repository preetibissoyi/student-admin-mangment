const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    collegeRollNumber: {
        type: String,
        required: [true, 'College roll number is required'],
        unique: true,
        trim: true
    },
    examinationRollNumber: {
        type: String,
        required: [true, 'Examination roll number is required'],
        unique: true,
        trim: true
    },
    batch: {
        type: String,
        required: [true, 'Batch is required'],
        trim: true
    },
    stream: {
        type: String,
        required: [true, 'Stream is required'],
        trim: true
    },
    examCode: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for examRollNumber
studentSchema.virtual('examRollNumber').get(function() {
    return this.examinationRollNumber;
});

// Create indexes
studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ collegeRollNumber: 1 }, { unique: true });
studentSchema.index({ examinationRollNumber: 1 }, { unique: true });

// Generate 6-digit exam code
const generateExamCode = async () => {
    let code;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
        // Generate a 6-digit number
        code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Check if code already exists
        const existingStudent = await mongoose.model('Student').findOne({ examCode: code });
        if (!existingStudent) {
            isUnique = true;
        }
        attempts++;
    }

    if (!isUnique) {
        throw new Error('Failed to generate unique exam code');
    }

    return code;
};

// Hash password before saving
studentSchema.pre('save', async function(next) {
    try {
        // Generate exam code only for new students
        if (this.isNew && !this.examCode) {
            this.examCode = await generateExamCode();
        }

        // Hash password only if modified
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 12);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
studentSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
