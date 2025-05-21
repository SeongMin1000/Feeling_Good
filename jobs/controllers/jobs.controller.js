const Job = require('../models/job.model');
const Review = require('../models/review.model');

// 전체 공고 조회
exports.getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.findAll({ include: Review });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // 단일 공고 + 평균 별점
  exports.getJobById = async (req, res) => {
    const { id } = req.params;
    try {
      const job = await Job.findByPk(id, { include: Review });
      if (!job) return res.status(404).json({ message: 'Job not found' });
      const reviews = await job.getReviews();
      const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;
      res.json({ ...job.toJSON(), avgRating });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // 공고 생성
  exports.createJob = async (req, res) => {
    const { title, company, desc, createdBy } = req.body;
    try {
      const newJob = await Job.create({ title, company, desc, createdBy });
      res.status(201).json(newJob);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // 별점(리뷰) 추가
  exports.addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment, userId } = req.body;
    try {
      const job = await Job.findByPk(id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      const review = await Review.create({ jobId: id, rating, comment, userId });
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };