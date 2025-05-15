const express = require('express');
const app = express();

// 회원가입, 로그인 라우터
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 3000;

app.use(express.json());

// auth 라우터 연결
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
