const { Translate } = require('@google-cloud/translate').v2;

// Google Translate API 설정
const translate = new Translate({
    key: process.env.GOOGLE_TRANSLATE_API_KEY || 'YOUR_API_KEY_HERE'
});

// 언어 이름을 언어 코드로 매핑
const languageMap = {
    '한국어': 'ko',
    'English': 'en',
    'Tiếng Việt': 'vi',
    '中文': 'zh',
    'O\'zbekcha': 'uz',
    'ไทย': 'th',
    'Filipino': 'tl'
};

// 언어 이름을 코드로 변환하는 함수
function getLanguageCode(language) {
    return languageMap[language] || language;
}

// 단일 텍스트 번역
const translateText = async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({
                success: false,
                message: 'Text and target language are required'
            });
        }

        // 언어 이름을 코드로 변환
        const targetLangCode = getLanguageCode(targetLanguage);

        // Google Translate API 호출
        const [translation] = await translate.translate(text, targetLangCode);

        res.json({
            success: true,
            originalText: text,
            translatedText: translation,
            targetLanguage
        });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({
            success: false,
            message: 'Translation failed',
            error: error.message
        });
    }
};

// 다중 텍스트 번역
const translateMultiple = async (req, res) => {
    try {
        const { texts, targetLanguage } = req.body;

        if (!texts || !Array.isArray(texts) || !targetLanguage) {
            return res.status(400).json({
                success: false,
                message: 'Texts array and target language are required'
            });
        }

        // 빈 텍스트 필터링
        const validTexts = texts.filter(text => text && text.trim());

        if (validTexts.length === 0) {
            return res.json({
                success: true,
                translations: []
            });
        }

        // 언어 이름을 코드로 변환
        const targetLangCode = getLanguageCode(targetLanguage);

        // Google Translate API 호출 (배치 처리)
        const [translations] = await translate.translate(validTexts, targetLangCode);

        // 결과 매핑
        const results = texts.map((originalText, index) => {
            if (!originalText || !originalText.trim()) {
                return {
                    originalText,
                    translatedText: originalText,
                    targetLanguage
                };
            }

            const validIndex = validTexts.indexOf(originalText);
            const translatedText = Array.isArray(translations)
                ? translations[validIndex]
                : translations;

            return {
                originalText,
                translatedText,
                targetLanguage
            };
        });

        res.json({
            success: true,
            translations: results
        });
    } catch (error) {
        console.error('Multiple translation error:', error);
        res.status(500).json({
            success: false,
            message: 'Multiple translation failed',
            error: error.message
        });
    }
};

// 지원 언어 목록
const getSupportedLanguages = async (req, res) => {
    try {
        // 지원하는 언어 목록 (언어명을 해당 언어로 표시)
        const supportedLanguages = [
            { code: 'ko', name: '한국어' },
            { code: 'en', name: 'English' },
            { code: 'vi', name: 'Tiếng Việt' },
            { code: 'zh', name: '中文' },
            { code: 'uz', name: 'O\'zbekcha' },
            { code: 'th', name: 'ไทย' },
            { code: 'tl', name: 'Filipino' }
        ];

        res.json({
            success: true,
            languages: supportedLanguages
        });
    } catch (error) {
        console.error('Get languages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get supported languages',
            error: error.message
        });
    }
};

module.exports = {
    translateText,
    translateMultiple,
    getSupportedLanguages
}; 