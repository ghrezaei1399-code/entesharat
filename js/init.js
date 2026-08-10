// ============================================================
// مقداردهی اولیه ماژول‌های اضافی
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ==============================
  // ۱. ماژول شخصی‌سازی (شب/روز، فونت)
  // ==============================
  if (typeof PersonalizeModule !== 'undefined') {
    PersonalizeModule.init();
    console.log('✅ PersonalizeModule: راه‌اندازی شد');
  } else {
    console.warn('⚠️ PersonalizeModule: پیدا نشد');
  }
  
  // ==============================
  // ۲. ماژول تبلیغات (فیلتر)
  // ==============================
  if (typeof AdsModule !== 'undefined') {
    AdsModule.init();
    console.log('✅ AdsModule: راه‌اندازی شد');
  } else {
    console.warn('⚠️ AdsModule: پیدا نشد');
  }
  
  // ==============================
  // ۳. ماژول تعامل (اسکرول بالا/پایین)
  // ==============================
  if (typeof InteractModule !== 'undefined') {
    InteractModule.init();
    console.log('✅ InteractModule: راه‌اندازی شد');
  } else {
    console.warn('⚠️ InteractModule: پیدا نشد');
  }
  
  // ==============================
  // ۴. ماژول هوشمند (امکانات دیگر)
  // ==============================
  if (typeof SmartModule !== 'undefined') {
    SmartModule.init();
    console.log('✅ SmartModule: راه‌اندازی شد');
  } else {
    console.warn('⚠️ SmartModule: پیدا نشد');
  }
  
  console.log('✅ همه‌ی ماژول‌ها: راه‌اندازی کامل شد');
});
