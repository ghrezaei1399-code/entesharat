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
        const container = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'List');
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
        container.innerHTML = pageAds.length
            ? pageAds.map(ad => this.card(ad)).join('')
            : `
                <div class="ad-box">
                    <div class="ad-desc">
                        هنوز تبلیغی ثبت نشده است.
                    </div>
                    <a href="${ad.link || '#'}" target="_blank" class="ad-link" style="display:inline-block;margin-top:6px;padding:4px 16px;background:#6C5CE7;color:#fff;border-radius:20px;font-size:.7rem;text-decoration:none;transition:0.3s">
                        🌐 مشاهده و ارتباط با سایت
                    </a>
                </div>
            `).join('');
        }
            `;

        const pageNum = document.getElementById(`ad${prefix}PageNum`);

        const pageNum = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'PageNum');
        if (pageNum) {
            const total = Math.max(1, Math.ceil(ads.length / this.perPage));
            pageNum.textContent = (this.page[side] + 1) + ' از ' + total;
            pageNum.textContent = `${this.page[side] + 1} از ${total}`;
        }
    },

    changePage(side, delta) {
        const total = Math.max(1, Math.ceil((this.data[side] || []).length / this.perPage));
        this.page[side] = Math.max(0, Math.min(total - 1, this.page[side] + delta));
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
        const input = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'Input');
        const link = document.getElementById('ad' + side.charAt(0).toUpperCase() + side.slice(1) + 'Link');
        const prefix = side.charAt(0).toUpperCase() + side.slice(1);

        const input = document.getElementById(`ad${prefix}Input`);
        const link = document.getElementById(`ad${prefix}Link`);

        if (!input || !input.value.trim()) {
            alert('لطفاً نام تبلیغ را وارد کنید.');
@@ -104,40 +166,66 @@ const AdsModule = {
        this.data[side].push({
            name: input.value.trim(),
            desc: 'تبلیغ جدید',
            link: link.value.trim() || '#',
            link: link?.value.trim() || '#',
            logo: '📢'
        });

        input.value = '';
        if (link) link.value = '';

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

        const all = [...this.data.left, ...this.data.right];
        if (all.length === 0) {
            container.innerHTML = '<div style="color:#7f8c8d;font-size:.7rem;text-align:center;padding:10px">هیچ تبلیغی ثبت نشده است.</div>';
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

        container.innerHTML = all.slice(0, 6).map(ad => `
            <div style="background:#fff;border-radius:12px;padding:12px;flex:1;min-width:120px;border:1px solid #d4a373;text-align:center">
                <span style="font-size:1.5rem;display:block">${ad.logo || '📢'}</span>
                <div style="font-size:.75rem;font-weight:700;color:#2d1b4e;margin:4px 0">${ad.name}</div>
                <a href="${ad.link || '#'}" target="_blank" style="font-size:.65rem;color:#6C5CE7;text-decoration:none">مشاهده سایت</a>
            </div>
        `).join('');
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
