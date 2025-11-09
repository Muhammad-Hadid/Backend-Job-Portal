const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    // Job Reference
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    
    // User Reference (if logged in)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    
    // Personal Information
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: 18,
        max: 100
    },
    
    // Professional Information
    experience: {
        type: Number,
        required: [true, 'Years of experience is required'],
        min: 0
    },
    currentCompany: {
        type: String,
        trim: true,
        default: ''
    },
    currentPosition: {
        type: String,
        trim: true,
        default: ''
    },
    education: {
        type: String,
        required: [true, 'Education qualification is required'],
        trim: true
    },
    
    // Application Documents
    resumeUrl: {
        type: String,
        required: [true, 'Resume is required']
    },
    coverLetter: {
        type: String,
        trim: true,
        default: ''
    },
    portfolioUrl: {
        type: String,
        trim: true,
        default: ''
    },
    linkedinUrl: {
        type: String,
        trim: true,
        default: ''
    },
    
    // Application Status
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
        default: 'pending'
    },
    
    // Additional Info
    noticePeriod: {
        type: String,
        default: 'Immediate'
    },
    expectedSalary: {
        type: Number,
        default: 0
    },
    
    // Timestamps
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
applicationSchema.index({ jobId: 1, email: 1 });
applicationSchema.index({ userId: 1 });

module.exports = mongoose.model('Application', applicationSchema);
