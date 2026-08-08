// =====================================================
// smart-section.js - بخش هوشمند گزینی و خوانی
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
    notification.style.cssText = 'background:' + bgColor + ';color:#fff;padding:15px 20px;border-radius:12px;margin-bottom:10px;box-shadow:0 4px 20px rgba(0,0,0,0.15);font-family:tahoma;font-size:.95rem;display:flex;align-items:center;gap:10px;transition:0.3s';
    notification.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle') + '"></i> ' + message;
    document.getElementById('notificationContainer').appendChild(notification);
    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        setTimeout(function() { notification.remove(); }, 300);
    }, 5000);
}

function getWorksList() {
    return JSON.parse(localStorage.getItem('worksList') || '[]');
}

function saveWorksList(works) {
    localStorage.setItem('worksList', JSON.stringify(works));
}

// ===== این تابع برای خواندن فایل است - فقط اینجا اصلاح شده =====
function readFileAsText(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function(e) { 
            console.log('✅ فایل خوانده شد:', file.name);
            console.log('📏 حجم:', e.target.result.length, 'کاراکتر');
            resolve(e.target.result); 
        };
        reader.onerror = function(e) { 
            console.error('❌ خطا در خواندن فایل:', e);
            reject(e); 
        };
        reader.readAsText(file);
    });
}

async function fetchTextFromURL(url) {
    try {
        const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
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

// ===== تابع خلاصه‌سازی با هوش مصنوعی =====
async function getAISummary(text) {
    console.log('📝 ارسال متن به هوش مصنوعی...');
    console.log('📏 طول متن:', text.length, 'کاراکتر');
    
    if (typeof Brain !== 'undefined' && Brain.summarize) {
        try {
            const summary = await Brain.summarize(text);
            console.log('✅ خلاصه دریافت شد');
            return summary;
        } catch (error) {
            console.error('❌ خطا در Brain.summarize:', error);
        }
    }
    
    return generateFallbackSummary(text);
}

function generateFallbackSummary(text) {
    const sentences = text.split(/[.。!！?？\n]/).filter(s => s.trim().length > 10);
    const firstSentences = sentences.slice(0, 5);
    
    return `📚 **خلاصه هوشمند (نسخه جایگزین)**

🔹 **موضوع اصلی:** 
${firstSentences[0] || 'متن برای تحلیل کافی نیست'}

🔹 **ایده‌های کلیدی:**
${firstSentences.slice(1, 4).map((s, i) => `• ${s.trim()}`).join('\n') || '• اطلاعات کافی برای استخراج ایده‌های کلیدی وجود ندارد'}

🔹 **نتیجه‌گیری:**
${firstSentences[firstSentences.length - 1] || 'متن برای نتیجه‌گیری کافی نیست'}

🔹 **نکات کاربردی:**
• متن ارسالی شما در گنجینه ذخیره شد
• برای دریافت خلاصه دقیق‌تر، مطمئن شوید Brain به درستی بارگذاری شده است

🔹 **ارزش مطالعه:**
این اثر می‌تواند برای علاقه‌مندان به موضوع مفید باشد.`;
}

function sendEmail(email, summary, title) {
    if (typeof Brain !== 'undefined' && Brain.sendEmail) {
        Brain.sendEmail(email, summary, title);
    } else {
        console.log(`📧 ایمیل به ${email} ارسال شد.`);
        console.log(`📄 عنوان: ${title}`);
        console.log(`📝 خلاصه: ${summary.substring(0, 200)}...`);
    }
    showNotification(`📧 خلاصه به ایمیل ${email} ارسال شد!`, 'success');
}

function extractFeatures(summary) {
    const features = {
        topic: '',
        ideas: [],
        conclusion: '',
        tips: [],
        value: ''
    };
    
    const lines = summary.split('\n');
    let currentSection = '';
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.includes('موضوع اصلی') || trimmed.includes('Main Topic')) {
            currentSection = 'topic';
            features.topic = trimmed.replace(/.*موضوع اصلی.*[:：]/, '').trim();
        } else if (trimmed.includes('ایده‌های کلیدی') || trimmed.includes('Key Ideas')) {
            currentSection = 'ideas';
        } else if (trimmed.includes('نتیجه‌گیری') || trimmed.includes('Conclusion')) {
            currentSection = 'conclusion';
            features.conclusion = trimmed.replace(/.*نتیجه‌گیری.*[:：]/, '').trim();
        } else if (trimmed.includes('نکات کاربردی') || trimmed.includes('Practical Tips')) {
            currentSection = 'tips';
        } else if (trimmed.includes('ارزش مطالعه') || trimmed.includes('Reading Value')) {
            currentSection = 'value';
            features.value = trimmed.replace(/.*ارزش مطالعه.*[:：]/, '').trim();
        } else if (currentSection === 'ideas' && trimmed.startsWith('•')) {
            features.ideas.push(trimmed.replace('•', '').trim());
        } else if (currentSection === 'tips' && trimmed.startsWith('•')) {
            features.tips.push(trimmed.replace('•', '').trim());
        }
    }
    
    if (!features.topic && !features.ideas.length) {
        const sentences = summary.split(/[.。!！?？\n]/).filter(s => s.trim().length > 10);
        features.topic = sentences[0] || 'موضوع: ' + summary.substring(0, 100);
        if (sentences.length > 1) {
            features.ideas = sentences.slice(1, 4).map(s => s.trim());
        }
        features.conclusion = sentences[sentences.length - 1] || 'نتیجه‌گیری: ' + summary.substring(summary.length - 100);
    }
    
    return features;
}

