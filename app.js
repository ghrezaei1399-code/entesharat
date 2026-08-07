// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    
    // رندر هدر
    root.innerHTML = Header.render();
    
    // بقیه بخش‌ها بعداً اضافه می‌شوند
    console.log('اپلیکیشن راه‌اندازی شد');
});
