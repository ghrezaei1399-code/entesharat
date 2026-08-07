// =====================================================
// smart-section.js - بخش هوشمند گزینی و خوانی
// =====================================================

// ---------- کلید API (از کاربر دریافت شده) ----------
const OPENAI_API_KEY = ''; // کلید از GitHub Secrets خوانده می‌شود

// ---------- شناسه‌های EmailJS (برای ارسال ایمیل) ----------
// (این مقادیر را بعداً از سایت EmailJS دریافت می‌کنید)
const EMAILJS_USER_ID = 'YOUR_USER_ID';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// =====================================================
// ۱. تابع خلاصه‌سازی با هوش مصنوعی
// =====================================================
async function getAISummary(text) {
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
                        content: `لطفاً متن زیر را بر اساس شاخص‌های فوق خلاصه کن:\n\n${text}` 
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('خطای OpenAI:', data.error);
            return 'متأسفانه خطایی در پردازش متن رخ داد. لطفاً دوباره تلاش کنید.';
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('خطا در خلاصه‌سازی:', error);
        return 'متأسفانه خطایی در پردازش متن رخ داد. لطفاً دوباره تلاش کنید.';
    }
}

// =====================================================
// ۲. تابع ارسال ایمیل (با EmailJS)
// =====================================================
function sendEmail(email, summary, title) {
    // ابتدا کتابخانه EmailJS را بارگذاری می‌کنیم
    if (typeof emailjs === 'undefined') {
        // اگر کتابخانه بارگذاری نشده، آن را از CDN می‌گیریم
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = function() {
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
        .then(function(response) {
            console.log('✅ ایمیل با موفقیت ارسال شد!', response);
        }, function(error) {
            console.error('❌ خطا در ارسال ایمیل:', error);
        });
}

// =====================================================
// ۳. مدیریت گنجینه آثار برگزیده (ذخیره در localStorage)
// =====================================================
function getWorksList() {
    return JSON.parse(localStorage.getItem('worksList') || '[]');
}

function saveWorksList(works) {
    localStorage.setItem('worksList', JSON.stringify(works));
}

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
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#7f8c8d;grid-column:1/-1">
                <i class="fas fa-inbox" style="font-size:3rem;display:block;margin-bottom:15px;color:#d4a373"></i>
                <p>هیچ اثری در گنجینه ثبت نشده است.</p>
                <p style="font-size:.85rem">اولین اثر خود را ارسال کنید تا در اینجا نمایش داده شود.</p>
            </div>
        `;
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
// ۴. نمایش جزئیات اثر در پنجره بازشو
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

// بستن با کلیک روی پس‌زمینه
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('workDetailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeWorkDetail();
            }
        });
    }
});

// =====================================================
// ۵. راه‌اندازی فرم ارسال
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    // نمایش آثار ذخیره‌شده
    const works = getWorksList();
    displayWorks(works);

    // ===== نمایش فرم با انیمیشن =====
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

    // ===== لغو و بستن فرم =====
    const cancelBtn = document.getElementById('cancelUploadBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const formContainer = document.getElementById('uploadFormContainer');
            const showBtn = document.getElementById('showUploadFormBtn');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            if (showBtn) {
                showBtn.style.display = 'inline-block';
            }
            document.getElementById('uploadForm').reset();
            const fileNameDisplay = document.getElementById('fileNameDisplay');
            if (fileNameDisplay) fileNameDisplay.style.display = 'none';
        });
    }

    // ===== انتخاب فایل با drag & drop =====
    const fileInput = document.getElementById('userFile');
    const fileDropArea = document.getElementById('fileDropArea');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    if (fileDropArea && fileInput) {
        fileDropArea.addEventListener('click', function() {
            fileInput.click();
        });

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
                if (fileInput.files[0] && fileNameDisplay) {
                    fileNameDisplay.textContent = '📎 ' + fileInput.files[0].name;
                    fileNameDisplay.style.display = 'block';
                }
            }
        });

        fileInput.addEventListener('change', function() {
            if (this.files[0] && fileNameDisplay) {
                fileNameDisplay.textContent = '📎 ' + this.files[0].name;
                fileNameDisplay.style.display = 'block';
            }
        });
    }

    // ===== ارسال فرم =====
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('userEmail')?.value;
            const file = document.getElementById('userFile')?.files[0];
            
            if (!email || !file) {
                alert('لطفاً ایمیل و فایل را وارد کنید.');
                return;
            }

            // بررسی حجم فایل
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB < 0.05) {
                alert('فایل ارسالی بسیار کوچک است. لطفاً فایلی با حداقل ۱۰ صفحه ارسال کنید.');
                return;
            }
            if (fileSizeInMB > 10) {
                alert('فایل ارسالی بسیار بزرگ است. لطفاً فایلی با حداکثر ۱۵۰ صفحه ارسال کنید.');
                return;
            }

            // نمایش پیام در حال پردازش
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال پردازش...';
            submitBtn.disabled = true;

            try {
                // خواندن محتوای فایل
                const reader = new FileReader();
                reader.onload = async function(e) {
                    const text = e.target.result;
                    
                    // خلاصه‌سازی با هوش مصنوعی
                    const summary = await getAISummary(text);
                    
                    // ذخیره در گنجینه
                    const title = file.name.replace(/\.[^/.]+$/, ''); // حذف پسوند
                    addToWorksList(title, summary, email);
                    
                    // ارسال ایمیل (اگر EmailJS تنظیم شده باشد)
                    if (EMAILJS_USER_ID !== 'YOUR_USER_ID') {
                        sendEmail(email, summary, title);
                    }
                    
                    // نمایش پیام موفقیت
                    document.getElementById('uploadFormContainer').style.display = 'none';
                    document.getElementById('successMessage').style.display = 'block';
                    document.getElementById('showUploadFormBtn').style.display = 'inline-block';
                    uploadForm.reset();
                    if (fileNameDisplay) fileNameDisplay.style.display = 'none';
                    
                    // اسکرول به پیام موفقیت
                    document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // بازنشانی دکمه
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // مخفی کردن پیام موفقیت بعد از ۶ ثانیه
                    setTimeout(() => {
                        document.getElementById('successMessage').style.display = 'none';
                    }, 6000);
                };
                reader.readAsText(file);
                
            } catch (error) {
                console.error('خطا:', error);
                alert('خطایی در پردازش فایل رخ داد. لطفاً دوباره تلاش کنید.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// =====================================================
// ۶. مقداردهی اولیه برای نمایش در صفحه
// =====================================================
console.log('✅ smart-section.js با موفقیت بارگذاری شد.');
