// 채용정보 페이지 JavaScript - 커뮤니티 스타일로 통일

// 로그인 상태 확인은 CommonUtils로 이동됨

// 페이지 로드 시 인증 확인
document.addEventListener('DOMContentLoaded', async () => {
  const isAuthenticated = await CommonUtils.checkAuthStatus();
  if (isAuthenticated) {
    await fetchJobs();
    initializeJobsPage();
  }
});

// 페이지 로드 시 즉시 위치 조정 (DOM 준비 전에도 실행)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // DOM이 준비되면 즉시 위치 조정
    setTimeout(() => {
      CommonUtils.adjustMainContentPosition(false);
    }, 10);
  });
} else {
  // 이미 DOM이 준비된 경우 즉시 실행
  CommonUtils.adjustMainContentPosition(false);
}

// 구인 정보 페이지 초기화
function initializeJobsPage() {
  loadSavedJobs();
  CommonUtils.setupFilterEvents(filterJobs, sortJobs);
  CommonUtils.setupSearchEvents(searchJobs);
  renderJobs();
  setupPagination();
  CommonUtils.setupResizeHandler();
  CommonUtils.adjustMainContentPosition(false); // 초기 위치 조정 (transition 없음)
}

// 공통 함수들은 CommonUtils로 이동됨

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

// 공통 이벤트 설정 함수들은 CommonUtils로 이동됨

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
        <h3 data-translate="검색 결과가 없습니다">검색 결과가 없습니다</h3>
        <p data-translate="다른 검색어나 필터를 시도해보세요.">다른 검색어나 필터를 시도해보세요.</p>
      </div>
    `;
  } else {
    jobsList.innerHTML = jobsToShow.map(job => createJobCard(job)).join('');
  }

  // 총 개수 업데이트
  if (jobsCount) {
    jobsCount.textContent = filteredJobs.length;
  }

  // 번역 적용
  if (window.translator) {
    window.translator.updateUILanguage();
  }
}

// 채용공고 카드 생성
function createJobCard(job) {
  const isLiked = likedJobs.has(job.id);
  const salaryText = job.salary === '5000+' ? '5,000만원 이상' : `${job.salary.replace('-', '~')}만원`;
  const visaText = Array.isArray(job.visa)
    ? job.visa.join(', ')
    : (typeof job.visa === 'string' && job.visa.length > 0 ? job.visa : '');

  const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const deadlineClass = daysLeft <= 7 ? 'urgent' : '';

  return `
    <div class="job-item" data-job-id="${job.id}">
      <div class="job-header">
        <div class="job-info">
          <div class="job-title" data-translate="${job.title}">${job.title}</div>
          <div class="company-name" data-translate="${job.company}">${job.company}</div>
          <span class="job-category" data-translate="${getCategoryName(job.category)}">${getCategoryName(job.category)}</span>
        </div>
      </div>
      
      <div class="job-details">
        <div class="detail-item">
          <i class="fas fa-map-marker-alt"></i>
          <span data-translate="${job.location}">${job.location}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-briefcase"></i>
          <span data-translate="${job.employment}">${job.employment}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-won-sign"></i>
          <span data-translate="${salaryText}">${salaryText}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-passport"></i>
          <span data-translate="${visaText}">${visaText}</span>
        </div>
      </div>
      
      <div class="job-description" data-translate="${job.description}">
        ${job.description}
      </div>
      
      <div class="job-meta">
        <div class="job-date">
          <i class="fas fa-calendar"></i>
          <span data-translate="마감: ${job.deadline} (${daysLeft}일 남음)">마감: ${job.deadline} (${daysLeft}일 남음)</span>
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

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let paginationHTML = '';

  // 이전 버튼
  paginationHTML += `
    <button class="page-btn nav-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fas fa-chevron-left"></i>
    </button>
  `;

  // 페이지 번호들
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  // 첫 페이지와 생략 표시
  if (startPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="changePage(1)">1</button>`;
    if (startPage > 2) {
      paginationHTML += `<button class="page-btn ellipsis">...</button>`;
    }
  }

  // 현재 페이지 주변 페이지들
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  // 마지막 페이지와 생략 표시
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<button class="page-btn ellipsis">...</button>`;
    }
    paginationHTML += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  }

  // 다음 버튼
  paginationHTML += `
    <button class="page-btn nav-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
      <i class="fas fa-chevron-right"></i>
    </button>
  `;

  pagination.innerHTML = paginationHTML;
}

