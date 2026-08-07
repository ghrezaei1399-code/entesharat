// =====================================================
// smart-section.js - بخش هوشمند گزینی و خوانی (نسخه نهایی)
// =====================================================

// ---------- کلید API (از GitHub Secrets خوانده می‌شود) ----------
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// ---------- شناسه‌های EmailJS ----------
const EMAILJS_USER_ID = 'YOUR_USER_ID';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// =====================================================
// ۱. توابع کمکی
// =====================================================
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        const div = document.createElement('div');
        div.id = 'notificationContainer';
        div.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;max-width:400px;width:100%';
        document.body.appendChild(div);
    }
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#e17055' : '#6C5CE7';
    notification.style.cssText = `background:${bgColor};color:#fff;padding:15px 20px;border-radius:12px;margin-bottom:10px;box-shadow:0 4px 20px rgba(0,0,0,0.15);font-family:tahoma;font-size:.95rem;animation:slideDown 0.3s ease;display:flex;align-items:center;gap:10px`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    document.getElementById('notificationContainer').appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        notification.style.transition = '0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getWorksList() {
    return JSON.parse(localStorage.getItem('worksList') || '[]');
}

function saveWorksList(works) {
    localStorage.setItem('worksList', JSON.stringify(works));
}

// =====================================================
// ۲. استخراج متن از لینک
// =====================================================
async function fetchTextFromURL(url) {
    try {
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('خطا در دریافت لینک');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyText = doc.body?.textContent || '';
        return bodyText.replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error('خطا در دریافت لینک:', error);
        throw new Error('لینک معتبر نیست یا قابل دسترسی نمی‌باشد.');
    }
}

// =====================================================
// ۳. خواندن فایل
// =====================================================
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

// =====================================================
// ۴. خلاصه‌سازی با هوش مصنوعی
// =====================================================
async function getAISummary(text) {
    if (!OPENAI_API_KEY) {
        throw new Error('کلید API تنظیم نشده است.');
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { 
                        role: 'system', 
                        content: `شما یک دستیار هوشمند هستید که متون را بر اساس شش شاخص اصلی خلاصه می‌کنید:
                        ۱. ارتباط با موضوع اصلی
                        ۲. زیبایی ادبی و فصاحت
                        ۳. تخصصی بودن محتوا
                        ۴. خلاقیت و ایده‌پردازی و نوآوری
                        ۵. مخاطب‌محوری و تأثیرگذاری
                        ۶. پویایی و انعطاف‌پذیری متن
                        خلاصه‌ای روان، منسجم و با حفظ نکات کلیدی تولید کنید.`
                    },
                    { 
                        role: 'user', 
                        content: `لطفاً متن زیر را بر اساس شاخص‌های فوق خلاصه کن:\n\n${text.substring(0, 15000)}` 
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error('خطا در خلاصه‌سازی:', error);
        throw new Error('خطا در پردازش متن توسط هوش مصنوعی.');
    }
}

// =====================================================
// ۵. ارسال ایمیل
// =====================================================
function sendEmail(email, summary, title) {
    if (EMAILJS_USER_ID === 'YOUR_USER_ID') {
        console.log('⚠️ EmailJS تنظیم نشده است.');
        return;
    }
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            emailjs.init(EMAILJS_USER_ID);
            sendEmailWithEmailJS(email, summary, title);
        };
        document.head.appendChild(script);
    } else {
        emailjs.init(EMAILJS_USER_ID);
        sendEmailWithEmailJS(email, summary, title);
    }
}

function sendEmailWithEmailJS(email, summary, title) {
    const templateParams = {
        to_email: email,
        summary_text: summary,
        title_text: title || 'خلاصه هوشمند',
        date: new Date().toLocaleDateString('fa-IR')
    };
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => console.log('✅ ایمیل ارسال شد'))
        .catch(err => console.error('❌ خطا در ارسال ایمیل:', err));
}

