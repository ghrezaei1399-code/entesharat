// ============================================================
// AI SERVICE - ENTESHARAT SMART ASSISTANT
// ============================================================

const AI = {

    getApiKey() {
        return (
            window.ENV?.OPENAI_API_KEY ||
            window.CONFIG?.OPENAI_API_KEY ||
            ''
        ).trim();
    },

    conversation: [],

    async respond(message, source = 'text') {

        const apiKey = this.getApiKey();

        if (!apiKey) {
            throw new Error('کلید هوش مصنوعی پیدا نشد.');
        }

        const cleanMessage = String(message || '').trim();

        if (!cleanMessage) {
            throw new Error('پیام خالی است.');
        }

        this.conversation.push({
            role: 'user',
            content: cleanMessage
        });

        if (this.conversation.length > 12) {
            this.conversation =
                this.conversation.slice(-12);
        }

        const systemPrompt = `
شما دستیار هوشمند «رادیو تلویزیون هوشمند انتشارات کیمیا» هستید.

وظایف شما:
- پاسخ به پرسش‌های کاربران درباره کتاب، نشر، چاپ، مطالعه، رادیو و تلویزیون.
- کمک به انتخاب و معرفی کتاب.
- پاسخ فارسی روان و محترمانه.
- اگر کاربر درخواست انجام کاری دارد، دقیقاً بگویید چه اقدامی می‌توانید انجام دهید.
- پاسخ‌ها کاربردی و مستقیم باشند.
- اگر اطلاعات کافی ندارید، صادقانه بگویید.
- منبع یا لینک ساختگی تولید نکنید.
- نوع پیام کاربر: ${source}
`;

        try {

            const response = await fetch(
                'https://api.openai.com/v1/chat/completions',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },

                    body: JSON.stringify({
                        model: 'gpt-4o-mini',

                        messages: [
                            {
                                role: 'system',
                                content: systemPrompt
                            },
                            ...this.conversation
                        ],

                        temperature: 0.5,
                        max_tokens: 700
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(
                    data?.error?.message ||
                    `خطای API: ${response.status}`
                );
            }

            const answer =
                data?.choices?.[0]?.message?.content?.trim();

            if (!answer) {
                throw new Error('پاسخ خالی از هوش مصنوعی دریافت شد.');
            }

            this.conversation.push({
                role: 'assistant',
                content: answer
            });

            return answer;

        } catch (error) {

            console.error('AI Error:', error);

            throw error;
        }
    },

    clearConversation() {
        this.conversation = [];
    }
};

window.AI = AI;
