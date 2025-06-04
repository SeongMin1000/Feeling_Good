document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      alert("로그인 성공! 메인 페이지로 이동합니다.");
      window.location.href = "jobs.html";
    } else {
      alert(data.message || "로그인 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("서버 오류가 발생했습니다.");
  }
});
