// ===== ماژول تبلیغات =====
const AdsModule = {
    data: {
        left: [
            {
                name: 'چاپ و تبلیغات آریا',
                desc: 'برترین کانون تبلیغاتی با سابقه درخشان در حوزه چاپ و بسته‌بندی',
                link: 'https://aria-print.com',
                logo: '🖨️'
            },
            {
                name: 'چاپ دیجیتال سروش',
                desc: 'مرجع تخصصی چاپ دیجیتال، چاپ بنر و کاتالوگ',
                link: 'https://soroush-print.ir',
                logo: '📇'
            },
            {
                name: 'انتشارات کتابچین',
                desc: 'پیشرو در چاپ و نشر کتاب‌های آموزشی و دانشگاهی',
                link: 'https://ketabchin.ir',
                logo: '📘'
            }
        ],
        right: [
            {
                name: 'نشر چشمه',
                desc: 'پیشرو در ادبیات معاصر و شعر نو با بیش از سه دهه فعالیت',
                link: 'https://cheshmeh.ir',
                logo: '📖'
            },
            {
                name: 'نشر ققنوس',
                desc: 'قدیمی‌ترین ناشر ادبیات، فلسفه و تاریخ ایران با بیش از نیم قرن سابقه',
                link: 'https://ghoghnoospub.ir',
                logo: '📚'
            },
            {
                name: 'نشر نی',
                desc: 'برجسته در فلسفه، علوم اجتماعی و تاریخ با انتشار آثار کلاسیک',
                link: 'https://ney-pub.ir',
                logo: '📘'
            },
            {
                name: 'نشر ثالث',
                desc: 'ناشر برتر ادبیات داستانی و ترجمه با آثاری از نویسندگان مطرح جهان',
                link: 'https://salespub.ir',
                logo: '📕'
            }
        ]
    },
    page: {left: 0, right: 0},
    perPage: 2,

    render(side) {
        const container = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'List');
        if (!container) return;

        const ads = this.data[side] || [];
        const start = this.page[side] * this.perPage;
        const pageAds = ads.slice(start, start + this.perPage);

        if (pageAds.length === 0) {
            container.innerHTML = '<div class="ad-box" style="padding:20px;color:#7f8c8d;font-size:.8rem;text-align:center">هیچ تبلیغی ثبت نشده است.</div>';
        } else {
            container.innerHTML = pageAds.map(ad => `
                <div class="ad-box" style="padding:15px;margin-bottom:10px;border-bottom:1px solid #e8ddd0">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
                        <span style="font-size:2rem">${ad.logo || '📢'}</span>
                        <div>
                            <div style="font-size:.85rem;font-weight:700;color:#2d1b4e">${ad.name}</div>
                            <div style="font-size:.75rem;color:#7f8c8d;line-height:1.4">${ad.desc || ''}</div>
                        </div>
                    </div>
                    <a href="${ad.link || '#'}" target="_blank" class="ad-link" style="display:inline-block;margin-top:6px;padding:4px 16px;background:#6C5CE7;color:#fff;border-radius:20px;font-size:.7rem;text-decoration:none;transition:0.3s">
                        🌐 مشاهده و ارتباط با سایت
                    </a>
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
            alert('لطفاً نام تبلیغ را وارد کنید.');
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
        alert('✅ تبلیغ با موفقیت اضافه شد!');
    },

    renderMobile() {
        const container = document.getElementById('adMobileList');
        if (!container) return;

        const all = [...this.data.left, ...this.data.right];
        if (all.length === 0) {
            container.innerHTML = '<div style="color:#7f8c8d;font-size:.7rem;text-align:center;padding:10px">هیچ تبلیغی ثبت نشده است.</div>';
            return;
        }

        container.innerHTML = all.slice(0, 6).map(ad => `
            <div style="background:#fff;border-radius:12px;padding:12px;flex:1;min-width:120px;border:1px solid #d4a373;text-align:center">
                <span style="font-size:1.5rem;display:block">${ad.logo || '📢'}</span>
                <div style="font-size:.75rem;font-weight:700;color:#2d1b4e;margin:4px 0">${ad.name}</div>
                <a href="${ad.link || '#'}" target="_blank" style="font-size:.65rem;color:#6C5CE7;text-decoration:none">مشاهده سایت</a>
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
