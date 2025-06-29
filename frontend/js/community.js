// ✅ 커뮤니티 게시판 JavaScript

// 전역 변수
let currentCategory = 'all';
let currentPage = 1;
let postsPerPage = 10;
let allPosts = [];
let filteredPosts = [];
let currentSearchTerm = '';
let currentSortType = 'latest';
let currentPostId = null;

// API 기본 URL (CommonUtils에서 가져오기)
const API_BASE_URL = CommonUtils.API_BASE_URL;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
    CommonUtils.checkAuthStatus();
    initializeCommunity();
});

// 페이지 로드 시 즉시 위치 조정 (DOM 준비 전에도 실행)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            CommonUtils.adjustMainContentPosition(false);
        }, 10);
    });
} else {
    CommonUtils.adjustMainContentPosition(false);
}

// 커뮤니티 초기화
async function initializeCommunity() {
    loadSavedData();
    await loadPosts();
    setupEventListeners();
    CommonUtils.setupFilterEvents(filterPosts, sortPosts);
    CommonUtils.setupSearchEvents(searchPosts);
    CommonUtils.setupResizeHandler();
    CommonUtils.adjustMainContentPosition(false);

    // 번역기 초기화
    if (window.translator) {
        await translatePostContent();
    }
}

// API에서 게시글 목록 불러오기
async function loadPosts() {
    try {
        const params = new URLSearchParams({
            category: currentCategory,
            search: currentSearchTerm,
            sort: currentSortType,
            page: currentPage,
            limit: postsPerPage
        });

        const response = await fetch(`${API_BASE_URL}/posts?${params}`);
        if (!response.ok) {
            throw new Error('게시글을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        allPosts = data.posts;
        filteredPosts = data.posts;

        renderPosts();
        renderPagination(data.pagination);
    } catch (error) {
        console.error('게시글 로드 오류:', error);
        // 에러 시 빈 목록 출력
        allPosts = [];
        filteredPosts = [];
        renderPosts();
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    const writeForm = document.getElementById('writeForm');
    if (writeForm) {
        writeForm.addEventListener('submit', handlePostSubmit);
    }

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal')) {
            closeWriteModal();
            closeDetailModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeWriteModal();
            closeDetailModal();
        }
    });
}

// 공통 함수들은 CommonUtils로 이동됨

// 카테고리별 필터링
async function filterPosts(category) {
    currentCategory = category;
    currentPage = 1;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    await loadPosts();
}

// 검색 기능
async function searchPosts() {
    const searchInput = document.getElementById('searchInput');
    currentSearchTerm = searchInput.value.trim();
    currentPage = 1;

    await loadPosts();
}

// handleSearchEnter는 CommonUtils로 이동됨

// 정렬 기능
async function sortPosts(sortType) {
    currentSortType = sortType;
    await loadPosts();
}

// 게시글 목록 렌더링
function renderPosts() {
    const postsList = document.getElementById('postsList');
    const postsCount = document.getElementById('postsCount');

    if (!postsList || !postsCount) return;

    postsCount.textContent = filteredPosts.length;

    if (filteredPosts.length === 0) {
        postsList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3 data-translate="게시글이 없습니다">게시글이 없습니다</h3>
        <p data-translate="검색 조건을 변경하거나 새 게시글을 작성해보세요.">검색 조건을 변경하거나 새 게시글을 작성해보세요.</p>
      </div>
    `;
    } else {
        postsList.innerHTML = filteredPosts.map(post => createPostHTML(post)).join('');
    }

    // 게시글 렌더링 후 번역 적용
    translatePostContent();
}

// 페이지네이션 렌더링
function renderPagination(pagination) {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement || !pagination) return;

    const { current, total } = pagination;

    let paginationHTML = '';

    // 이전 페이지 버튼
    if (current > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${current - 1})">이전</button>`;
    }

    // 페이지 번호들
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        paginationHTML += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    // 다음 페이지 버튼
    if (current < total) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${current + 1})">다음</button>`;
    }

    paginationElement.innerHTML = paginationHTML;
}

// 페이지 변경
async function changePage(page) {
    currentPage = page;
    await loadPosts();
}

