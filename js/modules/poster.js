// ===== ماژول ساخت پوستر (با html2canvas) =====
const PosterModule = {
    async generate() {
        const title = document.getElementById('posterTitle').value.trim();
        const description = document.getElementById('posterDescription').value.trim();
        const status = document.getElementById('posterStatus');
        if (!title || !description) {
            alert('لطفاً عنوان و توضیحات پوستر را وارد کنید.');
            return;
        }
        status.style.display = 'block';
        status.innerHTML = '⏳ در حال ساخت پوستر...';
        status.style.background = '#f0ecff';
        status.style.color = '#6C5CE7';
        try {
            // ساخت یک کارت ساده با Canvas
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            // پس‌زمینه گرادیانت
            const gradient = ctx.createLinearGradient(0, 0, 600, 400);
            gradient.addColorStop(0, '#6C5CE7');
            gradient.addColorStop(0.5, '#a29bfe');
            gradient.addColorStop(1, '#fdcb6e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 600, 400);
            // عنوان
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px tahoma';
            ctx.textAlign = 'center';
            ctx.fillText(title, 300, 100);
            // توضیحات
            ctx.font = '18px tahoma';
            ctx.fillStyle = '#f0ecff';
            const words = description.split(' ');
            let line = '';
            let y = 160;
            for (let i = 0; i < words.length; i++) {
                if ((line + words[i]).length > 30) {
                    ctx.fillText(line, 300, y);
                    line = words[i] + ' ';
                    y += 30;
                } else {
                    line += words[i] + ' ';
                }
            }
            ctx.fillText(line, 300, y);
            // تاریخ
            ctx.font = '14px tahoma';
            ctx.fillStyle = '#fdcb6e';
            ctx.fillText('تاریخ: ' + new Date().toLocaleDateString('fa-IR'), 300, 370);
            // تبدیل به تصویر
            const imageUrl = canvas.toDataURL('image/png');
            // اضافه کردن به گالری
            const gallery = document.getElementById('posterGallery');
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `
                <img src="${imageUrl}" alt="${title}" style="width:100%;height:150px;object-fit:cover">
                <div class="info"><h4>${title}</h4><p>${description.substring(0, 50)}...</p></div>
            `;
            gallery.prepend(div);
            status.innerHTML = '✅ پوستر با موفقیت ساخته شد!';
            status.style.background = '#d4edda';
            status.style.color = '#155724';
            // ارسال ایمیل (شبیه‌سازی)
            const email = prompt('ایمیل خود را برای دریافت پوستر وارد کنید:', '');
            if (email) {
                alert(`📧 پوستر "${title}" به ایمیل ${email} ارسال شد!`);
            }
            document.getElementById('posterTitle').value = '';
            document.getElementById('posterDescription').value = '';
            setTimeout(() => { status.style.display = 'none'; }, 5000);
        } catch (error) {
            console.error('خطا در ساخت پوستر:', error);
            status.innerHTML = '❌ خطا در ساخت پوستر: ' + error.message;
            status.style.background = '#f8d7da';
            status.style.color = '#721c24';
        }
    },

    clear() {
        document.getElementById('posterTitle').value = '';
        document.getElementById('posterDescription').value = '';
        document.getElementById('posterStatus').style.display = 'none';
    },

    init() {
        document.querySelector('#gallery .btn-generate')?.addEventListener('click', () => this.generate());
        document.querySelector('#gallery .btn-clear')?.addEventListener('click', () => this.clear());
        console.log('✅ PosterModule فعال شد');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PosterModule;
}
