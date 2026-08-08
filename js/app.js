// js/app.js
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    if (!container) return;

    // فقط اگر هدر وجود نداشت، اضافه کن
    if (!container.querySelector('.header')) {
        container.insertAdjacentHTML('afterbegin', Header.render());
    }
    
    // فقط اگر منو وجود نداشت، اضافه کن
    if (!container.querySelector('.menu')) {
        const header = container.querySelector('.header');
        if (header) {
            header.insertAdjacentHTML('afterend', Menu.render());
        } else {
            container.insertAdjacentHTML('afterbegin', Menu.render());
        }
    }

    // فعال‌سازی منو - رفتن به بخش مورد نظر
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // فعال‌سازی دکمه تغییر تم
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            Core.toggleTheme();
        });
    }
});
