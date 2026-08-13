// ============================================================
// ماژول گالری - مدیریت نمایش پوسترها
// ============================================================

class GalleryModule {
  constructor() {
    this.posters = APP_CONFIG.gallery.posters;
    this.init();
  }

  init() {
    const container = document.querySelector('.gallery-grid');
    if (!container) return;

    container.innerHTML = this.posters.map(poster => `
      <div class="gallery-item">
        <img src="${poster.image}" alt="${poster.title}" loading="lazy" />
        <p class="gallery-title">${poster.title}</p>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GalleryModule();
});
