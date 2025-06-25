// 회원 유형에 따른 필드 표시/숨김 처리
document.getElementById('userType').addEventListener('change', function () {
    const userType = this.value;
    const jobSeekerFields = document.querySelectorAll('.jobseeker-only');
    const employerFields = document.querySelectorAll('.employer-only');

    // 모든 조건부 필드 숨김
    jobSeekerFields.forEach(field => field.style.display = 'none');
    employerFields.forEach(field => field.style.display = 'none');

    // 선택된 유형에 따라 필드 표시
    if (userType === '구직자') {
        jobSeekerFields.forEach(field => field.style.display = 'block');
    } else if (userType === '고용주') {
        employerFields.forEach(field => field.style.display = 'block');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userType = document.getElementById('userType').value;

    if (!userType) {
        alert('회원 유형을 선택해주세요.');
        return;
    }

    // 기본 필수 입력 필드
    const basicRequiredFields = {
        userType: userType,
        username: document.getElementById('username').value.trim(),
        age: parseInt(document.getElementById('age').value),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        preferredLanguage: document.getElementById('preferredLanguage').value
    };

    // 회원 유형에 따른 추가 필수 필드
    let additionalRequiredFields = {};

    if (userType === '구직자') {
        additionalRequiredFields = {
            nationality: document.getElementById('nationality').value,
            visaType: document.getElementById('visaType').value,
            currentLocation: document.getElementById('currentLocation').value,
            desiredIndustry: document.getElementById('desiredIndustry').value
        };
    } else if (userType === '고용주') {
        additionalRequiredFields = {
            currentLocation: document.getElementById('currentLocation').value,
            companyName: document.getElementById('companyName').value.trim(),
            industry: document.getElementById('industry').value
        };
    }

    const requiredFields = { ...basicRequiredFields, ...additionalRequiredFields };

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
        phone: document.getElementById('phone').value.trim() || null
    };

    // 회원 유형에 따른 선택 필드 추가
    if (userType === '구직자') {
        optionalFields.visaExpiry = document.getElementById('visaExpiry').value || null;
        optionalFields.workType = document.getElementById('workType').value || null;
        optionalFields.koreanLevel = document.getElementById('koreanLevel').value || null;
        optionalFields.workExperience = document.getElementById('workExperience').value.trim() || null;
    } else if (userType === '고용주') {
        optionalFields.businessNumber = document.getElementById('businessNumber').value.trim() || null;
        optionalFields.companySize = document.getElementById('companySize').value || null;
    }

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