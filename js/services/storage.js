// ===== سرویس ذخیره‌سازی =====
const Storage = {
    // ذخیره داده
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('خطا در ذخیره:', e);
            return false;
        }
    },

    // بازیابی داده
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('خطا در بازیابی:', e);
            return defaultValue;
        }
    },

    // حذف داده
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('خطا در حذف:', e);
            return false;
        }
    },

    // پاک کردن همه داده‌ها
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('خطا در پاک کردن:', e);
            return false;
        }
    },

    // بررسی وجود داده
    has(key) {
        return localStorage.getItem(key) !== null;
    }
};

// صادر کردن برای استفاده در ماژول‌های دیگر
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
