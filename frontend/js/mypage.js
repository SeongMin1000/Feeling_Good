// 페이지 로드 시 사용자 정보 가져오기
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserProfile();
});

// 사용자 프로필 로드
async function loadUserProfile() {
  // 로그인 체크
  const token = localStorage.getItem('token');
  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
    return;
  }

  try {
    // 사용자 정보 가져오기
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = 'login.html';
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    displayUserInfo(result.user);
  } catch (error) {
    console.error('Profile Load Error:', error);
    alert('사용자 정보를 불러오는데 실패했습니다.');
  }
}

// 사용자 정보 화면에 표시
function displayUserInfo(userData) {
  // 기본 정보
  setElementText('username', userData.username);
  setElementText('age', userData.age);
  setElementText('gender', userData.gender);
  setElementText('email', userData.email);
  setElementText('phone', userData.phone);

  // 체류 정보
  setElementText('nationality', userData.nationality);
  setElementText('visaType', userData.visa_type);
  setElementText('visaExpiry', userData.visa_expiry_date ?
    new Date(userData.visa_expiry_date).toLocaleDateString('ko-KR') : null);

  // 거주/근무 조건
  setElementText('currentLocation', userData.current_location);
  setElementText('workType', userData.work_type);

  // 언어 정보
  setElementText('preferredLanguage', userData.preferred_language);
  setElementText('koreanLevel', userData.korean_level);

  // 직무/경력 정보
  setElementText('desiredIndustry', userData.desired_industry);
  setElementText('workExperience', userData.work_experience);
}

// 요소에 텍스트 설정 (null 체크 포함)
function setElementText(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value || '-';
  }
}

// 🔙 뒤로 가기 버튼 기능
function goBack() {
  window.history.back();
}

// 로그아웃 기능
function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
}
