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
        <div class="ad-box">
          <span class="ad-logo">${ad.logo || '📢'}</span>
          <div class="ad-name">${ad.name}</div>
          <div class="ad-desc">${ad.desc || ''}</div>
          <a href="${ad.link || '#'}" target="_blank" class="ad-link">مشاهده</a>
        </div>
      `).join('');
    } else {
      adLeftList.innerHTML = '<p style="color:#999;font-size:.7rem;text-align:center;padding:5px;">تبلیغی ثبت نشده</p>';
    }
    
    if (ads.nashr && ads.nashr.length > 0) {
      adRightList.innerHTML = ads.nashr.map(ad => `
        <div class="ad-box">
          <span class="ad-logo">${ad.logo || '📢'}</span>
          <div class="ad-name">${ad.name}</div>
          <div class="ad-desc">${ad.desc || ''}</div>
          <a href="${ad.link || '#'}" target="_blank" class="ad-link">مشاهده</a>
        </div>
      `).join('');
    } else {
      adRightList.innerHTML = '<p style="color:#999;font-size:.7rem;text-align:center;padding:5px;">تبلیغی ثبت نشده</p>';
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
  // ۱۰. تعامل هوشمند (چت‌بات)
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

  // ============================================================
  // بخش جدید: فردا را از امروز بسازیم
  // ============================================================

  const toolsNew = [
      { name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'fa-comment', purpose: 'تولید و ویرایش متن' },
      { name: 'Claude', url: 'https://claude.ai', icon: 'fa-comment-dots', purpose: 'تحلیل و تولید متن حرفه‌ای' },
      { name: 'Gemini', url: 'https://gemini.google.com', icon: 'fa-robot', purpose: 'تحلیل و تولید محتوا' },
      { name: 'Jasper', url: 'https://www.jasper.ai', icon: 'fa-pen-fancy', purpose: 'تولید محتوای بازاریابی' },
      { name: 'Copy.ai', url: 'https://www.copy.ai', icon: 'fa-copy', purpose: 'کپی‌رایتینگ' },
      { name: 'ElevenLabs', url: 'https://elevenlabs.io', icon: 'fa-microphone', purpose: 'گوینده‌های طبیعی' },
      { name: 'Midjourney', url: 'https://www.midjourney.com', icon: 'fa-palette', purpose: 'تصاویر هنری' },
      { name: 'Runway Gen-4', url: 'https://runwayml.com', icon: 'fa-video', purpose: 'ویدیوی سینمایی' },
      { name: 'HeyGen', url: 'https://heygen.com', icon: 'fa-user-tie', purpose: 'ویدیو با آواتار' },
      { name: 'Descript', url: 'https://www.descript.com', icon: 'fa-edit', purpose: 'ویرایش صدا و پادکست' },
      { name: 'Adobe Firefly', url: 'https://firefly.adobe.com', icon: 'fa-fire', purpose: 'تصاویر تجاری' },
      { name: 'Canva Magic Studio', url: 'https://www.canva.com', icon: 'fa-magic', purpose: 'طراحی سریع گرافیک' },
      { name: 'Stable Diffusion', url: 'https://stability.ai', icon: 'fa-image', purpose: 'تصاویر سفارشی' },
      { name: 'Suno AI', url: 'https://suno.com', icon: 'fa-music', purpose: 'ساخت موسیقی با آواز' },
      { name: 'D-ID', url: 'https://www.d-id.com', icon: 'fa-user-astronaut', purpose: 'آواتار تعاملی' }
  ];

  const booksNew = [{
      id: 1,
      title: 'هنر هوشمندنگاری',
      cover: 'images/bestclasick.png',
      media: ['متن', 'صوت', 'انیمیشن', 'پادکست'],
      status: 'مرحله ۳ از ۵',
      contributors: 'غلامرضا رضائی، سارا محمدی، علی کریمی',
      approvedContent: 'متن (تأیید شده)، صوت (در حال بررسی)، انیمیشن (ارسال شده)',
      estimatedPrice: '۱۴۵,۰۰۰ - ۱۸۰,۰۰۰ تومان',
      stage: 'تألیف و تدوین'
  }, {
      id: 2,
      title: 'رادیو و انقلاب دیجیتال',
      cover: 'images/bestbooks.png',
      media: ['متن', 'ویدئو', 'پادکست', 'تصویر'],
      status: 'مرحله ۲ از ۵',
      contributors: 'احمد نوری، مریم حسینی',
      approvedContent: 'متن (تأیید شده)، ویدئو (در حال تولید)',
      estimatedPrice: '۱۱۰,۰۰۰ - ۱۳۰,۰۰۰ تومان',
      stage: 'جمع‌آوری محتوا'
  }, {
      id: 3,
      title: 'کتاب‌های هوشمند',
      cover: 'images/rezaeibooks.png',
      media: ['متن', 'تصویر', 'انیمیشن', 'صوت'],
      status: 'مرحله ۴ از ۵',
      contributors: 'فاطمه زهرایی، علی کریمی',
      approvedContent: 'متن (تأیید شده)، تصویر (تأیید شده)، انیمیشن (در حال بررسی)',
      estimatedPrice: '۱۶۰,۰۰۰ - ۱۹۰,۰۰۰ تومان',
      stage: 'ویرایش نهایی'
  }];

  function renderToolsNew() {
      const container = document.getElementById('toolsContainerNew');
      if (!container) return;
      container.innerHTML = toolsNew.map(t => `
          <div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid rgba(0,0,0,0.03);font-size:13px;border-radius:10px;transition:all 0.3s;color:#2d1b4e;">
              <a href="${t.url}" target="_blank" style="color:inherit;text-decoration:none;display:flex;align-items:center;gap:8px;flex:1;">
                  <i class="fas ${t.icon}" style="color:#6C5CE7;font-size:14px;width:22px;text-align:center;"></i>
                  ${t.name}
              </a>
              <span style="font-size:10px;color:rgba(45,27,78,0.3);background:rgba(255,255,255,0.3);padding:2px 12px;border-radius:50px;">${t.purpose}</span>
          </div>
      `).join('');
  }

  function renderBooksNew() {
      const container = document.getElementById('bookshelfNew');
      if (!container) return;
      container.innerHTML = booksNew.map(book => `
          <div onclick="showBookDetailNew(${book.id})" style="background:rgba(255,255,255,0.6);backdrop-filter:blur(8px);border-radius:18px;padding:12px;border:2px solid rgba(253,203,110,0.10);text-align:center;cursor:pointer;transition:all 0.4s;box-shadow:0 4px 20px rgba(0,0,0,0.02);">
              <img src="${book.cover}" alt="${book.title}" style="width:100%;height:120px;object-fit:cover;border-radius:12px;background:rgba(255,255,255,0.3);" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22120%22%3E%3Crect width=%22200%22 height=%22120%22 fill=%22rgba(255,255,255,0.3)%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Tahoma%22 font-size=%2214%22 fill=%22rgba(45,27,78,0.2)%22%3Eبدون جلد%3C/text%3E%3C/svg%3E'">
              <h4 style="font-size:14px;font-weight:700;color:#2d1b4e;margin:8px 0 4px;">${book.title}</h4>
              <span style="font-size:10px;background:linear-gradient(135deg,#fdcb6e,#f39c12);color:#2d1b4e;padding:3px 12px;border-radius:50px;display:inline-block;font-weight:700;">${book.status}</span>
          </div>
      `).join('');
  }

  function showBookDetailNew(id) {
      const book = booksNew.find(b => b.id === id);
      if (!book) return;
      const detailBox = document.getElementById('bookDetailNew');
      detailBox.style.display = 'block';
      detailBox.innerHTML = `
          <h4 style="color:#2d1b4e;margin-bottom:8px;">📖 ${book.title}</h4>
          <div style="display:flex;flex-wrap:wrap;gap:4px 16px;font-size:14px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.03);">
              <span style="font-weight:600;color:rgba(45,27,78,0.5);min-width:110px;">مشارکت‌کنندگان:</span>
              <span style="color:#2d1b4e;">${book.contributors}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px 16px;font-size:14px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.03);">
              <span style="font-weight:600;color:rgba(45,27,78,0.5);min-width:110px;">رسانه‌های کتاب:</span>
              <span style="color:#2d1b4e;">${book.media.join(' · ')}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px 16px;font-size:14px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.03);">
              <span style="font-weight:600;color:rgba(45,27,78,0.5);min-width:110px;">محتوای تأییدشده:</span>
              <span style="color:#2d1b4e;">${book.approvedContent}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px 16px;font-size:14px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.03);">
              <span style="font-weight:600;color:rgba(45,27,78,0.5);min-width:110px;">مرحله فعلی:</span>
              <span style="color:#2d1b4e;">${book.stage}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px 16px;font-size:14px;padding:4px 0;">
              <span style="font-weight:600;color:rgba(45,27,78,0.5);min-width:110px;">تخمین قیمت:</span>
              <span style="color:#2d1b4e;">${book.estimatedPrice}</span>
          </div>
          <button onclick="alert('به زودی پس از تکمیل کتاب، امکان خرید فراهم می‌شود.')" style="margin-top:12px;padding:8px 24px;background:linear-gradient(135deg,#39FF14,#00b894);color:#2d1b4e;border:2px solid rgba(57,255,20,0.15);border-radius:60px;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.3s;">
              <i class="fas fa-shopping-cart"></i> خرید کتاب
          </button>
          <p style="font-size:12px;color:rgba(45,27,78,0.3);margin-top:8px;">پس از پرداخت، کتاب کامل دیجیتال هوشمند (متن + صوت + انیمیشن + پادکست) در اختیار شما قرار می‌گیرد.</p>
      `;
      detailBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function toggleUploadNew() {
      const area = document.getElementById('uploadAreaNew');
      area.style.display = area.style.display === 'block' ? 'none' : 'block';
      if (area.style.display === 'block') {
          area.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }

  function submitContentNew() {
      const title = document.getElementById('uploadTitleNew').value.trim();
      const author = document.getElementById('uploadAuthorNew').value.trim();
      const email = document.getElementById('uploadEmailNew').value.trim();
      const desc = document.getElementById('uploadDescNew').value.trim();

      if (!title || !author || !email || !desc) {
          alert('❌ لطفاً عنوان، نام، ایمیل و توضیحات را کامل کنید.');
          return;
      }
      if (!email.includes('@') || !email.includes('.')) {
          alert('❌ لطفاً یک ایمیل معتبر وارد کنید.');
          return;
      }

      const selectedAge = document.querySelector('.tag-new[data-type="age"].active');
      const selectedArea = document.querySelector('.tag-new[data-type="area"].active');
      const age = selectedAge ? selectedAge.dataset.value : 'انتخاب نشده';
      const area = selectedArea ? selectedArea.dataset.value : 'انتخاب نشده';

      const code = 'BK-' + Date.now().toString().slice(-6);

      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      submissions.push({
          code: code,
          title: title,
          author: author,
          email: email,
          desc: desc,
          age: age,
          area: area,
          status: 'در انتظار بررسی',
          date: new Date().toLocaleDateString('fa-IR')
      });
      localStorage.setItem('submissions', JSON.stringify(submissions));

      console.log('📧 ایمیل به مدیر ارسال شد:', {
          to: 'admin@kimiaandisheh.com',
          subject: `اثر جدید: ${title}`,
          body: `عنوان: ${title}\nنویسنده: ${author}\nایمیل: ${email}\nگروه سنی: ${age}\nحوزه محتوا: ${area}\nتوضیحات: ${desc}\nکد رهگیری: ${code}`
      });

      alert('✅ اثر شما با موفقیت ارسال شد. کد رهگیری به ایمیل شما ارسال خواهد شد.');

      document.getElementById('uploadTitleNew').value = '';
      document.getElementById('uploadAuthorNew').value = '';
      document.getElementById('uploadEmailNew').value = '';
      document.getElementById('uploadDescNew').value = '';
      document.getElementById('uploadFileNew').value = '';
      document.getElementById('uploadAreaNew').style.display = 'none';
  }

  function trackContentNew() {
      const code = document.getElementById('trackCodeNew').value.trim();
      const resultBox = document.getElementById('trackResultNew');

      if (!code) {
          alert('لطفاً کد رهگیری را وارد کنید.');
          return;
      }

      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      const found = submissions.find(s => s.code === code);

      if (found) {
          resultBox.innerHTML = `✅ وضعیت پرونده شما: <strong>${found.status}</strong><br> عنوان: ${found.title} | نویسنده: ${found.author} | تاریخ ارسال: ${found.date}`;
      } else {
          resultBox.innerHTML = '❌ کد رهگیری نامعتبر است. لطفاً دوباره بررسی کنید.';
      }
      resultBox.style.display = 'block';
  }

  function initFutureToday() {
      document.querySelectorAll('.tag-new').forEach(tag => {
          tag.addEventListener('click', function() {
              const type = this.dataset.type;
              document.querySelectorAll(`.tag-new[data-type="${type}"]`).forEach(t => {
                  t.classList.remove('active');
                  t.style.background = 'rgba(255,255,255,0.6)';
                  t.style.borderColor = 'rgba(0,0,0,0.04)';
                  t.style.color = 'rgba(45,27,78,0.6)';
                  t.style.transform = 'scale(1)';
              });
              this.classList.add('active');
              this.style.background = 'linear-gradient(135deg, rgba(108,92,231,0.12), rgba(162,155,254,0.08))';
              this.style.borderColor = 'rgba(108,92,231,0.3)';
              this.style.color = '#2d1b4e';
              this.style.transform = 'translateY(-2px) scale(1.03)';
          });
      });
      renderToolsNew();
      renderBooksNew();
  }

  // ============================================================
  // بخش جدید: تخفیف شو
  // ============================================================

  let ideasTakhfif = JSON.parse(localStorage.getItem('ideas_takhfif') || '[]');

  function updateStatsTakhfif() {
      const total = ideasTakhfif.length;
      document.getElementById('ideasCountTakhfif').textContent = total;
      document.getElementById('totalIdeasTakhfif').textContent = total;

      const counts = [0, 0, 0, 0];
      ideasTakhfif.forEach(item => {
          const idx = parseInt(item.discount) - 1;
          if (idx >= 0 && idx < 4) counts[idx]++;
      });

      document.getElementById('count1Takhfif').textContent = counts[0];
      document.getElementById('count2Takhfif').textContent = counts[1];
      document.getElementById('count3Takhfif').textContent = counts[2];
      document.getElementById('count4Takhfif').textContent = counts[3];
  }

  function scrollToFormTakhfif() {
      const area = document.getElementById('submitAreaTakhfif');
      area.classList.toggle('show');
      if (area.classList.contains('show')) {
          setTimeout(() => {
              area.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
      }
  }

  function submitIdeaTakhfif() {
      const title = document.getElementById('ideaTitleTakhfif').value.trim();
      const author = document.getElementById('ideaAuthorTakhfif').value.trim();
      const email = document.getElementById('ideaEmailTakhfif').value.trim();
      const discount = document.getElementById('ideaDiscountTakhfif').value;
      const desc = document.getElementById('ideaDescTakhfif').value.trim();
      const fileInput = document.getElementById('ideaFileTakhfif');
      const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'بدون فایل';

      if (!title || !author || !email || !desc) {
          alert('❌ لطفاً تمام فیلدها را پر کنید.');
          return;
      }
      if (!email.includes('@') || !email.includes('.')) {
          alert('❌ لطفاً یک ایمیل معتبر وارد کنید.');
          return;
      }

      const code = 'TK-' + Date.now().toString().slice(-6);

      ideasTakhfif.push({
          code: code,
          title: title,
          author: author,
          email: email,
          discount: discount,
          desc: desc,
          fileName: fileName,
          status: 'در انتظار بررسی',
          date: new Date().toLocaleDateString('fa-IR')
      });

      localStorage.setItem('ideas_takhfif', JSON.stringify(ideasTakhfif));
      updateStatsTakhfif();

      console.log('📧 ایمیل به مدیر ارسال شد:', {
          to: 'admin@kimiaandisheh.com',
          subject: `ایده جدید: ${title}`,
          body: `عنوان: ${title}\nنویسنده: ${author}\nایمیل: ${email}\nنوع تخفیف: ${document.getElementById('ideaDiscountTakhfif').options[document.getElementById('ideaDiscountTakhfif').selectedIndex].text}\nتوضیحات: ${desc}\nفایل: ${fileName}\nکد رهگیری: ${code}`
      });

      alert(`✅ ایده شما با موفقیت ارسال شد.\nکد رهگیری: ${code}\nکد رهگیری به ایمیل شما ارسال خواهد شد.`);

      document.getElementById('ideaTitleTakhfif').value = '';
      document.getElementById('ideaAuthorTakhfif').value = '';
      document.getElementById('ideaEmailTakhfif').value = '';
      document.getElementById('ideaDescTakhfif').value = '';
      document.getElementById('ideaFileTakhfif').value = '';
      document.getElementById('submitAreaTakhfif').classList.remove('show');
  }

  function trackContentTakhfif() {
      const code = document.getElementById('trackCodeTakhfif').value.trim();
      const resultBox = document.getElementById('trackResultTakhfif');

      if (!code) {
          alert('لطفاً کد رهگیری را وارد کنید.');
          return;
      }

      const found = ideasTakhfif.find(item => item.code === code);

      if (found) {
          const discountNames = ['نوآوری اثر', 'حل مشکل اجتماعی', 'جذاب برای جوانان', 'هوش مصنوعی'];
          const dIdx = parseInt(found.discount) - 1;
          resultBox.innerHTML = `✅ وضعیت: <strong>${found.status}</strong><br> عنوان: ${found.title} | نویسنده: ${found.author}<br> نوع تخفیف: ${discountNames[dIdx] || 'نامشخص'}<br> تاریخ ارسال: ${found.date}`;
      } else {
          resultBox.innerHTML = '❌ کد رهگیری نامعتبر است. لطفاً دوباره بررسی کنید.';
      }
      resultBox.style.display = 'block';
  }

  // ============================================================
  // راه‌اندازی بخش‌های جدید
  // ============================================================
  initFutureToday();
  updateStatsTakhfif();
// ============================================================
// ============================================================
// قابلیت جابجایی بخش‌ها (Drag & Drop) با هماهنگی منو
// ============================================================

function initDragAndDrop() {
    const container = document.querySelector('.container');
    if (!container) return;

    // به‌روزرسانی لینک‌های منو بر اساس بخش‌های موجود
    function updateMenuVisibility() {
        const menuLinks = document.querySelectorAll('.menu a');
        const sections = container.querySelectorAll('.draggable-section');
        const sectionIds = new Set();
        sections.forEach(el => sectionIds.add(el.id));

        menuLinks.forEach(link => {
            const target = link.getAttribute('data-target');
            if (target && sectionIds.has(target)) {
                link.style.display = '';
            } else {
                link.style.display = 'none';
            }
        });
    }

    // ذخیره ترتیب در localStorage
    function saveOrder() {
        const sections = container.querySelectorAll('.draggable-section');
        const order = Array.from(sections).map(el => el.id);
        localStorage.setItem('sectionOrder', JSON.stringify(order));
        updateMenuVisibility();
        showNotification('✅ ترتیب بخش‌ها ذخیره شد', 'success');
    }

    // بارگذاری ترتیب ذخیره‌شده
    function loadOrder() {
        const saved = localStorage.getItem('sectionOrder');
        if (!saved) return;
        try {
            const order = JSON.parse(saved);
            const sections = container.querySelectorAll('.draggable-section');
            const sectionMap = {};
            sections.forEach(el => { sectionMap[el.id] = el; });
            
            order.forEach(id => {
                if (sectionMap[id]) {
                    container.appendChild(sectionMap[id]);
                }
            });
            updateMenuVisibility();
        } catch (e) {
            console.warn('خطا در بازیابی ترتیب:', e);
        }
    }

    // اگر Sortable موجود باشد
    if (typeof Sortable !== 'undefined') {
        loadOrder();
        
        Sortable.create(container, {
            handle: '.section-title, .radio-nava-section, .footer-mini',
            animation: 200,
            filter: '.header, .menu, .footer, .ad-side, .ad-side-mobile, .ad-inline',
            draggable: '.draggable-section',
            onEnd: function() {
                saveOrder();
            }
        });
        
        console.log('✅ Drag & Drop: فعال شد');
    } else {
        console.warn('⚠️ Sortable.js بارگذاری نشده است');
    }
}

// تابع نمایش پیام (اگر در core.js نیست)
function showNotification(message, type = 'info') {
    const colors = {
        success: '#28a745',
        error: '#e17055',
        info: '#6C5CE7'
    };
    
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || '#6C5CE7'};
        color: #fff;
        padding: 10px 28px;
        border-radius: 60px;
        z-index: 9999;
        font-family: 'Tahoma', Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        transition: all 0.4s ease;
        opacity: 0;
        pointer-events: none;
    `;
    div.textContent = message;
    document.body.appendChild(div);
    
    setTimeout(() => { div.style.opacity = '1'; }, 50);
    setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => { div.remove(); }, 400);
    }, 3000);
}

