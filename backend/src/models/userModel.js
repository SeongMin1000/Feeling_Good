const pool = require('../../config/db');
const bcrypt = require('bcrypt');

class UserModel {
    // 회원가입 - 트랜잭션으로 모든 테이블에 데이터 저장
    static async createUser(userData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. 사용자 기본 정보 저장
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const [userResult] = await connection.execute(
                `INSERT INTO users (username, age, gender, email, phone, password) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    userData.username,
                    userData.age,
                    userData.gender || null,
                    userData.email,
                    userData.phone || null,
                    hashedPassword
                ]
            );

            const userId = userResult.insertId;

            // 2. 비자 정보 저장
            if (userData.nationality && userData.visaType) {
                await connection.execute(
                    `INSERT INTO user_visa (user_id, nationality, visa_type, visa_expiry_date) 
                     VALUES (?, ?, ?, ?)`,
                    [userId, userData.nationality, userData.visaType, userData.visaExpiry || null]
                );
            }

            // 3. 선호도/근무 조건 저장
            if (userData.currentLocation) {
                await connection.execute(
                    `INSERT INTO user_preferences (user_id, current_location, preferred_location, work_type, preferred_days, preferred_salary) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        userId,
                        userData.currentLocation,
                        userData.preferredLocation || null,
                        userData.workType || null,
                        userData.preferredDays || null,
                        userData.preferredSalary || null
                    ]
                );
            }

            // 4. 언어 정보 저장
            if (userData.preferredLanguage) {
                await connection.execute(
                    `INSERT INTO user_languages (user_id, preferred_language, korean_level, english_level, other_languages) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        userId,
                        userData.preferredLanguage,
                        userData.koreanLevel || null,
                        userData.englishLevel || null,
                        userData.otherLanguages || null
                    ]
                );
            }

            // 5. 직무/경력 정보 저장
            if (userData.desiredIndustry) {
                await connection.execute(
                    `INSERT INTO user_careers (user_id, desired_industry, work_experience, certifications, education_level, skills, resume_path) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        userId,
                        userData.desiredIndustry,
                        userData.workExperience || null,
                        userData.certifications || null,
                        userData.educationLevel || null,
                        userData.skills || null,
                        userData.resumePath || null
                    ]
                );
            }

            // 6. 기타 정보 저장
            await connection.execute(
                `INSERT INTO user_misc (user_id, disability_status, family_status, cultural_adaptation_level, community_interests) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    userId,
                    userData.disabilityStatus || false,
                    userData.familyStatus || null,
                    userData.culturalAdaptationLevel || null,
                    userData.communityInterests || null
                ]
            );

            await connection.commit();
            return userId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 이메일로 사용자 조회 (모든 관련 정보 포함)
    static async findUserByEmail(email) {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    u.*,
                    v.nationality, v.visa_type, v.visa_expiry_date,
                    p.current_location, p.preferred_location, p.work_type, p.preferred_days, p.preferred_salary,
                    l.preferred_language, l.korean_level, l.english_level, l.other_languages,
                    c.desired_industry, c.work_experience, c.certifications, c.education_level, c.skills, c.resume_path,
                    m.disability_status, m.family_status, m.cultural_adaptation_level, m.community_interests
                FROM users u
                LEFT JOIN user_visa v ON u.id = v.user_id
                LEFT JOIN user_preferences p ON u.id = p.user_id
                LEFT JOIN user_languages l ON u.id = l.user_id
                LEFT JOIN user_careers c ON u.id = c.user_id
                LEFT JOIN user_misc m ON u.id = m.user_id
                WHERE u.email = ?
            `, [email]);

            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // ID로 사용자 조회
    static async findUserById(userId) {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    u.*,
                    v.nationality, v.visa_type, v.visa_expiry_date,
                    p.current_location, p.preferred_location, p.work_type, p.preferred_days, p.preferred_salary,
                    l.preferred_language, l.korean_level, l.english_level, l.other_languages,
                    c.desired_industry, c.work_experience, c.certifications, c.education_level, c.skills, c.resume_path,
                    m.disability_status, m.family_status, m.cultural_adaptation_level, m.community_interests
                FROM users u
                LEFT JOIN user_visa v ON u.id = v.user_id
                LEFT JOIN user_preferences p ON u.id = p.user_id
                LEFT JOIN user_languages l ON u.id = l.user_id
                LEFT JOIN user_careers c ON u.id = c.user_id
                LEFT JOIN user_misc m ON u.id = m.user_id
                WHERE u.id = ?
            `, [userId]);

            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // 사용자 정보 업데이트
    static async updateUser(userId, userData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 기본 정보 업데이트
            if (userData.username || userData.age || userData.gender || userData.phone) {
                const updates = [];
                const values = [];

                if (userData.username) { updates.push('username = ?'); values.push(userData.username); }
                if (userData.age) { updates.push('age = ?'); values.push(userData.age); }
                if (userData.gender) { updates.push('gender = ?'); values.push(userData.gender); }
                if (userData.phone) { updates.push('phone = ?'); values.push(userData.phone); }

                values.push(userId);

                await connection.execute(
                    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                    values
                );
            }

            // 비자 정보 업데이트
            if (userData.nationality || userData.visaType || userData.visaExpiry) {
                await connection.execute(`
                    UPDATE user_visa SET 
                        nationality = COALESCE(?, nationality),
                        visa_type = COALESCE(?, visa_type),
                        visa_expiry_date = COALESCE(?, visa_expiry_date)
                    WHERE user_id = ?
                `, [userData.nationality, userData.visaType, userData.visaExpiry, userId]);
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 비밀번호 검증
    static async validatePassword(inputPassword, hashedPassword) {
        return bcrypt.compare(inputPassword, hashedPassword);
    }

    // 사용자 삭제 (CASCADE로 자동 삭제됨)
    static async deleteUser(userId) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM users WHERE id = ?',
                [userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserModel; 