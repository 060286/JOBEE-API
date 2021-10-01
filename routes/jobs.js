const express = require('express');
const router = express.Router();

// import jobs controller methos
const { getJobs, newJob, getJobsInRadius, updateJob, deleteJob, getJob, jobStats } = require('../controllers/jobsController');

router.route('/jobs').get(getJobs);

router.route('/job/new').post(newJob);

router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);

router.route('/jobs/stats/:topic').get(jobStats);

router.route('/job/:id').put(updateJob).delete(deleteJob);

router.route('/job/:id/:slug').get(getJob);

module.exports = router;
