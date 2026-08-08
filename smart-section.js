// ===== بخش هوشمند گزینی و خوانی =====

// دریافت کلید از فایل تنظیمات
const CONFIG = window.CONFIG || {};

// تابع خلاصه‌سازی تستی
async function getAISummary(text) {
    console.log('📝 متن دریافت شد:', text.substring(0, 50) + '...');
    return 'این یک خلاصه‌ی آزمایشی است. متن شما با موفقیت دریافت شد.';
}

// نمایش اعلان
function showNotification(msg, type) {
    alert(msg); // برای تست ساده
}

// نمایش آثار
function displayWorks(works) {
    const container = document.getElementById('worksList');
    if (!container) return;
    container.innerHTML = works.map(item => 
        `<div class="work-item" onclick="alert('${item.summary}')">
            <h4>${item.title}</h4>
            <p>${item.summary.substring(0, 100)}...</p>
        </div>`
    ).join('');
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    const works = JSON.parse(localStorage.getItem('worksList') || '[]');
    displayWorks(works);
    
    // دکمه ارسال
    document.getElementById('showUploadFormBtn')?.addEventListener('click', function() {
        document.getElementById('uploadFormContainer').style.display = 'block';
        this.style.display = 'none';
    });
    
    // فرم ارسال
    document.getElementById('uploadForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const text = document.getElementById('userText').value;
        if (!email || !text) {
            alert('لطفاً ایمیل و متن را وارد کنید.');
            return;
        }
        const summary = await getAISummary(text);
        const works = JSON.parse(localStorage.getItem('worksList') || '[]');
        works.unshift({ title: 'متن کاربر', summary, email, date: new Date().toLocaleDateString('fa-IR') });
        localStorage.setItem('worksList', JSON.stringify(works));
        displayWorks(works);
        alert('✅ ارسال شد!');
        document.getElementById('uploadFormContainer').style.display = 'none';
        document.getElementById('showUploadFormBtn').style.display = 'inline-block';
        this.reset();
    });
});
