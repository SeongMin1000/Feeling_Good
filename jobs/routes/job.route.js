// jobs/routes/job.route.js
const express = require('express');
const {
  getAllJobs,
  getJobById,
  createJob,
  addReview
} = require('../controllers/jobs.controller');
const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.post('/:id/ratings', addReview);

module.exports = router;