// ===== ماژول آرشیو =====
const ArchiveModule = {
    items: [
        'برنامه: زندگینامه همایون صنعتی‌زاده',
        'برنامه: موزه صنعت چاپ',
        'برنامه: صنعت نشر و تکنولوژی POD',
        'برنامه: ظرفیت صنعت چاپ در مسیر صادرات',
        'برنامه: زندگینامه محمدرضا صافیان',
        'برنامه: تاریخ کتاب و چاپ در تهران قدیم'
    ],

    render() {
        const container = document.getElementById('archiveList');
        if (!container) return;
        
        container.innerHTML = '';
        this.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'playlist-item';
            div.innerHTML = `<span>${item}</span><span>${new Date().toLocaleDateString('fa-IR')}</span>`;
            container.appendChild(div);
        });
    },

    filter() {
        const input = document.getElementById('searchInput');
        const query = input.value.toLowerCase();
        document.querySelectorAll('#archiveList .playlist-item').forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(query) ? 'flex' : 'none';
        });
    },

    async sendMessage(type) {
        const input = document.getElementById('comment_archive');
        let message = input.value.trim();
        if (type === 'audio') message = '🎤 پیام صوتی';
        else if (type === 'video') message = '🎬 پیام ویدئویی';
        else if (!message) {
            Core.showNotification('لطفاً متن خود را بنویسید.', 'error');
            return;
        }
        
        Core.addInteraction(message, 'آرشیو', type, 'responses_archive');
        input.value = '';
        
        try {
            const reply = await AI.respond(message);
            const responses = document.getElementById('responses_archive');
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
        this.render();
        
        document.getElementById('searchInput')?.addEventListener('keyup', () => this.filter());
        document.querySelector('#archive .btn-search')?.addEventListener('click', () => this.filter());
        
        console.log('✅ ArchiveModule فعال شد');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArchiveModule;
}
