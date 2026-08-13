// ============================================================
// app.js - مدیریت کلی سایت
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    if (!container) return;

    // ===== منوی جدید (با بخش‌های حذف‌شده و اضافه‌شده) =====
    const menuItems = [
        { id: 'radio', label: 'رادیو', icon: 'fa-radio' },
        { id: 'tv', label: 'تلویزیون', icon: 'fa-tv' },
        { id: 'archive', label: 'آرشیو', icon: 'fa-archive' },
        { id: 'gallery', label: 'گالری پوستر', icon: 'fa-images' },
        { id: 'radionava', label: 'رادیو نوای چاپ', icon: 'fa-radio' },
        { id: 'interact', label: 'تعامل', icon: 'fa-comment-dots' },
        { id: 'future-today', label: 'فردا را از امروز', icon: 'fa-rocket' },
        { id: 'takhfif-show', label: 'تخفیف شو', icon: 'fa-tags' },
        { id: 'publish', label: 'انتشارات', icon: 'fa-building' },
        { id: 'smart-select', label: 'هوشمند گزینی', icon: 'fa-robot' },
        { id: 'footer-mini', label: 'طراحی و توسعه', icon: 'fa-crown' }
    ];

    // ===== ساخت منو =====
    function renderMenu() {
        const existingMenu = document.querySelector('.menu');
        if (existingMenu) return existingMenu;

        const nav = document.createElement('nav');
        nav.className = 'menu';
        nav.innerHTML = menuItems.map(item => `
            <a href="#${item.id}">
                <i class="fas ${item.icon}"></i> ${item.label}
            </a>
        `).join('');
        return nav;
    }

    // ===== اضافه کردن منو به سایت =====
    const menu = renderMenu();
    const header = container.querySelector('.header');
    if (header && !container.querySelector('.menu')) {
        header.insertAdjacentHTML('afterend', menu.outerHTML);
    } else if (!container.querySelector('.menu')) {
        container.insertAdjacentHTML('afterbegin', menu.outerHTML);
    }

    // ===== اسکرول نرم به بخش‌ها =====
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== دکمه تغییر تم (شب/روز) =====
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }

    // ===== دکمه اسکرول به بالا =====
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== دکمه اسکرول به پایین =====
    const scrollBottomBtn = document.getElementById('scrollBottom');
    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', function() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    // ===== دکمه تغییر اندازه فونت =====
    const fontSizeBtn = document.getElementById('fontSizeBtn');
    let fontSizeLevel = 0;
    const fontSizes = ['16px', '18px', '20px', '22px', '24px'];
    if (fontSizeBtn) {
        fontSizeBtn.addEventListener('click', function() {
            fontSizeLevel = (fontSizeLevel + 1) % fontSizes.length;
            document.body.style.fontSize = fontSizes[fontSizeLevel];
        });
    }

    // ===== دکمه ریست چیدمان =====
    const resetBtn = document.getElementById('resetLayout');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('آیا می‌خواهید به چیدمان پیش‌فرض بازگردید؟')) {
                location.reload();
            }
        });
    }

    console.log('✅ app.js: منو و کنترل‌ها راه‌اندازی شدند');
});
