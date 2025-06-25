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
  renderCards();
  renderFavorites();
}

const jobData = [
  {
    name: "KGlobal Inc.",
    location: "서울",
    job: "마케팅 인턴",
    visa: "지원 가능",
    rating: 4,
    logo: "https://via.placeholder.com/100x100.png?text=KGlobal"
  },
  {
    name: "Ocean Korea",
    location: "부산",
    job: "유통관리",
    visa: "지원 불가능",
    rating: 3,
    logo: "https://via.placeholder.com/100x100.png?text=Ocean"
  },
  {
    name: "Hansung Tech",
    location: "인천",
    job: "엔지니어",
    visa: "지원 가능",
    rating: 5,
    logo: "https://via.placeholder.com/100x100.png?text=Hansung"
  }
];

const container = document.getElementById('cardContainer');
const favoriteList = document.getElementById('favoriteList');
let likedCompanies = new Set(JSON.parse(localStorage.getItem('favorites')) || []);
let current = 0;

// ✅ 2. 카드 렌더링
function renderCards() {
  if (!container) return;

  container.innerHTML = '';
  jobData.forEach((job, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    if (index === 0) card.classList.add('active');
    card.innerHTML = `
      <div>
        <img src="${job.logo}" alt="${job.name} Logo">
        <h2>${job.name}</h2>
        <p>지역: ${job.location}</p>
        <p>직무: ${job.job}</p>
        <p>비자: ${job.visa}</p>
      </div>
      <div>
        <div class="rating">${'⭐'.repeat(job.rating)}${'☆'.repeat(5 - job.rating)}</div>
        <button class="like-button" onclick="likeCard('${job.name}')">❤️ 관심 등록</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ✅ 3. 관심 등록 렌더링
function renderFavorites() {
  if (!favoriteList) return;

  favoriteList.innerHTML = '';
  likedCompanies.forEach(company => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${company}</span>
      <button class="remove-btn" onclick="removeFavorite('${company}')">삭제</button>
    `;
    favoriteList.appendChild(li);
  });
  localStorage.setItem('favorites', JSON.stringify([...likedCompanies]));
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

// ✅ 4. 카드 넘기기
function nextCard() {
  const cards = document.querySelectorAll('.card');
  if (cards.length === 0) return;

  cards[current].classList.remove('active');
  current = (current + 1) % cards.length;
  cards[current].classList.add('active');
}

// ✅ 5. 화살표로 넘기기
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextCard();
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
