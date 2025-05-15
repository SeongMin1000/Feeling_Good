const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // xampp 기본 user
    password: '',           // 기본 비번
    database: 'user_db', // DB 이름
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