// راه‌اندازی Drag & Drop
initDragAndDrop();

// ============================================================
// به‌روزرسانی منو هنگام جابجایی (در صورت تغییر دستی)
// ============================================================

// این تابع را در صورتی که منو با جاوااسکریپت ساخته می‌شود، صدا بزنید
function refreshMenu() {
    const menu = document.querySelector('.menu');
    if (!menu) return;
    
    const sections = document.querySelectorAll('.draggable-section');
    const menuItems = menu.querySelectorAll('a');
    
    // لینک‌های منو را با بخش‌های موجود هماهنگ کنید
    menuItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.replace('#', '');
            const section = document.getElementById(id);
            if (!section) {
                link.style.display = 'none';
            } else {
                link.style.display = '';
            }
        }
    });
}

// فراخوانی هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    // ... کدهای دیگر ...
    refreshMenu();
});
  // ============================================================
// توابع کنترل تلویزیون (اضافه شده)
// ============================================================

let tvTracks = [];
let tvCurrentIndex = 0;
let tvPlayer = null;

// بارگذاری لیست پخش تلویزیون
function loadTvPlaylist() {
    const playlistContainer = document.getElementById('tvPlaylist');
    if (!playlistContainer) return;
    
    // دریافت ویدیوها از APP_CONFIG
    if (window.APP_CONFIG && window.APP_CONFIG.tv) {
        tvTracks = window.APP_CONFIG.tv.videos;
    } else {
        tvTracks = [
            { id: 1, title: 'ویدئوی همگام‌سازی خدمات', file: 'images/video1.mp4' },
            { id: 2, title: 'ویدئوی کتاب هنر هوشمند نگاری ۲', file: 'images/video2.mp4' }
        ];
    }
    
    playlistContainer.innerHTML = tvTracks.map((video, index) => `
        <div class="playlist-item ${index === tvCurrentIndex ? 'active' : ''}" 
             onclick="loadTvTrack(${index})">
            <span>${video.title}</span>
            <span style="color: #6C5CE7; font-size: 0.8rem;">▶ پخش</span>
        </div>
    `).join('');
}

