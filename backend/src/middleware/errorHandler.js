// 전역 에러 핸들링 미들웨어
const errorHandler = (err, req, res, next) => {
    console.error('에러 스택:', err.stack);

    // JWT 에러 처리
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: '토큰이 만료되었습니다.' });
    }

    // 데이터베이스 에러 처리
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: '이미 존재하는 데이터입니다.' });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ message: '참조하는 데이터가 존재하지 않습니다.' });
    }

    // Validation 에러 처리
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    // 기본 에러 응답
    const statusCode = err.statusCode || 500;
    const message = err.message || '서버 내부 오류가 발생했습니다.';

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// 404 에러 핸들러
const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
};

module.exports = {
    errorHandler,
    notFoundHandler
}; 