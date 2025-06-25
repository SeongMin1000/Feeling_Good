const express = require('express');
const router = express.Router();
const TranslateController = require('../controllers/translateController');

// 단일 텍스트 번역
router.post('/translate', TranslateController.translateText);

// 여러 텍스트 번역
router.post('/translate-multiple', TranslateController.translateMultiple);

// 지원 언어 목록 조회
router.get('/languages', TranslateController.getSupportedLanguages);

module.exports = router; 