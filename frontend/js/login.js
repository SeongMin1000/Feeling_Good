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
      // userType이 company면 기업 페이지, 아니면 구직자 메인
      if (data.userType === "company") {
        window.location.href = "company-dashboard.html";
      } else {
        localStorage.setItem("token", data.token);
        window.location.href = "jobs.html";
      }
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    document.getElementById("loginResult").textContent = "서버 연결 실패";
  }
});
