// ✅ 1. 로그인 상태 확인
if (!localStorage.getItem("token")) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html";
}

// 샘플 구직 데이터
const jobData = [
    {
        id: 1,
        name: "테크놀로지 코리아",
        location: "서울 강남구",
        job: "프론트엔드 개발자",
        type: "정규직",
        salary: "4,000~5,000만원",
        visa: "E-7 비자 지원",
        rating: 4.5,
        description: "글로벌 IT 기업에서 프론트엔드 개발자를 모십니다. React, TypeScript 경험자 우대.",
        logo: "https://via.placeholder.com/150?text=TC",
        category: "it",
        skills: ["React", "TypeScript", "HTML/CSS"],
        benefits: ["주 35시간 근무", "점심/저녁 식대지원", "해외 컨퍼런스 지원"],
        deadline: "2024-03-31"
    },
    {
        id: 2,
        name: "글로벌 교육센터",
        location: "서울 마포구",
        job: "영어 강사",
        type: "계약직",
        salary: "시급 4만원",
        visa: "E-2 비자 필수",
        rating: 4.0,
        description: "원어민 수준의 영어 실력을 갖춘 강사님을 모십니다. TESOL 자격증 소지자 우대.",
        logo: "https://via.placeholder.com/150?text=GE",
        category: "education",
        skills: ["TESOL", "교육 경험", "커리큘럼 개발"],
        benefits: ["유연근무제", "교육비 지원", "경조사 지원"],
        deadline: "2024-03-15"
    },
    {
        id: 3,
        name: "한국 무역",
        location: "부산 해운대구",
        job: "무역 사무",
        type: "정규직",
        salary: "3,500~4,000만원",
        visa: "F-2 이상 가능",
        rating: 4.2,
        description: "수출입 관련 문서 작성 및 처리 업무. 중국어 또는 일본어 가능자 우대.",
        logo: "https://via.placeholder.com/150?text=KT",
        category: "trade",
        skills: ["무역실무", "중국어", "일본어"],
        benefits: ["주 40시간 근무", "야근수당", "해외출장"],
        deadline: "2024-04-15"
    },
    {
        id: 4,
        name: "스마트 팩토리",
        location: "인천 송도",
        job: "생산관리",
        type: "정규직",
        salary: "3,000~3,500만원",
        visa: "E-7 비자 지원",
        rating: 3.8,
        description: "스마트 팩토리 생산라인 관리 및 품질관리. 제조업 경력자 우대.",
        logo: "https://via.placeholder.com/150?text=SF",
        category: "manufacture",
        skills: ["품질관리", "생산관리", "ERP"],
        benefits: ["기숙사 제공", "통근버스", "자격증 취득 지원"],
        deadline: "2024-03-20"
    },
    {
        id: 5,
        name: "디자인허브",
        location: "서울 성동구",
        job: "UI/UX 디자이너",
        type: "정규직",
        salary: "3,800~4,500만원",
        visa: "E-7 비자 지원",
        rating: 4.7,
        description: "글로벌 서비스의 UI/UX 디자인을 담당할 디자이너를 찾습니다. 피그마 숙련자 우대.",
        logo: "https://via.placeholder.com/150?text=DH",
        category: "design",
        skills: ["Figma", "Adobe XD", "프로토타이핑"],
        benefits: ["자율출퇴근", "맥북 프로 지급", "디자인 툴 구독료 지원"],
        deadline: "2024-04-10"
    },
    {
        id: 6,
        name: "서울 호텔",
        location: "서울 중구",
        job: "호텔리어",
        type: "정규직",
        salary: "3,000~3,500만원",
        visa: "E-7 비자 가능",
        rating: 4.1,
        description: "5성급 호텔에서 함께할 프론트 데스크 직원을 모집합니다. 영어 필수, 제2외국어 우대.",
        logo: "https://via.placeholder.com/150?text=SH",
        category: "service",
        skills: ["영어회화", "고객서비스", "호텔 PMS"],
        benefits: ["호텔 직원가 이용", "유니폼 제공", "명절선물"],
        deadline: "2024-03-25"
    },
    {
        id: 7,
        name: "클라우드테크",
        location: "서울 구로구",
        job: "백엔드 개발자",
        type: "정규직",
        salary: "4,500~5,500만원",
        visa: "E-7 비자 지원",
        rating: 4.6,
        description: "클라우드 기반 서비스 개발을 위한 백엔드 개발자를 모집합니다. AWS 경험자 우대.",
        logo: "https://via.placeholder.com/150?text=CT",
        category: "it",
        skills: ["Node.js", "AWS", "MongoDB"],
        benefits: ["스톡옵션", "해외 워크샵", "자기개발비"],
        deadline: "2024-04-20"
    },
    {
        id: 8,
        name: "키즈스쿨",
        location: "경기 분당구",
        job: "유아 교육 강사",
        type: "정규직",
        salary: "2,800~3,300만원",
        visa: "E-2 비자 필수",
        rating: 4.3,
        description: "영유아 대상 영어 교육 프로그램 진행. 교육 경험자 우대.",
        logo: "https://via.placeholder.com/150?text=KS",
        category: "education",
        skills: ["유아교육", "영어교육", "학부모 상담"],
        benefits: ["방학 제공", "4대 보험", "중식 제공"],
        deadline: "2024-03-30"
    },
    {
        id: 9,
        name: "글로벌로지스틱스",
        location: "인천 중구",
        job: "물류 관리자",
        type: "정규직",
        salary: "3,500~4,000만원",
        visa: "E-7 비자 지원",
        rating: 4.0,
        description: "국제 물류 운영 및 관리 업무. 물류 경험자 우대.",
        logo: "https://via.placeholder.com/150?text=GL",
        category: "trade",
        skills: ["물류관리", "SAP", "영어"],
        benefits: ["상여금", "직책수당", "야간수당"],
        deadline: "2024-04-05"
    },
    {
        id: 10,
        name: "뷰티살롱",
        location: "서울 압구정",
        job: "헤어디자이너",
        type: "정규직",
        salary: "3,000~4,500만원",
        visa: "E-7 비자 가능",
        rating: 4.4,
        description: "글로벌 헤어살롱에서 함께할 디자이너를 모집합니다. 영어 가능자 우대.",
        logo: "https://via.placeholder.com/150?text=BS",
        category: "service",
        skills: ["헤어디자인", "컬러링", "고객서비스"],
        benefits: ["장비 지원", "교육 지원", "인센티브"],
        deadline: "2024-04-15"
    },
    {
        id: 11,
        name: "테크스타트업",
        location: "서울 서초구",
        job: "모바일 앱 개발자",
        type: "정규직",
        salary: "4,200~5,000만원",
        visa: "E-7 비자 지원",
        rating: 4.8,
        description: "핀테크 앱 개발을 위한 iOS/Android 개발자 모집. React Native 경험자 우대.",
        logo: "https://via.placeholder.com/150?text=TS",
        category: "it",
        skills: ["React Native", "iOS", "Android"],
        benefits: ["주 4.5일 근무", "운동비 지원", "원격근무"],
        deadline: "2024-04-30"
    },
    {
        id: 12,
        name: "크리에이티브에이전시",
        location: "서울 강남구",
        job: "모션그래픽 디자이너",
        type: "정규직",
        salary: "3,500~4,200만원",
        visa: "E-7 비자 지원",
        rating: 4.5,
        description: "브랜드 모션그래픽 제작. After Effects 능숙자 우대.",
        logo: "https://via.placeholder.com/150?text=CA",
        category: "design",
        skills: ["After Effects", "Premiere Pro", "Illustration"],
        benefits: ["장비 지원", "교육비 지원", "돌잔치 휴가"],
        deadline: "2024-04-25"
    }
];

