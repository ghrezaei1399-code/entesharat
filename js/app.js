// js/app.js
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    if (!container) return;

    // اگر هدر و منو از قبل در container نباشند، اضافه کن
    if (!container.querySelector('.header')) {
        container.insertAdjacentHTML('afterbegin', Header.render());
    }
    if (!container.querySelector('.menu')) {
        // منو را بعد از هدر اضافه کن
        const header = container.querySelector('.header');
        if (header) {
            header.insertAdjacentHTML('afterend', Menu.render());
        } else {
            container.insertAdjacentHTML('afterbegin', Menu.render());
        }
    }

    // فعال‌سازی منو
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
});