// =====================================================
// ۶. مدیریت گنجینه
// =====================================================
function addToWorksList(title, summary, email) {
    const works = getWorksList();
    works.unshift({
        id: Date.now(),
        title: title || 'اثر بدون عنوان',
        summary: summary,
        email: email || 'ناشناس',
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR')
    });
    saveWorksList(works);
    displayWorks(works);
}

function displayWorks(works) {
    const container = document.getElementById('worksList');
    if (!container) return;
    if (works.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:#7f8c8d;grid-column:1/-1">
            <i class="fas fa-inbox" style="font-size:3rem;display:block;margin-bottom:15px;color:#d4a373"></i>
            <p>هیچ اثری در گنجینه ثبت نشده است.</p>
            <p style="font-size:.85rem">اولین اثر خود را ارسال کنید تا در اینجا نمایش داده شود.</p>
        </div>`;
        return;
    }
    container.innerHTML = '';
    works.forEach(item => {
        const div = document.createElement('div');
        div.className = 'work-item';
        div.style.cssText = 'background:linear-gradient(135deg,#fff,#f8f4f0);border-radius:20px;padding:20px;border:2px solid #d4a373;cursor:pointer;transition:0.4s;box-shadow:0 4px 15px rgba(0,0,0,0.04)';
        div.onmouseover = function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 40px rgba(108,92,231,0.15)';
            this.style.borderColor = '#6C5CE7';
        };
        div.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';
            this.style.borderColor = '#d4a373';
        };
        div.onclick = function() { showWorkDetail(this); };
        const summaryPreview = item.summary.length > 120 ? item.summary.substring(0, 120) + '...' : item.summary;
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:start">
                <h4 style="color:#2d1b4e;font-size:1.1rem;margin-bottom:5px">📄 ${item.title}</h4>
                <span style="background:linear-gradient(135deg,#fdcb6e,#f39c12);color:#fff;padding:2px 12px;border-radius:50px;font-size:.7rem;font-weight:700">برگزیده</span>
            </div>
            <p style="color:#7f8c8d;font-size:.9rem;margin:8px 0;line-height:1.6">${summaryPreview}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
                <span style="color:#6C5CE7;font-size:.75rem"><i class="far fa-calendar-alt"></i> ${item.date}</span>
                <span style="color:#6C5CE7;font-size:.75rem"><i class="far fa-eye"></i> مشاهده خلاصه</span>
            </div>
        `;
        container.appendChild(div);
    });
}

