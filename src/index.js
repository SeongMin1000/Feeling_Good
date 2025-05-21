const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('../config/db');
db.sync({ alter: true })
.then(() => console.log('✅ DB synced'))
.catch(err => console.error('❌ DB sync error', err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());              // 프론트에서 요청 허용
app.use(express.json());      // JSON 파싱

// 샘플 라우터
app.get('/api/posts', (req, res) => {
  res.json([{ id: 1, title: "Hello, world!" }]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use('/api/jobs',               jobRoutes);

const jobRoutes    = require('../jobs/routes/job.route');