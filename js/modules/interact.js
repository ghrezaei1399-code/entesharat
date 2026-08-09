// ===== ماژول تعامل =====
const InteractModule = {
    async sendText() {
        const input = document.getElementById('mainInteract');
        if (!input.value.trim()) {
            Core.showNotification('لطفاً متن خود را بنویسید.', 'error');
            return;
        }
        
        const message = input.value;
        Core.addInteraction('💬 ' + message, null, 'text', 'mainResponses');
        input.value = '';
        
        try {
            const reply = await AI.respond(message);
            const responses = document.getElementById('mainResponses');
            const div = document.createElement('div');
            div.className = 'response-item';
            div.innerHTML = `<span class="type-icon text" style="background:#55efc4;color:#2d1b4e">🤖</span> 
                <div class="ai-response">${reply}</div>`;
            responses.appendChild(div);
            responses.scrollTop = responses.scrollHeight;
        } catch (error) {
            console.error('خطا در AI:', error);
            Core.showNotification('خطا در ارتباط با هوش مصنوعی', 'error');
        }
    },

    sendAudio() {
        Core.addInteraction('🎤 پیام صوتی ارسال شد', null, 'audio', 'mainResponses');
        setTimeout(async () => {
            try {
                const reply = await AI.respond('پیام صوتی');
                const responses = document.getElementById('mainResponses');
                const div = document.createElement('div');
                div.className = 'response-item';
                div.innerHTML = `<span class="type-icon text" style="background:#55efc4;color:#2d1b4e">🤖</span> 
                    <div class="ai-response">${reply}</div>`;
                responses.appendChild(div);
                responses.scrollTop = responses.scrollHeight;
            } catch (error) {
                console.error('خطا در AI:', error);
            }
        }, 500);
    },

    sendVideo() {
        Core.addInteraction('🎬 پیام ویدئویی ارسال شد', null, 'video', 'mainResponses');
        setTimeout(async () => {
            try {
                const reply = await AI.respond('پیام ویدئویی');
                const responses = document.getElementById('mainResponses');
                const div = document.createElement('div');
                div.className = 'response-item';
                div.innerHTML = `<span class="type-icon text" style="background:#55efc4;color:#2d1b4e">🤖</span> 
                    <div class="ai-response">${reply}</div>`;
                responses.appendChild(div);
                responses.scrollTop = responses.scrollHeight;
            } catch (error) {
                console.error('خطا در AI:', error);
            }
        }, 500);
    },

    init() {
        document.querySelector('#interact .btn-text')?.addEventListener('click', () => this.sendText());
        document.querySelector('#interact .btn-audio')?.addEventListener('click', () => this.sendAudio());
        document.querySelector('#interact .btn-video')?.addEventListener('click', () => this.sendVideo());
        
        console.log('✅ InteractModule فعال شد');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractModule;
}
