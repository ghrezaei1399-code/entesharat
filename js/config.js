// ============================================================
// پیکربندی مرکزی رادیو تلویزیون هوشمند انتشارات کیمیا
// ============================================================

// همه‌ی داده‌ها در یک جا
window.APP_CONFIG = {
  // اطلاعات پایه
  title: 'رادیو تلویزیون هوشمند | انتشارات کیمیا',
  brand: 'انتشارات کیمیا',
  
  // داده‌های رادیو - لیست آهنگ‌ها
  radio: {
    tracks: [
      { id: 1, title: 'آهنگ اول - Ayrilik', file: 'images/Ayrilik_aleftab.ir.mp3', date: '۱۴۰۵/۵/۱۹' },
      { id: 2, title: 'آهنگ دوم - Careless Whisper', file: 'images/Careless Whisper2.mp3', date: '۱۴۰۵/۵/۱۹' }
    ]
  },
  
  // داده‌های تلویزیون - لیست ویدئوها
  tv: {
    videos: [
      { id: 1, title: 'ویدئوی طرح همگام‌سازی خدمات', file: 'images/ویدئوی همگام سازی .mp4' },
      { id: 2, title: 'ویدئوی کتاب هنر هوشمند نگاری ۲', file: 'images/ویدئوی هوشمند نگاری.mp4' }
    ]
  },
  
  // داده‌های آرشیو - لیست برنامه‌ها
  archive: {
    programs: [
      { id: 1, title: 'زندگینامه همایون صنعتی‌زاده', date: '۱۴۰۵/۵/۱۹' },
      { id: 2, title: 'موزه صنعت چاپ', date: '۱۴۰۵/۵/۱۹' },
      { id: 3, title: 'صنعت نشر و تکنولوژی POD', date: '۱۴۰۵/۵/۱۹' },
      { id: 4, title: 'ظرفیت صنعت چاپ در مسیر صادرات', date: '۱۴۰۵/۵/۱۹' },
      { id: 5, title: 'زندگینامه محمدرضا صافیان', date: '۱۴۰۵/۵/۱۹' },
      { id: 6, title: 'تاریخ کتاب و چاپ در تهران قدیم', date: '۱۴۰۵/۵/۱۹' }
    ]
  },
  
  // داده‌های گالری - لیست پوسترها
  gallery: {
    posters: [
      { id: 1, title: 'پوستر تبلیغاتی ۱', image: 'images/posterngo.png' },
      { id: 2, title: 'پوستر تبلیغاتی ۲', image: 'images/posterenava.png' },
      { id: 3, title: 'پوستر تبلیغاتی ۳', image: 'images/posterwork.png' },
      { id: 4, title: 'پوستر تبلیغاتی ۴', image: 'images/bestbooks.png' },
      { id: 5, title: 'پوستر تبلیغاتی ۵', image: 'images/bestclasick.png' },
      { id: 6, title: 'پوستر تبلیغاتی ۶', image: 'images/rezaeibooks.png' }
    ]
  },
  
  // تنظیمات تبلیغات
  ads: {
    slides: [
      { id: 1, title: 'چاپ و تبلیغات آریا', link: '#', image: 'images/logo.jpg' },
      { id: 2, title: 'چاپ دیجیتال سروش', link: '#', image: 'images/logo2.jpg' }
    ]
  }
};

console.log('✅ Config: بارگذاری شد');
