/* =========================================================
   ENTESHARAT - ADS MODULE
   ========================================================= */

const AdsModule = {

    data: {
        left: [
            {
                name: 'چاپ و تبلیغات آریا',
                desc: 'خدمات چاپ، تبلیغات و بسته‌بندی',
                link: 'https://aria-print.com',
                logo: '🖨️'
            },
            {
                name: 'چاپ دیجیتال سروش',
                desc: 'چاپ دیجیتال، لیبل و محصولات چاپی',
                link: 'https://soroushprint.com',
                logo: '📇'
            },
            {
                name: 'انتشارات کتابچین',
                desc: 'چاپ و نشر کتاب‌های آموزشی و دانشگاهی',
                link: 'https://ketabchin.ir',
                logo: '📘'
            }
        ],

        right: [
            {
                name: 'نشر چشمه',
                desc: 'ادبیات معاصر، شعر و داستان',
                link: 'https://cheshmeh.ir',
                logo: '📖'
            },
            {
                name: 'نشر ققنوس',
                desc: 'ادبیات، فلسفه، تاریخ و علوم انسانی',
                link: 'https://ghoghnoospub.ir',
                logo: '📚'
            },
            {
                name: 'نشر نی',
                desc: 'فلسفه، علوم اجتماعی و تاریخ',
                link: 'https://ney-pub.ir',
                logo: '📘'
            },
            {
                name: 'نشر ثالث',
                desc: 'ادبیات داستانی و ترجمه',
                link: 'https://salespub.ir',
                logo: '📕'
            }
        ]
    },

    page: {
        left: 0,
        right: 0
    },

    perPage: 2,

    escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[char]));
    },

    safeUrl(value) {
        try {
            const url = new URL(String(value || '').trim());

            if (
                url.protocol === 'http:' ||
                url.protocol === 'https:'
            ) {
                return url.href;
            }
        } catch (error) {}

        return '';
    },

    createCard(ad, mobile = false) {

        const name = this.escapeHtml(ad.name);
        const desc = this.escapeHtml(ad.desc);
        const logo = this.escapeHtml(ad.logo);

        const link = this.safeUrl(ad.link);

        return `
            <article class="${mobile ? 'ad-item' : 'ad-box'}">

                <div class="ad-logo">
                    ${logo}
                </div>

                <div class="ad-name">
                    ${name}
                </div>

                <div class="ad-desc">
                    ${desc}
                </div>

                ${
                    link
                    ? `
                        <a
                            class="ad-link"
                            href="${this.escapeHtml(link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="fas fa-external-link-alt"></i>
                            مشاهده سایت
                        </a>
                      `
                    : ''
                }

            </article>
        `;
    },

    render(side) {

        const prefix =
            side.charAt(0).toUpperCase() + side.slice(1);

        const container =
            document.getElementById(`ad${prefix}List`);

        if (!container) return;

        const ads = this.data[side] || [];

        const totalPages =
            Math.max(
                1,
                Math.ceil(ads.length / this.perPage)
            );

        this.page[side] =
            Math.max(
                0,
                Math.min(
                    this.page[side],
                    totalPages - 1
                )
            );

        const start =
            this.page[side] * this.perPage;

        const currentAds =
            ads.slice(
                start,
                start + this.perPage
            );

        container.innerHTML =
            currentAds
                .map(ad => this.createCard(ad))
                .join('');

        const pageNumber =
            document.getElementById(
                `ad${prefix}PageNum`
            );

        if (pageNumber) {

            pageNumber.textContent =
                `${this.page[side] + 1} از ${totalPages}`;
        }
    },

    renderMobile() {

        const container =
            document.getElementById('adMobileList');

        if (!container) return;

        const ads = [
            ...this.data.left,
            ...this.data.right
        ];

        container.innerHTML =
            ads
                .map(ad => this.createCard(ad, true))
                .join('');
    },

    changePage(side, direction) {

        const ads =
            this.data[side] || [];

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    ads.length / this.perPage
                )
            );

        this.page[side] += direction;

        if (this.page[side] < 0) {
            this.page[side] =
                totalPages - 1;
        }

        if (this.page[side] >= totalPages) {
            this.page[side] = 0;
        }

        this.render(side);
        this.renderMobile();
    },

    init() {

        this.render('left');
        this.render('right');
        this.renderMobile();

        console.log(
            '✅ تبلیغات با موفقیت بارگذاری شد'
        );
    }
};


/* دسترسی سراسری برای دکمه‌های HTML */
window.AdsModule = AdsModule;


/* اجرای خودکار */
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        () => AdsModule.init(),
        { once: true }
    );

} else {

    AdsModule.init();

}
