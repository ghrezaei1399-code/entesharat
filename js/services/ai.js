const AI = {
    endpoint: 'https://entesharat-ai.ghrezaei1399.workers.dev',

    conversation: [],

    async respond(message, source = 'text') {
        const cleanMessage = String(message || '').trim();

        if (!cleanMessage) {
            throw new Error('پیام خالی است.');
        }

        this.conversation.push({
            role: 'user',
            content: cleanMessage
        });

        if (this.conversation.length > 12) {
            this.conversation = this.conversation.slice(-12);
        }

        const systemPrompt = `
شما دستیار هوشمند رادیو تلویزیون هوشمند انتشارات کیمیا هستید.

به زبان فارسی پاسخ بده.
پاسخ کاربردی، دقیق و کوتاه باشد.
در موضوعات کتاب، نشر، چاپ، مطالعه، رادیو و تلویزیون کمک کن.
اگر کاربر درخواست انجام کاری دارد، راه انجام واقعی آن را ارائه کن.
اطلاعات و لینک ساختگی ایجاد نکن.

نوع ورودی کاربر: ${source}
`;

        const response = await fetch(this.endpoint, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    ...this.conversation
                ]
            })
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                'پاسخ نامعتبر از سرور هوش مصنوعی دریافت شد.'
            );
        }

        if (!response.ok) {
            throw new Error(
                data?.error ||
                'خطا در ارتباط با هوش مصنوعی'
            );
        }

        const answer =
            data?.choices?.[0]?.message?.content?.trim();

        if (!answer) {
            throw new Error(
                'پاسخ خالی از هوش مصنوعی دریافت شد.'
            );
        }

        this.conversation.push({
            role: 'assistant',
            content: answer
        });

        return answer;
    },

    clearConversation() {
        this.conversation = [];
    }
};

window.AI = AI;
