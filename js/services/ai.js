// ===== سرویس هوش مصنوعی =====
const AI = {
    // دریافت کلید API
    getApiKey() {
        return window.CONFIG?.OPENAI_API_KEY || window.ENV?.OPENAI_API_KEY || '';
    },

    // پاسخ به پیام کاربر
    async respond(message) {
        const apiKey = this.getApiKey();
        
        console.log('📤 ارسال به OpenAI...');
        console.log('🔑 کلید:', apiKey ? '✅ موجود' : '❌ موجود نیست');
        console.log('📝 پیام:', message);

        if (!apiKey) {
            console.warn('⚠️ کلید API یافت نشد');
            return '⚠️ کلید هوش مصنوعی تنظیم نشده است. لطفاً با مدیر سیستم تماس بگیرید.';
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { 
                            role: 'system', 
                            content: 'شما یک دستیار هوشمند برای پاسخ به سوالات کاربران درباره موسیقی، رادیو و تلویزیون هستید. پاسخ‌ها را محترمانه، مفید و مختصر بنویسید.' 
                        },
                        { 
                            role: 'user', 
                            content: message
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            console.log('📥 پاسخ از OpenAI:', data);

            if (data.error) {
                throw new Error(data.error.message);
            }
            return data.choices[0].message.content;

        } catch (error) {
            console.error('❌ خطا در پاسخگویی:', error);
            return '❌ خطا در ارتباط با هوش مصنوعی. لطفاً دوباره تلاش کنید.';
        }
    },

    // خلاصه‌سازی متن
    async summarize(text) {
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            console.warn('⚠️ کلید API یافت نشد');
            return this.fallbackSummary(text);
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { 
                            role: 'system', 
                            content: `شما یک دستیار هوشمند برای خلاصه‌سازی کتاب و مقاله هستید. 
                            لطفاً متن را با ۵ ویژگی زیر خلاصه کنید:
                            ۱. موضوع اصلی
                            ۲. ایده‌های کلیدی - حداقل ۳ مورد
                            ۳. نتیجه‌گیری
                            ۴. نکات کاربردی - حداقل ۲ مورد
                            ۵. ارزش مطالعه` 
                        },
                        { 
                            role: 'user', 
                            content: `لطفاً متن زیر را خلاصه کن:\n\n${text.substring(0, 15000)}` 
                        }
                    ],
                    max_tokens: 800,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }
            return data.choices[0].message.content;

        } catch (error) {
            console.error('❌ خطا در خلاصه‌سازی:', error);
            return this.fallbackSummary(text);
        }
    },

    fallbackSummary(text) {
        const sentences = text.split(/[.。!！?？\n]/).filter(s => s.trim().length > 10);
        return `📚 **خلاصه هوشمند (نسخه جایگزین)**

🔹 **موضوع اصلی:** 
${sentences[0] || 'متن برای تحلیل کافی نیست'}

🔹 **ایده‌های کلیدی:**
• ${sentences[1] || 'ایده اول'}
• ${sentences[2] || 'ایده دوم'}
• ${sentences[3] || 'ایده سوم'}

🔹 **نتیجه‌گیری:**
${sentences[sentences.length - 1] || 'نتیجه‌گیری'}`;
    },

    // ساخت پوستر
    async generatePoster(description) {
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            console.warn('⚠️ کلید API برای ساخت پوستر یافت نشد');
            return null;
        }

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'dall-e-2',
                    prompt: `یک پوستر حرفه‌ای و زیبا برای: ${description}`,
                    n: 1,
                    size: '512x512'
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }
            return data.data[0].url;

        } catch (error) {
            console.error('❌ خطا در ساخت پوستر:', error);
            return null;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI;
}
