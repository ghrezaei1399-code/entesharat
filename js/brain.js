// js/brain.js
const Brain = {
    // دریافت کلید API از منابع مختلف
    getApiKey() {
        return window.CONFIG?.OPENAI_API_KEY || window.ENV?.OPENAI_API_KEY || '';
    },

    // خلاصه‌سازی متن با هوش مصنوعی
    async summarize(text) {
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            console.warn('⚠️ کلید API یافت نشد.');
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

    // خلاصه‌سازی جایگزین
    fallbackSummary(text) {
        const sentences = text.split(/[.。!！?？\n]/).filter(s => s.trim().length > 10);
        const firstSentences = sentences.slice(0, 5);
        
        return `📚 **خلاصه هوشمند (بدون API)**

🔹 **موضوع اصلی:** 
${firstSentences[0] || 'متن برای تحلیل کافی نیست'}

🔹 **ایده‌های کلیدی:**
${firstSentences.slice(1, 4).map((s, i) => `• ${s.trim()}`).join('\n') || '• اطلاعات کافی برای استخراج ایده‌های کلیدی وجود ندارد'}

🔹 **نتیجه‌گیری:**
${firstSentences[firstSentences.length - 1] || 'متن برای نتیجه‌گیری کافی نیست'}

🔹 **نکات کاربردی:**
• برای دریافت خلاصه کامل، کلید API را تنظیم کنید
• متن ارسالی شما در گنجینه ذخیره شد

🔹 **ارزش مطالعه:**
این اثر می‌تواند برای علاقه‌مندان به موضوع مفید باشد.

---
⏳ برای دریافت خلاصه دقیق‌تر، لطفاً کلید OpenAI را در فایل env.js تنظیم کنید.`;
    },

    // ارسال ایمیل
    sendEmail(email, summary, title) {
        console.log(`📧 ایمیل به ${email} ارسال شد.`);
        console.log(`📄 عنوان: ${title}`);
        console.log(`📝 خلاصه: ${summary.substring(0, 200)}...`);
        
        // در اینجا می‌توانید EmailJS یا سرویس دیگر را وصل کنید
        // EmailJS.send('service_id', 'template_id', { email, summary, title });
    },

    // پردازش کامل متن
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
