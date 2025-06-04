CREATE DATABASE IF NOT EXISTS user_db;
USE user_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- 기본 정보
    username VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('남성', '여성', '기타'),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    
    -- 체류 정보
    nationality VARCHAR(100) NOT NULL,
    visa_type VARCHAR(50) NOT NULL,
    visa_expiry_date DATE,
    
    -- 거주/근무 조건
    current_location VARCHAR(100) NOT NULL,
    preferred_location TEXT,
    work_type VARCHAR(50),
    preferred_days TEXT,
    preferred_salary VARCHAR(100),
    
    -- 언어 정보
    preferred_language VARCHAR(50) NOT NULL,
    korean_level VARCHAR(50),
    english_level VARCHAR(50),
    other_languages TEXT,
    
    -- 직무/경력 정보
    desired_industry VARCHAR(100) NOT NULL,
    work_experience TEXT,
    certifications TEXT,
    education_level VARCHAR(50),
    skills TEXT,
    resume_path VARCHAR(255),
    
    -- 기타 정보
    disability_status BOOLEAN DEFAULT FALSE,
    family_status VARCHAR(100),
    cultural_adaptation_level VARCHAR(50),
    community_interests TEXT,
    
    -- 인증 관련
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 