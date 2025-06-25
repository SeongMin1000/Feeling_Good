// ✅ 1. 로그인 상태 확인 및 토큰 검증
async function checkAuthStatus() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return false;
  }

  // 토큰 유효성 간단 체크 (실제 API 호출로 검증)
  try {
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "login.html";
      return false;
    }

    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return true; // 네트워크 오류 시에는 계속 진행
  }
}

// 페이지 로드 시 인증 확인
document.addEventListener('DOMContentLoaded', async () => {
  const isAuthenticated = await checkAuthStatus();
  if (isAuthenticated) {
    initializeJobsPage();
  }
});

// 구인 정보 페이지 초기화
function initializeJobsPage() {
  loadSavedJobs(); // 저장된 기업 데이터 불러오기
  renderCards();
  renderFavorites();
  updateUI(); // 초기 UI 설정
}

const jobData = [
  {
    name: "KGlobal Inc.",
    location: "서울",
    job: "마케팅 인턴",
    category: "서비스",
    visa: "지원 가능",
    rating: 4,
    logo: "https://via.placeholder.com/100x100.png?text=KGlobal"
  },
  {
    name: "Ocean Korea",
    location: "부산",
    job: "유통관리",
    category: "무역사무",
    visa: "지원 불가능",
    rating: 3,
    logo: "https://via.placeholder.com/100x100.png?text=Ocean"
  },
  {
    name: "Hansung Tech",
    location: "인천",
    job: "엔지니어",
    category: "IT개발",
    visa: "지원 가능",
    rating: 5,
    logo: "https://via.placeholder.com/100x100.png?text=Hansung"
  }
];

// 카테고리 필터링 관련 변수
let currentCategory = 'all';
let filteredJobData = [...jobData];

const container = document.getElementById('cardContainer');
const favoriteList = document.getElementById('favoriteList');
let likedCompanies = new Set(JSON.parse(localStorage.getItem('favorites')) || []);
let current = 0;

// ✅ 2. 카드 렌더링
function renderCards() {
  if (!container) return;

  container.innerHTML = '';
  filteredJobData.forEach((job, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    if (index === 0) card.classList.add('active');

    // 카드 내용 구성
    const cardContent = `
      <div class="card-header">
        <img src="${job.logo}" alt="${job.name} Logo" class="company-logo">
        <div class="company-info">
        <h2>${job.name}</h2>
          <p class="job-title">${job.job}</p>
          <span class="category-tag">${job.category}</span>
        </div>
      </div>
      
      <div class="job-details">
        <div class="detail-item">
          <i class="fas fa-map-marker-alt"></i>
          <span><span data-translate="지역">지역</span>: ${job.location}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-passport"></i>
          <span><span data-translate="비자 지원">비자 지원</span>: <span data-translate="${job.visa}">${job.visa}</span></span>
        </div>
        ${job.description ? `
          <div class="job-description">
            <i class="fas fa-info-circle"></i>
            ${job.description}
          </div>
        ` : ''}
      </div>
      
      <div class="card-actions">
        <div class="rating">${'⭐'.repeat(job.rating)}${'☆'.repeat(5 - job.rating)}</div>
        <div class="action-buttons">
          <button class="action-button like-button" onclick="likeCard('${job.name}')">
            <i class="fas fa-heart"></i> <span data-translate="관심 등록">관심 등록</span>
          </button>
          <button class="action-button apply-button" onclick="applyToJob('${job.name}')">
            <i class="fas fa-paper-plane"></i> <span data-translate="지원하기">지원하기</span>
          </button>
        </div>
      </div>
    `;

    card.innerHTML = cardContent;
    container.appendChild(card);
  });

  // 동적 콘텐츠 번역 적용
  if (typeof translateDynamicContent === 'function') {
    translateDynamicContent();
  }
}