// =====================================================
// ۷. نمایش جزئیات
// =====================================================
function showWorkDetail(element) {
    const title = element.querySelector('h4')?.textContent || 'بدون عنوان';
    const summary = element.querySelector('p')?.textContent || 'متن خلاصه در دسترس نیست.';
    const dateElement = element.querySelector('.work-item div:last-child span:first-child');
    const date = dateElement ? dateElement.textContent : 'تاریخ نامشخص';
    document.getElementById('detailTitle').textContent = title;
    document.getElementById('detailSummary').textContent = summary;
    document.getElementById('detailDate').textContent = '📅 ' + date;
    document.getElementById('workDetailModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeWorkDetail() {
    document.getElementById('workDetailModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// =====================================================
// ۸. مدیریت فرم و رویدادها
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    // نمایش آثار ذخیره‌شده
    displayWorks(getWorksList());

    // ---------- نمایش/مخفی کردن فرم ----------
    const showBtn = document.getElementById('showUploadFormBtn');
    if (showBtn) {
        showBtn.addEventListener('click', function() {
            const formContainer = document.getElementById('uploadFormContainer');
            if (formContainer) {
                formContainer.style.display = 'block';
                this.style.display = 'none';
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    const cancelBtn = document.getElementById('cancelUploadBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('uploadFormContainer').style.display = 'none';
            document.getElementById('showUploadFormBtn').style.display = 'inline-block';
            document.getElementById('uploadForm').reset();
            document.getElementById('fileNameDisplay').style.display = 'none';
            document.getElementById('userLink').style.display = 'none';
            document.getElementById('userText').style.display = 'none';
        });
    }

    // ---------- نمایش فیلدهای مربوط به هر روش ----------
    document.querySelectorAll('input[name="inputMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const fileInput = document.getElementById('userFile');
            const linkInput = document.getElementById('userLink');
            const textInput = document.getElementById('userText');
            const fileArea = document.getElementById('fileInputArea');
            
            fileInput.style.display = this.value === 'file' ? 'block' : 'none';
            fileArea.style.display = this.value === 'file' ? 'block' : 'none';
            linkInput.style.display = this.value === 'link' ? 'block' : 'none';
            textInput.style.display = this.value === 'text' ? 'block' : 'none';
            
            if (this.value === 'file') {
                fileInput.required = true;
                linkInput.required = false;
                textInput.required = false;
            } else if (this.value === 'link') {
                fileInput.required = false;
                linkInput.required = true;
                textInput.required = false;
            } else {
                fileInput.required = false;
                linkInput.required = false;
                textInput.required = true;
            }
        });
    });

    // ---------- انتخاب فایل ----------
    const fileInput = document.getElementById('userFile');
    const fileDropArea = document.getElementById('fileInputArea');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    if (fileDropArea && fileInput) {
        fileDropArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#6C5CE7';
            this.style.background = '#f0ecff';
        });
        fileDropArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#d4a373';
            this.style.background = 'transparent';
        });
        fileDropArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#d4a373';
            this.style.background = 'transparent';
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                if (fileInput.files[0]) {
                    fileNameDisplay.textContent = '📎 ' + fileInput.files[0].name;
                    fileNameDisplay.style.display = 'block';
                }
            }
        });
        fileInput.addEventListener('change', function() {
            if (this.files[0]) {
                fileNameDisplay.textContent = '📎 ' + this.files[0].name;
                fileNameDisplay.style.display = 'block';
            }
        });
    }

    // ---------- ارسال فرم ----------
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('userEmail').value;
            const method = document.querySelector('input[name="inputMethod"]:checked');
            if (!email) {
                showNotification('لطفاً ایمیل خود را وارد کنید.', 'error');
                return;
            }
            if (!method) {
                showNotification('لطفاً یک روش ارسال انتخاب کنید.', 'error');
                return;
            }

            let text = '';
            let title = '';

            try {
                // دریافت متن بر اساس روش انتخاب‌شده
                if (method.value === 'file') {
                    const file = document.getElementById('userFile').files[0];
                    if (!file) {
                        showNotification('لطفاً یک فایل انتخاب کنید.', 'error');
                        return;
                    }
                    if (file.size > 50 * 1024 * 1024) {
                        showNotification('حجم فایل بیشتر از ۵۰ مگابایت است.', 'error');
                        return;
                    }
                    title = file.name.replace(/\.[^/.]+$/, '');
                    text = await readFileAsText(file);
                    if (text.length < 50) {
                        showNotification('متن فایل بسیار کوتاه است یا قابل خواندن نیست.', 'error');
                        return;
                    }
               } else if (method.value === 'link') {
    const link = document.getElementById('userLink').value.trim();
    if (!link) {
        showNotification('لطفاً لینک را وارد کنید.', 'error');
        return;
    }
    title = 'مطلب از لینک';
    text = await fetchTextFromURL(link);
    if (text.length < 50) {
        showNotification('متن لینک بسیار کوتاه است یا قابل خواندن نیست.', 'error');
        return;
    }
} else if (method.value === 'text') {
    const textInput = document.getElementById('userText');
    text = textInput.value.trim();
    if (!text || text.length < 10) {
        showNotification('متن وارد شده بسیار کوتاه است.', 'error');
        return;
    }
    title = 'متن ارسالی کاربر';
}
