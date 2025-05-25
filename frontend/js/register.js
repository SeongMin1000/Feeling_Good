document.getElementById("registerForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  // ✅ 계정 정보
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // ✅ 사용자 정보
  const info = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    nationality: document.getElementById("nationality").value,
    visa: document.getElementById("visa").value,
    location: document.getElementById("location").value,
    language: document.getElementById("language").value
  };

  try {
    // ✅ 1. 백엔드로 회원가입 요청
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    document.getElementById("registerResult").textContent = data.message;

    if (res.ok) {
      alert("회원가입 및 정보 입력 완료!");

      // ✅ 2. currentUser 설정 및 userInfo 저장
      localStorage.setItem("currentUser", username);
      localStorage.setItem(`userInfo_${username}`, JSON.stringify(info));

      // ✅ 3. 메인 페이지로 이동
      window.location.href = "jobs.html";
    }
  } catch (error) {
    console.error("회원가입 오류:", error);
    document.getElementById("registerResult").textContent = "서버 연결 실패";
  }
});
