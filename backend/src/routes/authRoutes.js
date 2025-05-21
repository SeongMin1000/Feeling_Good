const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../config/db');


// 회원가입
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // 아이디 중복 체크
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
        }

        // 비밀번호 암호화
        const hash = await bcrypt.hash(password, 10);

        // DB에 저장
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
        res.json({ message: '회원가입 성공!' });
    } 
    catch (err) {
        res.status(500).json({ message: '서버 오류' });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // 유저 찾기
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
        }

        const user = rows[0];
        // 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
        }

        res.json({ message: '로그인 성공!' });
        // JWT 토큰 발급 등 추후 구현
    } 
    catch (err) {
    res.status(500).json({ message: '서버 오류' });
    }
});


module.exports = router;
