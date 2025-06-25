const { Translate } = require('@google-cloud/translate').v2;

// Google 번역 API 설정
const translate = new Translate({
    key: process.env.GOOGLE_TRANSLATE_API_KEY
});

class TranslateController {
    static async translateText(req, res) {
        try {
            const { text, targetLanguage } = req.body;

            if (!text || !targetLanguage) {
                return res.status(400).json({
                    message: '번역할 텍스트와 대상 언어를 입력해주세요.'
                });
            }

            // 언어 코드 매핑 (언어명을 해당 언어로 표시)
            const languageMap = {
                '한국어': 'ko',
                'English': 'en',
                'Tiếng Việt': 'vi',
                '中文': 'zh',
                'O\'zbekcha': 'uz',
                'ไทย': 'th',
                'Filipino': 'tl'
            };

            const targetLangCode = languageMap[targetLanguage] || targetLanguage;

            // 번역 실행
            const [translation] = await translate.translate(text, targetLangCode);

            res.json({
                success: true,
                originalText: text,
                translatedText: translation,
                targetLanguage: targetLanguage
            });

        } catch (error) {
            console.error('번역 에러:', error);
            res.status(500).json({
                message: '번역 중 오류가 발생했습니다.',
                error: error.message
            });
        }
    }

    static async translateMultiple(req, res) {
        try {
            const { texts, targetLanguage } = req.body;

            if (!texts || !Array.isArray(texts) || !targetLanguage) {
                return res.status(400).json({
                    message: '번역할 텍스트 배열과 대상 언어를 입력해주세요.'
                });
            }

            // 언어 코드 매핑 (언어명을 해당 언어로 표시)
            const languageMap = {
                '한국어': 'ko',
                'English': 'en',
                'Tiếng Việt': 'vi',
                '中文': 'zh',
                'O\'zbekcha': 'uz',
                'ไทย': 'th',
                'Filipino': 'tl'
            };

            const targetLangCode = languageMap[targetLanguage] || targetLanguage;

            // 여러 텍스트 번역
            const [translations] = await translate.translate(texts, targetLangCode);

            const result = texts.map((text, index) => ({
                originalText: text,
                translatedText: translations[index]
            }));

            res.json({
                success: true,
                translations: result,
                targetLanguage: targetLanguage
            });

        } catch (error) {
            console.error('다중 번역 에러:', error);
            res.status(500).json({
                message: '번역 중 오류가 발생했습니다.',
                error: error.message
            });
        }
    }

    static async getSupportedLanguages(req, res) {
        try {
            const [languages] = await translate.getLanguages();

            // 지원하는 언어만 필터링 (언어명을 해당 언어로 표시)
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
            console.error('지원 언어 조회 에러:', error);
            res.status(500).json({
                message: '지원 언어 조회 중 오류가 발생했습니다.',
                error: error.message
            });
        }
    }
}

module.exports = TranslateController; 