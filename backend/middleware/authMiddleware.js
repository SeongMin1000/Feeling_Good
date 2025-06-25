const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Authorization 헤더에서 토큰 추출
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
        }

        const token = authHeader.split(' ')[1];
        
        // 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 요청 객체에 사용자 정보 추가
        req.user = { id: decoded.userId };
        
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '토큰이 만료되었습니다.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        }
        res.status(401).json({ message: '인증에 실패했습니다.' });
    }
};

module.exports = authMiddleware; 