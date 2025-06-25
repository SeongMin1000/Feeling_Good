const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: '접근 토큰이 필요합니다.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('토큰 검증 에러:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '토큰이 만료되었습니다.' });
        }
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 옵셔널 인증 미들웨어 (토큰이 있으면 인증, 없어도 통과)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findUserById(decoded.userId);
            req.user = user;
        }

        next();
    } catch (error) {
        // 토큰이 유효하지 않아도 계속 진행
        next();
    }
};

module.exports = {
    authenticateToken,
    optionalAuth
}; 