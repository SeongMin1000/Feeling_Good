class Translator {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || '한국어';
        this.apiBaseUrl = '/api/translate';
    }

    // 언어 설정
    setLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
        this.updateUILanguage();
    }

    // 단일 텍스트 번역
    async translateText(text, targetLanguage = this.currentLanguage) {
        try {
            // 한국어로 번역하는 경우 또는 텍스트가 비어있는 경우 원본 반환
            if (targetLanguage === '한국어' || !text || !text.trim()) {
                return text;
            }

            const response = await fetch(`${this.apiBaseUrl}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    targetLanguage: targetLanguage
                })
            });

            const data = await response.json();

            if (data.success) {
                return data.translatedText;
            } else {
                throw new Error(data.message || '번역 실패');
            }
        } catch (error) {
            console.error('번역 에러:', error);
            return text; // 번역 실패시 원본 텍스트 반환
        }
    }

    // 여러 텍스트 번역
    async translateMultiple(texts, targetLanguage = this.currentLanguage) {
        try {
            // 한국어로 번역하는 경우 원본 반환
            if (targetLanguage === '한국어') {
                return texts;
            }

            const response = await fetch(`${this.apiBaseUrl}/translate-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    texts: texts,
                    targetLanguage: targetLanguage
                })
            });

            const data = await response.json();

            if (data.success) {
                return data.translations.map(item => item.translatedText);
            } else {
                throw new Error(data.message || '번역 실패');
            }
        } catch (error) {
            console.error('다중 번역 에러:', error);
            return texts; // 번역 실패시 원본 텍스트 배열 반환
        }
    }

    // UI 언어 업데이트
    async updateUILanguage() {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');

        // 텍스트 내용 번역
        for (let element of elementsToTranslate) {
            const originalText = element.getAttribute('data-translate');
            if (originalText) {
                const translatedText = await this.translateText(originalText);
                if (element.tagName === 'OPTION') {
                    element.textContent = translatedText;
                } else {
                    element.textContent = translatedText;
                }
            }
        }

        // placeholder 번역
        for (let element of placeholderElements) {
            const originalPlaceholder = element.getAttribute('data-translate-placeholder');
            if (originalPlaceholder) {
                const translatedPlaceholder = await this.translateText(originalPlaceholder);
                element.placeholder = translatedPlaceholder;
            }
        }
    }

    // 언어 선택 드롭다운 생성
    createLanguageDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'language-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 8px 0;
            min-width: 150px;
            z-index: 10002;
            display: none;
            margin-top: 2px;
        `;

        // 언어 옵션들
        const languages = [
            { code: 'ko', name: '한국어' },
            { code: 'en', name: 'English' },
            { code: 'vi', name: 'Tiếng Việt' },
            { code: 'zh', name: '中文' },
            { code: 'uz', name: 'O\'zbekcha' },
            { code: 'th', name: 'ไทย' },
            { code: 'tl', name: 'Filipino' }
        ];

        languages.forEach(lang => {
            const option = document.createElement('div');
            option.className = 'language-option';
            option.textContent = lang.name;
            option.style.cssText = `
                padding: 10px 16px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
                ${lang.name === this.currentLanguage ? 'background-color: #f0f8ff; font-weight: bold;' : ''}
            `;

            option.addEventListener('mouseenter', () => {
                option.style.backgroundColor = '#f5f5f5';
            });

            option.addEventListener('mouseleave', () => {
                option.style.backgroundColor = lang.name === this.currentLanguage ? '#f0f8ff' : 'transparent';
            });

            option.addEventListener('click', () => {
                this.setLanguage(lang.name);
                this.hideLanguageDropdown();
            });

            dropdown.appendChild(option);
        });

        return dropdown;
    }

    // 언어 드롭다운 표시/숨김
    showLanguageDropdown() {
        const dropdown = document.querySelector('.language-dropdown');
        if (dropdown) {
            dropdown.style.display = 'block';
        }
    }

    hideLanguageDropdown() {
        const dropdown = document.querySelector('.language-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    // 언어 선택 버튼에 드롭다운 연결
    attachLanguageSelector(buttonElement) {
        // 상대 위치 설정
        buttonElement.style.position = 'relative';
        buttonElement.style.display = 'inline-block';

        // 드롭다운 생성 및 추가
        const dropdown = this.createLanguageDropdown();
        buttonElement.appendChild(dropdown);

        // 클릭 이벤트 추가
        buttonElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showLanguageDropdown();
        });

        // 문서 클릭 시 드롭다운 숨김
        document.addEventListener('click', (e) => {
            if (!buttonElement.contains(e.target)) {
                this.hideLanguageDropdown();
            }
        });
    }

    // 번역 버튼 생성
    createTranslateButton() {
        const button = document.createElement('button');
        button.textContent = '번역';
        button.className = 'translate-btn';
        button.addEventListener('click', () => {
            this.updateUILanguage();
        });
        return button;
    }

    // 실시간 번역 입력 필드 생성
    createTranslateInput(placeholder = '번역할 텍스트를 입력하세요') {
        const container = document.createElement('div');
        container.className = 'translate-input-container';

        const input = document.createElement('textarea');
        input.placeholder = placeholder;
        input.className = 'translate-input';

        const translateBtn = document.createElement('button');
        translateBtn.textContent = '번역하기';
        translateBtn.className = 'translate-btn';

        const result = document.createElement('div');
        result.className = 'translate-result';

        translateBtn.addEventListener('click', async () => {
            const text = input.value.trim();
            if (text) {
                const translated = await this.translateText(text);
                result.textContent = translated;
            }
        });

        container.appendChild(input);
        container.appendChild(translateBtn);
        container.appendChild(result);

        return container;
    }
}

// 전역 번역기 인스턴스 생성
window.translator = new Translator();

// 페이지 로드 시 언어 설정 적용
document.addEventListener('DOMContentLoaded', () => {
    // 언어 선택 버튼 연결
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        window.translator.attachLanguageSelector(languageSelector);
    }

    // UI 언어 업데이트
    window.translator.updateUILanguage();
});

// 동적 콘텐츠 번역을 위한 전역 함수
function translateDynamicContent() {
    if (window.translator) {
        window.translator.updateUILanguage();
    }
}