// ✅ 3. 관심 등록 렌더링
function renderFavorites() {
  if (!favoriteList) return;

  favoriteList.innerHTML = '';
  likedCompanies.forEach(company => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="favorite-item-info">
        <div class="favorite-company">${company}</div>
      </div>
      <button class="remove-btn" onclick="removeFavorite('${company}')">
        <span data-translate="삭제">삭제</span>
      </button>
    `;
    favoriteList.appendChild(li);
  });

  // 관심 등록 개수 업데이트
  const favoriteCount = document.getElementById('favoriteCount');
  if (favoriteCount) {
    favoriteCount.textContent = likedCompanies.size;
  }

  localStorage.setItem('favorites', JSON.stringify([...likedCompanies]));

  // 동적 콘텐츠 번역 적용
  if (typeof translateDynamicContent === 'function') {
    translateDynamicContent();
  }
}

function likeCard(companyName) {
  if (!likedCompanies.has(companyName)) {
    likedCompanies.add(companyName);
    renderFavorites();
  } else {
    alert(companyName + " 은(는) 이미 관심 목록에 등록되어 있습니다.");
  }
}

function removeFavorite(companyName) {
  likedCompanies.delete(companyName);
  renderFavorites();
}

// ✅ 지원하기 기능 (임시)
function applyToJob(companyName) {
  alert(`${companyName}에 지원서를 제출했습니다!\n\n추후 지원서 관리 기능이 추가될 예정입니다.`);
}

// ✅ 카테고리 필터링 기능
function filterByCategory(category) {
  currentCategory = category;

  // 필터 버튼 상태 업데이트
  document.querySelectorAll('.filter-button').forEach(btn => {
    btn.classList.remove('active');
  });

  // 클릭된 버튼에 active 클래스 추가
  const clickedBtn = document.querySelector(`[data-filter="${getCategoryKey(category)}"]`);
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  // 데이터 필터링
  if (category === 'all') {
    filteredJobData = [...jobData];
  } else {
    filteredJobData = jobData.filter(job => job.category === category);
  }

  // 현재 인덱스 초기화
  current = 0;

  // 카드 다시 렌더링
  renderCards();
  updateUI();

  // 필터 결과 알림
  const resultCount = filteredJobData.length;
  if (category === 'all') {
    console.log(`전체 ${resultCount}개 기업을 표시합니다.`);
  } else {
    console.log(`${category} 카테고리 ${resultCount}개 기업을 표시합니다.`);
  }
}

// 카테고리명을 필터 키로 변환하는 함수
function getCategoryKey(category) {
  const categoryMap = {
    'all': 'all',
    'IT개발': 'it',
    '교육': 'education',
    '무역사무': 'trade',
    '서비스': 'service',
    '제조업': 'manufacture',
    '기타': 'other'
  };
  return categoryMap[category] || 'other';
}

// 기존 필터 버튼들에 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function () {
  // 필터 버튼 이벤트 리스너
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const filterType = this.getAttribute('data-filter');
      const categoryName = getCategoryName(filterType);
      filterByCategory(categoryName);
    });
  });

  // 전체 버튼 기본 활성화
  const allButton = document.querySelector('[data-filter="all"]');
  if (allButton) {
    allButton.classList.add('active');
  }
});

// 필터 키를 카테고리명으로 변환하는 함수
function getCategoryName(filterKey) {
  const keyMap = {
    'all': 'all',
    'it': 'IT개발',
    'education': '교육',
    'trade': '무역사무',
    'service': '서비스',
    'manufacture': '제조업',
    'design': '기타'
  };
  return keyMap[filterKey] || 'all';
}

// ✅ 4. 카드 넘기기
function nextCard() {
  const cards = document.querySelectorAll('.card');
  if (cards.length === 0) return;

  cards[current].classList.remove('active');
  current = (current + 1) % cards.length;
  cards[current].classList.add('active');
  updateUI(); // UI 업데이트
}

function prevCard() {
  const cards = document.querySelectorAll('.card');
  if (cards.length === 0) return;

  cards[current].classList.remove('active');
  current = (current - 1 + cards.length) % cards.length;
  cards[current].classList.add('active');
  updateUI(); // UI 업데이트
}

// ✅ 5. 키보드 네비게이션
document.addEventListener('keydown', (e) => {
  // 모달이 열려있을 때는 키보드 네비게이션 비활성화
  const modal = document.getElementById('addCompanyModal');
  if (modal && modal.style.display === 'flex') return;

  switch (e.key) {
    case 'ArrowRight':
    case ' ': // 스페이스바
      e.preventDefault();
      nextCard();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      prevCard();
      break;
    case 'Enter':
      e.preventDefault();
      const currentJob = jobData[current];
      if (currentJob) applyToJob(currentJob.name);
      break;
    case 'h': // 하트
    case 'l': // like
      e.preventDefault();
      const currentJobForLike = jobData[current];
      if (currentJobForLike) likeCard(currentJobForLike.name);
      break;
  }
});

// ✅ 6. 기업 추가 모달 관련 함수들
function openAddCompanyModal() {
  document.getElementById('addCompanyModal').style.display = 'flex';
  document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

function closeAddCompanyModal() {
  document.getElementById('addCompanyModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  // 폼 초기화
  document.getElementById('addCompanyForm').reset();
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function (e) {
  const modal = document.getElementById('addCompanyModal');
  if (e.target === modal) {
    closeAddCompanyModal();
  }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeAddCompanyModal();
  }
});

// ✅ 7. 기업 추가 폼 제출 처리
document.addEventListener('DOMContentLoaded', function () {
  const addCompanyForm = document.getElementById('addCompanyForm');
  if (addCompanyForm) {
    addCompanyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      addNewCompany();
    });
  }
});

function addNewCompany() {
  const formData = new FormData(document.getElementById('addCompanyForm'));

  const newCompany = {
    name: formData.get('companyName'),
    location: formData.get('location'),
    job: formData.get('job'),
    category: formData.get('category'),
    visa: formData.get('visa'),
    rating: parseInt(formData.get('rating')),
    logo: formData.get('logo') || `https://via.placeholder.com/100x100.png?text=${encodeURIComponent(formData.get('companyName'))}`,
    description: formData.get('description') || ''
  };

  // 필수 필드 검증
  if (!newCompany.name || !newCompany.location || !newCompany.job || !newCompany.category || !newCompany.visa || !newCompany.rating) {
    alert('필수 항목을 모두 입력해주세요.');
    return;
  }

  // jobData 배열에 새 회사 추가
  jobData.push(newCompany);

  // 현재 필터에 맞는 데이터도 업데이트
  if (currentCategory === 'all' || currentCategory === newCompany.category) {
    filteredJobData.push(newCompany);
  }

  // 로컬 스토리지에 저장
  localStorage.setItem('customJobs', JSON.stringify(jobData));

  // 카드 다시 렌더링
  renderCards();

  // 성공 메시지 및 모달 닫기
  alert(`${newCompany.name} 기업이 성공적으로 추가되었습니다!`);
  closeAddCompanyModal();

  // 새로 추가된 카드로 이동
  const newIndex = jobData.length - 1;
  showCard(newIndex);
}