// بارگذاری یک ویدیو
function loadTvTrack(index) {
    tvPlayer = document.getElementById('tvPlayer');
    if (!tvPlayer || index >= tvTracks.length) return;
    tvCurrentIndex = index;
    tvPlayer.src = tvTracks[index].file;
    tvPlayer.load();
    tvPlayer.play();
    loadTvPlaylist();
}

// پخش
function playTv() {
    tvPlayer = document.getElementById('tvPlayer');
    if (tvPlayer) tvPlayer.play();
}

// توقف
function pauseTv() {
    tvPlayer = document.getElementById('tvPlayer');
    if (tvPlayer) tvPlayer.pause();
}

// بعدی
function nextTv() {
    const next = (tvCurrentIndex + 1) % tvTracks.length;
    loadTvTrack(next);
}

// قبلی
function prevTv() {
    const prev = (tvCurrentIndex - 1 + tvTracks.length) % tvTracks.length;
    loadTvTrack(prev);
}

// راه‌اندازی تلویزیون
function initTv() {
    tvPlayer = document.getElementById('tvPlayer');
    loadTvPlaylist();
    if (tvTracks.length > 0) {
        loadTvTrack(0);
    }
}

// فراخوانی در رویداد بارگذاری
document.addEventListener('DOMContentLoaded', function() {
    // ... کدهای دیگر ...
    initTv();
});
  // ============================================================
