const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

class UserController {
    static async register(req, res) {
        try {
            const {
                username, age, gender, email, phone, password,
                nationality, visaType, visaExpiry,
                currentLocation, preferredLocation, workType, preferredDays, preferredSalary,
                preferredLanguage, koreanLevel, englishLevel, otherLanguages,
                desiredIndustry, workExperience, certifications, educationLevel, skills,
                disabilityStatus, familyStatus, culturalAdaptationLevel, communityInterests
            } = req.body;

            // 필수 필드 검증
            const requiredFields = {
                username, age, email, password, nationality,
                visaType, currentLocation, preferredLanguage, desiredIndustry
            };

            const missingFields = Object.entries(requiredFields)
                .filter(([key, value]) => !value)
                .map(([key]) => key);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    message: '필수 항목을 모두 입력해주세요.',
                    missingFields
                });
            }

            // 이메일 형식 검증
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: '올바른 이메일 형식을 입력해주세요.' });
            }

            // 비밀번호 길이 검증
            if (password.length < 6) {
                return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
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
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: '이미 존재하는 정보입니다.' });
            }
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
            }

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
                age: user.age,
                gender: user.gender,
                phone: user.phone,
                nationality: user.nationality,
                visaType: user.visa_type,
                visaExpiry: user.visa_expiry_date,
                currentLocation: user.current_location,
                preferredLocation: user.preferred_location,
                workType: user.work_type,
                preferredLanguage: user.preferred_language,
                koreanLevel: user.korean_level,
                desiredIndustry: user.desired_industry,
                createdAt: user.created_at
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

    static async getProfile(req, res) {
        try {
            const user = req.user; // 미들웨어에서 설정된 사용자 정보

            // 민감한 정보 제외
            const { password, ...userProfile } = user;

            res.json({
                message: '프로필 조회 성공',
                user: userProfile
            });
        } catch (error) {
            console.error('프로필 조회 에러:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updateData = req.body;

            // 비밀번호 변경 시 해싱 처리는 모델에서 담당
            const success = await UserModel.updateUser(userId, updateData);

            if (success) {
                // 업데이트된 사용자 정보 조회
                const updatedUser = await UserModel.findUserById(userId);
                const { password, ...userProfile } = updatedUser;

                res.json({
                    message: '프로필이 업데이트되었습니다.',
                    user: userProfile
                });
            } else {
                res.status(400).json({ message: '프로필 업데이트에 실패했습니다.' });
            }
        } catch (error) {
            console.error('프로필 업데이트 에러:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }

    static async deleteAccount(req, res) {
        try {
            const userId = req.user.id;
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
            }

            // 비밀번호 확인
            const isValid = await UserModel.validatePassword(password, req.user.password);
            if (!isValid) {
                return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
            }

            // 계정 삭제
            const success = await UserModel.deleteUser(userId);

            if (success) {
                res.json({ message: '계정이 삭제되었습니다.' });
            } else {
                res.status(400).json({ message: '계정 삭제에 실패했습니다.' });
            }
        } catch (error) {
            console.error('계정 삭제 에러:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }

    static async refreshToken(req, res) {
        try {
            const userId = req.user.id;

            // 새 토큰 생성
            const newToken = jwt.sign(
                { userId: userId, email: req.user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: '토큰이 갱신되었습니다.',
                token: newToken
            });
        } catch (error) {
            console.error('토큰 갱신 에러:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
}

module.exports = UserController; 