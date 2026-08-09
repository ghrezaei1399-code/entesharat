// ===== سرویس خواندن فایل =====
const FileReaderService = {
    // خواندن فایل متنی
    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    // خواندن فایل PDF (با PDF.js)
    async readPDFFile(file) {
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('کتابخانه PDF.js بارگذاری نشده است.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';
                    
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }
                    
                    resolve(fullText.trim());
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    // خواندن فایل Word (با Mammoth)
    async readWordFile(file) {
        if (typeof mammoth === 'undefined') {
            throw new Error('کتابخانه Mammoth بارگذاری نشده است.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                    resolve(result.value.trim());
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    // تشخیص نوع فایل و خواندن آن
    async readFile(file) {
        const fileName = file.name.toLowerCase();
        console.log('📖 خواندن فایل:', file.name);
        console.log('📏 حجم:', (file.size / 1024).toFixed(2), 'KB');

        try {
            if (fileName.endsWith('.pdf')) {
                return await this.readPDFFile(file);
            } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
                return await this.readWordFile(file);
            } else if (fileName.endsWith('.txt')) {
                return await this.readTextFile(file);
            } else {
                throw new Error('فرمت فایل پشتیبانی نمی‌شود. فقط PDF، Word و TXT قابل قبول هستند.');
            }
        } catch (error) {
            console.error('❌ خطا در خواندن فایل:', error);
            throw error;
        }
    },

    // دریافت متن از لینک
    async fetchFromURL(url) {
        try {
            console.log('🔗 دریافت از لینک:', url);
            const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
            if (!response.ok) throw new Error('خطا در دریافت لینک');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body?.textContent?.replace(/\s+/g, ' ').trim() || '';
        } catch (error) {
            console.error('❌ خطا در دریافت لینک:', error);
            throw new Error('لینک معتبر نیست یا قابل دسترسی نمی‌باشد.');
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileReaderService;
}
