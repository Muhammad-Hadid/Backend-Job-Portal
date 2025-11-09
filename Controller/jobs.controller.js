const Job = require('../models/job');

// Create Job API
const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, company, benefits, responsibilities, requirements } = req.body;

    const newJob = await Job.create({
      title,
      description,
      location,
      salary,
      company,
      benefits,         // expect array
      responsibilities, // expect array
      requirements,     // expect array
    });

    return res.status(201).json({
      message: 'Job created successfully',
      job: newJob,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Job by ID
const getSingleJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.status(200).json({
      status: "success",
      jobs: jobs,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, description, location, salary, company, benefits, responsibilities, requirements } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.company = company || job.company;
    job.benefits = benefits || job.benefits;
    job.responsibilities = responsibilities || job.responsibilities;
    job.requirements = requirements || job.requirements;

    await job.save();

    return res.status(200).json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJob,
  getSingleJobById,
  getAllJobs,
  updateJob,
  deleteJob,
};
