document.getElementById("registerCompanyForm").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    // ✅ 기업 계정 정보
    const companyId = document.getElementById("companyId").value;
    const companyPassword = document.getElementById("companyPassword").value;
  
    // ✅ 기업 정보
    const companyInfo = {
      name: document.getElementById("companyName").value,
      address: document.getElementById("companyAddress").value,
      industry: document.getElementById("industry").value,
      website: document.getElementById("companyWebsite").value
    };
  
    try {
      // ✅ 1. 백엔드로 기업 회원가입 요청
      const res = await fetch("http://localhost:5000/auth/register-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, companyPassword })
      });
  
      const data = await res.json();
      document.getElementById("companyRegisterResult").textContent = data.message;
  
      if (res.ok) {
        alert("기업 회원가입 완료!");
  
        // ✅ 2. currentCompany 설정 및 정보 저장
        localStorage.setItem("currentCompany", companyId);
        localStorage.setItem(`companyInfo_${companyId}`, JSON.stringify(companyInfo));
  
        // ✅ 3. 메인 페이지로 이동
        window.location.href = "company-dashboard.html";
      }
    } catch (error) {
      console.error("기업 회원가입 오류:", error);
      document.getElementById("companyRegisterResult").textContent = "서버 연결 실패";
    }
  });
  