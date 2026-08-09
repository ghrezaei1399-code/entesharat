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

    sendMessage(type) {
        const input = document.getElementById('comment_archive');
        let message = input.value.trim();
        if (type === 'audio') message = '🎤 پیام صوتی';
        else if (type === 'video') message = '🎬 پیام ویدئویی';
        else if (!message) {
            alert('لطفاً متن خود را بنویسید.');
            return;
        }
        
        Core.addInteraction(message, 'آرشیو', type, 'responses_archive');
        input.value = '';
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
