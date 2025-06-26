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

-- 7. 게시물 정보 (커뮤니티용)
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    author_id INT NOT NULL,
    author_name VARCHAR(100) NOT NULL,  -- 익명 처리를 위한 필드
    category ENUM('job-info', 'life-tips', 'qna', 'free-talk') NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. 댓글 정보 (커뮤니티용)
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    author_id INT NOT NULL,
    author_name VARCHAR(100) NOT NULL,  -- 익명 처리를 위한 필드
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 채용 공고 테이블
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,                   
    company VARCHAR(255) NOT NULL,                 
    author_id INT NOT NULL,                        
    location VARCHAR(100),                         
    category VARCHAR(50),                          
    employment ENUM('full-time', 'part-time', 'contract', 'intern') DEFAULT 'full-time',
    salary VARCHAR(50),                            
    deadline DATE,                                 
    posted DATETIME DEFAULT CURRENT_TIMESTAMP,     
    views INT DEFAULT 0,                           
    description TEXT,                              
                                

    korean_level ENUM('none', 'basic', 'intermediate', 'fluent'),
    english_level ENUM('none', 'basic', 'intermediate', 'fluent'),
    visa VARCHAR(255),

    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
