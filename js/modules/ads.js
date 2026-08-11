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

    escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&':'&amp;',
            '<':'&lt;',
            '>':'&gt;',
            '"':'&quot;',
            "'":'&#039;'
        }[char]));
    },

    safeUrl(value) {
        const url = String(value ?? '').trim();
        if (!url || url === '#') return '#';

        try {
            const parsed = new URL(url, window.location.href);

            return ['http:', 'https:'].includes(parsed.protocol)
                ? parsed.href
                : '#';
        } catch {
            return '#';
        }
    },

    card(ad) {
        const name = this.escapeHtml(ad.name || 'تبلیغ');
        const desc = this.escapeHtml(ad.desc || '');
        const logo = this.escapeHtml(ad.logo || '📢');
        const link = this.safeUrl(ad.link);

        return `
            <article class="ad-box">
                <span class="ad-logo" aria-hidden="true">${logo}</span>

                <div class="ad-name">${name}</div>

                ${desc ? `<div class="ad-desc">${desc}</div>` : ''}

                <a href="${this.escapeHtml(link)}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="ad-link"
                   aria-label="مشاهده ${name}">
                    <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                    مشاهده و ارتباط
                </a>
            </article>
        `;
    },

    render(side) {
        const prefix = side.charAt(0).toUpperCase() + side.slice(1);
        const container = document.getElementById(`ad${prefix}List`);

        if (!container) return;

        const ads = this.data[side] || [];
        const total = Math.max(1, Math.ceil(ads.length / this.perPage));

        this.page[side] = Math.max(
            0,
            Math.min(total - 1, this.page[side])
        );

        const start = this.page[side] * this.perPage;
        const pageAds = ads.slice(start, start + this.perPage);

        container.innerHTML = pageAds.length
            ? pageAds.map(ad => this.card(ad)).join('')
            : `
                <div class="ad-box">
                    <div class="ad-desc">
                        هنوز تبلیغی ثبت نشده است.
                    </div>
                </div>
            `;

        const pageNum = document.getElementById(`ad${prefix}PageNum`);

        if (pageNum) {
            pageNum.textContent = `${this.page[side] + 1} از ${total}`;
        }
    },

    changePage(side, delta) {
        const total = Math.max(
            1,
            Math.ceil((this.data[side] || []).length / this.perPage)
        );

        this.page[side] = Math.max(
            0,
            Math.min(total - 1, this.page[side] + delta)
        );

        this.render(side);
        this.renderMobile();
    },

    addAd(side) {
        const prefix = side.charAt(0).toUpperCase() + side.slice(1);

        const input = document.getElementById(`ad${prefix}Input`);
        const link = document.getElementById(`ad${prefix}Link`);

        if (!input || !input.value.trim()) {
            alert('لطفاً نام تبلیغ را وارد کنید.');
            return;
        }

        this.data[side].push({
            name: input.value.trim(),
            desc: 'تبلیغ جدید',
            link: link?.value.trim() || '#',
            logo: '📢'
        });

        input.value = '';

        if (link) {
            link.value = '';
        }

        this.page[side] = Math.max(
            0,
            Math.ceil(this.data[side].length / this.perPage) - 1
        );

        this.render(side);
        this.renderMobile();

        alert('✅ تبلیغ با موفقیت اضافه شد!');
    },

    renderMobile() {
        const container = document.getElementById('adMobileList');

        if (!container) return;

        const all = [
            ...this.data.left,
            ...this.data.right
        ];

        if (!all.length) {
            container.innerHTML = `
                <div class="ad-item">
                    <div class="ad-desc">
                        هنوز تبلیغی ثبت نشده است.
                    </div>
                </div>
            `;

            return;
        }

        container.innerHTML = all
            .slice(0, 8)
            .map(ad =>
                this.card(ad)
                    .replace(
                        'class="ad-box"',
                        'class="ad-item"'
                    )
            )
            .join('');
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