// توابع کنترل تلویزیون (اضافه شده بدون تداخل با کدهای قبلی)
// ============================================================

// این متغیرها را فقط اگر قبلاً تعریف نشده‌اند، تعریف کن
if (typeof tvTracks === 'undefined') {
    var tvTracks = [];
    var tvCurrentIndex = 0;
    var tvPlayer = null;
}

// بارگذاری لیست پخش تلویزیون (فقط اگر تابع قبلاً تعریف نشده باشد)
if (typeof loadTvPlaylist !== 'function') {
    function loadTvPlaylist() {
        const playlistContainer = document.getElementById('tvPlaylist');
        if (!playlistContainer) return;
        
        // دریافت ویدیوها از APP_CONFIG
        if (window.APP_CONFIG && window.APP_CONFIG.tv) {
            tvTracks = window.APP_CONFIG.tv.videos;
        }
        
        if (tvTracks.length === 0) {
            playlistContainer.innerHTML = '<p style="color:#999;text-align:center;padding:10px;">هیچ ویدیویی در لیست پخش وجود ندارد.</p>';
            return;
        }
        
        playlistContainer.innerHTML = tvTracks.map((video, index) => `
            <div class="playlist-item ${index === tvCurrentIndex ? 'active' : ''}" 
                 onclick="loadTvTrack(${index})">
                <span>${video.title || 'ویدیو ' + (index+1)}</span>
                <span style="color: #6C5CE7; font-size: 0.8rem;">▶ پخش</span>
            </div>
        `).join('');
    }
}

