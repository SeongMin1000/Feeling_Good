const db = require('../config/database');
const jwt = require('jsonwebtoken');

// 사용자 프로필 조회
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // JWT 미들웨어에서 설정된 사용자 ID
        console.log('Requesting profile for user ID:', userId);

        const query = `
            SELECT 
                username, email, phone, age, gender,
                nationality, visa_type, visa_expiry_date,
                current_location, work_type,
                preferred_language, korean_level,
                desired_industry, work_experience
            FROM users 
            WHERE id = ?
        `;

        const [rows] = await db.query(query, [userId]);
        console.log('Query result:', rows);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}; 