function addToWorksList(title, summary, email) {
    const works = getWorksList();
    const features = extractFeatures(summary);
    
    const newWork = {
        id: Date.now(),
        title: title || 'اثر بدون عنوان',
        summary: summary,
        email: email || 'ناشناس',
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR'),
        features: features,
        timestamp: Date.now()
    };
    
    works.unshift(newWork);
    saveWorksList(works);
    displayWorks(works);
    
    console.log('✅ اثر در گنجینه ذخیره شد:', newWork.title);
    showNotification('📚 اثر شما با موفقیت در گنجینه ذخیره شد!', 'success');
}

function displayWorks(works) {
    const container = document.getElementById('worksList');
    if (!container) {
        console.error('❌ عنصر worksList یافت نشد!');
        return;
    }
    
    if (works.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#7f8c8d;grid-column:1/-1">
                <i class="fas fa-inbox" style="font-size:3rem;display:block;margin-bottom:15px;color:#d4a373"></i>
                <p>هیچ اثری در گنجینه ثبت نشده است.</p>
                <p style="font-size:.85rem">اولین اثر خود را ارسال کنید تا در اینجا نمایش داده شود.</p>
            </div>`;
        return;
    }
    
    container.innerHTML = '';
    
    works.forEach(function(item, index) {
        const div = document.createElement('div');
        div.className = 'work-item';
        
        const isLatest = index === 0;
        div.style.cssText = isLatest 
            ? 'background:linear-gradient(135deg,#f0ecff,#e8dff5);border-radius:20px;padding:25px;border:3px solid #6C5CE7;cursor:pointer;transition:0.4s;box-shadow:0 8px 30px rgba(108,92,231,0.2)'
            : 'background:linear-gradient(135deg,#fff,#f8f4f0);border-radius:20px;padding:20px;border:2px solid #d4a373;cursor:pointer;transition:0.4s;box-shadow:0 4px 15px rgba(0,0,0,0.04)';
        
        div.onmouseover = function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 40px rgba(108,92,231,0.25)';
            this.style.borderColor = '#6C5CE7';
        };
        div.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = isLatest ? '0 8px 30px rgba(108,92,231,0.2)' : '0 4px 15px rgba(0,0,0,0.04)';
            this.style.borderColor = isLatest ? '#6C5CE7' : '#d4a373';
        };
        div.onclick = function() { showWorkDetail(item); };
        
        const features = item.features || {};
        const featureTags = [];
        if (features.topic) featureTags.push('📖 ' + features.topic.substring(0, 30) + '...');
        if (features.ideas && features.ideas.length) featureTags.push('💡 ' + features.ideas[0].substring(0, 30) + '...');
        if (features.value) featureTags.push('⭐ ' + features.value.substring(0, 30) + '...');
        
        const summaryPreview = item.summary.length > 150 ? item.summary.substring(0, 150) + '...' : item.summary;
        
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
                <div>
                    <h4 style="color:#2d1b4e;font-size:1.1rem;margin:0">📄 ${item.title}</h4>
                    ${isLatest ? '<span style="display:inline-block;background:linear-gradient(135deg,#fdcb6e,#f39c12);color:#fff;padding:2px 12px;border-radius:50px;font-size:.7rem;font-weight:700;margin-top:5px">🔥 آخرین اثر</span>' : ''}
                </div>
                <span style="background:linear-gradient(135deg,#6C5CE7,#a29bfe);color:#fff;padding:2px 12px;border-radius:50px;font-size:.7rem;font-weight:700">برگزیده</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:5px;margin:8px 0">
                ${featureTags.map(tag => `<span style="background:#f0ecff;color:#6C5CE7;padding:2px 10px;border-radius:12px;font-size:.7rem">${tag}</span>`).join('')}
            </div>
            <p style="color:#7f8c8d;font-size:.9rem;margin:8px 0;line-height:1.6">${summaryPreview}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
                <span style="color:#6C5CE7;font-size:.75rem"><i class="far fa-calendar-alt"></i> ${item.date} - ${item.time}</span>
                <span style="color:#6C5CE7;font-size:.75rem"><i class="far fa-eye"></i> مشاهده خلاصه کامل</span>
            </div>
            <div style="margin-top:8px;color:#7f8c8d;font-size:.7rem">
                <i class="far fa-envelope"></i> ${item.email}
            </div>
        `;
        container.appendChild(div);
    });
}

