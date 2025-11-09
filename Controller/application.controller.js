const Application = require('../models/application');
const Job = require('../models/job');
const fs = require('fs');
const path = require('path');

// Submit a new job application
const submitApplication = async (req, res) => {
    try {
        console.log('📥 Received application submission');
        console.log('📄 File info:', req.file); // Multer attaches file info here
        console.log('📋 Form data:', req.body);

        // Get file path from multer (req.file is populated by multer middleware)
        const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : null;

        if (!resumeUrl) {
            return res.status(400).json({
                success: false,
                message: 'Resume file is required'
            });
        }

        const {
            jobId,
            fullName,
            email,
            phone,
            age,
            experience,
            currentCompany,
            currentPosition,
            education,
            coverLetter,
            portfolioUrl,
            linkedinUrl,
            noticePeriod,
            expectedSalary
        } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if user already applied for this job
        const existingApplication = await Application.findOne({ jobId, email });
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Create new application
        const application = new Application({
            jobId,
            userId: req.user?.id || null, // If user is logged in
            fullName,
            email,
            phone,
            age,
            experience,
            currentCompany,
            currentPosition,
            education,
            resumeUrl,
            coverLetter,
            portfolioUrl,
            linkedinUrl,
            noticePeriod,
            expectedSalary
        });

        await application.save();

        console.log('✅ Application saved successfully');

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        console.error('❌ Error submitting application:', error);
        
        // If there was an error and a file was uploaded, delete it
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads/resumes', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('🗑️ Deleted uploaded file due to error');
            }
        }

        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
};

// Get all applications for a specific job (Admin only)
const getApplicationsByJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const applications = await Application.find({ jobId })
            .populate('userId', 'name email')
            .populate('jobId', 'title company')
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message
        });
    }
};

// Get all applications by a user
const getApplicationsByUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { email } = req.query;

        let query = {};
        if (userId) {
            query.userId = userId;
        } else if (email) {
            query.email = email;
        } else {
            return res.status(400).json({
                success: false,
                message: 'User ID or email is required'
            });
        }

        const applications = await Application.find(query)
            .populate('jobId', 'title company location salary')
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Error fetching user applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message
        });
    }
};

// Update application status (Admin only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('jobId', 'title company');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: application
        });
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application',
            error: error.message
        });
    }
};

// Get single application details
const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id)
            .populate('userId', 'name email')
            .populate('jobId', 'title company location salary');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application',
            error: error.message
        });
    }
};

// Delete application
const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findByIdAndDelete(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete application',
            error: error.message
        });
    }
};

module.exports = {
    submitApplication,
    getApplicationsByJob,
    getApplicationsByUser,
    updateApplicationStatus,
    getApplicationById,
    deleteApplication
};
