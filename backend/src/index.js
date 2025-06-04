const express = require('express');
const cors = require('cors'); // 🔹 CORS 모듈 import
const app = express();
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });


// 라우터 import
const userRoutes = require('./routes/userRoutes');

// 기본 포트 설정
const PORT = process.env.PORT;

// 미들웨어 설정
app.use(cors()); // 🔹 프론트엔드 요청 허용
app.use(express.json()); // 🔹 JSON 파싱

// 라우터 등록
app.use('/user', userRoutes);

// 정적 파일 폴더 등록 (frontend)
app.use(express.static(path.join(__dirname, '../../frontend/pages')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/js')));
app.use('/css', express.static(path.join(__dirname, '../../frontend/css')));


// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});