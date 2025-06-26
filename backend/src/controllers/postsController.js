const mysql = require('mysql2/promise');

// MySQL 연결 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'feeling_good',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 게시글 목록 조회
exports.getPosts = async (req, res) => {
  try {
    const { category, search, sort = 'latest', page = 1, limit = 10 } = req.query;
    let query = `
      SELECT p.*, u.username as author_username 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    if (category && category !== 'all') {
      query += ' AND p.category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (p.title LIKE ? OR p.content LIKE ? OR p.author_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    switch (sort) {
      case 'latest':
        query += ' ORDER BY p.created_at DESC';
        break;
      case 'popular':
        query += ' ORDER BY p.like_count DESC, p.created_at DESC';
        break;
      case 'comments':
        query += ' ORDER BY p.comment_count DESC, p.created_at DESC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    const [rows] = await pool.query(query, params);
    let countQuery = 'SELECT COUNT(*) as total FROM posts WHERE 1=1';
    const countParams = [];
    if (category && category !== 'all') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (title LIKE ? OR content LIKE ? OR author_name LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;
    res.json({
      posts: rows,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalCount: total
      }
    });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 상세 조회
exports.getPostDetail = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);
    const [posts] = await pool.query(`
      SELECT p.*, u.username as author_username 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      WHERE p.id = ?
    `, [id]);
    if (posts.length === 0) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    res.json(posts[0]);
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 작성
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, isAnonymous } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }
    // TODO: JWT 토큰 검증 및 사용자 정보 추출
    const authorId = 1; // 실제로는 토큰에서 추출
    const authorName = isAnonymous ? '익명' : '사용자'; // 실제로는 사용자 정보에서 추출
    const [result] = await pool.query(
      'INSERT INTO posts (title, content, author_id, author_name, category, is_anonymous) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, authorId, authorName, category, isAnonymous]
    );
    res.json({ 
      id: result.insertId, 
      message: '게시글이 등록되었습니다.' 
    });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 좋아요 토글
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'UPDATE posts SET like_count = like_count + 1 WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    res.json({ message: '좋아요가 추가되었습니다.' });
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 댓글 목록 조회
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const [comments] = await pool.query(`
      SELECT c.*, u.username as author_username 
      FROM comments c 
      LEFT JOIN users u ON c.author_id = u.id 
      WHERE c.post_id = ? 
      ORDER BY c.created_at ASC
    `, [id]);
    res.json(comments);
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }
    // TODO: JWT 토큰 검증 및 사용자 정보 추출
    const authorId = 1; // 실제로는 토큰에서 추출
    const authorName = '사용자'; // 실제로는 사용자 정보에서 추출
    const [commentResult] = await pool.query(
      'INSERT INTO comments (post_id, author_id, author_name, content) VALUES (?, ?, ?, ?)',
      [id, authorId, authorName, content]
    );
    await pool.query(
      'UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?',
      [id]
    );
    res.json({ 
      id: commentResult.insertId, 
      message: '댓글이 등록되었습니다.' 
    });
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}; 