// ✅ 8. 특정 카드 표시 함수
function showCard(index) {
  const cards = document.querySelectorAll('.card');
  if (cards.length === 0 || index < 0 || index >= cards.length) return;

  // 모든 카드 비활성화
  cards.forEach(card => card.classList.remove('active'));

  // 지정된 카드 활성화
  cards[index].classList.add('active');
  current = index;

  // UI 업데이트
  updateUI();
}

// ✅ 9. UI 업데이트 함수 (진행률 + 카운터 + 버튼 상태)
function updateUI() {
  updateProgress();
  updateCardCounter();
  updateNavigationButtons();
}

function updateProgress() {
  const progressBar = document.getElementById('progress');
  if (progressBar && jobData.length > 0) {
    const progressPercent = ((current + 1) / jobData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }
}

function updateCardCounter() {
  const currentCardNumber = document.getElementById('currentCardNumber');
  const totalCards = document.getElementById('totalCards');

  if (currentCardNumber && totalCards) {
    currentCardNumber.textContent = current + 1;
    totalCards.textContent = jobData.length;
  }
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn && nextBtn) {
    // 첫 번째 카드일 때 이전 버튼 비활성화
    prevBtn.disabled = (current === 0);
    // 마지막 카드일 때 다음 버튼 비활성화
    nextBtn.disabled = (current === jobData.length - 1);
  }
}

// ✅ 10. 페이지 로드 시 저장된 기업 데이터 불러오기
function loadSavedJobs() {
  const savedJobs = localStorage.getItem('customJobs');
  if (savedJobs) {
    const parsedJobs = JSON.parse(savedJobs);
    // 기본 데이터와 저장된 데이터 병합 (중복 제거)
    const existingNames = jobData.map(job => job.name);
    const newJobs = parsedJobs.filter(job => !existingNames.includes(job.name));
    jobData.push(...newJobs);
  }
}

// ✅ 11. 터치/스와이프 기능
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
  const swipeThreshold = 50; // 최소 스와이프 거리
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      // 오른쪽으로 스와이프 = 이전 카드
      prevCard();
    } else {
      // 왼쪽으로 스와이프 = 다음 카드
      nextCard();
    }
  }
}

// 터치 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function () {
  const cardContainer = document.getElementById('cardContainer');

  if (cardContainer) {
    // 터치 시작
    cardContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    // 터치 종료
    cardContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    }, { passive: true });

    // 마우스 드래그도 지원
    let isMouseDown = false;

    cardContainer.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      touchStartX = e.clientX;
      cardContainer.style.cursor = 'grabbing';
    });

    cardContainer.addEventListener('mousemove', (e) => {
      if (isMouseDown) {
        e.preventDefault();
      }
    });

    cardContainer.addEventListener('mouseup', (e) => {
      if (isMouseDown) {
        touchEndX = e.clientX;
        handleSwipe();
        isMouseDown = false;
        cardContainer.style.cursor = 'grab';
      }
    });

    cardContainer.addEventListener('mouseleave', () => {
      isMouseDown = false;
      cardContainer.style.cursor = 'grab';
    });

    // 커서 스타일 설정
    cardContainer.style.cursor = 'grab';
  }
});

// 로그아웃 기능
function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('favorites');
    window.location.href = 'login.html';
  }
}