// بارگذاری یک ویدیو (فقط اگر تابع قبلاً تعریف نشده باشد)
if (typeof loadTvTrack !== 'function') {
    function loadTvTrack(index) {
        tvPlayer = document.getElementById('tvPlayer');
        if (!tvPlayer || index >= tvTracks.length) return;
        tvCurrentIndex = index;
        tvPlayer.src = tvTracks[index].file;
        tvPlayer.load();
        tvPlayer.play();
        loadTvPlaylist();
    }
}

// پخش (فقط اگر تابع قبلاً تعریف نشده باشد)
if (typeof playTv !== 'function') {
    function playTv() {
        tvPlayer = document.getElementById('tvPlayer');
        if (tvPlayer) tvPlayer.play();
    }
}

// توقف (فقط اگر تابع قبلاً تعریف نشده باشد)
if (typeof pauseTv !== 'function') {
    function pauseTv() {
        tvPlayer = document.getElementById('tvPlayer');
        if (tvPlayer) tvPlayer.pause();
    }
}

// بعدی (فقط اگر تابع قبلاً تعریف نشده باشد)
if (typeof nextTv !== 'function') {
    function nextTv() {
        const next = (tvCurrentIndex + 1) % tvTracks.length;
        loadTvTrack(next);
    }
}

// قبلی (فقط اگر تابع قبلاً تعریف نشده باشد)
if (typeof prevTv !== 'function') {
    function prevTv() {
        const prev = (tvCurrentIndex - 1 + tvTracks.length) % tvTracks.length;
        loadTvTrack(prev);
    }
}

