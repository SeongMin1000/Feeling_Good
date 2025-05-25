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
