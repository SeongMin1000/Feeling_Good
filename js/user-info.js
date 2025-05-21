// frontend-folder/js/user-info.js
document.getElementById("userInfoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const info = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    nationality: document.getElementById("nationality").value,
    visa: document.getElementById("visa").value,
  };

  localStorage.setItem("userInfo", JSON.stringify(info)); // ✅ 저장
  alert("정보가 저장되었습니다!");
  window.location.href = "jobs.html"; // ✅ 다음 페이지로 이동
});
