const express = require('express');
const router = express.Router();
const {
  createJob,
  getSingleJobById, 
  getAllJobs,
  updateJob,
  deleteJob,
} = require('../Controller/jobs.controller');
const { authenticate } = require("../middleware/auth.middleware");

router.post('/createjob', authenticate, createJob); // Create
router.get('/alljobs', getAllJobs); // Read All
router.get('/singlejob/:id', getSingleJobById); // updated route by ID
router.put('/update/:id', updateJob); // Update by ID
router.delete('/delete-jobs/:id', deleteJob); // Delete by ID

module.exports = router;
