// 채용정보 페이지 JavaScript - 커뮤니티 스타일로 통일

// 로그인 상태 확인 및 토큰 검증
async function checkAuthStatus() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return false;
  }

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
    return true;
  }
}

// 페이지 로드 시 인증 확인
document.addEventListener('DOMContentLoaded', async () => {
  const isAuthenticated = await checkAuthStatus();
  if (isAuthenticated) {
    initializeJobsPage();
  }
});

// 페이지 로드 시 즉시 위치 조정 (DOM 준비 전에도 실행)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // DOM이 준비되면 즉시 위치 조정
    setTimeout(() => {
      adjustMainContentPosition(false);
    }, 10);
  });
} else {
  // 이미 DOM이 준비된 경우 즉시 실행
  adjustMainContentPosition(false);
}

// 구인 정보 페이지 초기화
function initializeJobsPage() {
  loadSavedJobs();
  setupFilterEvents();
  setupSearchEvents();
  renderJobs();
  setupPagination();
  setupResizeHandler();
  adjustMainContentPosition(false); // 초기 위치 조정 (transition 없음)
}

// 메인 콘텐츠 위치를 헤더 높이에 맞춰 조정하는 함수
function adjustMainContentPosition(enableTransition = false) {
  const header = document.querySelector('.header');
  const filterSection = document.querySelector('.filter-section');
  const mainContent = document.querySelector('.main-content');

  if (header && filterSection && mainContent) {
    if (enableTransition) {
      // 동적 조정 시에는 애니메이션과 함께
      setTimeout(() => {
        mainContent.classList.add('positioned');

        // 실제 헤더 높이 계산
        const headerHeight = header.offsetHeight;

        // 필터 섹션을 헤더 바로 아래에 위치시키기
        filterSection.style.marginTop = `${headerHeight}px`;

        // 전체 섹션 높이 계산
        const totalHeight = headerHeight + filterSection.offsetHeight;
        mainContent.style.marginTop = `${totalHeight + 20}px`;
      }, 50);
    } else {
      // 초기 로드 시에는 즉시 설정
      const headerHeight = header.offsetHeight;

      // 필터 섹션을 헤더 바로 아래에 위치시키기
      filterSection.style.marginTop = `${headerHeight}px`;

      // 전체 섹션 높이 계산
      const totalHeight = headerHeight + filterSection.offsetHeight;
      mainContent.style.marginTop = `${totalHeight + 20}px`;
    }
  }
}

// 화면 크기 변경 시 메인 콘텐츠 위치 조정
function setupResizeHandler() {
  window.addEventListener('resize', function () {
    adjustMainContentPosition(true); // 리사이즈 시에는 transition 사용
  });
}

