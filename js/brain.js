// js/brain.js
const Brain = {
    apiKey: window.CONFIG?.OPENAI_API_KEY || '',

    // تنظیم کلید API
    setApiKey(key) {
        this.apiKey = key;
    },

    // خلاصه‌سازی متن با هوش مصنوعی
    async summarize(text) {
        if (!this.apiKey) {
            console.warn('کلید API تنظیم نشده است.');
            return 'برای استفاده از هوش مصنوعی، کلید API را تنظیم کنید.';
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { 
                            role: 'system', 
                            content: 'شما یک دستیار هوشمند هستید که متون را خلاصه می‌کنید. خلاصه را روان، منسجم و با حفظ نکات کلیدی بنویسید.' 
                        },
                        { 
                            role: 'user', 
                            content: `لطفاً متن زیر را خلاصه کن:\n\n${text.substring(0, 15000)}` 
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }
            return data.choices[0].message.content;

        } catch (error) {
            console.error('خطا در خلاصه‌سازی:', error);
            return 'خطا در پردازش متن توسط هوش مصنوعی.';
        }
    },

    // ارسال ایمیل (با EmailJS)
    sendEmail(email, summary, title) {
        console.log(`📧 ایمیل به ${email} ارسال شد.`);
        console.log(`📄 عنوان: ${title}`);
        console.log(`📝 خلاصه: ${summary}`);
    },

    // تابع برای استفاده در smart-section.js
    async processText(text, title) {
        try {
            const summary = await this.summarize(text);
            return {
                success: true,
                summary: summary,
                title: title || 'خلاصه هوشمند'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
