// ============================================================
// ماژول رادیو - مدیریت پخش‌کننده و لیست آهنگ‌ها
// ============================================================

import APP_CONFIG from '../config.js';

class RadioModule {
  constructor() {
    this.tracks = APP_CONFIG.radio.tracks;
    this.currentTrackIndex = 0;
    this.audio = new Audio();
    this.isPlaying = false;
    this.init();
  }

  init() {
    this.renderTrackList();
    this.setupControls();
    this.loadTrack(0);
  }

  renderTrackList() {
    const listContainer = document.querySelector('.radio-track-list');
    if (!listContainer) return;

    listContainer.innerHTML = this.tracks.map((track, index) => `
      <div class="track-item ${index === this.currentTrackIndex ? 'active' : ''}" data-index="${index}">
        <span class="track-title">${track.title}</span>
        <span class="track-date">${track.date}</span>
        <button class="play-btn" data-index="${index}">▶</button>
      </div>
    `).join('');

    // اتصال رویداد کلیک به دکمه‌های پخش
    listContainer.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        this.loadTrack(index);
        this.togglePlay();
      });
    });
  }

  loadTrack(index) {
    this.currentTrackIndex = index;
    const track = this.tracks[index];
    this.audio.src = track.file;
    this.audio.load();
    this.updateActiveTrack(index);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play().catch(err => console.log('خطا در پخش:', err));
      this.isPlaying = true;
    }
    this.updatePlayButton();
  }

  setupControls() {
    const playBtn = document.querySelector('.radio-play-btn');
    const nextBtn = document.querySelector('.radio-next-btn');
    const prevBtn = document.querySelector('.radio-prev-btn');

    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.loadTrack(nextIndex);
        if (this.isPlaying) this.audio.play();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prevIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(prevIndex);
        if (this.isPlaying) this.audio.play();
      });
    }
  }

  updateActiveTrack(index) {
    document.querySelectorAll('.track-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  updatePlayButton() {
    const btn = document.querySelector('.radio-play-btn');
    if (btn) {
      btn.textContent = this.isPlaying ? '⏸' : '▶';
    }
  }
}

// راه‌اندازی ماژول
document.addEventListener('DOMContentLoaded', () => {
  new RadioModule();
});