// 샘플 채용공고 데이터
window.jobData = [
  {
    id: 1,
    title: "프론트엔드 개발자",
    company: "KGlobal Inc.",
    location: "서울",
    category: "it",
    employment: "정규직",
    salary: "3000-4000",
    visa: ["E-7", "F-2"],
    korean: "intermediate",
    english: "basic",
    description: "React, Vue.js를 활용한 웹 애플리케이션 개발 업무를 담당합니다. 신입/경력 모두 환영하며, 성장할 수 있는 환경을 제공합니다.",
    deadline: "2024-02-15",
    posted: "2024-01-15",
    views: 156,
    logo: "https://via.placeholder.com/60x60.png?text=KG"
  },
  {
    id: 2,
    title: "영어 강사",
    company: "Ocean Korea",
    location: "부산",
    category: "education",
    employment: "계약직",
    salary: "2000-3000",
    visa: ["E-2"],
    korean: "basic",
    english: "native",
    description: "초/중/고등학생 영어 회화 및 문법 수업을 담당합니다. 원어민 우대하며, 교육 경험이 있으신 분을 찾습니다.",
    deadline: "2024-02-20",
    posted: "2024-01-10",
    views: 89,
    logo: "https://via.placeholder.com/60x60.png?text=OK"
  },
  {
    id: 3,
    title: "무역사무원",
    company: "Hansung Tech",
    location: "인천",
    category: "trade",
    employment: "정규직",
    salary: "4000-5000",
    visa: ["E-7", "F-4", "F-6"],
    korean: "advanced",
    english: "intermediate",
    description: "수출입 업무, 해외 바이어 관리, 무역서류 작성 등의 업무를 담당합니다. 무역 실무 경험자 우대합니다.",
    deadline: "2024-02-25",
    posted: "2024-01-12",
    views: 234,
    logo: "https://via.placeholder.com/60x60.png?text=HT"
  },
  {
    id: 4,
    title: "서비스 매니저",
    company: "Seoul Service Co.",
    location: "서울",
    category: "service",
    employment: "정규직",
    salary: "3000-4000",
    visa: ["E-7", "F-2", "F-4"],
    korean: "advanced",
    english: "basic",
    description: "고객 서비스 관리 및 직원 교육을 담당합니다. 서비스업 경험이 있으신 분을 우대합니다.",
    deadline: "2024-02-28",
    posted: "2024-01-18",
    views: 112,
    logo: "https://via.placeholder.com/60x60.png?text=SS"
  },
  {
    id: 5,
    title: "제조업 품질관리",
    company: "Korea Manufacturing",
    location: "경기",
    category: "manufacture",
    employment: "정규직",
    salary: "2000-3000",
    visa: ["E-9", "F-4"],
    korean: "intermediate",
    english: "basic",
    description: "제품 품질 검사 및 관리 업무를 담당합니다. 제조업 경험자 우대하며, 꼼꼼한 성격의 지원자를 찾습니다.",
    deadline: "2024-03-05",
    posted: "2024-01-20",
    views: 78,
    logo: "https://via.placeholder.com/60x60.png?text=KM"
  },
  {
    id: 6,
    title: "그래픽 디자이너",
    company: "Creative Studio",
    location: "서울",
    category: "design",
    employment: "계약직",
    salary: "3000-4000",
    visa: ["E-7", "F-2"],
    korean: "intermediate",
    english: "intermediate",
    description: "브랜드 디자인, 광고 제작물 디자인 업무를 담당합니다. Photoshop, Illustrator 능숙자 우대합니다.",
    deadline: "2024-03-10",
    posted: "2024-01-22",
    views: 145,
    logo: "https://via.placeholder.com/60x60.png?text=CS"
  }
];

// 전역 변수
let filteredJobs = [...window.jobData];
let currentPage = 1;
let jobsPerPage = 5;
let currentFilter = 'all';
let likedJobs = new Set(JSON.parse(localStorage.getItem('favoriteJobs')) || []);

// 필터 이벤트 설정
function setupFilterEvents() {
  // 카테고리 필터 버튼
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      // 활성 상태 변경
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // 필터 적용
      const category = this.getAttribute('data-filter');
      filterJobs(category);
    });
  });

  // 고급 필터 토글
  const advancedToggle = document.querySelector('.advanced-filter-toggle');
  const advancedFilters = document.querySelector('.advanced-filters');
  const mainContent = document.querySelector('.main-content');

  if (advancedToggle && advancedFilters && mainContent) {
    advancedToggle.addEventListener('click', function () {
      advancedFilters.classList.toggle('show');

      // 헤더 전체 높이를 계산하여 메인 콘텐츠 위치 조정
      adjustMainContentPosition(true); // 동적 조정 (transition 사용)
    });
  }

  // 정렬 옵션
  const sortSelect = document.getElementById('sortType');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      sortJobs(this.value);
    });
  }
}

// 검색 이벤트 설정
function setupSearchEvents() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');

  if (searchInput) {
    searchInput.addEventListener('keypress', handleSearchEnter);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', searchJobs);
  }
}

// 검색 엔터 처리
function handleSearchEnter(event) {
  if (event.key === 'Enter') {
    searchJobs();
  }
}

// 검색 기능
function searchJobs() {
  const searchType = document.getElementById('searchType').value;
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

  if (!searchTerm) {
    filteredJobs = [...window.jobData];
  } else {
    filteredJobs = window.jobData.filter(job => {
      switch (searchType) {
        case 'title':
          return job.title.toLowerCase().includes(searchTerm);
        case 'company':
          return job.company.toLowerCase().includes(searchTerm);
        case 'location':
          return job.location.toLowerCase().includes(searchTerm);
        case 'all':
          return job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm);
        default:
          return true;
      }
    });
  }

  currentPage = 1;
  renderJobs();
  setupPagination();
}

// 필터 기능
function filterJobs(category) {
  currentFilter = category;

  if (category === 'all') {
    filteredJobs = [...window.jobData];
  } else {
    filteredJobs = window.jobData.filter(job => job.category === category);
  }

  currentPage = 1;
  renderJobs();
  setupPagination();
}