// 페이지 변경
function changePage(page) {
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderJobs();
  setupPagination();

  // 맨 위로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 관심 등록/해제
function toggleLike(jobId) {
  const job = window.jobData.find(j => j.id === jobId);
  if (!job) return;

  let favorites = JSON.parse(localStorage.getItem('jobFavorites')) || [];

  if (likedJobs.has(jobId)) {
    // 관심 해제
    likedJobs.delete(jobId);
    favorites = favorites.filter(fav => fav.id !== jobId);
  } else {
    // 관심 등록
    likedJobs.add(jobId);
    const favoriteJob = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      workType: job.employment,
      dateAdded: new Date().toISOString()
    };
    favorites.push(favoriteJob);
  }

  localStorage.setItem('jobFavorites', JSON.stringify(favorites));
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
    addJobForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const jobData = Object.fromEntries(formData);

      // 비자(visa) 체크박스 값 여러 개 배열로 수집
      const visaChecked = Array.from(document.querySelectorAll('input[name="visa"]:checked')).map(cb => cb.value);
      jobData.visa = visaChecked;
      if (!jobData.visa || jobData.visa.length === 0) {
        alert('비자 종류를 1개 이상 선택해주세요.');
        return;
      }

      // employment 값 매핑
      const employmentMap = {
        '정규직': 'full-time',
        '계약직': 'contract',
        '인턴': 'intern',
        '파견직': 'part-time'
      };
      if (jobData.employment && employmentMap[jobData.employment]) {
        jobData.employment = employmentMap[jobData.employment];
      }

      // DB에 저장 (POST)
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (res.ok) {
        alert('채용공고가 성공적으로 등록되었습니다!');
        closeAddJobModal();
        await fetchJobs(); // 목록 새로고침
      } else {
        alert('채용공고 등록에 실패했습니다.');
      }
    });
  }
});

// 필터 초기화
function resetFilters() {
  CommonUtils.resetFilters();
  applyFilters();
}

// 고급 필터 적용
function applyFilters() {
  let filtered = [...window.jobData];

  // 고용형태 필터
  const employmentFilters = Array.from(document.querySelectorAll('input[name="employment"]:checked')).map(cb => cb.value);
  const employmentMap = {
    '정규직': 'full-time',
    '계약직': 'contract',
    '인턴': 'intern',
    '파견직': 'part-time'
  };
  if (employmentFilters.length > 0) {
    const mappedEmployment = employmentFilters.map(val => employmentMap[val] || val);
    filtered = filtered.filter(job => mappedEmployment.includes(job.employment));
  }

  // 급여 필터
  const salaryFilters = Array.from(document.querySelectorAll('input[name="salary"]:checked')).map(cb => cb.value);
  if (salaryFilters.length > 0) {
    filtered = filtered.filter(job => salaryFilters.includes(job.salary));
  }

  // 비자 필터 (하나라도 포함되면 통과)
  const visaFilters = Array.from(document.querySelectorAll('input[name="visa"]:checked')).map(cb => cb.value);
  if (visaFilters.length > 0) {
    filtered = filtered.filter(job => {
      let visaArr = [];
      if (Array.isArray(job.visa)) {
        visaArr = job.visa;
      } else if (typeof job.visa === 'string') {
        visaArr = job.visa.split(',').map(v => v.trim());
      }
      return visaArr.some(v => visaFilters.includes(v));
    });
  }

  // 언어 수준 필터
  const koreanLevel = document.querySelector('select[name="korean-level"]').value;
  const englishLevel = document.querySelector('select[name="english-level"]').value;

  if (koreanLevel) {
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
  if (advancedFilters) {
    advancedFilters.classList.remove('show');
    CommonUtils.removeAdvancedFiltersOutsideClick();
  }
  CommonUtils.adjustMainContentPosition(true);
}

// 저장된 데이터 불러오기
function loadSavedJobs() {
  // 기존 방식과 새로운 방식 모두 지원
  const oldSaved = CommonUtils.storage.get('favoriteJobs');
  const newSaved = CommonUtils.storage.get('jobFavorites');

  if (newSaved) {
    likedJobs = new Set(newSaved.map(fav => fav.id));
  } else if (oldSaved) {
    // 기존 데이터를 새로운 형식으로 변환
    likedJobs = new Set(oldSaved);

    // 새로운 형식으로 변환하여 저장
    const newFavorites = oldSaved.map(jobId => {
      const job = window.jobData.find(j => j.id === jobId);
      return job ? {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        workType: job.employment,
        dateAdded: new Date().toISOString()
      } : null;
    }).filter(Boolean);

    CommonUtils.storage.set('jobFavorites', newFavorites);
    CommonUtils.storage.remove('favoriteJobs'); // 기존 데이터 제거
  }
}

// 로그아웃
function logout() {
  CommonUtils.logout();
}

async function fetchJobs() {
  const res = await fetch('/api/jobs');
  const jobs = await res.json();
  window.jobData = jobs;
  filteredJobs = [...window.jobData];
  renderJobs();
  setupPagination();
}
