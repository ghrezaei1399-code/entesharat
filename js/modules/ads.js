/* =========================================================
   ENTESHARAT - ADS MODULE
   ========================================================= */

const AdsModule = {

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

    getAds(side) {
        const source =
            window.APP_CONFIG?.advertisements?.[side] ||
            window.APP_CONFIG?.ads?.[side] ||
            [];

        return Array.isArray(source) ? source : [];
    },

    safeUrl(value) {
        if (!value) return '';

        try {
            const url = new URL(value, window.location.href);

            if (
                url.protocol === 'http:' ||
                url.protocol === 'https:'
            ) {
                return url.href;
            }

            return '';
        } catch {
            return '';
        }
    },

    createCard(ad, mobile = false) {

        const name = this.escape(ad.name || ad.title || 'تبلیغ');
        const desc = this.escape(ad.desc || ad.description || '');
        const logo = this.escape(ad.logo || ad.icon || '📢');
        const url = this.safeUrl(ad.link || ad.url || '');

        return `
            <article class="${mobile ? 'ad-item' : 'ad-box'}">

                <div class="ad-logo" aria-hidden="true">
                    ${logo}
                </div>

                <div class="ad-name">
                    ${name}
                </div>

                ${
                    desc
                        ? `<div class="ad-desc">${desc}</div>`
                        : ''
                }

                ${
                    url
                        ? `
                            <a
                                class="ad-link"
                                href="${this.escape(url)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                مشاهده سایت
                            </a>
                          `
                        : ''
                }

            </article>
        `;
    },

    renderSide(side) {

        const prefix =
            side.charAt(0).toUpperCase() + side.slice(1);

        const container =
            document.getElementById(`ad${prefix}List`);

        if (!container) return;

        const ads = this.getAds(side);

        const total =
            Math.max(1, Math.ceil(ads.length / this.perPage));

        this.page[side] =
            Math.max(
                0,
                Math.min(this.page[side], total - 1)
            );

        const start =
            this.page[side] * this.perPage;

        const visible =
            ads.slice(start, start + this.perPage);

        container.innerHTML =
            visible.length
                ? visible
                    .map(ad => this.createCard(ad))
                    .join('')
                : '';
    },

    renderMobile() {

        const container =
            document.getElementById('adMobileList');

        if (!container) return;

        const ads = [
            ...this.getAds('left'),
            ...this.getAds('right')
        ];

        container.innerHTML =
            ads
                .map(ad => this.createCard(ad, true))
                .join('');
    },

    changePage(side, direction) {

        const ads = this.getAds(side);

        const total =
            Math.max(1, Math.ceil(ads.length / this.perPage));

        this.page[side] += direction;

        if (this.page[side] < 0) {
            this.page[side] = total - 1;
        }

        if (this.page[side] >= total) {
            this.page[side] = 0;
        }

        this.renderSide(side);
    },

    init() {

        this.renderSide('left');
        this.renderSide('right');
        this.renderMobile();

        console.log('AdsModule initialized');
    }
};

window.AdsModule = AdsModule;

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        () => AdsModule.init(),
        { once: true }
    );
} else {
    AdsModule.init();
}