// 정렬 기능
function sortJobs(sortType) {
  switch (sortType) {
    case 'latest':
      filteredJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
      break;
    case 'deadline':
      filteredJobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      break;
    case 'salary':
      filteredJobs.sort((a, b) => {
        const getSalaryValue = (salary) => {
          if (salary === '5000+') return 5000;
          return parseInt(salary.split('-')[0]);
        };
        return getSalaryValue(b.salary) - getSalaryValue(a.salary);
      });
      break;
  }

  renderJobs();
}

// 채용공고 목록 렌더링
function renderJobs() {
  const jobsList = document.getElementById('jobsList');
  const jobsCount = document.getElementById('jobsCount');

  if (!jobsList) return;

  // 페이지네이션 적용
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const jobsToShow = filteredJobs.slice(startIndex, endIndex);

  if (jobsToShow.length === 0) {
    jobsList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-briefcase"></i>
        <h3>검색 결과가 없습니다</h3>
        <p>다른 검색어나 필터를 시도해보세요.</p>
      </div>
    `;
  } else {
    jobsList.innerHTML = jobsToShow.map(job => createJobCard(job)).join('');
  }

  // 총 개수 업데이트
  if (jobsCount) {
    jobsCount.textContent = filteredJobs.length;
  }
}

// 채용공고 카드 생성
function createJobCard(job) {
  const isLiked = likedJobs.has(job.id);
  const salaryText = job.salary === '5000+' ? '5,000만원 이상' : `${job.salary.replace('-', '~')}만원`;
  const visaText = job.visa.join(', ');

  const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const deadlineClass = daysLeft <= 7 ? 'urgent' : '';

  return `
    <div class="job-item" data-job-id="${job.id}">
      <div class="job-header">
        <div class="job-info">
          <div class="job-title">${job.title}</div>
          <div class="company-name">${job.company}</div>
          <span class="job-category">${getCategoryName(job.category)}</span>
        </div>
        <img src="${job.logo}" alt="${job.company} 로고" class="company-logo">
      </div>
      
      <div class="job-details">
        <div class="detail-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>${job.location}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-briefcase"></i>
          <span>${job.employment}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-won-sign"></i>
          <span>${salaryText}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-passport"></i>
          <span>${visaText}</span>
        </div>
      </div>
      
      <div class="job-description">
        ${job.description}
      </div>
      
      <div class="job-meta">
        <div class="job-date">
          <i class="fas fa-calendar"></i>
          <span>마감: ${job.deadline} (${daysLeft}일 남음)</span>
        </div>
        <div class="job-actions">
          <button class="action-btn ${isLiked ? 'active' : ''}" onclick="toggleLike(${job.id})">
            <i class="fas fa-heart"></i>
          </button>
          <button class="action-btn" onclick="viewJobDetail(${job.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn" onclick="applyToJob(${job.id})">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// 카테고리 이름 변환
function getCategoryName(category) {
  const categoryNames = {
    'all': '전체',
    'it': 'IT개발',
    'education': '교육',
    'trade': '무역사무',
    'service': '서비스',
    'manufacture': '제조업',
    'design': '기타'
  };
  return categoryNames[category] || category;
}

// 페이지네이션 설정
function setupPagination() {
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const pagination = document.getElementById('pagination');

  if (!pagination) return;

  let paginationHTML = '';

  // 이전 버튼
  if (currentPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage - 1})">
      <i class="fas fa-chevron-left"></i>
    </button>`;
  }

  // 페이지 번호들
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="changePage(1)">1</button>`;
    if (startPage > 2) {
      paginationHTML += `<span class="page-ellipsis">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" 
      onclick="changePage(${i})">${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<span class="page-ellipsis">...</span>`;
    }
    paginationHTML += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  }

  // 다음 버튼
  if (currentPage < totalPages) {
    paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage + 1})">
      <i class="fas fa-chevron-right"></i>
    </button>`;
  }

  pagination.innerHTML = paginationHTML;
}

// 페이지 변경
function changePage(page) {
  currentPage = page;
  renderJobs();
  setupPagination();

  // 맨 위로 스크롤
  document.querySelector('.jobs-container').scrollIntoView({ behavior: 'smooth' });
}

// 관심 등록/해제
function toggleLike(jobId) {
  if (likedJobs.has(jobId)) {
    likedJobs.delete(jobId);
  } else {
    likedJobs.add(jobId);
  }

  localStorage.setItem('favoriteJobs', JSON.stringify([...likedJobs]));
  renderJobs(); // 하트 아이콘 상태 업데이트
}

// 채용공고 상세보기
function viewJobDetail(jobId) {
  const job = window.jobData.find(j => j.id === jobId);
  if (job) {
    // 조회수 증가
    job.views++;

    // 상세보기 모달 또는 페이지로 이동
    alert(`${job.title} - ${job.company}\n\n${job.description}\n\n상세 페이지 구현 예정입니다.`);
  }
}

// 지원하기
function applyToJob(jobId) {
  const job = window.jobData.find(j => j.id === jobId);
  if (job) {
    if (confirm(`${job.company}의 ${job.title} 포지션에 지원하시겠습니까?`)) {
      alert("지원이 완료되었습니다!\n\n지원 현황은 마이페이지에서 확인할 수 있습니다.");
    }
  }
}

// 채용공고 등록 모달
function openAddJobModal() {
  const modal = document.getElementById('addJobModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeAddJobModal() {
  const modal = document.getElementById('addJobModal');
  if (modal) {
    modal.style.display = 'none';
    document.getElementById('addJobForm').reset();
  }
}

// 채용공고 등록 폼 제출
document.addEventListener('DOMContentLoaded', function () {
  const addJobForm = document.getElementById('addJobForm');
  if (addJobForm) {
    addJobForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const jobData = Object.fromEntries(formData);

      // 새로운 ID 생성
      jobData.id = Date.now();
      jobData.visa = jobData.visa ? [jobData.visa] : [];
      jobData.posted = new Date().toISOString().split('T')[0];
      jobData.views = 0;

      // 기본 로고 설정
      if (!jobData.logo) {
        jobData.logo = `https://via.placeholder.com/60x60.png?text=${jobData.company.charAt(0).toUpperCase()}`;
      }

      // 샘플 데이터에 추가 (실제 구현에서는 API 호출)
      window.jobData.push(jobData);
      filteredJobs = [...window.jobData];

      // UI 업데이트
      renderJobs();
      setupPagination();

      // 모달 닫기
      closeAddJobModal();

      alert('채용공고가 성공적으로 등록되었습니다!');
    });
  }
});

