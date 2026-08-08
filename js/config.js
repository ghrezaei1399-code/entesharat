// js/config.js
window.CONFIG = {
    // این کلید از فایل محرمانه بارگذاری می‌شود
    // در صورتی که کلید در متغیر محیطی ENV قرار دارد، از آن استفاده کن
    OPENAI_API_KEY: window.ENV?.OPENAI_API_KEY || ''
};