let filteredJobs = [...jobData];
let current = 0;
const container = document.getElementById('cardContainer');
const favoriteList = document.getElementById('favoriteList');
const progressBar = document.getElementById('progress');
const favoriteCount = document.getElementById('favoriteCount');
let likedCompanies = new Set(JSON.parse(localStorage.getItem('favorites')) || []);

// 상세 필터 토글
document.querySelector('.advanced-filter-toggle').addEventListener('click', function() {
    document.querySelector('.advanced-filters').classList.toggle('show');
});

// 필터 초기화
function resetFilters() {
    // 체크박스 초기화
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // 셀렉트 박스 초기화
    document.querySelectorAll('select').forEach(select => {
        select.value = '';
    });

    // 직종 필터 초기화
    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.filter-button[data-filter="all"]').classList.add('active');

    // 카드 리스트 초기화
    filteredJobs = [...jobData];
    current = 0;
    renderCards();
}

// 필터 적용
function applyFilters() {
    // 선택된 직종
    const activeCategory = document.querySelector('.filter-button.active').dataset.filter;

    // 선택된 고용형태
    const selectedEmployment = Array.from(document.querySelectorAll('input[name="employment"]:checked'))
        .map(checkbox => checkbox.value);

    // 선택된 급여 범위
    const selectedSalary = Array.from(document.querySelectorAll('input[name="salary"]:checked'))
        .map(checkbox => checkbox.value);

    // 선택된 비자 종류
    const selectedVisa = Array.from(document.querySelectorAll('input[name="visa"]:checked'))
        .map(checkbox => checkbox.value);

    // 선택된 언어 수준
    const koreanLevel = document.querySelector('select[name="korean-level"]').value;
    const englishLevel = document.querySelector('select[name="english-level"]').value;

    // 필터링 적용
    filteredJobs = jobData.filter(job => {
        // 직종 필터
        if (activeCategory !== 'all' && job.category !== activeCategory) {
            return false;
        }

        // 고용형태 필터
        if (selectedEmployment.length > 0 && !selectedEmployment.includes(job.type)) {
            return false;
        }

        // 급여 필터
        if (selectedSalary.length > 0) {
            const salary = parseInt(job.salary.replace(/[^0-9]/g, ''));
            const matchesSalary = selectedSalary.some(range => {
                const [min, max] = range.split('-').map(Number);
                if (range === '5000+') {
                    return salary >= 5000;
                }
                return salary >= min && salary <= max;
            });
            if (!matchesSalary) {
                return false;
            }
        }

        // 비자 필터
        if (selectedVisa.length > 0) {
            const jobVisa = job.visa.split(' ')[0]; // "E-7 비자 지원" -> "E-7"
            if (!selectedVisa.includes(jobVisa)) {
                return false;
            }
        }

        // 언어 수준 필터 (실제 데이터에 언어 수준이 추가되면 구현)
        // if (koreanLevel && job.koreanLevel < koreanLevel) return false;
        // if (englishLevel && job.englishLevel < englishLevel) return false;

        return true;
    });

    // 결과가 없는 경우
    if (filteredJobs.length === 0) {
        showToast('검색 결과가 없습니다. 필터 조건을 변경해보세요.');
        return;
    }

    // 필터링된 결과 표시
    current = 0;
    renderCards();
    
    // 필터 패널 닫기
    document.querySelector('.advanced-filters').classList.remove('show');
    
    // 검색 결과 수 표시
    showToast(`${filteredJobs.length}개의 채용정보를 찾았습니다.`);
}