// 게시글 HTML 생성
function createPostHTML(post) {
    const categoryNames = {
        'job-info': '취업정보',
        'life-tips': '생활팁',
        'qna': 'Q&A',
        'free-talk': '자유게시판'
    };

    const previewContent = post.content.length > 100
        ? post.content.substring(0, 100) + '...'
        : post.content;

    const date = CommonUtils.formatDate(post.created_at);

    return `
    <div class="post-item" onclick="openPostDetail(${post.id})">
      <div class="post-header">
        <h3 class="post-title" data-translate="${post.title}" data-original-text="${post.title}">${post.title}</h3>
        <span class="post-category" data-translate="${categoryNames[post.category]}">${categoryNames[post.category]}</span>
      </div>
      <div class="post-content-preview" data-translate="${previewContent}" data-original-text="${previewContent}">${previewContent.replace(/\n/g, ' ')}</div>
      <div class="post-meta">
        <div class="post-author">
          <i class="fas fa-user"></i>
          <span>${post.author_name}</span>
        </div>
        <div class="post-stats">
          <span><i class="fas fa-calendar"></i> ${date}</span>
          <span><i class="fas fa-eye"></i> ${post.views}</span>
          <span><i class="fas fa-thumbs-up"></i> ${post.like_count}</span>
          <span><i class="fas fa-comments"></i> ${post.comment_count}</span>
        </div>
      </div>
    </div>
  `;
}

// 글쓰기 모달 열기
function openWriteModal() {
    const modal = document.getElementById('writeModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 글쓰기 모달 닫기
function closeWriteModal() {
    const modal = document.getElementById('writeModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('writeForm').reset();
    }
}

// 게시글 작성 처리
async function handlePostSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const postData = {
        category: formData.get('category'),
        title: formData.get('title'),
        content: formData.get('content'),
        isAnonymous: !!formData.get('anonymous'),
        authorId: user.id || 1,
        authorName: user.username || '사용자'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error('게시글 등록에 실패했습니다.');
        }

        const result = await response.json();

        closeWriteModal();
        alert('게시글이 성공적으로 등록되었습니다!');

        // 게시글 목록 새로고침
        await loadPosts();
    } catch (error) {
        console.error('게시글 작성 오류:', error);
        alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    }
}

// 게시글 상세보기 열기
async function openPostDetail(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
        if (!response.ok) {
            throw new Error('게시글을 불러올 수 없습니다.');
        }

        const post = await response.json();
        currentPostId = postId;

        // 모달에 데이터 표시
        const detailTitle = document.getElementById('detailTitle');
        const detailContent = document.getElementById('detailContent');

        detailTitle.textContent = post.title;
        detailTitle.setAttribute('data-translate', post.title);
        detailTitle.setAttribute('data-original-text', post.title);

        document.getElementById('detailAuthor').textContent = post.author_name;
        document.getElementById('detailDate').textContent = CommonUtils.formatDate(post.created_at);
        document.getElementById('detailViews').textContent = post.views;
        document.getElementById('detailLikes').textContent = post.like_count;

        detailContent.textContent = post.content;
        detailContent.setAttribute('data-translate', post.content);
        detailContent.setAttribute('data-original-text', post.content);

        // 댓글 로드
        await loadComments(postId);

        // 번역 적용
        await translatePostContent();

        // 모달 표시
        const modal = document.getElementById('postDetailModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('게시글 상세보기 오류:', error);
        alert('게시글을 불러올 수 없습니다.');
    }
}

// 게시글 상세보기 닫기
function closeDetailModal() {
    const modal = document.getElementById('postDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentPostId = null;
}

// 좋아요 토글
async function toggleLike() {
    if (!currentPostId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/posts/${currentPostId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('좋아요 처리에 실패했습니다.');
        }

        // UI 업데이트
        const likeElement = document.getElementById('detailLikes');
        const currentLikes = parseInt(likeElement.textContent);
        likeElement.textContent = currentLikes + 1;

        const likeBtn = document.querySelector('.like-btn');
        likeBtn.classList.add('active');
        setTimeout(() => likeBtn.classList.remove('active'), 1000);

        // 게시글 목록 새로고침
        await loadPosts();
    } catch (error) {
        console.error('좋아요 토글 오류:', error);
        alert('좋아요 처리에 실패했습니다.');
    }
}

// 북마크 토글
function toggleBookmark() {
    alert('북마크 기능은 추후 구현 예정입니다.');
}

// 게시글 공유
function sharePost() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById('detailTitle').textContent,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('링크가 클립보드에 복사되었습니다!');
        });
    }
}

