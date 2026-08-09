// ===== ماژول منو =====
const MenuModule = {
    items: [
        { id: 'radio', label: 'رادیو', icon: 'fa-radio' },
        { id: 'tv', label: 'تلویزیون', icon: 'fa-tv' },
        { id: 'archive', label: 'آرشیو', icon: 'fa-archive' },
        { id: 'gallery', label: 'گالری پوستر', icon: 'fa-images' },
        { id: 'radionava', label: 'رادیو نوای چاپ', icon: 'fa-radio' },
        { id: 'interact', label: 'تعامل', icon: 'fa-comment-dots' },
        { id: 'publish', label: 'انتشارات', icon: 'fa-building' },
        { id: 'smart-select', label: 'هوشمند گزینی', icon: 'fa-robot' },
        { id: 'reading-growth', label: 'رشد سرانه مطالعه', icon: 'fa-chart-line' },
        { id: 'book-narrators', label: 'راویان', icon: 'fa-users' },
        { id: 'media-helpers', label: 'یاوران', icon: 'fa-hand-holding-heart' },
        { id: 'footer', label: 'طراحی و توسعه', icon: 'fa-crown' }  // ← اضافه شد
    ],

    render() {
        let html = '<nav class="menu">';
        this.items.forEach(item => {
            html += `<a href="#${item.id}"><i class="fas ${item.icon}"></i> ${item.label}</a>`;
        });
        html += '</nav>';
        return html;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuModule;
}
