// ===== ماژول تلویزیون =====
const TvModule = {
    files: [
        'images/ویدئوی همگام سازی .mp4',
        'images/ویدئوی هوشمند نگاری.mp4'
    ],
    titles: ['ویدئوی طرح همگام‌سازی خدمات', 'ویدئوی کتاب هنر هوشمند نگاری ۲'],
    currentIndex: 0,

    renderPlaylist() {
        const container = document.getElementById('tvPlaylist');
        if (!container) return;
        container.innerHTML = '';
        this.files.forEach((file, i) => {
            const div = document.createElement('div');
            div.className = 'playlist-item' + (i === this.currentIndex ? ' active' : '');
            div.innerHTML = `<span>${this.titles[i] || 'ویدئو ' + (i+1)}</span>`;
            div.onclick = () => this.load(i);
            container.appendChild(div);
        });
    },

    load(index) {
        const player = document.getElementById('tvPlayer');
        if (this.files[index]) {
            player.src = this.files[index];
            player.load();
            player.play();
            this.currentIndex = index;
            this.renderPlaylist();
        }
    },

    next() { this.load((this.currentIndex + 1) % this.files.length); },
    prev() { this.load((this.currentIndex - 1 + this.files.length) % this.files.length); },

    addFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.files.push(URL.createObjectURL(file));
                this.titles.push(file.name);
                this.renderPlaylist();
                alert('✅ ویدئو با موفقیت اضافه شد!');
            }
        };
        input.click();
    },

    // پیام‌ها فقط در باکس نمایش داده می‌شوند (بدون درخواست به OpenAI)
    sendMessage(type) {
        const input = document.getElementById('comment_tv');
        let message = input.value.trim();
        if (type === 'audio') message = '🎤 پیام صوتی';
        else if (type === 'video') message = '🎬 پیام ویدئویی';
        else if (!message) {
            alert('لطفاً متن خود را بنویسید.');
            return;
        }
        // نمایش پیام کاربر
        const container = document.getElementById('responses_tv');
        const div = document.createElement('div');
        div.className = 'response-item';
        div.innerHTML = `<span class="type-icon text">م</span> <span>${message}</span>`;
        container.prepend(div);
        input.value = '';
        // پاسخ خودکار ساده
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'response-item';
            replyDiv.innerHTML = `<span class="type-icon text" style="background:#55efc4;color:#2d1b4e">🤖</span> <span>✅ پیام شما دریافت شد. از ارتباط شما سپاسگزاریم!</span>`;
            container.prepend(replyDiv);
        }, 500);
    },

    init() {
        this.renderPlaylist();
        document.querySelector('#tv .btn-next')?.addEventListener('click', () => this.next());
        document.querySelector('#tv .btn-prev')?.addEventListener('click', () => this.prev());
        document.querySelector('#tv .btn-add')?.addEventListener('click', () => this.addFile());
        console.log('✅ TvModule فعال شد');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TvModule;
}
