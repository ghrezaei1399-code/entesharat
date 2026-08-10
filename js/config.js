// ============================================================
// پیکربندی مرکزی رادیو تلویزیون هوشمند انتشارات کیمیا
// ============================================================

window.APP_CONFIG = {
  // اطلاعات پایه
  title: 'رادیو تلویزیون هوشمند | انتشارات کیمیا',
  brand: 'انتشارات کیمیا',
  
  // داده‌های رادیو (ویس‌ها)
  radio: {
    tracks: [
      { id: 1, title: 'آهنگ اول - Ayrilik', file: 'images/Ayrilik_aleftab.ir.mp3', date: '۱۴۰۵/۵/۱۹' },
      { id: 2, title: 'آهنگ دوم - Careless Whisper', file: 'images/Careless Whisper2.mp3', date: '۱۴۰۵/۵/۱۹' }
    ]
  },
  
  // داده‌های تلویزیون (ویدیوها)
  tv: {
  videos: [
    { id: 1, title: 'ویدئوی طرح همگام‌سازی خدمات', file: 'images/video1.mp4' },
    { id: 2, title: 'ویدئوی کتاب هنر هوشمند نگاری ۲', file: 'images/video2.mp4' }
  ]
},
  
  // داده‌های آرشیو
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
  
  // داده‌های گالری پوستر
  gallery: {
    posters: [
      { id: 1, title: 'پوستر تبلیغاتی ۱', image: 'images/bestclasick.png' },
      { id: 2, title: 'پوستر تبلیغاتی ۲', image: 'images/nafis.png' },
      { id: 3, title: 'پوستر تبلیغاتی ۳', image: 'images/rezaeibooks.png' },
      { id: 4, title: 'پوستر تبلیغاتی ۴', image: 'images/litografi.png' },
      { id: 5, title: 'پوستر تبلیغاتی ۵', image: 'images/bestbooks.png' },
      { id: 6, title: 'پوستر تبلیغاتی ۶', image: 'images/bestbooks2.png' }
    ]
  },
  
  // داده‌های تبلیغات دو طرف (چپ و راست)
  ads: {
    chap: [
      { id: 1, name: 'چاپ و تبلیغات آریا', logo: '🖨️', link: '#' },
      { id: 2, name: 'چاپ دیجیتال سروش', logo: '📇', link: '#' }
    ],
    nashr: [
      { id: 1, name: 'نشر چشمه', logo: '📖', link: '#' },
      { id: 2, name: 'نشر ققنوس', logo: '📚', link: '#' }
    ]
  }
};

console.log('✅ Config: بارگذاری شد');
