// js/core.js
const Core = {
    currentSection: 'radio',
    modules: {},
    init() {
        this.loadModules();
        this.setupNavigation();
        this.setupTheme();
    },
    loadModules() {
        // ماژول‌ها بعداً اضافه می‌شوند
        console.log('هسته بارگذاری شد');
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
        document.querySelectorAll('.section').forEach(el => el.style.display = 'none');
        const target = document.getElementById(sectionId);
        if (target) target.style.display = 'block';
    },
    setupTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.body.className = theme === 'dark' ? 'dark-mode' : '';
    }
};
document.addEventListener('DOMContentLoaded', () => Core.init());
