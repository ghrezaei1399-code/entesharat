// ===== ماژول تبلیغات =====
const AdsModule = {
    data: {
        // سمت چپ: تبلیغات همکاران حوزه چاپ
        left: [
            {
                name: 'چاپ گرافیت',
                desc: 'کانون تبلیغاتی معتبر | چاپ بنر، کاتالوگ، بسته‌بندی',
                link: 'https://graphit-print.com',
                logo: '🖨️'
            },
            {
                name: 'چاپ ایما',
                desc: 'بزرگترین مجموعه چاپ دیجیتال شرق کشور',
                link: 'https://ima-print.com',
                logo: '📇'
            },
            {
                name: 'انتشارات طلوع مجد',
                desc: 'چاپ کتاب، صفحه‌آرایی، طراحی جلد و تبلیغات',
                link: 'https://tolouemajd.ir',
                logo: '📘'
            },
            {
                name: 'چاپخانه رهام',
                desc: 'چاپ افست و دیجیتال با کیفیت بالا',
                link: 'https://roham-print.ir',
                logo: '📰'
            }
        ],
        // سمت راست: تبلیغات همکاران نشر
        right: [
            {
                name: 'نشر ققنوس',
                desc: 'قدیمی‌ترین ناشر ادبیات، فلسفه و تاریخ ایران',
                link: 'https://ghoghnoospub.ir',
                logo: '📚'
            },
            {
                name: 'نشر چشمه',
                desc: 'پیشرو در ادبیات معاصر و شعر نو',
                link: 'https://cheshmeh.ir',
                logo: '📖'
            },
            {
                name: 'نشر ثالث',
                desc: 'ناشر برتر ادبیات داستانی و ترجمه',
                link: 'https://salespub.ir',
                logo: '📕'
            },
            {
                name: 'نشر مرکز',
                desc: 'معتبر در ادبیات فارسی و علوم انسانی',
                link: 'https://markazpub.ir',
                logo: '📗'
            },
            {
                name: 'نشر قطره',
                desc: 'فعال در ادبیات، روانشناسی و کتاب‌های آموزشی',
                link: 'https://ghatreh.com',
                logo: '📙'
            },
            {
                name: 'نشر نی',
                desc: 'برجسته در فلسفه، علوم اجتماعی و تاریخ',
                link: 'https://ney-pub.ir',
                logo: '📘'
            },
            {
                name: 'انتشارات فروغ سیمرغ',
                desc: 'ناشر ادبیات کلاسیک و معاصر فارسی',
                link: 'https://forughsimorgh.ir',
                logo: '🦅'
            }
        ]
    },
    page: {left: 0, right: 0},
    perPage: 3,

    render(side) {
        const container = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'List');
        if (!container) return;

        const sideName = side === 'left' ? 'چاپ' : 'نشر';
        const ads = this.data[side] || [];
        const start = this.page[side] * this.perPage;
        const pageAds = ads.slice(start, start + this.perPage);

        if (pageAds.length === 0) {
            container.innerHTML = '<div class="ad-box" style="padding:15px;color:#7f8c8d;font-size:.7rem">هیچ تبلیغی ثبت نشده است.</div>';
        } else {
            container.innerHTML = pageAds.map(ad => `
                <div class="ad-box">
                    <span class="ad-logo">${ad.logo || '📢'}</span>
                    <div class="ad-name">${ad.name}</div>
                    <div class="ad-desc">${ad.desc || ''}</div>
                    <a href="${ad.link || '#'}" target="_blank" class="ad-link">مشاهده سایت</a>
                </div>
            `).join('');
        }

        const pageNum = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'PageNum');
        if (pageNum) {
            const total = Math.max(1, Math.ceil(ads.length / this.perPage));
            pageNum.textContent = (this.page[side] + 1) + ' از ' + total;
        }
    },

    changePage(side, delta) {
        const total = Math.max(1, Math.ceil((this.data[side] || []).length / this.perPage));
        this.page[side] = Math.max(0, Math.min(total - 1, this.page[side] + delta));
        this.render(side);
        this.renderMobile();
    },

    addAd(side) {
        const input = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'Input');
        const link = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'Link');

        if (!input || !input.value.trim()) {
            Core.showNotification('لطفاً نام تبلیغ را وارد کنید.', 'error');
            return;
        }

        this.data[side].push({
            name: input.value.trim(),
            desc: 'تبلیغ جدید',
            link: link.value.trim() || '#',
            logo: '📢'
        });

        input.value = '';
        if (link) link.value = '';
        this.render(side);
        this.renderMobile();
        Core.showNotification('✅ تبلیغ با موفقیت اضافه شد!', 'success');
    },

    renderMobile() {
        const container = document.getElementById('adMobileList');
        if (!container) return;

        const all = [...this.data.left, ...this.data.right];
        if (all.length === 0) {
            container.innerHTML = '<div style="color:#7f8c8d;font-size:.7rem">هیچ تبلیغی ثبت نشده است.</div>';
            return;
        }

        container.innerHTML = all.slice(0, 6).map(ad => `
            <div style="background:#fff;border-radius:10px;padding:8px;flex:1;min-width:100px;border:1px solid #e8ddd0;text-align:center">
                <span style="font-size:1.2rem">${ad.logo || '📢'}</span>
                <div style="font-size:.65rem;font-weight:700;color:#2d1b4e">${ad.name}</div>
                <a href="${ad.link || '#'}" target="_blank" style="font-size:.55rem;color:#6C5CE7">مشاهده</a>
            </div>
        `).join('');
    },

    init() {
        this.render('left');
        this.render('right');
        this.renderMobile();
        console.log('✅ AdsModule فعال شد');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdsModule;
}
