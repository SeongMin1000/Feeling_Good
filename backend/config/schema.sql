-- 1. 사용자 기본 정보
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('남성', '여성', '기타'),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 체류(비자) 정보
CREATE TABLE user_visa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    visa_type VARCHAR(50) NOT NULL,
    visa_expiry_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. 거주 및 근무 조건
CREATE TABLE user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    current_location VARCHAR(100) NOT NULL,
    preferred_location TEXT,
    work_type VARCHAR(50),
    preferred_days TEXT,
    preferred_salary VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. 언어 정보
CREATE TABLE user_languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    preferred_language VARCHAR(50) NOT NULL,
    korean_level VARCHAR(50),
    english_level VARCHAR(50),
    other_languages TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. 직무/경력 정보
CREATE TABLE user_careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    desired_industry VARCHAR(100) NOT NULL,
    work_experience TEXT,
    certifications TEXT,
    education_level VARCHAR(50),
    skills TEXT,
    resume_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. 기타 정보
CREATE TABLE user_misc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    disability_status BOOLEAN DEFAULT FALSE,
    family_status VARCHAR(100),
    cultural_adaptation_level VARCHAR(50),
    community_interests TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
