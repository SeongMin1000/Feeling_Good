const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// 공개 라우트 (인증 불필요)
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// 보호된 라우트 (인증 필요)
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.updateProfile);
router.delete('/account', authenticateToken, UserController.deleteAccount);
router.post('/refresh-token', authenticateToken, UserController.refreshToken);

module.exports = router; 