// راه‌اندازی تلویزیون (فقط اگر تابع قبلاً تعریف نشده باشد)
if (typeof initTv !== 'function') {
    function initTv() {
        tvPlayer = document.getElementById('tvPlayer');
        loadTvPlaylist();
        if (tvTracks.length > 0) {
            loadTvTrack(0);
        }
    }
}

// فراخوانی راه‌اندازی تلویزیون (فقط اگر قبلاً فراخوانی نشده باشد)
if (typeof tvInitialized === 'undefined') {
    var tvInitialized = true;
    document.addEventListener('DOMContentLoaded', function() {
        // صبر کن تا سایر کدها اجرا شوند
        setTimeout(initTv, 500);
    });
}
  // ============================================================
// توابع کنترل تلویزیون (هماهنگ با index.html)
// ============================================================

let tvTracks = [];
let tvCurrentIndex = 0;
let tvPlayer = null;

// بارگذاری لیست پخش تلویزیون
function loadTvPlaylist() {
    const playlistContainer = document.getElementById('tvPlaylist');
    if (!playlistContainer) return;
    
    // دریافت ویدیوها از APP_CONFIG
    if (window.APP_CONFIG && window.APP_CONFIG.tv) {
        tvTracks = window.APP_CONFIG.tv.videos;
    } else {
        tvTracks = [
            { id: 1, title: 'ویدئوی همگام‌سازی خدمات', file: 'images/video1.mp4' },
            { id: 2, title: 'ویدئوی کتاب هنر هوشمند نگاری ۲', file: 'images/video2.mp4' }
        ];
    }
    
    if (tvTracks.length === 0) {
        playlistContainer.innerHTML = '<p style="color:#999;text-align:center;padding:10px;">هیچ ویدیویی در لیست پخش وجود ندارد.</p>';
        return;
    }
    
    playlistContainer.innerHTML = tvTracks.map((video, index) => `
        <div class="playlist-item ${index === tvCurrentIndex ? 'active' : ''}" 
             onclick="loadTvTrack(${index})">
            <span>${video.title}</span>
            <span style="color: #6C5CE7; font-size: 0.8rem;">▶ پخش</span>
        </div>
    `).join('');
}

