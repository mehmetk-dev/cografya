// Main Application Controller for 3D Lunapark Arcade Festival
import { Carnival3D } from './hub/carnival3D.js';
import { sound } from './audio/soundManager.js';
import { ticketShop } from './hub/ticketShop.js';

// 3D Mini Games
import { Snake3D } from './games/snake3D.js';
import { CarRacing3D } from './games/carRacing3D.js';
import { CannonTarget3D } from './games/cannonTarget3D.js';
import { Pinball3D } from './games/pinball3D.js';
import { RocketLander3D } from './games/rocketLander3D.js';

class Lunapark3DApp {
  constructor() {
    this.canvasContainer = document.getElementById('carnival-3d-canvas');
    this.carnival = new Carnival3D(this.canvasContainer, (gameId) => this.launchGame(gameId));
    this.currentGame = null;

    this.initUI();
    this.initEventListeners();
    this.updateHighscoresUI();
    ticketShop.updateUI();

    // Start 3D rendering loop
    this.animate();
  }

  initUI() {
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
    this.themeIcon = document.getElementById('theme-icon');
    this.bgmToggleBtn = document.getElementById('bgm-toggle-btn');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.soundIcon = document.getElementById('sound-icon');
    this.shopBtn = document.getElementById('shop-btn');
    this.openShopBadge = document.getElementById('open-shop-badge');
    this.shopCloseBtn = document.getElementById('shop-close-btn');

    // Camera control buttons
    this.camOrbitBtn = document.getElementById('cam-orbit-btn');
    this.camCoasterBtn = document.getElementById('cam-coaster-btn');
    this.camFollowBtn = document.getElementById('cam-follow-btn');
    this.camOverviewBtn = document.getElementById('cam-overview-btn');

    this.gameModal = document.getElementById('game-modal');
    this.gameContainer = document.getElementById('game-container');
    this.shopModal = document.getElementById('shop-modal');
    this.shopItemsList = document.getElementById('shop-items-list');
  }

  initEventListeners() {
    // 3D Camera Mode Selectors
    const setCamActive = (activeBtn, mode) => {
      document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
      activeBtn.classList.add('active');
      this.carnival.setCameraMode(mode);
      sound.playClick();
    };

    this.camOrbitBtn.addEventListener('click', () => setCamActive(this.camOrbitBtn, 'orbit'));
    this.camCoasterBtn.addEventListener('click', () => setCamActive(this.camCoasterBtn, 'coaster_pov'));
    if (this.camFollowBtn) {
      this.camFollowBtn.addEventListener('click', () => setCamActive(this.camFollowBtn, 'follow'));
    }
    this.camOverviewBtn.addEventListener('click', () => setCamActive(this.camOverviewBtn, 'overview'));

    // Theme toggle (Day / Night)
    this.themeToggleBtn.addEventListener('click', () => {
      const isNight = this.carnival.toggleTheme();
      document.body.classList.toggle('day-mode', !isNight);
      this.themeIcon.textContent = isNight ? '🌙' : '☀️';
      sound.playClick();
    });

    // BGM toggle
    this.bgmToggleBtn.addEventListener('click', () => {
      const isPlaying = sound.toggleBGM();
      this.bgmToggleBtn.style.borderColor = isPlaying ? '#00ff88' : 'var(--card-border)';
      this.bgmToggleBtn.style.color = isPlaying ? '#00ff88' : 'var(--text-primary)';
    });

    // Sound mute toggle
    this.soundToggleBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    // Shop modal triggers
    this.shopBtn.addEventListener('click', () => this.openShop());
    this.openShopBadge.addEventListener('click', () => this.openShop());
    this.shopCloseBtn.addEventListener('click', () => this.closeShop());

    // Game Booth Cards Click
    const boothCards = document.querySelectorAll('.booth-card');
    boothCards.forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.dataset.game;
        this.launchGame(gameId);
      });
    });
  }

  animate() {
    this.carnival.update();
    this.carnival.render();
    requestAnimationFrame(() => this.animate());
  }

  launchGame(gameId) {
    sound.playClick();
    this.gameModal.classList.add('active');
    this.gameContainer.innerHTML = '';

    const handleGameOver = () => {
      this.closeGame();
    };

    switch (gameId) {
      case 'snake':
        this.currentGame = new Snake3D(this.gameContainer, handleGameOver);
        break;
      case 'car_racing':
        this.currentGame = new CarRacing3D(this.gameContainer, handleGameOver);
        break;
      case 'cannon_target':
        this.currentGame = new CannonTarget3D(this.gameContainer, handleGameOver);
        break;
      case 'pinball':
        this.currentGame = new Pinball3D(this.gameContainer, handleGameOver);
        break;
      case 'rocket_lander':
        this.currentGame = new RocketLander3D(this.gameContainer, handleGameOver);
        break;
      default:
        console.warn('Unknown game:', gameId);
    }
  }

  closeGame() {
    this.gameModal.classList.remove('active');
    this.gameContainer.innerHTML = '';
    this.currentGame = null;
    this.updateHighscoresUI();
    ticketShop.updateUI();
  }

  openShop() {
    sound.playClick();
    this.renderShopItems();
    this.shopModal.classList.add('active');
  }

  closeShop() {
    sound.playClick();
    this.shopModal.classList.remove('active');
  }

  renderShopItems() {
    this.shopItemsList.innerHTML = '';
    ticketShop.items.forEach(item => {
      const isOwned = ticketShop.hasItem(item.id);
      const card = document.createElement('div');
      card.className = 'shop-item-card';
      card.innerHTML = `
        <div>
          <h4 style="color:#ffdd00; font-size:15px;">${item.name}</h4>
          <p style="font-size:12px; color:rgba(255,255,255,0.7); margin-top:2px;">${item.desc}</p>
        </div>
        <button class="shop-buy-btn ${isOwned ? 'owned' : ''}" data-id="${item.id}">
          ${isOwned ? '✓ SAHİPSİN' : `🎟️ ${item.cost}`}
        </button>
      `;

      const buyBtn = card.querySelector('.shop-buy-btn');
      if (!isOwned) {
        buyBtn.addEventListener('click', () => {
          const res = ticketShop.buyItem(item.id);
          if (res.success) {
            this.renderShopItems();
          } else {
            alert(res.message);
          }
        });
      }

      this.shopItemsList.appendChild(card);
    });
  }

  updateHighscoresUI() {
    const elSnake = document.getElementById('booth-hs-snake');
    const elCar = document.getElementById('booth-hs-car');
    const elCannon = document.getElementById('booth-hs-cannon');
    const elPinball = document.getElementById('booth-hs-pinball');
    const elRocket = document.getElementById('booth-hs-rocket');

    if (elSnake) elSnake.textContent = ticketShop.getHighScore('snake');
    if (elCar) elCar.textContent = `${ticketShop.getHighScore('car_racing')} m`;
    if (elCannon) elCannon.textContent = ticketShop.getHighScore('cannon_target');
    if (elPinball) elPinball.textContent = ticketShop.getHighScore('pinball');
    if (elRocket) elRocket.textContent = ticketShop.getHighScore('rocket_lander');
  }
}

// Start application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new Lunapark3DApp();
});