// 직종 필터 이벤트 리스너
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        // 이미 선택된 버튼을 다시 클릭한 경우 무시
        if (button.classList.contains('active')) return;

        // 버튼 활성화 상태 변경
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // 다른 필터가 적용되어 있는 경우 전체 필터 적용
        if (document.querySelector('input[type="checkbox"]:checked') || 
            document.querySelector('select[name="korean-level"]').value || 
            document.querySelector('select[name="english-level"]').value) {
            applyFilters();
        } else {
            // 직종 필터만 적용
            const filter = button.dataset.filter;
            filteredJobs = filter === 'all' 
                ? [...jobData]
                : jobData.filter(job => job.category === filter);
            current = 0;
            renderCards();
        }
    });
});

// 카드 렌더링
function renderCards() {
    container.innerHTML = '';
    filteredJobs.forEach((job, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        if (index === 0) card.classList.add('active');
        
        const stars = '⭐'.repeat(Math.floor(job.rating)) + 
                     (job.rating % 1 >= 0.5 ? '⭐' : '') +
                     '☆'.repeat(5 - Math.ceil(job.rating));

        const deadline = new Date(job.deadline);
        const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
        
        card.innerHTML = `
            <div class="card-header">
                <img src="${job.logo}" alt="${job.name} Logo" class="company-logo">
                <div class="company-info">
                    <h2>${job.name}</h2>
                    <div class="rating">${stars} ${job.rating}</div>
                </div>
            </div>
            <div class="job-details">
                <div class="detail-item">📍 지역: ${job.location}</div>
                <div class="detail-item">💼 직무: ${job.job}</div>
                <div class="detail-item">⏰ 고용형태: ${job.type}</div>
                <div class="detail-item">💰 급여: ${job.salary}</div>
                <div class="detail-item">🌏 비자: ${job.visa}</div>
                <div class="detail-item">⏳ 마감일: ${daysLeft}일 남음</div>
            </div>
            <div class="job-description">
                <strong>주요 업무</strong><br>
                ${job.description}<br><br>
                <strong>필요 스킬</strong><br>
                ${job.skills.map(skill => `#${skill}`).join(' ')}<br><br>
                <strong>복리후생</strong><br>
                ${job.benefits.join(' • ')}
            </div>
            <div class="card-actions">
                <button class="action-button like-button" onclick="likeCard('${job.id}', '${job.name}', '${job.job}')">
                    ❤️ 관심 등록
                </button>
                <button class="action-button apply-button" onclick="applyJob(${job.id})">
                    📝 지원하기
                </button>
            </div>
        `;
        container.appendChild(card);
    });
    updateProgress();
}

// 진행 상태 업데이트
function updateProgress() {
    const progress = ((current + 1) / filteredJobs.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// 관심 목록 렌더링
function renderFavorites() {
    favoriteList.innerHTML = '';
    let count = 0;
    likedCompanies.forEach(company => {
        const [id, name, position] = company.split('|');
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="favorite-item-info">
                <div class="favorite-company">${name}</div>
                <div class="favorite-position">${position}</div>
            </div>
            <button class="remove-btn" onclick="removeFavorite('${company}')">삭제</button>
        `;
        favoriteList.appendChild(li);
        count++;
    });
    favoriteCount.textContent = count;
}

