// js/personalize.js
const Personalize = {
    storageKey: 'personalize_settings',
    defaultSettings: {
        hiddenSections: [],
        sectionOrder: ['radio', 'tv', 'archive', 'gallery', 'radionava', 'interact', 'smart-select', 'reading-growth', 'book-narrators', 'media-helpers', 'publish', 'footer-mini'],
        adsVisible: true,
        fullscreenSection: null
    },

    init() {
        // بارگذاری تنظیمات
        this.settings = this.loadSettings();
        
        // اعمال تنظیمات
        this.applySettings();
        
        // راه‌اندازی کشیدن و رها کردن
        this.setupDragAndDrop();
        
        // دابل‌کلیک برای تمام‌صفحه
        this.setupFullscreen();
        
        // دکمه بازگشت به حالت پیش‌فرض
        document.getElementById('resetLayout')?.addEventListener('click', () => this.resetLayout());
        
        // دکمه مخفی/نمایش تبلیغات
        document.getElementById('toggleAds')?.addEventListener('click', () => this.toggleAds());
        
        console.log('✅ شخصی‌سازی فعال شد');
    },

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return { ...this.defaultSettings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('خطا در بارگذاری تنظیمات:', e);
        }
        return { ...this.defaultSettings };
    },

    saveSettings() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
        } catch (e) {
            console.warn('خطا در ذخیره تنظیمات:', e);
        }
    },

    applySettings() {
        // اعمال مخفی‌سازی بخش‌ها
        document.querySelectorAll('.draggable-section').forEach(el => {
            const id = el.id;
            if (this.settings.hiddenSections.includes(id)) {
                el.classList.add('hidden-section');
            } else {
                el.classList.remove('hidden-section');
            }
        });
        
        // اعمال ترتیب بخش‌ها
        const container = document.querySelector('.container');
        const sections = this.settings.sectionOrder.map(id => document.getElementById(id)).filter(Boolean);
        sections.forEach(el => {
            if (el) container.appendChild(el);
        });
        
        // اعمال نمایش تبلیغات
        const ads = document.querySelectorAll('.ad-side, .ad-side-mobile');
        ads.forEach(el => {
            el.style.display = this.settings.adsVisible ? '' : 'none';
        });
    },

    setupDragAndDrop() {
        const container = document.querySelector('.container');
        if (!container) return;
        
        Sortable.create(container, {
            handle: '.section-title, .footer-mini',  // ✅ اضافه شد
            animation: 150,
            filter: '.header, .menu, .footer, .radio-nava-section, .ad-side, .ad-side-mobile',
            onEnd: (evt) => {
                // به‌روزرسانی ترتیب در تنظیمات
                const sections = container.querySelectorAll('.draggable-section');
                this.settings.sectionOrder = Array.from(sections).map(el => el.id);
                this.saveSettings();
                
                // نمایش پیام
                showNotification('✅ ترتیب بخش‌ها ذخیره شد', 'success');
            }
        });
    },

    setupFullscreen() {
        document.querySelectorAll('.draggable-section').forEach(el => {
            el.addEventListener('dblclick', () => {
                this.toggleFullscreen(el.id);
            });
        });
    },

    toggleFullscreen(id) {
        const el = document.getElementById(id);
        if (!el) return;
        
        const isFullscreen = el.classList.contains('fullscreen');
        
        // اگر قبلاً تمام‌صفحه بود، برگردان
        if (isFullscreen) {
            el.classList.remove('fullscreen');
            this.settings.fullscreenSection = null;
            document.body.style.overflow = '';
            // نمایش دوباره دکمه‌های شناور
            document.querySelector('.floating-toolbar').style.display = '';
        } else {
            // بستن تمام‌صفحه قبلی
            document.querySelectorAll('.fullscreen').forEach(el => el.classList.remove('fullscreen'));
            
            // باز کردن تمام‌صفحه جدید
            el.classList.add('fullscreen');
            this.settings.fullscreenSection = id;
            document.body.style.overflow = 'hidden';
            // مخفی کردن دکمه‌های شناور
            document.querySelector('.floating-toolbar').style.display = 'none';
            
            // دکمه خروج از تمام‌صفحه
            this.addFullscreenExit(el);
        }
        
        this.saveSettings();
    },

    addFullscreenExit(el) {
        // حذف دکمه قبلی
        const oldBtn = document.querySelector('.fullscreen-exit-btn');
        if (oldBtn) oldBtn.remove();
        
        // اضافه کردن دکمه خروج
        const btn = document.createElement('button');
        btn.className = 'fullscreen-exit-btn';
        btn.innerHTML = '<i class="fas fa-compress"></i> خروج از تمام‌صفحه';
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 12px 25px;
            background: #e17055;
            color: #fff;
            border: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: 0.3s;
        `;
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => this.toggleFullscreen(el.id);
        document.body.appendChild(btn);
    },

    toggleAds() {
        this.settings.adsVisible = !this.settings.adsVisible;
        this.saveSettings();
        this.applySettings();
        showNotification(this.settings.adsVisible ? '✅ تبلیغات نمایش داده می‌شود' : '✅ تبلیغات مخفی شد', 'info');
    },

    toggleSection(id) {
        const index = this.settings.hiddenSections.indexOf(id);
        if (index > -1) {
            this.settings.hiddenSections.splice(index, 1);
            showNotification('✅ بخش نمایش داده شد', 'success');
        } else {
            this.settings.hiddenSections.push(id);
            showNotification('✅ بخش مخفی شد', 'info');
        }
        this.saveSettings();
        this.applySettings();
    },

    resetLayout() {
        if (!confirm('آیا می‌خواهید به حالت پیش‌فرض بازگردید؟')) return;
        
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        this.applySettings();
        
        // بستن تمام‌صفحه
        document.querySelectorAll('.fullscreen').forEach(el => el.classList.remove('fullscreen'));
        document.querySelector('.floating-toolbar').style.display = '';
        document.querySelector('.fullscreen-exit-btn')?.remove();
        document.body.style.overflow = '';
        
        showNotification('✅ به حالت پیش‌فرض بازگشتید', 'success');
    }
};

// ===== راه‌اندازی =====
document.addEventListener('DOMContentLoaded', function() {
    // فقط اگر Sortable وجود دارد
    if (typeof Sortable !== 'undefined') {
        Personalize.init();
    } else {
        console.warn('⚠️ کتابخانه Sortable بارگذاری نشد.');
    }
});

// ===== تابع نمایش پیام =====
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer') || (() => {
        const div = document.createElement('div');
        div.id = 'notificationContainer';
        div.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;max-width:400px;width:100%';
        document.body.appendChild(div);
        return div;
    })();
    
    const notification = document.createElement('div');
    const colors = {
        success: '#28a745',
        error: '#e17055',
        info: '#6C5CE7'
    };
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    notification.style.cssText = `
        background: ${colors[type] || '#6C5CE7'};
        color: #fff;
        padding: 15px 20px;
        border-radius: 12px;
        margin-bottom: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        font-family: tahoma;
        font-size: .95rem;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: 0.3s;
        animation: slideDown 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
