// ===== ماژول تعامل =====
const InteractModule = {
    sendText() {
        const input = document.getElementById('mainInteract');
        if (!input.value.trim()) {
            alert('لطفاً متن خود را بنویسید.');
            return;
        }
        
        Core.addInteraction('💬 ' + input.value, null, 'text', 'mainResponses');
        input.value = '';
        
        // پاسخ هوش مصنوعی
        setTimeout(async () => {
            const responses = document.getElementById('mainResponses');
            const div = document.createElement('div');
            div.className = 'response-item';
            div.innerHTML = `<span class="type-icon text" style="background:#55efc4;color:#2d1b4e">🤖</span> 
                <div class="ai-response">✅ در حال پردازش...</div>`;
            responses.appendChild(div);
            
            // استفاده از AI واقعی
            try {
                const reply = await AI.respond(input.value);
                div.querySelector('.ai-response').textContent = '🤖 ' + reply;
            } catch (e) {
                div.querySelector('.ai-response').textContent = '🤖 از پیام شما سپاسگزاریم!';
            }
        }, 1000);
    },

    sendAudio() {
        Core.addInteraction('🎤 پیام صوتی ارسال شد', null, 'audio', 'mainResponses');
        setTimeout(() => {
            const responses = document.getElementById('mainResponses');
            const div = document.createElement('div');
            div.className = 'response-item';
            div.innerHTML = `<span class="type-icon text" style="background:#55efc4;color:#2d1b4e">🤖</span> 
                <div class="ai-response">✅ پیام صوتی شما دریافت شد!</div>`;
            responses.appendChild(div);
        }, 800);
    },

    sendVideo() {
        Core.addInteraction('🎬 پیام ویدئویی ارسال شد', null, 'video', 'mainResponses');
        setTimeout(() => {
            const responses = document.getElementById('mainResponses');
            const div = document.createElement('div');
            div.className = 'response-item';
            div.innerHTML = `<span class="type-icon text" style="background:#55efc4;color:#2d1b4e">🤖</span> 
                <div class="ai-response">✅ پیام ویدئویی شما دریافت شد!</div>`;
            responses.appendChild(div);
        }, 800);
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