// بارگذاری یک ویدیو
function loadTvTrack(index) {
    tvPlayer = document.getElementById('tvPlayer');
    if (!tvPlayer || index >= tvTracks.length) return;
    tvCurrentIndex = index;
    tvPlayer.src = tvTracks[index].file;
    tvPlayer.load();
    tvPlayer.play();
    loadTvPlaylist();
}

// پخش
function playTv() {
    tvPlayer = document.getElementById('tvPlayer');
    if (tvPlayer) tvPlayer.play();
}

// توقف
function pauseTv() {
    tvPlayer = document.getElementById('tvPlayer');
    if (tvPlayer) tvPlayer.pause();
}

// بعدی
function nextTv() {
    const next = (tvCurrentIndex + 1) % tvTracks.length;
    loadTvTrack(next);
}

// قبلی
function prevTv() {
    const prev = (tvCurrentIndex - 1 + tvTracks.length) % tvTracks.length;
    loadTvTrack(prev);
}

// راه‌اندازی تلویزیون
function initTv() {
    tvPlayer = document.getElementById('tvPlayer');
    loadTvPlaylist();
    if (tvTracks.length > 0) {
        loadTvTrack(0);
    }
}

// فراخوانی در رویداد بارگذاری
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initTv, 500);
});
  console.log('✅ Core: راه‌اندازی کامل شد');
});