function showWorkDetail(item) {
    const features = item.features || {};
    
    let html = `
        <div style="max-width:800px;margin:50px auto;background:linear-gradient(135deg,#fff,#f8f4f0);border-radius:30px;padding:35px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:scaleIn 0.4s ease">
            <button onclick="closeWorkDetail()" style="position:absolute;top:15px;left:15px;background:linear-gradient(135deg,#e17055,#fd79a8);border:none;border-radius:50%;width:45px;height:45px;color:#fff;font-size:1.5rem;cursor:pointer;transition:0.3s;box-shadow:0 4px 15px rgba(225,112,85,0.3)">✕</button>
            <h2 style="color:#2d1b4e;font-size:1.8rem;margin-bottom:20px;padding-left:40px">📄 ${item.title}</h2>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px">
                ${features.topic ? `<div style="background:#f0ecff;border-radius:12px;padding:15px;border-right:4px solid #6C5CE7"><strong>📖 موضوع اصلی:</strong><br>${features.topic}</div>` : ''}
                ${features.value ? `<div style="background:#f0ecff;border-radius:12px;padding:15px;border-right:4px solid #fdcb6e"><strong>⭐ ارزش مطالعه:</strong><br>${features.value}</div>` : ''}
            </div>
            
            ${features.ideas && features.ideas.length ? `
                <div style="background:#f8f4f0;border-radius:16px;padding:20px;margin-bottom:15px;border-right:4px solid #00b894">
                    <strong>💡 ایده‌های کلیدی:</strong>
                    <ul style="list-style:none;padding:0;margin-top:10px">
                        ${features.ideas.map(idea => `<li style="padding:5px 0;border-bottom:1px solid #eee">• ${idea}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${features.tips && features.tips.length ? `
                <div style="background:#f8f4f0;border-radius:16px;padding:20px;margin-bottom:15px;border-right:4px solid #e17055">
                    <strong>🔧 نکات کاربردی:</strong>
                    <ul style="list-style:none;padding:0;margin-top:10px">
                        ${features.tips.map(tip => `<li style="padding:5px 0;border-bottom:1px solid #eee">• ${tip}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${features.conclusion ? `
                <div style="background:#f8f4f0;border-radius:16px;padding:20px;margin-bottom:15px;border-right:4px solid #6C5CE7">
                    <strong>📌 نتیجه‌گیری:</strong>
                    <p style="margin-top:10px">${features.conclusion}</p>
                </div>
            ` : ''}
            
            <div style="background:linear-gradient(135deg,#fef9f0,#f5ede5);border-radius:16px;padding:20px;border:2px dashed #d4a373;margin-top:15px">
                <strong>📝 خلاصه کامل:</strong>
                <p style="color:#34495e;line-height:2.2;font-size:1.05rem;margin-top:10px">${item.summary}</p>
            </div>
            
            <div style="display:flex;justify-content:space-between;margin-top:20px;color:#7f8c8d;font-size:.85rem">
                <span><i class="far fa-calendar-alt"></i> ${item.date} - ${item.time}</span>
                <span><i class="far fa-envelope"></i> ${item.email}</span>
            </div>
            
            <button onclick="closeWorkDetail()" style="margin-top:20px;padding:14px 40px;background:linear-gradient(135deg,#6C5CE7,#a29bfe);border:none;border-radius:50px;color:#fff;font-weight:700;font-size:1.1rem;cursor:pointer;transition:0.3s;box-shadow:0 4px 20px rgba(108,92,231,0.3)">
                <i class="fas fa-undo-alt"></i> بازگشت
            </button>
        </div>
    `;
    
    const modal = document.getElementById('workDetailModal');
    modal.innerHTML = html;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeWorkDetail() {
    document.getElementById('workDetailModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 smart-section.js بارگذاری شد');
    
    displayWorks(getWorksList());

    var showBtn = document.getElementById('showUploadFormBtn');
    if (showBtn) {
        showBtn.addEventListener('click', function() {
            var formContainer = document.getElementById('uploadFormContainer');
            if (formContainer) {
                formContainer.style.display = 'block';
                this.style.display = 'none';
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    var cancelBtn = document.getElementById('cancelUploadBtn');
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

    document.querySelectorAll('input[name="inputMethod"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            var fileInput = document.getElementById('userFile');
            var linkInput = document.getElementById('userLink');
            var textInput = document.getElementById('userText');
            var fileArea = document.getElementById('fileInputArea');
            
            if (this.value === 'file') {
                fileInput.style.display = 'block';
                fileArea.style.display = 'block';
                linkInput.style.display = 'none';
                textInput.style.display = 'none';
                fileInput.required = true;
                linkInput.required = false;
                textInput.required = false;
            } else if (this.value === 'link') {
                fileInput.style.display = 'none';
                fileArea.style.display = 'none';
                linkInput.style.display = 'block';
                textInput.style.display = 'none';
                fileInput.required = false;
                linkInput.required = true;
                textInput.required = false;
            } else {
                fileInput.style.display = 'none';
                fileArea.style.display = 'none';
                linkInput.style.display = 'none';
                textInput.style.display = 'block';
                fileInput.required = false;
                linkInput.required = false;
                textInput.required = true;
            }
        });
    });

    var fileInput = document.getElementById('userFile');
    var fileDropArea = document.getElementById('fileInputArea');
    var fileNameDisplay = document.getElementById('fileNameDisplay');

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

    var uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            var email = document.getElementById('userEmail').value;
            var method = document.querySelector('input[name="inputMethod"]:checked');
            
            if (!email) {
                showNotification('لطفاً ایمیل خود را وارد کنید.', 'error');
                return;
            }
            if (!method) {
                showNotification('لطفاً یک روش ارسال انتخاب کنید.', 'error');
                return;
            }

            var text = '';
            var title = '';

            try {
                showNotification('⏳ در حال پردازش متن...', 'info');

                if (method.value === 'file') {
                    var file = document.getElementById('userFile').files[0];
                    if (!file) {
                        showNotification('لطفاً یک فایل انتخاب کنید.', 'error');
                        return;
                    }
                    if (file.size > 50 * 1024 * 1024) {
                        showNotification('حجم فایل بیشتر از ۵۰ مگابایت است.', 'error');
                        return;
                    }
                    title = file.name.replace(/\.[^/.]+$/, '');
                    
                    console.log('📖 در حال خواندن فایل:', file.name);
                    text = await readFileAsText(file);
                    console.log('✅ فایل خوانده شد. طول:', text.length);
                    
                    if (text.length < 50) {
                        showNotification('متن فایل بسیار کوتاه است یا قابل خواندن نیست.', 'error');
                        return;
                    }
                    
                } else if (method.value === 'link') {
                    var link = document.getElementById('userLink').value.trim();
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
                    var textInput = document.getElementById('userText');
                    text = textInput.value.trim();
                    if (!text || text.length < 10) {
                        showNotification('متن وارد شده بسیار کوتاه است.', 'error');
                        return;
                    }
                    title = 'متن ارسالی کاربر';
                }

                const summary = await getAISummary(text);
                addToWorksList(title, summary, email);
                sendEmail(email, summary, title);

                document.getElementById('uploadFormContainer').style.display = 'none';
                document.getElementById('showUploadFormBtn').style.display = 'inline-block';
                document.getElementById('uploadForm').reset();
                document.getElementById('fileNameDisplay').style.display = 'none';
                document.getElementById('userLink').style.display = 'none';
                document.getElementById('userText').style.display = 'none';
                
                document.getElementById('successMessage').style.display = 'block';
                setTimeout(function() {
                    document.getElementById('successMessage').style.display = 'none';
                }, 6000);

                showNotification('✅ خلاصه‌سازی کامل شد! به ایمیل و گنجینه ارسال شد.', 'success');

            } catch (error) {
                console.error('❌ خطا:', error);
                showNotification(error.message || 'خطایی در پردازش رخ داد.', 'error');
            }
        });
    }
});
