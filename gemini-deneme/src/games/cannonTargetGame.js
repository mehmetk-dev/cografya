// 3. Carnival Cannon Knockdown - Physics Target Shooter
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class CannonTargetGame {
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
      <div class="game-wrapper cannon-theme">
        <div class="game-header">
          <div class="game-stat"><span>SKOR</span><b id="cannon-score">0</b></div>
          <div class="game-stat"><span>TOP HAKKI</span><b id="cannon-ammo">3</b></div>
          <div class="game-stat"><span>DEVİRİLEN</span><b id="cannon-knocked">0 / 6</b></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="cannon-highscore">${ticketShop.getHighScore('cannon_target')}</b></div>
          <button class="game-close-btn" id="cannon-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <canvas id="cannon-canvas" width="700" height="500"></canvas>
          <div id="cannon-overlay" class="game-overlay-screen">
            <h2 id="cannon-overlay-title">FESTİVAL TOP ATIŞI</h2>
            <p id="cannon-overlay-desc">Topu geriye doğru çek ve nişan al! Piramit halindeki teneke kutuları ve hareketli ördekleri devir!</p>
            <button id="cannon-start-btn" class="arcade-btn-primary">ATIŞA BAŞLA</button>
          </div>
        </div>
        <div class="game-footer-hint">
          💡 Fareyi veya parmağını topun üzerinden tutup geriye çekerek nişan al ve bırak!
        </div>
      </div>
    `;

    this.canvas = document.getElementById('cannon-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById('cannon-score');
    this.ammoEl = document.getElementById('cannon-ammo');
    this.knockedEl = document.getElementById('cannon-knocked');
    this.overlay = document.getElementById('cannon-overlay');
    this.startBtn = document.getElementById('cannon-start-btn');
    this.closeBtn = document.getElementById('cannon-close');
  }

  resetState() {
    this.score = 0;
    this.ammo = 3;
    this.level = 1;
    this.cannonPos = { x: 100, y: 380 };

    // Aiming state
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragCurrent = { x: 0, y: 0 };

    // Active projectile
    this.balls = [];
    this.particles = [];

    // Shelves and Bottle objects
    this.shelves = [
      { x: 440, y: 340, width: 220, height: 14 }
    ];

    this.bottles = [];
    this.ducks = [];
    this.balloons = [];

    this.initLevelObjects();
  }

  initLevelObjects() {
    this.bottles = [];
    this.ducks = [];
    this.balloons = [];

    // Construct 3-2-1 pyramid on the shelf
    const sx = 480;
    const sy = 340;
    const bw = 24;
    const bh = 42;

    // Row 1 (Bottom 3)
    for (let i = 0; i < 3; i++) {
      this.bottles.push(this.createBottle(sx + i * 32, sy - bh / 2, bw, bh));
    }
    // Row 2 (Middle 2)
    for (let i = 0; i < 2; i++) {
      this.bottles.push(this.createBottle(sx + 16 + i * 32, sy - bh - bh / 2, bw, bh));
    }
    // Row 3 (Top 1)
    this.bottles.push(this.createBottle(sx + 32, sy - bh * 2 - bh / 2, bw, bh));

    // Moving duck targets on a higher shelf
    this.ducks.push({
      x: 350,
      y: 160,
      width: 32,
      height: 28,
      vx: 1.5,
      minX: 340,
      maxX: 640,
      alive: true
    });

    // Floating balloons
    this.balloons.push({
      x: 380,
      y: 80,
      radius: 18,
      color: '#ff00aa',
      alive: true
    });
    this.balloons.push({
      x: 580,
      y: 110,
      radius: 18,
      color: '#00f2fe',
      alive: true
    });
  }

  createBottle(x, y, w, h) {
    return {
      x,
      y,
      initX: x,
      initY: y,
      w,
      h,
      vx: 0,
      vy: 0,
      angle: 0,
      vAngle: 0,
      knocked: false,
      color: '#ffbe0b'
    };
  }

  bindEvents() {
    this.onDown = (e) => {
      if (!this.running || this.ammo <= 0) return;
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const x = (clientX - rect.left) * (700 / rect.width);
      const y = (clientY - rect.top) * (500 / rect.height);

      if (Math.hypot(x - this.cannonPos.x, y - this.cannonPos.y) < 70) {
        this.isDragging = true;
        this.dragStart = { x: this.cannonPos.x, y: this.cannonPos.y };
        this.dragCurrent = { x, y };
      }
    };

    this.onMove = (e) => {
      if (!this.isDragging) return;
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const x = (clientX - rect.left) * (700 / rect.width);
      const y = (clientY - rect.top) * (500 / rect.height);

      // Limit drag distance
      const dx = x - this.cannonPos.x;
      const dy = y - this.cannonPos.y;
      const dist = Math.min(100, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);

      this.dragCurrent = {
        x: this.cannonPos.x + Math.cos(angle) * dist,
        y: this.cannonPos.y + Math.sin(angle) * dist
      };
    };

    this.onUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Fire projectile
      const dx = this.cannonPos.x - this.dragCurrent.x;
      const dy = this.cannonPos.y - this.dragCurrent.y;
      const power = Math.hypot(dx, dy) * 0.28;

      if (power > 3) {
        const angle = Math.atan2(dy, dx);
        this.balls.push({
          x: this.cannonPos.x,
          y: this.cannonPos.y,
          vx: Math.cos(angle) * power,
          vy: Math.sin(angle) * power,
          radius: 12,
          bounces: 0,
          alive: true
        });

        this.ammo--;
        this.ammoEl.textContent = this.ammo;
        sound.playCannon();
      }
    };

    this.canvas.addEventListener('mousedown', this.onDown);
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('mouseup', this.onUp);

    this.canvas.addEventListener('touchstart', this.onDown, { passive: false });
    window.addEventListener('touchmove', this.onMove, { passive: false });
    window.addEventListener('touchend', this.onUp);

    this.startBtn.addEventListener('click', () => this.start());
    this.closeBtn.addEventListener('click', () => this.stop());
  }

  start() {
    this.resetState();
    this.running = true;
    this.overlay.style.display = 'none';
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.onGameOver) this.onGameOver();
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const gravity = 0.25;

    // Update Projectile Balls
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      b.vy += gravity;
      b.x += b.vx;
      b.y += b.vy;

      // Floor bounce
      if (b.y + b.radius >= 470) {
        b.y = 470 - b.radius;
        b.vy = -b.vy * 0.55;
        b.vx *= 0.8;
        b.bounces++;
        if (Math.abs(b.vy) > 2) sound.playTone(180, 'sine', 0.05, 0.08);
      }

      // Ball vs Shelves
      this.shelves.forEach(sh => {
        if (b.x >= sh.x && b.x <= sh.x + sh.width && b.y + b.radius >= sh.y && b.y - b.radius <= sh.y + sh.height) {
          b.vy = -b.vy * 0.6;
          b.y = sh.y - b.radius;
        }
      });

      // Ball vs Bottles (Physics Impulse Transfer)
      this.bottles.forEach(bottle => {
        if (this.checkBallBottleOverlap(b, bottle)) {
          const impulseX = b.vx * 0.85;
          const impulseY = b.vy * 0.85;

          bottle.vx += impulseX;
          bottle.vy += impulseY - 2;
          bottle.vAngle += (Math.random() - 0.5) * 0.4 + impulseX * 0.02;

          b.vx *= 0.4;
          b.vy *= 0.4;

          sound.playHit();
          this.spawnBottleShards(bottle.x, bottle.y);

          if (!bottle.knocked) {
            bottle.knocked = true;
            this.score += 50;
            this.scoreEl.textContent = this.score;
          }
        }
      });

      // Ball vs Ducks
      this.ducks.forEach(duck => {
        if (duck.alive && Math.hypot(b.x - duck.x, b.y - duck.y) < b.radius + duck.width / 2) {
          duck.alive = false;
          this.score += 100;
          this.scoreEl.textContent = this.score;
          sound.playVictory();
          this.spawnBottleShards(duck.x, duck.y, '#ffd700', 16);
        }
      });

      // Ball vs Balloons
      this.balloons.forEach(bal => {
        if (bal.alive && Math.hypot(b.x - bal.x, b.y - bal.y) < b.radius + bal.radius) {
          bal.alive = false;
          this.score += 80;
          this.scoreEl.textContent = this.score;
          sound.playPowerup();
          this.spawnBottleShards(bal.x, bal.y, bal.color, 20);
        }
      });

      // Trail
      if (Math.random() < 0.4) {
        this.particles.push({
          x: b.x,
          y: b.y,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          color: '#00f2fe',
          alpha: 0.6,
          size: 3
        });
      }

      if (b.x > 750 || b.y > 550 || (b.bounces > 4 && Math.abs(b.vx) < 0.2)) {
        this.balls.splice(i, 1);
      }
    }

    // Update Bottles physics (Gravity + rotation)
    let knockedCount = 0;
    this.bottles.forEach(bottle => {
      bottle.vy += gravity * 0.9;
      bottle.x += bottle.vx;
      bottle.y += bottle.vy;
      bottle.angle += bottle.vAngle;

      bottle.vx *= 0.96;
      bottle.vAngle *= 0.95;

      // Check if off original shelf position or tipped over
      if (Math.abs(bottle.angle) > 0.4 || Math.abs(bottle.x - bottle.initX) > 20 || bottle.y > bottle.initY + 15) {
        bottle.knocked = true;
      }

      if (bottle.knocked) knockedCount++;

      // Floor collision for bottles
      if (bottle.y + bottle.h / 2 >= 470) {
        bottle.y = 470 - bottle.h / 2;
        bottle.vy = -bottle.vy * 0.2;
        bottle.vAngle *= 0.8;
      }
    });

    this.knockedEl.textContent = `${knockedCount} / ${this.bottles.length}`;

    // Update Ducks
    this.ducks.forEach(duck => {
      duck.x += duck.vx;
      if (duck.x > duck.maxX || duck.x < duck.minX) {
        duck.vx = -duck.vx;
      }
    });

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Check Round Over
    if (this.ammo === 0 && this.balls.length === 0) {
      setTimeout(() => this.handleGameOver(knockedCount), 600);
    }
  }

  checkBallBottleOverlap(ball, bottle) {
    const dx = Math.abs(ball.x - bottle.x);
    const dy = Math.abs(ball.y - bottle.y);
    return dx < (ball.radius + bottle.w / 2) && dy < (ball.radius + bottle.h / 2);
  }

  spawnBottleShards(x, y, color = '#ffbe0b', count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 6 - 2,
        color,
        size: 3 + Math.random() * 3,
        alpha: 1
      });
    }
  }

  handleGameOver(knocked) {
    if (!this.running) return;
    this.running = false;

    const allClearBonus = (knocked === this.bottles.length) ? 200 : 0;
    this.score += allClearBonus;
    this.scoreEl.textContent = this.score;

    const earnedTickets = Math.floor(this.score / 60);
    if (earnedTickets > 0) {
      ticketShop.addTickets(earnedTickets);
    }
    const isNewHigh = ticketShop.setHighScore('cannon_target', this.score);

    document.getElementById('cannon-overlay-title').textContent = (knocked === this.bottles.length) ? 'TAM İSABET! 🎯' : 'ATIŞLAR BİTTİ!';
    document.getElementById('cannon-overlay-desc').innerHTML = `
      Toplam Skor: <b>${this.score}</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
      Devrilen Kutular: <b>${knocked} / ${this.bottles.length}</b><br>
      Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
    `;
    this.startBtn.textContent = 'YENİDEN DENE';
    this.overlay.style.display = 'flex';
  }

  render() {
    const ctx = this.ctx;

    // Wooden Carnival Booth Background
    ctx.fillStyle = '#2b1b17';
    ctx.fillRect(0, 0, 700, 500);

    // Striped Tent Awning at top
    const sliceW = 35;
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = (i % 2 === 0) ? '#e63946' : '#f1faee';
      ctx.beginPath();
      ctx.moveTo(i * sliceW, 0);
      ctx.lineTo((i + 1) * sliceW, 0);
      ctx.lineTo((i + 0.5) * sliceW, 35);
      ctx.closePath();
      ctx.fill();
    }

    // Ground Shelf
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(0, 470, 700, 30);
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 470, 700, 4);

    // Target Shelves
    this.shelves.forEach(sh => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(sh.x, sh.y, sh.width, sh.height);
      ctx.fillStyle = '#a06835';
      ctx.fillRect(sh.x, sh.y, sh.width, 3);
      // Support brackets
      ctx.fillRect(sh.x + 20, sh.y + sh.height, 10, 30);
      ctx.fillRect(sh.x + sh.width - 30, sh.y + sh.height, 10, 30);
    });

    // Upper Duck Rail
    ctx.strokeStyle = '#a06835';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(320, 185);
    ctx.lineTo(660, 185);
    ctx.stroke();

    // Draw Balloons
    this.balloons.forEach(bal => {
      if (!bal.alive) return;
      ctx.save();
      ctx.fillStyle = bal.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = bal.color;
      ctx.beginPath();
      ctx.arc(bal.x, bal.y, bal.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bal.x, bal.y + bal.radius);
      ctx.lineTo(bal.x, bal.y + bal.radius + 15);
      ctx.stroke();
      ctx.restore();
    });

    // Draw Ducks
    this.ducks.forEach(d => {
      if (!d.alive) return;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2); // Body
      ctx.fill();
      ctx.beginPath();
      ctx.arc(10 * Math.sign(d.vx), -8, 8, 0, Math.PI * 2); // Head
      ctx.fill();
      ctx.fillStyle = '#f77f00';
      ctx.fillRect(14 * Math.sign(d.vx), -8, 6 * Math.sign(d.vx), 4); // Beak
      ctx.restore();
    });

    // Draw Bottles
    this.bottles.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      ctx.fillStyle = b.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = b.color;
      ctx.beginPath();
      ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 3);
      ctx.fill();

      // Bottle stripes
      ctx.fillStyle = '#d62828';
      ctx.fillRect(-b.w / 2, -b.h / 4, b.w, 6);
      ctx.restore();
    });

    // Draw Slingshot / Cannon Stand
    ctx.save();
    ctx.strokeStyle = '#c68a4c';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(this.cannonPos.x - 15, this.cannonPos.y + 40);
    ctx.lineTo(this.cannonPos.x - 15, this.cannonPos.y);
    ctx.lineTo(this.cannonPos.x + 15, this.cannonPos.y);
    ctx.lineTo(this.cannonPos.x + 15, this.cannonPos.y + 40);
    ctx.stroke();

    // Aiming Trajectory Preview
    if (this.isDragging) {
      const dx = this.cannonPos.x - this.dragCurrent.x;
      const dy = this.cannonPos.y - this.dragCurrent.y;
      const power = Math.hypot(dx, dy) * 0.28;
      const angle = Math.atan2(dy, dx);
      let simX = this.cannonPos.x;
      let simY = this.cannonPos.y;
      let simVx = Math.cos(angle) * power;
      let simVy = Math.sin(angle) * power;

      ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
      for (let step = 0; step < 28; step++) {
        simVy += 0.25;
        simX += simVx;
        simY += simVy;
        if (step % 2 === 0) {
          ctx.beginPath();
          ctx.arc(simX, simY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Elastic Slingshot bands
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.cannonPos.x - 15, this.cannonPos.y);
      ctx.lineTo(this.dragCurrent.x, this.dragCurrent.y);
      ctx.moveTo(this.cannonPos.x + 15, this.cannonPos.y);
      ctx.lineTo(this.dragCurrent.x, this.dragCurrent.y);
      ctx.stroke();

      // Ball in slingshot
      ctx.fillStyle = '#00f2fe';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f2fe';
      ctx.beginPath();
      ctx.arc(this.dragCurrent.x, this.dragCurrent.y, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Idle ball on pedestal
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(this.cannonPos.x, this.cannonPos.y, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Draw Active Projectiles
    this.balls.forEach(b => {
      ctx.save();
      ctx.fillStyle = '#00f2fe';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f2fe';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}
