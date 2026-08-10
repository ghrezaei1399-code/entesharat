// ============================================================
// هسته‌ی مرکزی - تمام ماژول‌ها از اینجا مدیریت می‌شوند
// ============================================================

console.log('🚀 Core: راه‌اندازی...');

// صبر کن تا صفحه کامل شود
document.addEventListener('DOMContentLoaded', function() {
  
  // بررسی اینکه داده‌ها بارگذاری شده‌اند
  if (typeof window.APP_CONFIG === 'undefined') {
    console.error('❌ Config: داده‌ها پیدا نشد!');
    return;
  }
  
  console.log('✅ Config: داده‌ها بارگذاری شد');
  
  // ==============================
  // ۱. بارگذاری رادیو
  // ==============================
  const radioContainer = document.querySelector('.radio-track-list');
  if (radioContainer && window.APP_CONFIG.radio) {
    const tracks = window.APP_CONFIG.radio.tracks;
    radioContainer.innerHTML = tracks.map((track, index) => `
      <div class="track-item" data-index="${index}">
        <span>${track.title}</span>
        <span>${track.date}</span>
        <button onclick="window.playTrack(${index})">▶</button>
      </div>
    `).join('');
    console.log('✅ رادیو: بارگذاری شد');
  }
  
  // ==============================
  // ۲. بارگذاری گالری
  // ==============================
  const galleryContainer = document.querySelector('.gallery-grid');
  if (galleryContainer && window.APP_CONFIG.gallery) {
    const posters = window.APP_CONFIG.gallery.posters;
    galleryContainer.innerHTML = posters.map(poster => `
      <div class="gallery-item">
        <img src="${poster.image}" alt="${poster.title}" />
        <p>${poster.title}</p>
      </div>
    `).join('');
    console.log('✅ گالری: بارگذاری شد');
  }
  
  // ==============================
  // ۳. بارگذاری آرشیو
  // ==============================
  const archiveContainer = document.querySelector('.archive-list');
  if (archiveContainer && window.APP_CONFIG.archive) {
    const programs = window.APP_CONFIG.archive.programs;
    archiveContainer.innerHTML = programs.map(program => `
      <div class="archive-item">
        <span>${program.title}</span>
        <span>${program.date}</span>
      </div>
    `).join('');
    console.log('✅ آرشیو: بارگذاری شد');
  }
  
  // ==============================
  // ۴. بارگذاری تبلیغات
  // ==============================
  const adsContainer = document.querySelector('.ads-slides');
  if (adsContainer && window.APP_CONFIG.ads) {
    const slides = window.APP_CONFIG.ads.slides;
    adsContainer.innerHTML = slides.map(ad => `
      <div class="ad-item">
        <img src="${ad.image}" alt="${ad.title}" />
        <p>${ad.title}</p>
      </div>
    `).join('');
    console.log('✅ تبلیغات: بارگذاری شد');
  }
  
  console.log('✅ Core: راه‌اندازی کامل شد');
});

// ==============================
// تابع پخش برای رادیو
// ==============================
window.playTrack = function(index) {
  if (!window.APP_CONFIG || !window.APP_CONFIG.radio) return;
  
  const track = window.APP_CONFIG.radio.tracks[index];
  if (!track) return;
  
  // اگر قبلاً یک پخش‌کننده وجود داشت، متوقفش کن
  if (window.currentAudio) {
    window.currentAudio.pause();
    window.currentAudio = null;
  }
  
  // پخش آهنگ جدید
  window.currentAudio = new Audio(track.file);
  window.currentAudio.play().catch(err => {
    console.log('خطا در پخش:', err);
  });
  
  // تغییر ظاهر آیتم فعال
  document.querySelectorAll('.track-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
};
