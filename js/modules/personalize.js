// ===== ماژول شخصی‌سازی =====
const PersonalizeModule = {
    storageKey: 'personalize_settings',
   defaultSettings: {
    sectionOrder: ['radio', 'tv', 'archive', 'gallery', 'radionava', 'interact', 'smart-select', 'reading-growth', 'book-narrators', 'media-helpers', 'publish', 'footer-mini'],
    // ✅ 'footer-mini' اضافه شد
}

    loadSettings() {
        return Storage.get(this.storageKey, this.defaultSettings);
    },

    saveSettings(settings) {
        Storage.save(this.storageKey, settings);
    },

    applySettings(settings) {
        document.querySelectorAll('.draggable-section').forEach(el => {
            const id = el.id;
            if (settings.hiddenSections.includes(id)) {
                el.classList.add('hidden-section');
            } else {
                el.classList.remove('hidden-section');
            }
        });
        
        const container = document.querySelector('.container');
        const sections = settings.sectionOrder.map(id => document.getElementById(id)).filter(Boolean);
        sections.forEach(el => {
            if (el) container.appendChild(el);
        });
        
        const ads = document.querySelectorAll('.ad-side, .ad-side-mobile');
        ads.forEach(el => {
            el.style.display = settings.adsVisible ? '' : 'none';
        });
        
        // اعمال اندازه فونت
        document.body.style.fontSize = (settings.fontSize || 100) + '%';
    },

    setupDragAndDrop() {
        const container = document.querySelector('.container');
        if (!container || typeof Sortable === 'undefined') return;
        
        Sortable.create(container, {
            handle: '.section-title, .radio-nava-section, .footer',
            animation: 150,
            filter: '.header, .menu, .ad-side, .ad-side-mobile',
            onEnd: () => {
                const sections = container.querySelectorAll('.draggable-section');
                const settings = this.loadSettings();
                settings.sectionOrder = Array.from(sections).map(el => el.id);
                this.saveSettings(settings);
                Core.showNotification('✅ ترتیب بخش‌ها ذخیره شد', 'success');
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
        
        if (isFullscreen) {
            el.classList.remove('fullscreen');
            document.body.style.overflow = '';
            document.querySelector('.floating-toolbar').style.display = '';
            document.querySelector('.fullscreen-exit-btn')?.remove();
        } else {
            document.querySelectorAll('.fullscreen').forEach(el => el.classList.remove('fullscreen'));
            el.classList.add('fullscreen');
            document.body.style.overflow = 'hidden';
            document.querySelector('.floating-toolbar').style.display = 'none';
            
            const btn = document.createElement('button');
            btn.className = 'fullscreen-exit-btn';
            btn.innerHTML = '<i class="fas fa-compress"></i> خروج از تمام‌صفحه';
            btn.onclick = () => this.toggleFullscreen(id);
            document.body.appendChild(btn);
        }
    },

    toggleAds() {
        const settings = this.loadSettings();
        settings.adsVisible = !settings.adsVisible;
        this.saveSettings(settings);
        this.applySettings(settings);
        Core.showNotification(settings.adsVisible ? '✅ تبلیغات نمایش داده می‌شود' : '✅ تبلیغات مخفی شد', 'info');
    },

    cycleFontSize() {
        const sizes = [85, 100, 115, 130];
        const settings = this.loadSettings();
        let current = settings.fontSize || 100;
        let nextIndex = (sizes.indexOf(current) + 1) % sizes.length;
        settings.fontSize = sizes[nextIndex];
        this.saveSettings(settings);
        this.applySettings(settings);
        Core.showNotification('✅ اندازه فونت: ' + settings.fontSize + '%', 'info');
    },

    resetLayout() {
        if (!confirm('آیا می‌خواهید به چیدمان پیش‌فرض بازگردید؟\n(همه بخش‌ها نمایش داده می‌شوند و به ترتیب اولیه برمی‌گردند)')) return;
        
        this.saveSettings(this.defaultSettings);
        this.applySettings(this.defaultSettings);
        
        document.querySelectorAll('.fullscreen').forEach(el => el.classList.remove('fullscreen'));
        document.querySelector('.floating-toolbar').style.display = '';
        document.querySelector('.fullscreen-exit-btn')?.remove();
        document.body.style.overflow = '';
        
        Core.showNotification('✅ به چیدمان پیش‌فرض بازگشتید', 'success');
    },

    init() {
        const settings = this.loadSettings();
        this.applySettings(settings);
        this.setupDragAndDrop();
        this.setupFullscreen();
        
        document.getElementById('resetLayout')?.addEventListener('click', () => this.resetLayout());
        document.getElementById('toggleAds')?.addEventListener('click', () => this.toggleAds());
        document.getElementById('fontSizeBtn')?.addEventListener('click', () => this.cycleFontSize());
        
        console.log('✅ PersonalizeModule فعال شد');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalizeModule;
}
