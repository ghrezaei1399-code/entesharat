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
  // ۱. بارگذاری رادیو (ویس‌ها)
  // ==============================
  const radioPlayer = document.getElementById('radioPlayer');
  if (radioPlayer && window.APP_CONFIG.radio) {
    const tracks = window.APP_CONFIG.radio.tracks;
    // پاک کردن source‌های قبلی
    radioPlayer.innerHTML = '';
    tracks.forEach(track => {
      const source = document.createElement('source');
      source.src = track.file;
      source.type = 'audio/mpeg';
      radioPlayer.appendChild(source);
    });
    radioPlayer.load();
    console.log('✅ رادیو: ویس‌ها بارگذاری شدند');
  }
  
  // ==============================
  // ۲. بارگذاری تلویزیون (ویدیوها)
  // ==============================
  const tvPlayer = document.getElementById('tvPlayer');
  if (tvPlayer && window.APP_CONFIG.tv) {
    const videos = window.APP_CONFIG.tv.videos;
    // پاک کردن source‌های قبلی
    tvPlayer.innerHTML = '';
    videos.forEach(video => {
      const source = document.createElement('source');
      source.src = video.file;
      source.type = 'video/mp4';
      tvPlayer.appendChild(source);
    });
    tvPlayer.load();
    console.log('✅ تلویزیون: ویدیوها بارگذاری شدند');
  }
  
  // ==============================
  // ۳. بارگذاری گالری پوستر
  // ==============================
  const posterGallery = document.getElementById('posterGallery');
  if (posterGallery && window.APP_CONFIG.gallery) {
    const posters = window.APP_CONFIG.gallery.posters;
    posterGallery.innerHTML = posters.map(poster => `
      <div class="gallery-item">
        <img src="${poster.image}" alt="${poster.title}" loading="lazy" />
        <div class="info">
          <h4>${poster.title}</h4>
          <p>تولید هوش مصنوعی</p>
        </div>
      </div>
    `).join('');
    console.log('✅ گالری: بارگذاری شد');
  }
  
  // ==============================
  // ۴. بارگذاری آرشیو
  // ==============================
  const archiveList = document.getElementById('archiveList');
  if (archiveList && window.APP_CONFIG.archive) {
    const programs = window.APP_CONFIG.archive.programs;
    archiveList.innerHTML = programs.map(program => `
      <div class="archive-item">
        <span>${program.title}</span>
        <span class="date">${program.date}</span>
      </div>
    `).join('');
    console.log('✅ آرشیو: بارگذاری شد');
  }
  
  // ==============================
  // ۵. بارگذاری تبلیغات دو طرف (چپ و راست)
  // ==============================
  const adLeftList = document.getElementById('adLeftList');
  const adRightList = document.getElementById('adRightList');
  
  if (adLeftList && adRightList && window.APP_CONFIG.ads) {
    const ads = window.APP_CONFIG.ads;
    
    // تبلیغات چپ (حوزه چاپ)
    if (ads.chap && ads.chap.length > 0) {
      adLeftList.innerHTML = ads.chap.map(ad => `
        <div class="ad-item">
          <span class="ad-logo">${ad.logo || '📢'}</span>
          <div class="ad-name">${ad.name}</div>
          <a href="${ad.link || '#'}" target="_blank" class="ad-link">مشاهده</a>
        </div>
      `).join('');
    } else {
      adLeftList.innerHTML = '<p style="color:#999;font-size:.7rem;text-align:center;padding:5px;">تبلیغی ثبت نشده</p>';
    }
    
    // تبلیغات راست (حوزه نشر)
    if (ads.nashr && ads.nashr.length > 0) {
      adRightList.innerHTML = ads.nashr.map(ad => `
        <div class="ad-item">
          <span class="ad-logo">${ad.logo || '📢'}</span>
          <div class="ad-name">${ad.name}</div>
          <a href="${ad.link || '#'}" target="_blank" class="ad-link">مشاهده</a>
        </div>
      `).join('');
    } else {
      adRightList.innerHTML = '<p style="color:#999;font-size:.7rem;text-align:center;padding:5px;">تبلیغی ثبت نشده</p>';
    }
    
    console.log('✅ تبلیغات دو طرف: بارگذاری شد');
  }
  
  // ==============================
  // ۶. بارگذاری تبلیغات موبایل (خطی)
  // ==============================
  const adMobileList = document.getElementById('adMobileList');
  if (adMobileList && window.APP_CONFIG.ads) {
    const allAds = [...(window.APP_CONFIG.ads.chap || []), ...(window.APP_CONFIG.ads.nashr || [])];
    if (allAds.length > 0) {
      adMobileList.innerHTML = allAds.slice(0, 4).map(ad => `
        <div class="ad-item">
          <span class="ad-logo">${ad.logo || '📢'}</span>
          <div class="ad-name">${ad.name}</div>
          <a href="${ad.link || '#'}" target="_blank" class="ad-link">مشاهده</a>
        </div>
      `).join('');
    } else {
      adMobileList.innerHTML = '<div style="color:#7f8c8d;font-size:.7rem;text-align:center;padding:5px;">تبلیغاتی ثبت نشده است.</div>';
    }
    console.log('✅ تبلیغات موبایل: بارگذاری شد');
  }
  
  // ==============================
  // ۷. راه‌اندازی پاسخگوی هوشمند (تعامل)
  // ==============================
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const sendBtn = document.querySelector('#interact .chat-input button');
  
  if (chatInput && chatMessages) {
    // تابع ارسال پیام
    window.sendChatMessage = function() {
      const msg = chatInput.value.trim();
      if (!msg) return;
      
      chatMessages.innerHTML += `<p class="user">👤 ${msg}</p>`;
      
      // پاسخ هوشمند ساده
      let reply = '🤖 متشکرم! پیام شما دریافت شد.';
      if (msg.includes('سلام') || msg.includes('سلام')) {
        reply = '🤖 سلام! خوش آمدید. چگونه می‌توانم کمک کنم؟';
      } else if (msg.includes('کتاب')) {
        reply = '🤖 کتاب‌های انتشارات کیمیا در بخش آرشیو قابل مشاهده هستند.';
      } else if (msg.includes('چاپ')) {
        reply = '🤖 صنعت چاپ در ایران تاریخچه‌ای غنی دارد. در بخش آرشیو برنامه‌های مرتبط را ببینید.';
      } else if (msg.includes('تماس')) {
        reply = '🤖 شماره تماس: ۰۹۱۲۲۴۷۲۴۴۸ | ۰۲۱۶۶۹۶۱۵۶۹';
      }
      
      chatMessages.innerHTML += `<p class="bot">${reply}</p>`;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatInput.value = '';
    };
    
    // اتصال رویداد به دکمه
    if (sendBtn) {
      sendBtn.onclick = window.sendChatMessage;
    }
    
    // ارسال با Enter
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        window.sendChatMessage();
      }
    });
    
    console.log('✅ تعامل هوشمند: راه‌اندازی شد');
  }
  
  console.log('✅ Core: راه‌اندازی کامل شد');
});

// ==============================
// تابع پخش برای رادیو (در صورت استفاده از لیست پخش)
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
    alert('خطا در پخش آهنگ. ممکن است فایل وجود نداشته باشد.');
  });
  
  // تغییر ظاهر آیتم فعال
  document.querySelectorAll('.track-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
};
