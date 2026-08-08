// js/core.js
const Core = {
    currentSection: 'radio',
    init() {
        this.setupNavigation();
        this.setupTheme();
        console.log('Core initialized');
    },
    setupNavigation() {
        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').replace('#', '');
                this.navigateTo(target);
            });
        });
    },
    navigateTo(sectionId) {
        this.currentSection = sectionId;
        // نمایش همه بخش‌ها به جای مخفی کردن
        document.querySelectorAll('.section, .new-section, .radio-nava-section').forEach(el => {
            el.style.display = '';
        });
        const target = document.getElementById(sectionId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    },
    setupTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            const btn = document.getElementById('themeToggle');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }
    },
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }
};
