// 4. Neon Pinball & Bumper Frenzy
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class PinballGame {
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
      <div class="game-wrapper pinball-theme">
        <div class="game-header">
          <div class="game-stat"><span>SKOR</span><b id="pinball-score">0</b></div>
          <div class="game-stat"><span>TOP</span><b id="pinball-balls">3 / 3</b></div>
          <div class="game-stat"><span>KOMBO</span><b id="pinball-combo" class="highlight">x1</b></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="pinball-highscore">${ticketShop.getHighScore('pinball')}</b></div>
          <button class="game-close-btn" id="pinball-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <canvas id="pinball-canvas" width="460" height="700"></canvas>
          <div id="pinball-overlay" class="game-overlay-screen">
            <h2 id="pinball-overlay-title">NEON PİNBALL</h2>
            <p id="pinball-overlay-desc">Sol/Sağ Paletler: A/D veya Sol/Sağ Oklar. Top Fırlatıcı: SPACE tuşuna basılı tut ve bırak!</p>
            <button id="pinball-start-btn" class="arcade-btn-primary">PİNBALL'A BAŞLA</button>
          </div>
        </div>
        <div class="mobile-pinball-controls">
          <button class="flipper-btn left-flip" id="pinball-btn-left">◀ SOL PALET</button>
          <button class="plunger-btn-mobile" id="pinball-btn-launch">🚀 FIRLAT</button>
          <button class="flipper-btn right-flip" id="pinball-btn-right">SAĞ PALET ▶</button>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('pinball-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById('pinball-score');
    this.ballsEl = document.getElementById('pinball-balls');
    this.comboEl = document.getElementById('pinball-combo');
    this.overlay = document.getElementById('pinball-overlay');
    this.startBtn = document.getElementById('pinball-start-btn');
    this.closeBtn = document.getElementById('pinball-close');
  }

  resetState() {
    this.score = 0;
    this.ballsLeft = 3;
    this.combo = 1;
    this.comboTimer = 0;

    // Plunger state
    this.plungerCharge = 0;
    this.isChargingPlunger = false;
    this.inShooterLane = true;

    // Ball
    this.ball = {
      x: 435,
      y: 600,
      vx: 0,
      vy: 0,
      radius: 9,
      active: true
    };

    // Flippers
    this.leftFlipper = {
      pivotX: 130,
      pivotY: 620,
      length: 65,
      restAngle: 0.5,
      upAngle: -0.5,
      angle: 0.5,
      isUp: false
    };

    this.rightFlipper = {
      pivotX: 270,
      pivotY: 620,
      length: 65,
      restAngle: Math.PI - 0.5,
      upAngle: Math.PI + 0.5,
      angle: Math.PI - 0.5,
      isUp: false
    };

    // Bumpers
    this.bumpers = [
      { x: 140, y: 220, radius: 26, color: '#ff007f', hitAnim: 0 },
      { x: 260, y: 220, radius: 26, color: '#00f2fe', hitAnim: 0 },
      { x: 200, y: 130, radius: 30, color: '#ffe600', hitAnim: 0 },
      { x: 200, y: 310, radius: 22, color: '#33ff99', hitAnim: 0 }
    ];

    // Slingshots (triangles above flippers)
    this.slings = [
      { p1: { x: 75, y: 490 }, p2: { x: 115, y: 560 }, p3: { x: 75, y: 560 }, hitAnim: 0 },
      { p1: { x: 325, y: 490 }, p2: { x: 285, y: 560 }, p3: { x: 325, y: 560 }, hitAnim: 0 }
    ];

    // Drop Targets (Rollover lights)
    this.targets = [
      { x: 100, y: 75, lit: false, color: '#ff00aa' },
      { x: 150, y: 65, lit: false, color: '#00f2fe' },
      { x: 200, y: 60, lit: false, color: '#ffea00' },
      { x: 250, y: 65, lit: false, color: '#00ff66' },
      { x: 300, y: 75, lit: false, color: '#ff00aa' }
    ];

    this.particles = [];
  }

  bindEvents() {
    this.keyDownHandler = (e) => {
      if (!this.running) return;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        if (!this.leftFlipper.isUp) sound.playFlipper();
        this.leftFlipper.isUp = true;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        if (!this.rightFlipper.isUp) sound.playFlipper();
        this.rightFlipper.isUp = true;
      }
      if (['Space', 'ArrowDown', 'KeyS'].includes(e.code)) {
        if (this.inShooterLane) this.isChargingPlunger = true;
      }
    };

    this.keyUpHandler = (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.leftFlipper.isUp = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.rightFlipper.isUp = false;
      if (['Space', 'ArrowDown', 'KeyS'].includes(e.code)) {
        if (this.isChargingPlunger) {
          this.releasePlunger();
        }
      }
    };

    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);

    this.startBtn.addEventListener('click', () => this.start());
    this.closeBtn.addEventListener('click', () => this.stop());

    // Mobile buttons
    const btnLeft = document.getElementById('pinball-btn-left');
    const btnRight = document.getElementById('pinball-btn-right');
    const btnLaunch = document.getElementById('pinball-btn-launch');

    if (btnLeft && btnRight && btnLaunch) {
      btnLeft.addEventListener('pointerdown', () => { sound.playFlipper(); this.leftFlipper.isUp = true; });
      btnLeft.addEventListener('pointerup', () => { this.leftFlipper.isUp = false; });
      btnLeft.addEventListener('pointerleave', () => { this.leftFlipper.isUp = false; });

      btnRight.addEventListener('pointerdown', () => { sound.playFlipper(); this.rightFlipper.isUp = true; });
      btnRight.addEventListener('pointerup', () => { this.rightFlipper.isUp = false; });
      btnRight.addEventListener('pointerleave', () => { this.rightFlipper.isUp = false; });

      btnLaunch.addEventListener('pointerdown', () => { if (this.inShooterLane) this.isChargingPlunger = true; });
      btnLaunch.addEventListener('pointerup', () => { if (this.isChargingPlunger) this.releasePlunger(); });
      btnLaunch.addEventListener('pointerleave', () => { if (this.isChargingPlunger) this.releasePlunger(); });
    }
  }

  releasePlunger() {
    this.isChargingPlunger = false;
    if (this.plungerCharge > 10) {
      this.ball.vy = -Math.min(22, this.plungerCharge * 0.35 + 8);
      this.ball.vx = -1.2;
      this.inShooterLane = false;
      sound.playTone(320, 'sine', 0.15, 0.15, 400);
    }
    this.plungerCharge = 0;
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
    // Plunger charging
    if (this.isChargingPlunger) {
      this.plungerCharge = Math.min(60, this.plungerCharge + 1.2);
    }

    // Flipper angular speed
    const flipSpeed = 0.28;
    if (this.leftFlipper.isUp) {
      this.leftFlipper.angle = Math.max(this.leftFlipper.upAngle, this.leftFlipper.angle - flipSpeed);
    } else {
      this.leftFlipper.angle = Math.min(this.leftFlipper.restAngle, this.leftFlipper.angle + flipSpeed);
    }

    if (this.rightFlipper.isUp) {
      this.rightFlipper.angle = Math.min(this.rightFlipper.upAngle, this.rightFlipper.angle + flipSpeed);
    } else {
      this.rightFlipper.angle = Math.max(this.rightFlipper.restAngle, this.rightFlipper.angle - flipSpeed);
    }

    // Combo timer
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.combo = 1;
        this.comboEl.textContent = 'x1';
      }
    }

    // Physics step
    const gravity = 0.2;
    const b = this.ball;

    if (!this.inShooterLane) {
      b.vy += gravity;
      b.x += b.vx;
      b.y += b.vy;

      // Friction
      b.vx *= 0.995;
      b.vy *= 0.995;

      // Outer curved boundary collision
      if (b.x < 35) {
        b.x = 35;
        b.vx = -b.vx * 0.7;
      }
      if (b.x > 400 && b.y > 150) {
        b.x = 400;
        b.vx = -b.vx * 0.7;
      }
      if (b.y < 35) {
        b.y = 35;
        b.vy = -b.vy * 0.7;
      }

      // Top right curved lane (returns ball into table)
      if (b.x > 410 && b.y < 120) {
        b.vx = -4;
        b.vy = 2;
      }

      // Bumpers Collision
      this.bumpers.forEach(bump => {
        const dist = Math.hypot(b.x - bump.x, b.y - bump.y);
        if (dist < b.radius + bump.radius) {
          const angle = Math.atan2(b.y - bump.y, b.x - bump.x);
          const force = 10;
          b.vx = Math.cos(angle) * force;
          b.vy = Math.sin(angle) * force;

          bump.hitAnim = 12;
          this.score += 50 * this.combo;
          this.combo = Math.min(8, this.combo + 1);
          this.comboTimer = 90;
          this.comboEl.textContent = `x${this.combo}`;
          this.scoreEl.textContent = this.score;

          sound.playBumper();
          this.spawnHitParticles(bump.x, bump.y, bump.color);
        }
      });

      // Target roll-overs
      this.targets.forEach(t => {
        if (!t.lit && Math.hypot(b.x - t.x, b.y - t.y) < b.radius + 14) {
          t.lit = true;
          this.score += 150 * this.combo;
          this.scoreEl.textContent = this.score;
          sound.playTone(880, 'sine', 0.12, 0.15);
          this.spawnHitParticles(t.x, t.y, t.color);

          // All targets lit bonus!
          if (this.targets.every(tg => tg.lit)) {
            this.score += 1000;
            this.scoreEl.textContent = this.score;
            sound.playVictory();
            setTimeout(() => this.targets.forEach(tg => tg.lit = false), 1000);
          }
        }
      });

      // Flippers Collision
      this.checkFlipperCollision(this.leftFlipper, true);
      this.checkFlipperCollision(this.rightFlipper, false);

      // Drain (Lost Ball)
      if (b.y > 710) {
        this.handleDrain();
      }
    }

    // Update animations
    this.bumpers.forEach(bm => { if (bm.hitAnim > 0) bm.hitAnim--; });
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.04;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  checkFlipperCollision(flipper, isLeft) {
    const b = this.ball;
    const fx2 = flipper.pivotX + Math.cos(flipper.angle) * flipper.length;
    const fy2 = flipper.pivotY + Math.sin(flipper.angle) * flipper.length;

    // Line segment distance
    const l2 = flipper.length * flipper.length;
    let t = ((b.x - flipper.pivotX) * (fx2 - flipper.pivotX) + (b.y - flipper.pivotY) * (fy2 - flipper.pivotY)) / l2;
    t = Math.max(0, Math.min(1, t));

    const projX = flipper.pivotX + t * (fx2 - flipper.pivotX);
    const projY = flipper.pivotY + t * (fy2 - flipper.pivotY);

    const dist = Math.hypot(b.x - projX, b.y - projY);

    if (dist < b.radius + 6) {
      const normalAngle = flipper.angle - (isLeft ? Math.PI / 2 : -Math.PI / 2);
      const impulse = flipper.isUp ? 13 : 5;

      b.vx = Math.cos(normalAngle) * impulse + (isLeft ? 2 : -2);
      b.vy = Math.sin(normalAngle) * impulse - 3;
      b.y = projY - b.radius - 2;

      sound.playFlipper();
      this.spawnHitParticles(projX, projY, '#00f2fe', 6);
    }
  }

  spawnHitParticles(x, y, color, count = 12) {
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

  handleDrain() {
    this.ballsLeft--;
    this.ballsEl.textContent = `${this.ballsLeft} / 3`;
    sound.playGameOver();

    if (this.ballsLeft <= 0) {
      this.handleGameOver();
    } else {
      // Reset ball to shooter lane
      this.inShooterLane = true;
      this.ball.x = 435;
      this.ball.y = 600;
      this.ball.vx = 0;
      this.ball.vy = 0;
    }
  }

  handleGameOver() {
    this.running = false;
    const earnedTickets = Math.floor(this.score / 80);
    if (earnedTickets > 0) {
      ticketShop.addTickets(earnedTickets);
    }
    const isNewHigh = ticketShop.setHighScore('pinball', this.score);

    document.getElementById('pinball-overlay-title').textContent = 'PİNBALL TAMAMLANDI!';
    document.getElementById('pinball-overlay-desc').innerHTML = `
      Toplam Skor: <b>${this.score}</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
      Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
    `;
    this.startBtn.textContent = 'YENİDEN OYNA';
    this.overlay.style.display = 'flex';
  }

  render() {
    const ctx = this.ctx;

    // Table BG
    ctx.fillStyle = '#0e0b1d';
    ctx.fillRect(0, 0, 460, 700);

    // Shooter lane separator
    ctx.strokeStyle = '#3d2b63';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(415, 160);
    ctx.lineTo(415, 700);
    ctx.stroke();

    // Outer table neon border
    ctx.strokeStyle = '#ff00aa';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00aa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(35, 700);
    ctx.lineTo(35, 160);
    ctx.arc(225, 160, 190, Math.PI, 0, false);
    ctx.lineTo(445, 700);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Targets
    this.targets.forEach(t => {
      ctx.save();
      ctx.fillStyle = t.lit ? t.color : '#333';
      ctx.shadowBlur = t.lit ? 14 : 0;
      ctx.shadowColor = t.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Bumpers
    this.bumpers.forEach(bump => {
      ctx.save();
      ctx.fillStyle = bump.color;
      ctx.shadowBlur = bump.hitAnim > 0 ? 25 : 12;
      ctx.shadowColor = bump.color;
      ctx.beginPath();
      ctx.arc(bump.x, bump.y, bump.radius + (bump.hitAnim > 0 ? 3 : 0), 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bump.x, bump.y, bump.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Slingshots
    this.slings.forEach(sl => {
      ctx.save();
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f2fe';
      ctx.beginPath();
      ctx.moveTo(sl.p1.x, sl.p1.y);
      ctx.lineTo(sl.p2.x, sl.p2.y);
      ctx.lineTo(sl.p3.x, sl.p3.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    // Draw Left & Right Flippers
    this.drawFlipper(ctx, this.leftFlipper, '#00f2fe');
    this.drawFlipper(ctx, this.rightFlipper, '#ff007f');

    // Draw Plunger
    ctx.save();
    ctx.fillStyle = '#555';
    ctx.fillRect(425, 640 + this.plungerCharge * 0.5, 20, 50);
    ctx.fillStyle = '#ff3366';
    ctx.fillRect(420, 630 + this.plungerCharge * 0.5, 30, 10);
    ctx.restore();

    // Draw Ball
    ctx.save();
    ctx.fillStyle = '#f8f9fa';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

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

  drawFlipper(ctx, f, color) {
    const fx2 = f.pivotX + Math.cos(f.angle) * f.length;
    const fy2 = f.pivotY + Math.sin(f.angle) * f.length;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(f.pivotX, f.pivotY);
    ctx.lineTo(fx2, fy2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(f.pivotX, f.pivotY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