// 관심 기업 등록
function likeCard(id, companyName, position) {
    const companyInfo = `${id}|${companyName}|${position}`;
    if (!likedCompanies.has(companyInfo)) {
        likedCompanies.add(companyInfo);
        renderFavorites();
        showToast(`${companyName} 기업이 관심 목록에 추가되었습니다! 🎉`);
    } else {
        showToast(`${companyName} 기업은 이미 관심 목록에 있습니다.`);
    }
    localStorage.setItem('favorites', JSON.stringify([...likedCompanies]));
}

// 관심 기업 제거
function removeFavorite(companyInfo) {
    const [, name] = companyInfo.split('|');
    likedCompanies.delete(companyInfo);
    renderFavorites();
    showToast(`${name} 기업이 관심 목록에서 제거되었습니다.`);
    localStorage.setItem('favorites', JSON.stringify([...likedCompanies]));
}

// 지원하기 기능
function applyJob(jobId) {
    const job = jobData.find(j => j.id === jobId);
    if (job) {
        showToast(`${job.name} 기업 지원이 완료되었습니다! 📨`);
        // TODO: 실제 지원 로직 구현
    }
}

// 다음 카드로 넘기기
function nextCard() {
    if (filteredJobs.length === 0) return;
    
    const cards = document.querySelectorAll('.card');
    cards[current].classList.remove('active');
    current = (current + 1) % filteredJobs.length;
    cards[current].classList.add('active');
    updateProgress();
}

// 토스트 메시지 표시
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1000;
        animation: fadeInOut 3s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, 20px); }
            15% { opacity: 1; transform: translate(-50%, 0); }
            85% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        toast.remove();
        style.remove();
    }, 3000);
}

// 키보드 이벤트 처리
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        nextCard();
    }
});

// 로그아웃 처리
function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// 페이지 로드 시 로그인 체크
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }
    resetFilters();
});

// 초기 렌더링
renderCards();
renderFavorites();
