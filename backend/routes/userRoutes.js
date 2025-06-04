// 프로필 조회 라우트 추가
router.get('/profile', authMiddleware, userController.getUserProfile); 