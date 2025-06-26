const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

// 채용공고 목록 조회
router.get('/', jobsController.getJobs);

// 채용공고 상세 조회
router.get('/:id', jobsController.getJobDetail);

// 채용공고 등록
router.post('/', jobsController.createJob);

module.exports = router; 