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

function renderCards() {
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

function renderFavorites() {
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

function nextCard() {
  const cards = document.querySelectorAll('.card');
  cards[current].classList.remove('active');
  current = (current + 1) % cards.length;
  cards[current].classList.add('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextCard();
});

renderCards();
renderFavorites();