// 필터 초기화
function resetFilters() {
  // 모든 체크박스 해제
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

  // 필터 적용
  applyFilters();
}

// 고급 필터 적용
function applyFilters() {
  let filtered = [...window.jobData];

  // 고용형태 필터
  const employmentFilters = Array.from(document.querySelectorAll('input[name="employment"]:checked')).map(cb => cb.value);
  if (employmentFilters.length > 0) {
    filtered = filtered.filter(job => employmentFilters.includes(job.employment));
  }

  // 급여 필터
  const salaryFilters = Array.from(document.querySelectorAll('input[name="salary"]:checked')).map(cb => cb.value);
  if (salaryFilters.length > 0) {
    filtered = filtered.filter(job => salaryFilters.includes(job.salary));
  }

  // 비자 필터
  const visaFilters = Array.from(document.querySelectorAll('input[name="visa"]:checked')).map(cb => cb.value);
  if (visaFilters.length > 0) {
    filtered = filtered.filter(job => job.visa.some(v => visaFilters.includes(v)));
  }

  // 언어 수준 필터
  const koreanLevel = document.querySelector('select[name="korean-level"]').value;
  const englishLevel = document.querySelector('select[name="english-level"]').value;

  if (koreanLevel) {
    // 언어 수준 비교 로직 (간단화)
    filtered = filtered.filter(job => job.korean === koreanLevel || job.korean === 'basic');
  }

  if (englishLevel) {
    filtered = filtered.filter(job => job.english === englishLevel || job.english === 'basic');
  }

  filteredJobs = filtered;
  currentPage = 1;
  renderJobs();
  setupPagination();

  // 고급 필터 패널 닫기
  const advancedFilters = document.querySelector('.advanced-filters');
  const mainContent = document.querySelector('.main-content');

  if (advancedFilters) {
    advancedFilters.classList.remove('show');
  }

  // 메인 콘텐츠 위치 헤더 높이에 맞춰 조정
  adjustMainContentPosition(true); // 동적 조정 (transition 사용)
}

// 저장된 데이터 불러오기
function loadSavedJobs() {
  const saved = localStorage.getItem('favoriteJobs');
  if (saved) {
    likedJobs = new Set(JSON.parse(saved));
  }
}

// 로그아웃
function logout() {
  if (confirm("로그아웃 하시겠습니까?")) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
}
