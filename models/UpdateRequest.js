const mongoose = require('mongoose');

const updateRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    field: {
        type: String,
        required: true,
        enum: ['studentName', 'email', 'collegeRollNumber', 'programType', 'stream', 'batch', 'examinationRollNumber']
    },
    oldValue: {
        type: String,
        required: true
    },
    newValue: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    remarks: {
        type: String,
        default: null
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    processedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const UpdateRequest = mongoose.model('UpdateRequest', updateRequestSchema);

module.exports = UpdateRequest; 