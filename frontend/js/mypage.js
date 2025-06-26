// 페이지 로드 시 사용자 정보 가져오기
document.addEventListener('DOMContentLoaded', function () {
  loadUserProfile();
  loadFavoriteJobs();
  initializeDefaultTab();
});

// 기본 탭 초기화
function initializeDefaultTab() {
  switchTab('profile');
}

// 탭 전환 기능
function switchTab(tabName) {
  // 모든 탭 버튼과 콘텐츠 비활성화
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content-section').forEach(content => {
    content.classList.remove('active');
  });

  // 선택된 탭 활성화
  const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
  const activeContent = document.getElementById(`${tabName}-tab`);

  if (activeButton && activeContent) {
    activeButton.classList.add('active');
    activeContent.classList.add('active');
  }

  // 관심 채용공고 탭을 선택했을 때 목록 업데이트
  if (tabName === 'favorites') {
    loadFavoriteJobs();
  }
}

// 사용자 프로필 정보 로드 (DB에서)
async function loadUserProfile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      window.location.href = 'login.html';
      return;
    }

    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.user;

      // 프로필 정보 표시 (DB 데이터 사용)
      document.getElementById('username-display').textContent = user.username || '사용자';
      document.getElementById('email-display').textContent = user.email || '';
      document.getElementById('username').textContent = user.username || '-';
      document.getElementById('age').textContent = user.age || '-';
      document.getElementById('gender').textContent = user.gender || '-';
      document.getElementById('phone').textContent = user.phone || '-';
      document.getElementById('nationality').textContent = user.nationality || '-';
      document.getElementById('visaType').textContent = user.visa_type || '-';
      document.getElementById('visaExpiry').textContent = user.visa_expiry_date ? formatDate(user.visa_expiry_date, true) : '-';
      document.getElementById('currentLocation').textContent = user.current_location || '-';
      document.getElementById('workType').textContent = user.work_type || '-';
      document.getElementById('preferredLanguage').textContent = user.preferred_language || '-';
      document.getElementById('koreanLevel').textContent = user.korean_level || '-';
      document.getElementById('desiredIndustry').textContent = user.desired_industry || '-';
      document.getElementById('workExperience').textContent = user.work_experience || '-';

      // 사용자 정보를 localStorage에도 저장 (캐싱)
      localStorage.setItem('user', JSON.stringify(user));

    } else if (response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    } else {
      console.error('프로필 조회 실패:', response.statusText);
      showToast('프로필 정보를 불러오는데 실패했습니다.', 'error');

      // 실패 시 localStorage의 기본값 사용
      loadUserProfileFromStorage();
    }
  } catch (error) {
    console.error('프로필 조회 에러:', error);
    showToast('네트워크 오류가 발생했습니다.', 'error');

    // 에러 시 localStorage의 기본값 사용
    loadUserProfileFromStorage();
  }
}

// localStorage에서 사용자 정보 로드 (폴백용)
function loadUserProfileFromStorage() {
  const userData = JSON.parse(localStorage.getItem('user')) || {};

  // 기본값 설정
  const profile = {
    username: userData.username || '사용자',
    email: userData.email || 'user@example.com',
    age: userData.age || '25',
    gender: userData.gender || '남성',
    phone: userData.phone || '010-1234-5678',
    nationality: userData.nationality || '베트남',
    visaType: userData.visa_type || userData.visaType || 'E-9 (비전문취업)',
    visaExpiry: userData.visa_expiry_date || userData.visaExpiry || '2025-12-31',
    currentLocation: userData.current_location || userData.currentLocation || '서울특별시 강남구',
    workType: userData.work_type || userData.workType || '정규직',
    preferredLanguage: userData.preferred_language || userData.preferredLanguage || '한국어',
    koreanLevel: userData.korean_level || userData.koreanLevel || '중급',
    desiredIndustry: userData.desired_industry || userData.desiredIndustry || '제조업',
    workExperience: userData.work_experience || userData.workExperience || '2년'
  };

  // 프로필 정보 표시
  document.getElementById('username-display').textContent = profile.username;
  document.getElementById('email-display').textContent = profile.email;
  document.getElementById('username').textContent = profile.username;
  document.getElementById('age').textContent = profile.age;
  document.getElementById('gender').textContent = profile.gender;
  document.getElementById('phone').textContent = profile.phone;
  document.getElementById('nationality').textContent = profile.nationality;
  document.getElementById('visaType').textContent = profile.visaType;
  document.getElementById('visaExpiry').textContent = profile.visaExpiry;
  document.getElementById('currentLocation').textContent = profile.currentLocation;
  document.getElementById('workType').textContent = profile.workType;
  document.getElementById('preferredLanguage').textContent = profile.preferredLanguage;
  document.getElementById('koreanLevel').textContent = profile.koreanLevel;
  document.getElementById('desiredIndustry').textContent = profile.desiredIndustry;
  document.getElementById('workExperience').textContent = profile.workExperience;
}

