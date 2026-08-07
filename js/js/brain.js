// js/brain.js
const Brain = {
    apiKey: process.env.OPENAI_API_KEY || '',
    async summarize(text) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: `خلاصه کن: ${text}` }]
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('خطا در ارتباط با هوش مصنوعی:', error);
            return 'خطا در پردازش درخواست';
        }
    },
    sendEmail(email, summary) {
        console.log(`ایمیل به ${email} ارسال شد: ${summary}`);
    }
};
