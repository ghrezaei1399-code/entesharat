// ===== ماژول ساخت پوستر =====
const PosterModule = {
    generate() {
        const title = document.getElementById('posterTitle').value.trim();
        const description = document.getElementById('posterDescription').value.trim();
        const status = document.getElementById('posterStatus');
        
        if (!title || !description) {
            alert('لطفاً عنوان و توضیحات پوستر را وارد کنید.');
            return;
        }
        
        status.style.display = 'block';
        status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ساخت پوستر با هوش مصنوعی DALL-E...';
        status.style.background = '#f0ecff';
        status.style.color = '#6C5CE7';
        
        // استفاده از AI واقعی
        AI.generatePoster(description).then(async (imageUrl) => {
            if (imageUrl) {
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
                
                // ارسال ایمیل
                const email = prompt('ایمیل خود را برای دریافت پوستر وارد کنید:', '');
                if (email) {
                    await Email.sendPoster(email, title, description);
                    alert(`📧 پوستر "${title}" به ایمیل ${email} ارسال شد!`);
                }
            } else {
                // نسخه جایگزین (بدون API)
                const colors = ['#6C5CE7', '#4a90d9', '#55efc4', '#fdcb6e', '#fd79a8'];
                const color1 = colors[Math.floor(Math.random() * colors.length)];
                const color2 = colors[Math.floor(Math.random() * colors.length)];
                
                const gallery = document.getElementById('posterGallery');
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `
                    <div style="width:100%;height:150px;background:linear-gradient(135deg,${color1},${color2});display:flex;align-items:center;justify-content:center;color:#fff;font-size:2rem;flex-direction:column">
                        <i class="fas fa-paint-brush" style="font-size:2.5rem"></i>
                        <span style="font-size:.7rem;margin-top:4px">پوستر جدید</span>
                    </div>
                    <div class="info"><h4>${title}</h4><p>${description.substring(0, 50)}...</p></div>
                `;
                gallery.prepend(div);
                
                status.innerHTML = '✅ پوستر در گالری ذخیره شد! (نسخه جایگزین)';
                status.style.background = '#d4edda';
                status.style.color = '#155724';
            }
            
            document.getElementById('posterTitle').value = '';
            document.getElementById('posterDescription').value = '';
            
            setTimeout(() => { status.style.display = 'none'; }, 5000);
        }).catch((error) => {
            status.innerHTML = '❌ خطا در ساخت پوستر: ' + error.message;
            status.style.background = '#f8d7da';
            status.style.color = '#721c24';
        });
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
