const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// 회원가입
router.post('/register', UserController.register);

// 로그인
router.post('/login', UserController.login);

module.exports = router; 