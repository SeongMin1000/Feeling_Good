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
      localStorage.setItem("token", data.token); // ✅ 토큰 저장
      alert("로그인 성공!");
      window.location.href = "user-info.html";        // ✅ 페이지 이동
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    document.getElementById("loginResult").textContent = "서버 연결 실패";
  }
});
