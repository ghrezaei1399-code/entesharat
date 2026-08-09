// ===== مغز اصلی =====
const Core = {
    init() {
        console.log('🚀 Core: راه‌اندازی...');
        
        // ۱. تنظیمات
        this.setupTheme();
        
        // ۲. بارگذاری ماژول‌ها
        this.loadModules();
        
        // ۳. دکمه‌های شناور
        this.setupFloatingButtons();
        
        console.log('✅ Core: راه‌اندازی کامل شد');
    },

    loadModules() {
        // هدر و منو
        const container = document.querySelector('.container');
        if (container && !container.querySelector('.header')) {
            container.insertAdjacentHTML('afterbegin', HeaderModule.render());
        }
        if (container && !container.querySelector('.menu')) {
            const header = container.querySelector('.header');
            if (header) {
                header.insertAdjacentHTML('afterend', MenuModule.render());
            }
        }
        
        // ماژول‌های دیگر
        if (typeof AdsModule !== 'undefined') AdsModule.init();
        if (typeof RadioModule !== 'undefined') RadioModule.init();
        if (typeof TvModule !== 'undefined') TvModule.init();
        if (typeof ArchiveModule !== 'undefined') ArchiveModule.init();
        if (typeof InteractModule !== 'undefined') InteractModule.init();
        if (typeof PosterModule !== 'undefined') PosterModule.init();
        if (typeof SmartModule !== 'undefined') SmartModule.init();
        if (typeof PersonalizeModule !== 'undefined') PersonalizeModule.init();
    },

    setupTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            const btn = document.getElementById('themeToggle');
            if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        document.getElementById('themeToggle')?.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            Core.showNotification(isDark ? '✅ حالت شب فعال شد' : '✅ حالت روز فعال شد', 'info');
        });
    },

    setupFloatingButtons() {
        document.getElementById('scrollTop')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.getElementById('scrollBottom')?.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    },

    // تابع نمایش پیام
    showNotification(message, type = 'info') {
        const colors = { success: '#28a745', error: '#e17055', info: '#6C5CE7' };
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
        
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;max-width:400px;width:100%';
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: ${colors[type] || '#6C5CE7'};
            color: #fff;
            padding: 10px 16px;
            border-radius: 10px;
            margin-bottom: 6px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.12);
            font-family: tahoma;
            font-size: .85rem;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: 0.3s;
            animation: slideDown 0.3s ease;
        `;
        notification.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i> ${message}`;
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(50px)';
            setTimeout(() => notification.remove(), 300);
        }, 3500);
    },

    // تابع تعامل (برای ماژول‌ها)
    addInteraction(message, source, type, targetId) {
        const icons = { text: 'م', audio: 'ص', video: 'و' };
        const colors = { text: '#6C5CE7', audio: '#fd79a8', video: '#55efc4' };
        
        let targetContainer = document.getElementById(targetId) || document.getElementById('mainResponses');
        if (!targetContainer) {
            console.error('targetContainer not found:', targetId);
            return;
        }
        
        const div = document.createElement('div');
        div.className = 'response-item';
        div.innerHTML = `<span class="type-icon ${type}" style="background:${colors[type] || '#6C5CE7'}">${icons[type] || 'م'}</span> 
            <div><span>${message} ${source ? 'از ' + source : ''}</span>
            <div class="ai-response">🤖 <span id="ai-response-${Date.now()}" style="color:#6C5CE7;font-size:.8rem">در حال پردازش...</span></div></div>`;
        targetContainer.prepend(div);
        if (targetContainer.children.length > 10) targetContainer.removeChild(targetContainer.lastChild);
        
        const responseId = 'ai-response-' + Date.now();
        setTimeout(() => {
            const responseEl = document.getElementById(responseId);
            if (responseEl) {
                const replies = [
                    '✅ پیام شما دریافت شد. از ارتباط شما سپاسگزاریم!',
                    '✅ ممنون از پیام شما. هوش مصنوعی پاسخ را ثبت کرد.',
                    '✅ پاسخ: محتوای شما برای بررسی ثبت شد.',
                    '✅ از شما متشکریم. پیام شما با موفقیت در سیستم ثبت شد.'
                ];
                responseEl.textContent = replies[Math.floor(Math.random() * replies.length)];
            }
        }, 1000 + Math.random() * 1000);
    }
};

// راه‌اندازی خودکار
document.addEventListener('DOMContentLoaded', function() {
    Core.init();
});
