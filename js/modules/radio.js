// ===== ماژول رادیو =====
const RadioModule = {
    files: ['images/Ayrilik_aleftab.ir.mp3', 'images/Careless Whisper2.mp3'],
    titles: ['آهنگ اول - Ayrilik', 'آهنگ دوم - Careless Whisper'],
    currentIndex: 0,

    renderPlaylist() {
        const container = document.getElementById('radioPlaylist');
        if (!container) return;
        
        container.innerHTML = '';
        this.files.forEach((file, i) => {
            const div = document.createElement('div');
            div.className = 'playlist-item' + (i === this.currentIndex ? ' active' : '');
            div.innerHTML = `<span>${this.titles[i] || 'فایل ' + (i+1)}</span><span>${new Date().toLocaleDateString('fa-IR')}</span>`;
            div.onclick = () => this.load(i);
            container.appendChild(div);
        });
    },

    load(index) {
        const player = document.getElementById('radioPlayer');
        if (this.files[index]) {
            player.src = this.files[index];
            player.load();
            player.play();
            this.currentIndex = index;
            this.renderPlaylist();
        }
    },

    next() {
        this.load((this.currentIndex + 1) % this.files.length);
    },

    prev() {
        this.load((this.currentIndex - 1 + this.files.length) % this.files.length);
    },

    addFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.files.push(URL.createObjectURL(file));
                this.titles.push(file.name);
                this.renderPlaylist();
                Core.showNotification('✅ فایل با موفقیت اضافه شد!', 'success');
            }
        };
        input.click();
    },

    async sendMessage(type) {
        const input = document.getElementById('comment_radio');
        let message = input.value.trim();
        if (type === 'audio') message = '🎤 پیام صوتی';
        else if (type === 'video') message = '🎬 پیام ویدئویی';
        else if (!message) {
            Core.showNotification('لطفاً متن خود را بنویسید.', 'error');
            return;
        }
        
        // نمایش پیام کاربر
        Core.addInteraction(message, 'رادیو', type, 'responses_radio');
        input.value = '';
        
        // دریافت پاسخ واقعی از AI
        try {
            const reply = await AI.respond(message);
            const responses = document.getElementById('responses_radio');
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

    init() {
        this.renderPlaylist();
        
        document.querySelector('#radio .btn-next')?.addEventListener('click', () => this.next());
        document.querySelector('#radio .btn-prev')?.addEventListener('click', () => this.prev());
        document.querySelector('#radio .btn-add')?.addEventListener('click', () => this.addFile());
        
        console.log('✅ RadioModule فعال شد');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RadioModule;
}
