const express = require('express');
const router = express.Router();
const { translateText, translateMultiple, getSupportedLanguages } = require('../controllers/translateController');

// 단일 텍스트 번역
router.post('/translate', translateText);

// 여러 텍스트 번역
router.post('/translate-multiple', translateMultiple);

// 지원 언어 목록 조회
router.get('/languages', getSupportedLanguages);

module.exports = router; 