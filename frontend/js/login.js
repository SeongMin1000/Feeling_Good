document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    document.getElementById("loginResult").textContent = data.message;

    if (res.ok) {
      alert("로그인 성공!");
      localStorage.setItem("currentUser", username);

      // ✅ 사용자 정보 여부에 따라 분기
      const personalInfo = localStorage.getItem(`userInfo_${username}`);
      const companyInfo = localStorage.getItem(`companyInfo_${username}`);

      if (companyInfo) {
        // 기업 회원 → 기업 전용 메인 페이지로
        window.location.href = "company-dashboard.html";
      } else if (personalInfo) {
        // 일반 사용자 → 구직자 메인 페이지로
        window.location.href = "jobs.html";
      } else {
        // 첫 로그인 사용자 → 사용자 정보 입력 (기존 방식 유지)
        window.location.href = "register.html";
      }
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    document.getElementById("loginResult").textContent = "서버 연결 실패";
  }
});
