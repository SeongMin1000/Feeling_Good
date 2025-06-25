document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 필수 입력 필드 수집 및 검증
    const requiredFields = {
        username: document.getElementById('username').value.trim(),
        age: parseInt(document.getElementById('age').value),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        nationality: document.getElementById('nationality').value,
        visaType: document.getElementById('visaType').value,
        currentLocation: document.getElementById('currentLocation').value,
        preferredLanguage: document.getElementById('preferredLanguage').value,
        desiredIndustry: document.getElementById('desiredIndustry').value
    };

    // 필수 필드 검증
    const emptyFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || value === '')
        .map(([key]) => key);

    if (emptyFields.length > 0) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    // 선택 입력 필드
    const optionalFields = {
        gender: document.getElementById('gender').value || null,
        phone: document.getElementById('phone').value.trim() || null,
        visaExpiry: document.getElementById('visaExpiry').value || null,
        workType: document.getElementById('workType').value || null,
        koreanLevel: document.getElementById('koreanLevel').value || null,
        workExperience: document.getElementById('workExperience').value.trim() || null
    };

    // 전체 데이터 병합
    const formData = {
        ...requiredFields,
        ...optionalFields
    };

    try {
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            window.location.href = 'login.html';
        } else {
            // 서버에서 보낸 구체적인 에러 메시지 표시
            if (data.missingFields) {
                alert(`다음 필수 항목을 입력해주세요: ${data.missingFields.join(', ')}`);
            } else {
                alert(data.message || '회원가입 중 오류가 발생했습니다.');
            }
        }
    } catch (error) {
        console.error('Register Error:', error);
        alert('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
}); 