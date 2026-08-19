// 1. Neon Festival Snake Game
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class SnakeGame {
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
      <div class="game-wrapper snake-theme">
        <div class="game-header">
          <div class="game-stat"><span>SKOR</span><b id="snake-score">0</b></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="snake-highscore">${ticketShop.getHighScore('snake')}</b></div>
          <div class="game-stat"><span>KOMBO</span><b id="snake-combo" class="highlight">x1</b></div>
          <button class="game-close-btn" id="snake-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <canvas id="snake-canvas" width="600" height="600"></canvas>
          <div id="snake-overlay" class="game-overlay-screen">
            <h2 id="snake-overlay-title">NEON YILAN</h2>
            <p id="snake-overlay-desc">Şekerleri ve pamuk şekerleri topla! Yön tuşları veya WASD ile kontrol et. Space ile Turbo Hızlanma!</p>
            <button id="snake-start-btn" class="arcade-btn-primary">OYUNA BAŞLA</button>
          </div>
        </div>
        <div class="mobile-controls">
          <button class="dpad-btn up" data-dir="UP">▲</button>
          <div class="dpad-mid">
            <button class="dpad-btn left" data-dir="LEFT">◀</button>
            <button class="dpad-btn turbo" id="snake-mobile-turbo">⚡ BOOST</button>
            <button class="dpad-btn right" data-dir="RIGHT">▶</button>
          </div>
          <button class="dpad-btn down" data-dir="DOWN">▼</button>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('snake-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById('snake-score');
    this.comboEl = document.getElementById('snake-combo');
    this.overlay = document.getElementById('snake-overlay');
    this.startBtn = document.getElementById('snake-start-btn');
    this.closeBtn = document.getElementById('snake-close');
  }

  resetState() {
    this.gridSize = 20;
    this.tileCount = 30; // 600 / 20
    this.snake = [
      { x: 15, y: 15 },
      { x: 14, y: 15 },
      { x: 13, y: 15 }
    ];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score = 0;
    this.combo = 1;
    this.comboTimer = 0;
    this.speed = 100; // ms per tick
    this.lastTick = 0;
    this.isTurbo = false;
    this.particles = [];
    this.food = this.spawnFood();
    this.powerup = null;
    this.powerupTimer = 0;
    this.activeEffect = null;
    this.effectDuration = 0;
  }

  bindEvents() {
    this.keyHandler = (e) => {
      if (!this.running) return;
      if (['ArrowUp', 'KeyW'].includes(e.code) && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
      if (['ArrowDown', 'KeyS'].includes(e.code) && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
      if (['ArrowLeft', 'KeyA'].includes(e.code) && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
      if (['ArrowRight', 'KeyD'].includes(e.code) && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
      if (['Space', 'ShiftLeft'].includes(e.code)) this.isTurbo = true;
    };

    this.keyUpHandler = (e) => {
      if (['Space', 'ShiftLeft'].includes(e.code)) this.isTurbo = false;
    };

    window.addEventListener('keydown', this.keyHandler);
    window.addEventListener('keyup', this.keyUpHandler);

    this.startBtn.addEventListener('click', () => this.start());
    this.closeBtn.addEventListener('click', () => this.stop());

    // Mobile buttons
    const dpadBtns = this.container.querySelectorAll('.dpad-btn[data-dir]');
    dpadBtns.forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const dir = btn.dataset.dir;
        if (dir === 'UP' && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
        if (dir === 'DOWN' && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
        if (dir === 'LEFT' && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
        if (dir === 'RIGHT' && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
      });
    });

    const turboBtn = document.getElementById('snake-mobile-turbo');
    if (turboBtn) {
      turboBtn.addEventListener('pointerdown', () => { this.isTurbo = true; });
      turboBtn.addEventListener('pointerup', () => { this.isTurbo = false; });
      turboBtn.addEventListener('pointerleave', () => { this.isTurbo = false; });
    }
  }

  spawnFood() {
    let newFood;
    while (!newFood || this.snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * (this.tileCount - 2)) + 1,
        y: Math.floor(Math.random() * (this.tileCount - 2)) + 1,
        type: Math.random() < 0.25 ? 'special' : 'normal'
      };
    }
    return newFood;
  }

  spawnPowerup() {
    const types = ['turbo', 'magnet', 'freeze'];
    return {
      x: Math.floor(Math.random() * (this.tileCount - 2)) + 1,
      y: Math.floor(Math.random() * (this.tileCount - 2)) + 1,
      type: types[Math.floor(Math.random() * types.length)],
      life: 300 // ticks
    };
  }

  start() {
    this.resetState();
    this.running = true;
    this.overlay.style.display = 'none';
    this.lastTick = performance.now();
    this.loop(this.lastTick);
  }

  stop() {
    this.running = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('keydown', this.keyHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
    if (this.onGameOver) this.onGameOver();
  }

  loop(currentTime) {
    if (!this.running) return;

    this.animationId = requestAnimationFrame((t) => this.loop(t));

    const currentSpeed = this.isTurbo ? 50 : (this.activeEffect === 'freeze' ? 140 : Math.max(65, this.speed - Math.floor(this.score / 60) * 3));

    if (currentTime - this.lastTick >= currentSpeed) {
      this.updateGameLogic();
      this.lastTick = currentTime;
    }

    this.render();
  }

  updateGameLogic() {
    this.dir = { ...this.nextDir };
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      this.handleDeath();
      return;
    }

    // Self collision
    if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
      this.handleDeath();
      return;
    }

    this.snake.unshift(head);

    // Combo timer
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.combo = 1;
        this.comboEl.textContent = 'x1';
      }
    }

    // Magnet effect
    if (this.activeEffect === 'magnet') {
      const dx = head.x - this.food.x;
      const dy = head.y - this.food.y;
      if (Math.abs(dx) <= 4 && Math.abs(dy) <= 4) {
        if (dx > 0) this.food.x++;
        else if (dx < 0) this.food.x--;
        if (dy > 0) this.food.y++;
        else if (dy < 0) this.food.y--;
      }
    }

    // Food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      const basePoints = this.food.type === 'special' ? 30 : 10;
      const gained = basePoints * this.combo * (this.isTurbo ? 2 : 1);
      this.score += gained;
      this.combo = Math.min(5, this.combo + 1);
      this.comboTimer = 25; // ticks to sustain combo
      this.comboEl.textContent = `x${this.combo}`;
      this.scoreEl.textContent = this.score;

      sound.playTone(400 + this.combo * 100, 'sine', 0.1, 0.15);
      this.spawnParticles(head.x * this.gridSize + 10, head.y * this.gridSize + 10, this.food.type === 'special' ? '#ff00ff' : '#00ffcc');

      this.food = this.spawnFood();

      // Chance to spawn powerup
      if (!this.powerup && Math.random() < 0.2) {
        this.powerup = this.spawnPowerup();
      }
    } else {
      this.snake.pop();
    }

    // Powerup collision & update
    if (this.powerup) {
      this.powerup.life--;
      if (head.x === this.powerup.x && head.y === this.powerup.y) {
        this.activeEffect = this.powerup.type;
        this.effectDuration = 100;
        sound.playPowerup();
        this.powerup = null;
      } else if (this.powerup.life <= 0) {
        this.powerup = null;
      }
    }

    if (this.activeEffect) {
      this.effectDuration--;
      if (this.effectDuration <= 0) {
        this.activeEffect = null;
      }
    }

    // Turbo trail particles
    if (this.isTurbo) {
      this.spawnParticles(head.x * this.gridSize + 10, head.y * this.gridSize + 10, '#ffff00', 2);
    }
  }

  spawnParticles(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        color,
        size: 3 + Math.random() * 3,
        alpha: 1
      });
    }
  }

  handleDeath() {
    this.running = false;
    sound.playGameOver();

    // Reward tickets based on score (1 ticket per 15 pts)
    const earnedTickets = Math.floor(this.score / 15);
    if (earnedTickets > 0) {
      ticketShop.addTickets(earnedTickets);
    }
    const isNewHigh = ticketShop.setHighScore('snake', this.score);

    document.getElementById('snake-overlay-title').textContent = 'OYUN BİTTİ!';
    document.getElementById('snake-overlay-desc').innerHTML = `
      Skorun: <b>${this.score}</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
      Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
    `;
    this.startBtn.textContent = 'TEKRAR OYNA';
    this.overlay.style.display = 'flex';
  }

  render() {
    const ctx = this.ctx;
    const size = this.gridSize;

    // Dark grid background
    ctx.fillStyle = '#0f0e26';
    ctx.fillRect(0, 0, 600, 600);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 600; i += size) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 600);
      ctx.moveTo(0, i);
      ctx.lineTo(600, i);
      ctx.stroke();
    }

    // Draw Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.04;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Food (Fruit / Candy)
    ctx.save();
    const fx = this.food.x * size + size / 2;
    const fy = this.food.y * size + size / 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.food.type === 'special' ? '#ff00ff' : '#00ffcc';
    ctx.fillStyle = this.food.type === 'special' ? '#ff00aa' : '#00ffcc';
    ctx.beginPath();
    ctx.arc(fx, fy, size / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx - 2, fy - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Powerup if exists
    if (this.powerup) {
      ctx.save();
      const px = this.powerup.x * size + size / 2;
      const py = this.powerup.y * size + size / 2;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ffff00';
      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.arc(px, py, size / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '12px Outfit';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.powerup.type === 'turbo' ? '⚡' : (this.powerup.type === 'magnet' ? '🧲' : '❄️'), px, py);
      ctx.restore();
    }

    // Draw Snake
    this.snake.forEach((seg, idx) => {
      const sx = seg.x * size;
      const sy = seg.y * size;
      const isHead = idx === 0;

      ctx.save();
      if (isHead) {
        ctx.fillStyle = '#00ff88';
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#00ff88';
        ctx.beginPath();
        ctx.roundRect(sx + 1, sy + 1, size - 2, size - 2, 6);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        const eyeOffsetX = this.dir.x === 0 ? 4 : (this.dir.x > 0 ? 12 : 2);
        const eyeOffsetY = this.dir.y === 0 ? 4 : (this.dir.y > 0 ? 12 : 2);
        ctx.beginPath();
        ctx.arc(sx + eyeOffsetX, sy + 5, 2.5, 0, Math.PI * 2);
        ctx.arc(sx + eyeOffsetX, sy + 15, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const t = idx / this.snake.length;
        ctx.fillStyle = `hsl(${140 + t * 60}, 100%, ${50 - t * 15}%)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ff88';
        ctx.beginPath();
        ctx.roundRect(sx + 2, sy + 2, size - 4, size - 4, 4);
        ctx.fill();
      }
      ctx.restore();
    });
  }
}
