const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'feeling_good',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 채용공고 목록 조회
exports.getJobs = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jobs ORDER BY posted DESC');
    res.json(rows);
  } catch (error) {
    console.error('채용공고 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 채용공고 상세 조회
exports.getJobDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '채용공고를 찾을 수 없습니다.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('채용공고 상세 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 채용공고 등록
exports.createJob = async (req, res) => {
  try {
    const {
      title, company, location, category, employment, salary, deadline, description,
      korean_level, english_level, visa
    } = req.body;
    // author_id는 임시로 1로 저장
    const author_id = 1;
    // visa가 배열이면 문자열로 변환
    const visaStr = Array.isArray(visa) ? visa.join(',') : (visa || '');
    const [result] = await pool.query(
      `INSERT INTO jobs (title, company, author_id, location, category, employment, salary, deadline, description, korean_level, english_level, visa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, company, author_id, location, category, employment, salary, deadline, description, korean_level, english_level, visaStr]
    );
    res.json({ id: result.insertId, message: '채용공고가 등록되었습니다.' });
  } catch (error) {
    console.error('채용공고 등록 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}; 