// 댓글 로드
async function loadComments(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
        if (!response.ok) {
            throw new Error('댓글을 불러올 수 없습니다.');
        }

        const comments = await response.json();

        const commentsList = document.getElementById('commentsList');
        const commentsCount = document.getElementById('commentsCount');

        commentsCount.textContent = comments.length;

        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments" data-translate="아직 댓글이 없습니다.">아직 댓글이 없습니다.</p>';
        } else {
            commentsList.innerHTML = comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author_name}</span>
                        <span class="comment-date">${CommonUtils.formatDate(comment.created_at)}</span>
                    </div>
                    <div class="comment-content" data-translate="${comment.content}" data-original-text="${comment.content}">${comment.content}</div>
                </div>
            `).join('');
        }

        // 댓글 로드 후 번역 적용
        await translatePostContent();
    } catch (error) {
        console.error('댓글 로드 오류:', error);
        // 에러 시 빈 목록 출력
        const commentsList = document.getElementById('commentsList');
        const commentsCount = document.getElementById('commentsCount');
        commentsCount.textContent = 0;
        commentsList.innerHTML = '<p class="no-comments">아직 댓글이 없습니다.</p>';
    }
}

// 댓글 추가
async function addComment() {
    const commentInput = document.getElementById('commentInput');
    const content = commentInput.value.trim();

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    if (!currentPostId) {
        alert('게시글을 선택해주세요.');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
        const response = await fetch(`${API_BASE_URL}/posts/${currentPostId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                content,
                authorId: user.id || 1,
                authorName: user.username || '사용자'
            })
        });

        if (!response.ok) {
            throw new Error('댓글 등록에 실패했습니다.');
        }

        alert('댓글이 등록되었습니다!');
        commentInput.value = '';

        // 댓글 목록 새로고침
        await loadComments(currentPostId);

        // 게시글 목록 새로고침 (댓글 수 업데이트)
        await loadPosts();
    } catch (error) {
        console.error('댓글 작성 오류:', error);
        alert('댓글 등록에 실패했습니다. 다시 시도해주세요.');
    }
}

// 필터 초기화
function resetFilters() {
    CommonUtils.resetFilters();
    applyFilters();
}

// 고급 필터 적용
function applyFilters() {
    // 필터 적용 로직 (커뮤니티에 맞게 조정)
    currentCategory = 'all';
    currentPage = 1;
    loadPosts();

    const advancedFilters = document.querySelector('.advanced-filters');
    if (advancedFilters) {
        advancedFilters.classList.remove('show');
        CommonUtils.removeAdvancedFiltersOutsideClick(); // 외부 클릭 이벤트 제거
    }
    CommonUtils.adjustMainContentPosition(true);
}

// 저장된 데이터 불러오기
function loadSavedData() {
    // 저장된 설정이나 즐겨찾기 불러오기
    const savedSettings = CommonUtils.storage.get('communitySettings');
    if (savedSettings) {
        // 설정 적용
        if (savedSettings.defaultCategory) {
            currentCategory = savedSettings.defaultCategory;
        }
        if (savedSettings.postsPerPage) {
            postsPerPage = savedSettings.postsPerPage;
        }
    }
}

// 게시글 내용 번역 함수
async function translatePostContent() {
    if (!window.translator) return;

    try {
        const currentLanguage = localStorage.getItem('preferredLanguage') || '한국어';

        // 한국어인 경우 번역하지 않음
        if (currentLanguage === '한국어') {
            return;
        }

        // 번역할 요소들 선택
        const elementsToTranslate = document.querySelectorAll('[data-translate]');

        for (let element of elementsToTranslate) {
            const originalText = element.getAttribute('data-translate');
            if (originalText && originalText.trim()) {
                try {
                    const translatedText = await window.translator.translateText(originalText, currentLanguage);
                    if (translatedText && translatedText !== originalText) {
                        element.textContent = translatedText;
                    }
                } catch (error) {
                    console.error('번역 오류:', error);
                    // 번역 실패 시 원본 텍스트 유지
                }
            }
        }
    } catch (error) {
        console.error('게시글 번역 중 오류:', error);
    }
}

// 로그아웃 기능
function logout() {
    CommonUtils.logout();
}
