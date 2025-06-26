const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// 미들웨어 import
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// 라우터 import
const userRoutes = require('./routes/userRoutes');
const translateRoutes = require('./routes/translateRoutes');
const postsRoutes = require('./routes/posts');

// 기본 포트 설정
const PORT = process.env.PORT;

// CORS 설정
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 보안 헤더 설정
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 요청 로깅 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// API 라우터 등록
app.use('/api/user', userRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/posts', postsRoutes);

// Health check 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 정적 파일 폴더 등록 (frontend)
app.use(express.static(path.join(__dirname, '../../frontend/pages')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/js')));
app.use('/css', express.static(path.join(__dirname, '../../frontend/css')));

// 루트 경로
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/login.html'));
});

// 404 핸들러 (API 경로에만 적용)

// 전역 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});