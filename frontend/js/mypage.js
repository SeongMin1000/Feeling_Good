// 📌 마이페이지: localStorage에서 사용자 정보를 불러와 출력
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("currentUser");
  const info = JSON.parse(localStorage.getItem(`userInfo_${username}`));

  const container = document.getElementById("userInfoDisplay");

  if (!info) {
    container.innerHTML = "<p>❗ 사용자 정보가 없습니다. 다시 로그인해주세요.</p>";
    return;
  }

  container.innerHTML = `
    <p><strong>이름:</strong> ${info.name}</p>
    <p><strong>나이:</strong> ${info.age}</p>
    <p><strong>성별:</strong> ${info.gender}</p>
    <p><strong>국적:</strong> ${info.nationality}</p>
    <p><strong>비자 종류:</strong> ${info.visa}</p>
    <p><strong>지역:</strong> ${info.location}</p>
    <p><strong>언어:</strong> ${info.language}</p>
  `;
});

// 🔙 뒤로 가기 버튼 기능
function goBack() {
  window.history.back();
}

// 페이지 로드 시 사용자 정보 가져오기
document.addEventListener('DOMContentLoaded', async () => {
    // 로그인 체크
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // 사용자 정보 가져오기
        const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }

        const userData = await response.json();
        displayUserInfo(userData);
    } catch (error) {
        console.error('Error:', error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
    }
});

// 사용자 정보 화면에 표시
function displayUserInfo(userData) {
    // 기본 정보
    document.getElementById('username').textContent = userData.username || '-';
    document.getElementById('age').textContent = userData.age || '-';
    document.getElementById('gender').textContent = userData.gender || '-';
    document.getElementById('email').textContent = userData.email || '-';
    document.getElementById('phone').textContent = userData.phone || '-';

    // 체류 정보
    document.getElementById('nationality').textContent = userData.nationality || '-';
    document.getElementById('visaType').textContent = userData.visa_type || '-';
    document.getElementById('visaExpiry').textContent = userData.visa_expiry_date ? new Date(userData.visa_expiry_date).toLocaleDateString() : '-';

    // 거주/근무 조건
    document.getElementById('currentLocation').textContent = userData.current_location || '-';
    document.getElementById('workType').textContent = userData.work_type || '-';

    // 언어 정보
    document.getElementById('preferredLanguage').textContent = userData.preferred_language || '-';
    document.getElementById('koreanLevel').textContent = userData.korean_level || '-';

    // 직무/경력 정보
    document.getElementById('desiredIndustry').textContent = userData.desired_industry || '-';
    document.getElementById('workExperience').textContent = userData.work_experience || '-';
}
