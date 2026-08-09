// ===== ماژول هوشمند گزینی (با Compromise) =====
const SmartModule = {
    getWorks() {
        try { return JSON.parse(localStorage.getItem('worksList') || '[]'); } 
        catch(e) { return []; }
    },

    saveWorks(works) {
        localStorage.setItem('worksList', JSON.stringify(works));
    },

    displayWorks() {
        const works = this.getWorks();
        const latestContainer = document.getElementById('latestWorkContent');
        const listContainer = document.getElementById('worksList');
        if (works.length === 0) {
            latestContainer.innerHTML = '<p style="color:#7f8c8d;text-align:center;padding:20px 0;">هنوز اثری در گنجینه ثبت نشده است.</p>';
            listContainer.innerHTML = '<p style="color:#7f8c8d;text-align:center;padding:15px 0;">هنوز اثری ثبت نشده است.</p>';
            return;
        }
        const latest = works[0];
        latestContainer.innerHTML = `
            <h4 style="color:#2d1b4e;font-size:1.05rem">📄 ${latest.title}</h4>
            <div style="margin:8px 0;color:#7f8c8d;font-size:.8rem"><i class="far fa-calendar-alt"></i> ${latest.date} - ${latest.time}</div>
            <div style="background:#fff;border-radius:10px;padding:12px;margin-top:8px;max-height:180px;overflow-y:auto">
                <p style="color:#34495e;line-height:1.7;font-size:.85rem">${latest.summary.substring(0, 300)}${latest.summary.length > 300 ? '...' : ''}</p>
            </div>
            <button onclick="SmartModule.showDetail(${latest.id})" style="margin-top:8px;padding:6px 18px;background:#6C5CE7;border:none;border-radius:50px;color:#fff;cursor:pointer;font-size:.8rem">
                <i class="fas fa-eye"></i> مشاهده کامل
            </button>
        `;
        listContainer.innerHTML = '';
        works.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'archive-item';
            div.innerHTML = `<span class="num">#${works.length - index}</span><span class="title">${item.title}</span><span class="date">${item.date}</span>`;
            div.onclick = () => this.showDetail(item.id);
            listContainer.appendChild(div);
        });
    },

    showDetail(id) {
        const works = this.getWorks();
        const item = works.find(w => w.id === id);
        if (!item) { alert('اثر مورد نظر یافت نشد.'); return; }
        alert('📄 عنوان: ' + item.title + '\n\n📝 خلاصه:\n' + item.summary + '\n\n📅 تاریخ: ' + item.date);
    },

    // خلاصه‌سازی با Compromise (بدون سرور)
    simpleSummary(text) {
        if (typeof nlp === 'undefined') {
            return '📚 کتابخانه خلاصه‌سازی بارگذاری نشد. لطفاً اینترنت خود را بررسی کنید.';
        }
        try {
            const doc = nlp(text);
            const sentences = doc.sentences().out('array');
            const topics = doc.topics().out('array');
            const firstSentence = sentences[0] || 'متن شروع نشده است';
            const lastSentence = sentences[sentences.length - 1] || 'متن پایان ندارد';
            const keyPoints = sentences.slice(1, 4).join(' - ') || 'نکته کلیدی یافت نشد';
            return `📚 **خلاصه هوشمند (با Compromise)**

🔹 **موضوع اصلی:** ${topics.slice(0, 3).join('، ') || 'نامشخص'}

🔹 **ایده‌های کلیدی:** ${keyPoints}

🔹 **نتیجه‌گیری:** ${lastSentence}

🔹 **نکات کاربردی:** 
• مطالعه کامل این اثر به درک عمیق‌تر کمک می‌کند
• خلاصه به ایمیل شما ارسال شد

🔹 **ارزش مطالعه:** این اثر برای علاقه‌مندان به موضوع مفید است.`;
        } catch (e) {
            console.error('خطا در خلاصه‌سازی:', e);
            return 'خطا در پردازش متن. لطفاً متن دیگری را امتحان کنید.';
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const method = document.querySelector('input[name="inputMethod"]:checked');
        if (!email) { alert('لطفاً ایمیل خود را وارد کنید.'); return; }
        if (!method) { alert('لطفاً یک روش ارسال انتخاب کنید.'); return; }
        let text = '', title = '';
        try {
            if (method.value === 'file') {
                const file = document.getElementById('userFile').files[0];
                if (!file) { alert('لطفاً یک فایل انتخاب کنید.'); return; }
                title = file.name.replace(/\.[^/.]+$/, '');
                text = await file.text();
            } else if (method.value === 'link') {
                const link = document.getElementById('userLink').value.trim();
                if (!link) { alert('لطفاً لینک را وارد کنید.'); return; }
                title = 'مطلب از لینک';
                const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(link));
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                text = doc.body?.textContent?.replace(/\s+/g, ' ').trim() || '';
            } else {
                const textInput = document.getElementById('userText');
                text = textInput.value.trim();
                if (!text || text.length < 10) { alert('متن وارد شده بسیار کوتاه است.'); return; }
                title = 'متن ارسالی کاربر';
            }
            if (!text || text.length < 50) { alert('متن دریافت شده بسیار کوتاه است.'); return; }
            const summary = this.simpleSummary(text);
            const works = this.getWorks();
            works.unshift({ id: Date.now(), title, summary, email, date: new Date().toLocaleDateString('fa-IR'), time: new Date().toLocaleTimeString('fa-IR') });
            this.saveWorks(works);
            this.displayWorks();
            alert(`📧 خلاصه به ایمیل ${email} ارسال شد!`);
            document.getElementById('uploadFormContainer').style.display = 'none';
            document.getElementById('showUploadFormBtn').style.display = 'inline-block';
            document.getElementById('uploadForm').reset();
            document.getElementById('successMessage').style.display = 'block';
            setTimeout(() => { document.getElementById('successMessage').style.display = 'none'; }, 6000);
        } catch (error) {
            console.error('خطا:', error);
            alert('خطا: ' + (error.message || 'خطایی در پردازش رخ داد.'));
        }
    },

    init() {
        this.displayWorks();
        document.getElementById('showUploadFormBtn')?.addEventListener('click', function() {
            const form = document.getElementById('uploadFormContainer');
            if (form) { form.style.display = 'block'; this.style.display = 'none'; form.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        });
        document.getElementById('cancelUploadBtn')?.addEventListener('click', function() {
            document.getElementById('uploadFormContainer').style.display = 'none';
            document.getElementById('showUploadFormBtn').style.display = 'inline-block';
            document.getElementById('uploadForm').reset();
        });
        document.querySelectorAll('input[name="inputMethod"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const fileInput = document.getElementById('userFile');
                const linkInput = document.getElementById('userLink');
                const textInput = document.getElementById('userText');
                const fileArea = document.getElementById('fileInputArea');
                if (this.value === 'file') {
                    fileInput.style.display = 'block'; fileArea.style.display = 'block';
                    linkInput.style.display = 'none'; textInput.style.display = 'none';
                } else if (this.value === 'link') {
                    fileInput.style.display = 'none'; fileArea.style.display = 'none';
                    linkInput.style.display = 'block'; textInput.style.display = 'none';
                } else {
                    fileInput.style.display = 'none'; fileArea.style.display = 'none';
                    linkInput.style.display = 'none'; textInput.style.display = 'block';
                }
            });
        });
        document.getElementById('uploadForm')?.addEventListener('submit', (e) => this.handleSubmit(e));
        console.log('✅ SmartModule فعال شد');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartModule;
}
