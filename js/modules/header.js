// ===== ماژول هدر =====
const HeaderModule = {
    render() {
        return `
        <div class="header">
            <div class="logo-wrapper">
                <img src="images/2.jpg" alt="انتشارات کیمیا">
            </div>
            <div class="radio-tv-icons">
                <div class="icon-box"><img src="images/1763357724-De1014635(www.tiktarh.com).jpg" alt="رادیو"></div>
                <span class="plus">+</span>
                <div class="icon-box"><img src="images/y4q0rneg.jpg" alt="تلویزیون"></div>
            </div>
            <h1>رادیو تلویزیون <span>هوشمند</span></h1>
            <p>انتشارات کیمیا | رادیو نوای چاپ</p>
        </div>`;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderModule;
}
