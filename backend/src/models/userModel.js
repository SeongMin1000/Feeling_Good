const pool = require('../../config/db');
const bcrypt = require('bcrypt');

class UserModel {
    static async createUser(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const [result] = await pool.execute(
                `INSERT INTO users (
                    username, age, gender, email, phone, password,
                    nationality, visa_type, visa_expiry_date,
                    current_location, work_type,
                    preferred_language, korean_level,
                    desired_industry, work_experience
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userData.username,
                    userData.age,
                    userData.gender || null,
                    userData.email,
                    userData.phone || null,
                    hashedPassword,
                    userData.nationality,
                    userData.visaType,
                    userData.visaExpiry || null,
                    userData.currentLocation,
                    userData.workType || null,
                    userData.preferredLanguage,
                    userData.koreanLevel || null,
                    userData.desiredIndustry,
                    userData.workExperience || null
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findUserByEmail(email) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async validatePassword(inputPassword, hashedPassword) {
        return bcrypt.compare(inputPassword, hashedPassword);
    }
}

module.exports = UserModel; 