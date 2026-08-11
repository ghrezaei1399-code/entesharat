// ============================================================
// هسته‌ی مرکزی - مدیریت همه‌ی بخش‌های سایت
// ============================================================

console.log('🚀 Core: راه‌اندازی...');

document.addEventListener('DOMContentLoaded', function() {
  
  // بررسی وجود داده‌ها
  if (typeof window.APP_CONFIG === 'undefined') {
    console.error('❌ Config: داده‌ها پیدا نشد!');
    return;
  }
  
  console.log('✅ Config: داده‌ها بارگذاری شد');
  
  // ============================================================
  // ۱. بارگذاری رادیو (ویس‌ها در پلیر اصلی + لیست پخش)
  // ============================================================
  const radioPlayer = document.getElementById('radioPlayer');
  const radioPlaylist = document.getElementById('radioPlaylist');
  
  if (radioPlayer && window.APP_CONFIG.radio) {
    const tracks = window.APP_CONFIG.radio.tracks;
    radioPlayer.innerHTML = '';
    tracks.forEach(track => {
      const source = document.createElement('source');
      source.src = track.file;
      source.type = 'audio/mpeg';
      radioPlayer.appendChild(source);
    });
    radioPlayer.load();
    console.log('✅ رادیو: ویس‌ها بارگذاری شدند');
    
    if (radioPlaylist) {
      radioPlaylist.innerHTML = tracks.map((track, index) => `
        <div class="playlist-item" style="
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          margin-bottom: 4px;
          background: #f8f4f0;
          border-radius: 6px;
          border: 1px solid #e8ddd0;
          cursor: pointer;
          transition: all 0.2s;
        " onclick="document.getElementById('radioPlayer').src = '${track.file}'; document.getElementById('radioPlayer').load(); document.getElementById('radioPlayer').play();">
          <span>${track.title}</span>
          <span style="color: #6C5CE7; font-size: 0.8rem;">▶ پخش</span>
        </div>
      `).join('');
      console.log('✅ لیست پخش رادیو: ساخته شد');
    }
  }
  
  // ============================================================
  // ۲. بارگذاری تلویزیون (ویدیوها در پلیر اصلی + لیست پخش)
  // ============================================================
  const tvPlayer = document.getElementById('tvPlayer');
  const tvPlaylist = document.getElementById('tvPlaylist');
  
  if (tvPlayer && window.APP_CONFIG.tv) {
    const videos = window.APP_CONFIG.tv.videos;
    tvPlayer.innerHTML = '';
    videos.forEach(video => {
      const source = document.createElement('source');
      source.src = video.file;
      source.type = 'video/mp4';
      tvPlayer.appendChild(source);
    });
    tvPlayer.load();
    console.log('✅ تلویزیون: ویدیوها بارگذاری شدند');
    
    if (tvPlaylist) {
      tvPlaylist.innerHTML = videos.map((video, index) => `
        <div class="playlist-item" style="
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          margin-bottom: 4px;
          background: #f8f4f0;
          border-radius: 6px;
          border: 1px solid #e8ddd0;
          cursor: pointer;
          transition: all 0.2s;
        " onclick="document.getElementById('tvPlayer').src = '${video.file}'; document.getElementById('tvPlayer').load(); document.getElementById('tvPlayer').play();">
          <span>${video.title}</span>
          <span style="color: #6C5CE7; font-size: 0.8rem;">▶ پخش</span>
        </div>
      `).join('');
      console.log('✅ لیست پخش تلویزیون: ساخته شد');
    }
  }
  
  // ============================================================
  // ۳. بارگذاری آرشیو
  // ============================================================
  const archiveList = document.getElementById('archiveList');
  if (archiveList && window.APP_CONFIG.archive) {
    const programs = window.APP_CONFIG.archive.programs;
    archiveList.innerHTML = programs.map((program) => `
      <div class="archive-item" style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        margin-bottom: 8px;
        background: #fff;
        border-radius: 10px;
        border: 1px solid #e8ddd0;
        transition: all 0.2s;
        cursor: pointer;
      " onclick="window.location.href='#archive'">
        <span style="font-weight: 500; color: #2d1b4e;">${program.title}</span>
        <span style="font-size: 12px; color: #999;">${program.date}</span>
        <span style="color: #6C5CE7; font-size: 14px;">🔗</span>
      </div>
    `).join('');
    console.log('✅ آرشیو: بارگذاری شد');
  }
  
  // ============================================================
  // ۴. بارگذاری تبلیغات دو طرف
  // ============================================================
  const adLeftList = document.getElementById('adLeftList');
  const adRightList = document.getElementById('adRightList');
  
  if (adLeftList && adRightList && window.APP_CONFIG.ads) {
    const ads = window.APP_CONFIG.ads;
    
    if (ads.chap && ads.chap.length > 0) {
      adLeftList.innerHTML = ads.chap.map(ad => `
        <div class="ad-item" style="
          background: #fff;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 10px;
          border: 1px solid #e8ddd0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          text-align: center;
          transition: all 0.2s;
        ">
          <div style="font-size: 2rem; display: block; margin-bottom: 6px;">${ad.logo || '📢'}</div>
          <div style="font-weight: 700; color: #2d1b4e; font-size: 0.9rem; margin-bottom: 4px;">${ad.name}</div>
          <a href="${ad.link || '#'}" target="_blank" style="
            display: inline-block;
            background: #6C5CE7;
            color: #fff;
            padding: 4px 16px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 0.75rem;
            font-weight: 600;
            transition: 0.2s;
          " onmouseover="this.style.background='#5a4bd1'" onmouseout="this.style.background='#6C5CE7'">
            مشاهده سایت
          </a>
        </div>
      `).join('');
    } else {
      adLeftList.innerHTML = '<p style="color:#999;font-size:.7rem;text-align:center;padding:10px;">تبلیغی ثبت نشده</p>';
    }
    
    if (ads.nashr && ads.nashr.length > 0) {
      adRightList.innerHTML = ads.nashr.map(ad => `
        <div class="ad-item" style="
          background: #fff;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 10px;
          border: 1px solid #e8ddd0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          text-align: center;
          transition: all 0.2s;
        ">
          <div style="font-size: 2rem; display: block; margin-bottom: 6px;">${ad.logo || '📢'}</div>
          <div style="font-weight: 700; color: #2d1b4e; font-size: 0.9rem; margin-bottom: 4px;">${ad.name}</div>
          <a href="${ad.link || '#'}" target="_blank" style="
            display: inline-block;
            background: #6C5CE7;
            color: #fff;
            padding: 4px 16px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 0.75rem;
            font-weight: 600;
            transition: 0.2s;
          " onmouseover="this.style.background='#5a4bd1'" onmouseout="this.style.background='#6C5CE7'">
            مشاهده سایت
          </a>
        </div>
      `).join('');
    } else {
      adRightList.innerHTML = '<p style="color:#999;font-size:.7rem;text-align:center;padding:10px;">تبلیغی ثبت نشده</p>';
    }
    
    console.log('✅ تبلیغات دو طرف: بارگذاری شد');
  }
  
  // ============================================================
  // ۵. بارگذاری تبلیغات موبایل
  // ============================================================
  const adMobileList = document.getElementById('adMobileList');
  if (adMobileList && window.APP_CONFIG.ads) {
    const allAds = [...(window.APP_CONFIG.ads.chap || []), ...(window.APP_CONFIG.ads.nashr || [])];
    if (allAds.length > 0) {
      adMobileList.innerHTML = allAds.slice(0, 4).map(ad => `
        <div class="ad-item" style="
          background: #fff;
          border-radius: 12px;
          padding: 12px;
          border: 1px solid #e8ddd0;
          text-align: center;
          flex: 1;
          min-width: 100px;
        ">
          <div style="font-size: 1.8rem; display: block; margin-bottom: 4px;">${ad.logo || '📢'}</div>
          <div style="font-weight: 700; color: #2d1b4e; font-size: 0.75rem; margin-bottom: 4px;">${ad.name}</div>
          <a href="${ad.link || '#'}" target="_blank" style="
            display: inline-block;
            background: #6C5CE7;
            color: #fff;
            padding: 2px 12px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 0.65rem;
            font-weight: 600;
          ">
            مشاهده
          </a>
        </div>
      `).join('');
    } else {
      adMobileList.innerHTML = '<div style="color:#7f8c8d;font-size:.7rem;text-align:center;padding:10px;">تبلیغاتی ثبت نشده است.</div>';
    }
    console.log('✅ تبلیغات موبایل: بارگذاری شد');
  }
  
  // ============================================================
  // ۶. ماژول شب/روز
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
      }
    });
    console.log('✅ ماژول شب/روز: راه‌اندازی شد');
  }
  
  // ============================================================
  // ۷. ماژول اسکرول بالا/پایین
  // ============================================================
  const scrollTop = document.getElementById('scrollTop');
  const scrollBottom = document.getElementById('scrollBottom');
  
  if (scrollTop) {
    scrollTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  if (scrollBottom) {
    scrollBottom.addEventListener('click', function() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }
  console.log('✅ ماژول اسکرول: راه‌اندازی شد');
  
  // ============================================================
  // ۸. ماژول تغییر اندازه فونت
  // ============================================================
  const fontSizeBtn = document.getElementById('fontSizeBtn');
  let fontSizeLevel = 0;
  const fontSizes = ['16px', '18px', '20px', '22px', '24px'];
  
  if (fontSizeBtn) {
    fontSizeBtn.addEventListener('click', function() {
      fontSizeLevel = (fontSizeLevel + 1) % fontSizes.length;
      document.body.style.fontSize = fontSizes[fontSizeLevel];
    });
    console.log('✅ ماژول فونت: راه‌اندازی شد');
  }
  
  // ============================================================
  // ۹. ماژول ریست چیدمان
  // ============================================================
  const resetLayout = document.getElementById('resetLayout');
  if (resetLayout) {
    resetLayout.addEventListener('click', function() {
      location.reload();
    });
    console.log('✅ ماژول ریست: راه‌اندازی شد');
  }
  

  
  // ============================================================
  // ۱۱. تعامل هوشمند (چت‌بات)
  // ============================================================
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  
  if (chatInput && chatMessages) {
    window.sendChatMessage = function() {
      const msg = chatInput.value.trim();
      if (!msg) return;
      
      chatMessages.innerHTML += `<p class="user" style="color:#6C5CE7;font-weight:500;margin:4px 0;">👤 ${msg}</p>`;
      
      let reply = '🤖 متشکرم! پیام شما دریافت شد.';
      if (msg.includes('سلام')) {
        reply = '🤖 سلام! خوش آمدید. چگونه می‌توانم کمک کنم؟';
      } else if (msg.includes('کتاب')) {
        reply = '🤖 کتاب‌های انتشارات کیمیا در بخش آرشیو قابل مشاهده هستند.';
      } else if (msg.includes('چاپ')) {
        reply = '🤖 صنعت چاپ در ایران تاریخچه‌ای غنی دارد. در بخش آرشیو برنامه‌های مرتبط را ببینید.';
      } else if (msg.includes('تماس')) {
        reply = '🤖 شماره تماس: ۰۹۱۲۲۴۷۲۴۴۸ | ۰۲۱۶۶۹۶۱۵۶۹';
      }
      
      chatMessages.innerHTML += `<p class="bot" style="color:#2b6b4f;margin:4px 0;">${reply}</p>`;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatInput.value = '';
    };
    
    const sendBtn = document.querySelector('#interact .chat-input button');
    if (sendBtn) {
      sendBtn.onclick = window.sendChatMessage;
    }
    
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        window.sendChatMessage();
      }
    });
    
    console.log('✅ تعامل هوشمند: راه‌اندازی شد');
  }
  
  console.log('✅ Core: راه‌اندازی کامل شد');
});
