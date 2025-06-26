const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// 게시글 목록 조회
router.get('/', postsController.getPosts);

// 게시글 상세 조회
router.get('/:id', postsController.getPostDetail);

// 게시글 작성
router.post('/', postsController.createPost);

// 게시글 좋아요 토글
router.post('/:id/like', postsController.likePost);

// 댓글 목록 조회
router.get('/:id/comments', postsController.getComments);

// 댓글 작성
router.post('/:id/comments', postsController.createComment);

module.exports = router; 