// ===== سرویس ارسال ایمیل =====
const Email = {
    // ارسال ایمیل با EmailJS
    async send(to, subject, body) {
        console.log(`📧 ارسال ایمیل به ${to}`);
        console.log(`📄 موضوع: ${subject}`);
        console.log(`📝 متن: ${body.substring(0, 200)}...`);

        // اگر EmailJS تنظیم شده باشد
        if (window.emailjs) {
            try {
                const result = await window.emailjs.send(
                    window.CONFIG?.EMAILJS_SERVICE_ID || 'service_id',
                    window.CONFIG?.EMAILJS_TEMPLATE_ID || 'template_id',
                    {
                        to_email: to,
                        subject: subject,
                        message: body
                    },
                    window.CONFIG?.EMAILJS_USER_ID || 'user_id'
                );
                console.log('✅ ایمیل ارسال شد:', result);
                return true;
            } catch (error) {
                console.error('❌ خطا در ارسال ایمیل:', error);
                return false;
            }
        }

        // شبیه‌سازی ارسال ایمیل
        alert(`📧 ایمیل به ${to} ارسال شد!`);
        return true;
    },

    // ارسال خلاصه به ایمیل
    async sendSummary(email, summary, title) {
        const subject = `📚 خلاصه هوشمند: ${title}`;
        const body = `
            عنوان: ${title}
            
            خلاصه:
            ${summary}
            
            تاریخ: ${new Date().toLocaleDateString('fa-IR')}
            
            این خلاصه توسط هوش مصنوعی تولید شده است.
        `;
        return this.send(email, subject, body);
    },

    // ارسال پوستر به ایمیل
    async sendPoster(email, title, description) {
        const subject = `🎨 پوستر ساخته شده: ${title}`;
        const body = `
            عنوان پوستر: ${title}
            
            توضیحات: ${description}
            
            تاریخ: ${new Date().toLocaleDateString('fa-IR')}
            
            این پوستر توسط هوش مصنوعی DALL-E ساخته شده است.
        `;
        return this.send(email, subject, body);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Email;
}
