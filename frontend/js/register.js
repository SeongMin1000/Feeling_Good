document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 필수 입력 필드
    const username = document.getElementById('username').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nationality = document.getElementById('nationality').value;
    const visaType = document.getElementById('visaType').value;
    const currentLocation = document.getElementById('currentLocation').value;
    const preferredLanguage = document.getElementById('preferredLanguage').value;
    const desiredIndustry = document.getElementById('desiredIndustry').value;

    // 선택 입력 필드
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value;
    const visaExpiry = document.getElementById('visaExpiry').value;
    const workType = document.getElementById('workType').value;
    const koreanLevel = document.getElementById('koreanLevel').value;
    const workExperience = document.getElementById('workExperience').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // 필수 정보
                username,
                age,
                email,
                password,
                nationality,
                visaType,
                currentLocation,
                preferredLanguage,
                desiredIndustry,
                
                // 선택 정보
                gender,
                phone,
                visaExpiry,
                workType,
                koreanLevel,
                workExperience
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || '회원가입 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다.');
    }
}); 