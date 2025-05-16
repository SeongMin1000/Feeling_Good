document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    document.getElementById("loginResult").textContent = data.message;

    if (res.ok) {
      // 향후 token 저장 가능: localStorage.setItem("token", data.token);
      alert("로그인 성공!");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    document.getElementById("loginResult").textContent = "서버 연결 실패";
  }
});