// 관심 채용공고 로드
function loadFavoriteJobs() {
  const favorites = JSON.parse(localStorage.getItem('jobFavorites')) || [];
  const favoritesList = document.getElementById('favoritesList');
  const noFavorites = document.getElementById('noFavorites');
  const favoritesCount = document.getElementById('favoritesCount');

  // 카운트 업데이트
  favoritesCount.textContent = favorites.length;

  if (favorites.length === 0) {
    favoritesList.innerHTML = '';
    noFavorites.style.display = 'block';
    return;
  }

  noFavorites.style.display = 'none';

  // 관심 채용공고 목록 생성
  favoritesList.innerHTML = favorites.map(job => `
        <div class="favorite-item" data-job-id="${job.id}">
            <div class="favorite-header">
                <div class="favorite-title">
                    <h4 data-translate="${job.title}">${job.title}</h4>
                    <div class="favorite-company" data-translate="${job.company}">${job.company}</div>
                </div>
                <button class="remove-favorite" onclick="removeFavorite('${job.id}')" title="관심 해제">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="favorite-meta">
                <span><i class="fas fa-map-marker-alt"></i> <span data-translate="${job.location}">${job.location}</span></span>
                <span><i class="fas fa-won-sign"></i> <span data-translate="${job.salary}">${job.salary}</span></span>
                <span><i class="fas fa-clock"></i> <span data-translate="${job.workType}">${job.workType}</span></span>
                <span><i class="fas fa-calendar-plus"></i> ${formatDate(job.dateAdded)}</span>
            </div>
        </div>
    `).join('');

  // 번역 적용
  if (window.translator) {
    window.translator.updateUILanguage();
  }
}

// 관심 채용공고 제거
function removeFavorite(jobId) {
  if (confirm('이 채용공고를 관심 목록에서 제거하시겠습니까?')) {
    let favorites = JSON.parse(localStorage.getItem('jobFavorites')) || [];
    favorites = favorites.filter(job => job.id !== jobId);
    localStorage.setItem('jobFavorites', JSON.stringify(favorites));
    loadFavoriteJobs();

    // 성공 메시지
    showToast('관심 목록에서 제거되었습니다.', 'success');
  }
}

// 프로필 편집 기능
function editProfile() {
  alert('프로필 편집 기능은 준비 중입니다.');
}

// 로그아웃 기능
function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}

// 날짜 포맷팅
function formatDate(dateString, isExpiry = false) {
  if (!dateString) return isExpiry ? '-' : '방금 전';

  const date = new Date(dateString);

  // 비자 만료일인 경우 단순 날짜 포맷
  if (isExpiry) {
    return date.toLocaleDateString('ko-KR');
  }

  // 일반 날짜인 경우 상대시간 표시
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return '1일 전';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}주 전`;
  } else {
    return date.toLocaleDateString('ko-KR');
  }
}

// 토스트 메시지 표시
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass;
  let backgroundColor;

  switch (type) {
    case 'success':
      iconClass = 'fa-check-circle';
      backgroundColor = '#28a745';
      break;
    case 'error':
      iconClass = 'fa-exclamation-circle';
      backgroundColor = '#dc3545';
      break;
    default:
      iconClass = 'fa-info-circle';
      backgroundColor = '#007bff';
  }

  toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${iconClass}"></i>
            <span>${message}</span>
        </div>
    `;

  // 토스트 스타일
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(toast);

  // 애니메이션
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 100);

  // 자동 제거
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 페이지 이동 함수들
function goToJobs() {
  window.location.href = 'jobs.html';
}

function goToCommunity() {
  window.location.href = 'community.html';
}

// 전역 함수로 노출
window.switchTab = switchTab;
window.removeFavorite = removeFavorite;
window.editProfile = editProfile;
window.logout = logout;
