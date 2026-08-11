/* =========================================================
   ENTESHARAT - Responsive Ads Module
   ========================================================= */

const AdsModule = {

    data: {
        left: [
            {
                name: 'چاپ و تبلیغات آریا',
                desc: 'خدمات چاپ و تبلیغات',
                logo: '🖨️',
                link: ''
            },
            {
                name: 'چاپ دیجیتال سروش',
                desc: 'خدمات چاپ دیجیتال',
                logo: '📇',
                link: ''
            }
        ],

        right: [
            {
                name: 'نشر چشمه',
                desc: 'ادبیات و نشر کتاب',
                logo: '📖',
                link: 'https://cheshmeh.ir'
            },
            {
                name: 'انتشارات ققنوس',
                desc: 'کتاب، ادبیات و علوم انسانی',
                logo: '📚',
                link: 'https://qoqnoos.ir'
            },
            {
                name: 'نشر نی',
                desc: 'ادبیات، علوم اجتماعی و پژوهش',
                logo: '📘',
                link: 'https://nashreney.com'
            }
        ]
    },

    page: {
        left: 0,
        right: 0
    },

    perPage: 2,

    escape(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[char]));
    },

    validUrl(value) {
        if (!value) return '';

        try {
            const url = new URL(value, window.location.href);

            if (url.protocol === 'http:' || url.protocol === 'https:') {
                return url.href;
            }

            return '';
        } catch {
            return '';
        }
    },

    createCard(ad, mobile = false) {

        const name = this.escape(ad.name || 'تبلیغ');
        const desc = this.escape(ad.desc || '');
        const logo = this.escape(ad.logo || '📢');
        const url = this.validUrl(ad.link);

        const button = url
            ? `
                <a
                    class="ad-link"
                    href="${this.escape(url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="مشاهده ${name}"
                >
                    <i class="fas fa-arrow-up-right-from-square"></i>
                    مشاهده سایت
                </a>
              `
            : `
                <span class="ad-link ad-link-disabled">
                    <i class="fas fa-clock"></i>
                    لینک در حال تکمیل
                </span>
              `;

        return `
            <article class="${mobile ? 'ad-item' : 'ad-box'}">

                <div class="ad-logo" aria-hidden="true">
                    ${logo}
                </div>

                <div class="ad-name">
                    ${name}
                </div>

                ${desc ? `
                    <div class="ad-desc">
                        ${desc}
                    </div>
                ` : ''}

                ${button}

            </article>
        `;
    },

    renderSide(side) {

        const prefix =
            side.charAt(0).toUpperCase() + side.slice(1);

        const container =
            document.getElementById(`ad${prefix}List`);

        if (!container) return;

        const ads = this.data[side] || [];

        const totalPages = Math.max(
            1,
            Math.ceil(ads.length / this.perPage)
        );

        this.page[side] = Math.max(
            0,
            Math.min(
                this.page[side],
                totalPages - 1
            )
        );

        const start =
            this.page[side] * this.perPage;

        const visibleAds =
            ads.slice(start, start + this.perPage);

        container.innerHTML =
            visibleAds.length
                ? visibleAds.map(ad => this.createCard(ad)).join('')
                : `
                    <div class="ad-empty">
                        تبلیغی ثبت نشده است.
                    </div>
                  `;

        const pageNumber =
            document.getElementById(`ad${prefix}PageNum`);

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
            ads.length
                ? ads.map(ad => this.createCard(ad, true)).join('')
                : `
                    <div class="ad-empty">
                        تبلیغی ثبت نشده است.
                    </div>
                  `;
    },

    changePage(side, direction) {

        const ads = this.data[side] || [];

        const totalPages = Math.max(
            1,
            Math.ceil(ads.length / this.perPage)
        );

        this.page[side] += direction;

        if (this.page[side] < 0) {
            this.page[side] = totalPages - 1;
        }

        if (this.page[side] >= totalPages) {
            this.page[side] = 0;
        }

        this.renderSide(side);
    },

    init() {

        this.renderSide('left');
        this.renderSide('right');
        this.renderMobile();

        console.log('✅ AdsModule: تبلیغات واکنش‌گرا فعال شد');
    }
};


/* اجرای مستقل؛ وابسته به init.js نیست */
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        () => AdsModule.init(),
        { once: true }
    );

} else {

    AdsModule.init();

}
