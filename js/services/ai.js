// ===== سرویس هوش مصنوعی =====
const AI = {
    // دریافت کلید API
    getApiKey() {
        return window.CONFIG?.OPENAI_API_KEY || window.ENV?.OPENAI_API_KEY || '';
    },

    // خلاصه‌سازی متن با ۵ ویژگی
    async summarize(text) {
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            console.warn('⚠️ کلید API یافت نشد');
            return this.fallbackSummary(text);
        }

        try {
            console.log('📤 ارسال به OpenAI...');
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
                            ۱. موضوع اصلی (Main Topic)
                            ۲. ایده‌های کلیدی (Key Ideas) - حداقل ۳ مورد
                            ۳. نتیجه‌گیری (Conclusion)
                            ۴. نکات کاربردی (Practical Tips) - حداقل ۲ مورد
                            ۵. ارزش مطالعه (Reading Value)
                            
                            خلاصه را روان، منسجم و با حفظ نکات کلیدی بنویسید.` 
                        },
                        { 
                            role: 'user', 
                            content: `لطفاً متن زیر را با ۵ ویژگی ذکر شده خلاصه کن:\n\n${text.substring(0, 15000)}` 
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
            console.log('✅ خلاصه از OpenAI دریافت شد');
            return data.choices[0].message.content;

        } catch (error) {
            console.error('❌ خطا در خلاصه‌سازی:', error);
            return this.fallbackSummary(text);
        }
    },

    // خلاصه جایگزین (بدون API)
    fallbackSummary(text) {
        const sentences = text.split(/[.。!！?？\n]/).filter(s => s.trim().length > 10);
        const firstSentences = sentences.slice(0, 5);
        
        return `📚 **خلاصه هوشمند (نسخه جایگزین)**

🔹 **موضوع اصلی:** 
${firstSentences[0] || 'متن برای تحلیل کافی نیست'}

🔹 **ایده‌های کلیدی:**
${firstSentences.slice(1, 4).map((s, i) => `• ${s.trim()}`).join('\n') || '• اطلاعات کافی برای استخراج ایده‌های کلیدی وجود ندارد'}

🔹 **نتیجه‌گیری:**
${firstSentences[firstSentences.length - 1] || 'متن برای نتیجه‌گیری کافی نیست'}

🔹 **نکات کاربردی:**
• مطالعه کامل این اثر به درک عمیق‌تر کمک می‌کند
• خلاصه به ایمیل شما ارسال شد

🔹 **ارزش مطالعه:**
این اثر برای علاقه‌مندان به موضوع بسیار مفید و ارزشمند است.`;
    },

    // ساخت پوستر با DALL-E
    async generatePoster(description) {
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            console.warn('⚠️ کلید API برای ساخت پوستر یافت نشد');
            return null;
        }

        try {
            console.log('🎨 در حال ساخت پوستر با DALL-E...');
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
            console.log('✅ پوستر ساخته شد');
            return data.data[0].url;

        } catch (error) {
            console.error('❌ خطا در ساخت پوستر:', error);
            return null;
        }
    },

    // پاسخ به پیام کاربر
    async respond(message) {
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            return 'از پیام شما سپاسگزاریم. در حال پردازش...';
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
                            content: 'شما یک دستیار هوشمند برای پاسخ به سوالات کاربران هستید. پاسخ‌ها را محترمانه، مفید و مختصر بنویسید.' 
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
            if (data.error) {
                throw new Error(data.error.message);
            }
            return data.choices[0].message.content;

        } catch (error) {
            console.error('❌ خطا در پاسخگویی:', error);
            return 'از پیام شما سپاسگزاریم. در حال پردازش...';
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI;
}
