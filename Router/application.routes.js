const express = require('express');
const router = express.Router();
const {
    submitApplication,
    getApplicationsByJob,
    getApplicationsByUser,
    updateApplicationStatus,
    getApplicationById,
    deleteApplication
} = require('../Controller/application.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public route - Submit application with file upload
// upload.single('resume') means: expect ONE file with field name 'resume'
router.post('/submit', 
  upload.single('resume'), // Multer handles file upload FIRST
  (req, res, next) => {
    // Optional authentication - try to authenticate but don't require it
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      authenticate(req, res, (err) => {
        if (err) req.user = null;
        next();
      });
    } else {
      next();
    }
  }, 
  submitApplication // Then controller handles the request
);

// Protected routes - Require authentication
router.get('/user', authenticate, getApplicationsByUser);
router.get('/:id', authenticate, getApplicationById);

// Admin only routes
router.get('/job/:jobId', authenticate, authorizeAdmin, getApplicationsByJob);
router.patch('/:id/status', authenticate, authorizeAdmin, updateApplicationStatus);
router.delete('/:id', authenticate, authorizeAdmin, deleteApplication);

module.exports = router;
