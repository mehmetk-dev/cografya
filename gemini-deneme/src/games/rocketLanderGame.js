// 5. Rocket Acrobat: Gravity Lander
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class RocketLanderGame {
  constructor(container, onGameOver) {
    this.container = container;
    this.onGameOver = onGameOver;
    this.running = false;
    this.animationId = null;

    this.initDOM();
    this.resetState();
    this.bindEvents();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="game-wrapper rocket-theme">
        <div class="game-header">
          <div class="game-stat"><span>SKOR</span><b id="rocket-score">0</b></div>
          <div class="game-stat"><span>YAKIT</span><div class="fuel-bar-container"><div id="rocket-fuel-bar"></div></div></div>
          <div class="game-stat"><span>DÜŞÜŞ HIZI</span><b id="rocket-vspeed">0.0 m/s</b></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="rocket-highscore">${ticketShop.getHighScore('rocket_lander')}</b></div>
          <button class="game-close-btn" id="rocket-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <canvas id="rocket-canvas" width="600" height="600"></canvas>
          <div id="rocket-overlay" class="game-overlay-screen">
            <h2 id="rocket-overlay-title">YERÇEKİMİ ROKETİ</h2>
            <p id="rocket-overlay-desc">W / Yukarı Ok: Ana Roket İtkisi. A / D: Yön Dümenleri. Hareketli platformlara YAVAŞÇA iniş yap!</p>
            <button id="rocket-start-btn" class="arcade-btn-primary">FIRLAT!</button>
          </div>
        </div>
        <div class="mobile-rocket-controls">
          <button class="rocket-steer-btn" id="rocket-btn-left">↶ SOL İTKİ</button>
          <button class="rocket-main-btn" id="rocket-btn-thrust">🔥 ANA ATEŞLEME</button>
          <button class="rocket-steer-btn" id="rocket-btn-right">SAĞ İTKİ ↷</button>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('rocket-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById('rocket-score');
    this.fuelBar = document.getElementById('rocket-fuel-bar');
    this.vSpeedEl = document.getElementById('rocket-vspeed');
    this.overlay = document.getElementById('rocket-overlay');
    this.startBtn = document.getElementById('rocket-start-btn');
    this.closeBtn = document.getElementById('rocket-close');
  }

  resetState() {
    this.rocket = {
      x: 300,
      y: 80,
      vx: 0,
      vy: 0,
      angle: 0,
      angularVelocity: 0,
      fuel: 100,
      width: 28,
      height: 48,
      crashed: false,
      landed: false
    };

    this.gravity = 0.04;
    this.mainThrust = 0.12;
    this.rotateSpeed = 0.006;
    this.keys = { up: false, left: false, right: false };

    this.particles = [];
    this.stars = [];
    this.wind = (Math.random() - 0.5) * 0.02;

    // Moving landing pads with multipliers
    this.platforms = [
      { x: 80, y: 520, width: 110, vx: 0.8, minX: 40, maxX: 200, mult: 2, name: '2X' },
      { x: 380, y: 480, width: 80, vx: -1.1, minX: 300, maxX: 480, mult: 3, name: '3X HAREKETLİ' },
      { x: 230, y: 560, width: 60, vx: 0, minX: 230, maxX: 230, mult: 5, name: '5X HASSAS' }
    ];

    // Star gems in the sky
    this.gems = [
      { x: 160, y: 220, collected: false },
      { x: 440, y: 260, collected: false },
      { x: 300, y: 340, collected: false }
    ];
  }

  bindEvents() {
    this.keyDownHandler = (e) => {
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) this.keys.up = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
    };

    this.keyUpHandler = (e) => {
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) this.keys.up = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
    };

    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);

    this.startBtn.addEventListener('click', () => this.start());
    this.closeBtn.addEventListener('click', () => this.stop());

    // Mobile buttons
    const btnLeft = document.getElementById('rocket-btn-left');
    const btnRight = document.getElementById('rocket-btn-right');
    const btnThrust = document.getElementById('rocket-btn-thrust');

    if (btnLeft && btnRight && btnThrust) {
      btnLeft.addEventListener('pointerdown', () => { this.keys.left = true; });
      btnLeft.addEventListener('pointerup', () => { this.keys.left = false; });
      btnLeft.addEventListener('pointerleave', () => { this.keys.left = false; });

      btnRight.addEventListener('pointerdown', () => { this.keys.right = true; });
      btnRight.addEventListener('pointerup', () => { this.keys.right = false; });
      btnRight.addEventListener('pointerleave', () => { this.keys.right = false; });

      btnThrust.addEventListener('pointerdown', () => { this.keys.up = true; });
      btnThrust.addEventListener('pointerup', () => { this.keys.up = false; });
      btnThrust.addEventListener('pointerleave', () => { this.keys.up = false; });
    }
  }

  start() {
    this.resetState();
    this.running = true;
    this.overlay.style.display = 'none';
    this.loop();
  }

  stop() {
    this.running = false;
    sound.stopThrust();
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
    if (this.onGameOver) this.onGameOver();
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const r = this.rocket;
    if (r.crashed || r.landed) return;

    // Rotation
    if (this.keys.left && r.fuel > 0) {
      r.angularVelocity -= this.rotateSpeed;
      r.fuel = Math.max(0, r.fuel - 0.1);
    }
    if (this.keys.right && r.fuel > 0) {
      r.angularVelocity += this.rotateSpeed;
      r.fuel = Math.max(0, r.fuel - 0.1);
    }

    r.angularVelocity *= 0.94; // Rotational damping
    r.angle += r.angularVelocity;

    // Thruster
    if (this.keys.up && r.fuel > 0) {
      const thrustX = Math.sin(r.angle) * this.mainThrust;
      const thrustY = -Math.cos(r.angle) * this.mainThrust;
      r.vx += thrustX;
      r.vy += thrustY;
      r.fuel = Math.max(0, r.fuel - 0.35);

      sound.startThrust();
      this.spawnThrustParticles(r.x, r.y, r.angle);
    } else {
      sound.stopThrust();
    }

    // Gravity and wind
    r.vy += this.gravity;
    r.vx += this.wind;

    r.x += r.vx;
    r.y += r.vy;

    // Screen wrap / bounds
    if (r.x < 15) { r.x = 15; r.vx = -r.vx * 0.5; }
    if (r.x > 585) { r.x = 585; r.vx = -r.vx * 0.5; }

    // Update HUD
    this.fuelBar.style.width = `${r.fuel}%`;
    const vspeed = Math.round(r.vy * 10 * 10) / 10;
    this.vSpeedEl.textContent = `${vspeed > 0 ? '↓' : '↑'} ${Math.abs(vspeed)} m/s`;
    this.vSpeedEl.style.color = Math.abs(r.vy) > 2.0 ? '#ff0055' : '#00ff88';

    // Collect Gem Stars
    this.gems.forEach(gem => {
      if (!gem.collected && Math.hypot(r.x - gem.x, r.y - gem.y) < 28) {
        gem.collected = true;
        r.fuel = Math.min(100, r.fuel + 30);
        sound.playPowerup();
      }
    });

    // Update Moving Platforms
    this.platforms.forEach(p => {
      p.x += p.vx;
      if (p.x < p.minX || p.x > p.maxX) p.vx = -p.vx;

      // Platform Landing Collision Check
      const rocketBottom = r.y + r.height / 2;
      if (
        r.x >= p.x - 10 &&
        r.x <= p.x + p.width + 10 &&
        rocketBottom >= p.y &&
        rocketBottom <= p.y + 16 &&
        r.vy > 0
      ) {
        this.evaluateLanding(p);
      }
    });

    // Ground Crash
    if (r.y + r.height / 2 >= 590) {
      this.handleCrash();
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  evaluateLanding(platform) {
    const r = this.rocket;
    const isSpeedSafe = Math.abs(r.vy) < 2.0 && Math.abs(r.vx) < 1.4;
    const isAngleSafe = Math.abs(r.angle) < 0.28; // ~16 degrees

    if (isSpeedSafe && isAngleSafe) {
      r.landed = true;
      r.vy = 0;
      r.vx = 0;
      sound.stopThrust();
      sound.playVictory();

      // Score Calculation
      const basePoints = 200;
      const fuelBonus = Math.round(r.fuel * 4);
      const totalScore = (basePoints + fuelBonus) * platform.mult;
      this.scoreEl.textContent = totalScore;

      const earnedTickets = Math.floor(totalScore / 50);
      if (earnedTickets > 0) ticketShop.addTickets(earnedTickets);
      const isNewHigh = ticketShop.setHighScore('rocket_lander', totalScore);

      document.getElementById('rocket-overlay-title').textContent = 'MÜKEMMEL İNİŞ! 🚀';
      document.getElementById('rocket-overlay-desc').innerHTML = `
        Platform Çarpanı: <b>${platform.name}</b><br>
        Kalan Yakıt Bonusu: <b>+${fuelBonus}</b><br>
        Toplam Skor: <b>${totalScore}</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
        Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
      `;
      this.startBtn.textContent = 'BİR DAHA UÇ';
      this.overlay.style.display = 'flex';
    } else {
      this.handleCrash();
    }
  }

  handleCrash() {
    const r = this.rocket;
    r.crashed = true;
    sound.stopThrust();
    sound.playNoise(0.7, 0.4, 250);
    sound.playGameOver();

    // Explosion particles
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: r.x,
        y: r.y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: ['#ff0055', '#ff9900', '#ffff00'][Math.floor(Math.random() * 3)],
        size: 4 + Math.random() * 5,
        alpha: 1
      });
    }

    document.getElementById('rocket-overlay-title').textContent = 'ROKET PARÇALANDI! 💥';
    document.getElementById('rocket-overlay-desc').innerHTML = `
      İniş hızı çok yüksekti veya roket dik değildi!<br>
      Daha yumuşak inmek için iniş anında W ile kısa itkiler ver.
    `;
    this.startBtn.textContent = 'TEKRAR DENE';
    this.overlay.style.display = 'flex';
  }

  spawnThrustParticles(rx, ry, angle) {
    const flameX = rx - Math.sin(angle) * 26;
    const flameY = ry + Math.cos(angle) * 26;
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: flameX + (Math.random() * 6 - 3),
        y: flameY + (Math.random() * 6 - 3),
        vx: -Math.sin(angle) * (4 + Math.random() * 4) + (Math.random() - 0.5) * 2,
        vy: Math.cos(angle) * (4 + Math.random() * 4) + (Math.random() - 0.5) * 2,
        color: ['#ff007f', '#00f2fe', '#ffff00'][Math.floor(Math.random() * 3)],
        size: 3 + Math.random() * 4,
        alpha: 0.9
      });
    }
  }

  render() {
    const ctx = this.ctx;

    // Space / Planet Atmosphere BG
    const grad = ctx.createLinearGradient(0, 0, 0, 600);
    grad.addColorStop(0, '#09081e');
    grad.addColorStop(1, '#1b1238');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 600);

    // Draw Gems (Fuel Stars)
    this.gems.forEach(g => {
      if (g.collected) return;
      ctx.save();
      ctx.fillStyle = '#ffea00';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath();
      ctx.arc(g.x, g.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⛽', g.x, g.y + 4);
      ctx.restore();
    });

    // Draw Platforms
    this.platforms.forEach(p => {
      ctx.save();
      ctx.fillStyle = '#222034';
      ctx.fillRect(p.x, p.y, p.width, 14);

      // Neon Top strip
      ctx.fillStyle = '#00f2fe';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f2fe';
      ctx.fillRect(p.x, p.y, p.width, 4);

      // Platform text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.name, p.x + p.width / 2, p.y + 11);
      ctx.restore();
    });

    // Draw Rocket
    const r = this.rocket;
    if (!r.crashed) {
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.angle);

      // Rocket Body
      ctx.fillStyle = '#f8f9fa';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f2fe';
      ctx.beginPath();
      ctx.moveTo(0, -r.height / 2);
      ctx.lineTo(r.width / 2, r.height / 2 - 8);
      ctx.lineTo(-r.width / 2, r.height / 2 - 8);
      ctx.closePath();
      ctx.fill();

      // Cockpit Glass
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Fins / Landing Legs
      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-r.width / 2, r.height / 2 - 12);
      ctx.lineTo(-r.width / 2 - 6, r.height / 2 + 4);
      ctx.moveTo(r.width / 2, r.height / 2 - 12);
      ctx.lineTo(r.width / 2 + 6, r.height / 2 + 4);
      ctx.stroke();

      ctx.restore();
    }

    // Draw Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}
