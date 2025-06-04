const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

class UserController {
    static async register(req, res) {
        try {
            const {
                username, age, gender, email, phone, password,
                nationality, visaType, visaExpiry,
                currentLocation, workType,
                preferredLanguage, koreanLevel,
                desiredIndustry, workExperience
            } = req.body;

            // 필수 필드 검증
            if (!username || !age || !email || !password || !nationality || 
                !visaType || !currentLocation || !preferredLanguage || !desiredIndustry) {
                return res.status(400).json({ message: '필수 항목을 모두 입력해주세요.' });
            }
            
            // 이메일 중복 확인
            const existingUser = await UserModel.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
            }

            // 사용자 생성
            const userId = await UserModel.createUser(req.body);
            
            res.status(201).json({
                message: '회원가입이 완료되었습니다.',
                userId
            });
        } catch (error) {
            console.error('회원가입 에러:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // 사용자 찾기
            const user = await UserModel.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
            }

            // 비밀번호 검증
            const isValid = await UserModel.validatePassword(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
            }

            // JWT 토큰 생성
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // 민감한 정보 제외하고 사용자 정보 전송
            const userInfo = {
                id: user.id,
                username: user.username,
                email: user.email,
                nationality: user.nationality,
                currentLocation: user.current_location,
                preferredLanguage: user.preferred_language
            };

            res.json({
                message: '로그인 성공',
                token,
                user: userInfo
            });
        } catch (error) {
            console.error('로그인 에러:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
}

module.exports = UserController; 