// 2. Nitro Drift Highway - Car Racing Game
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class CarRacingGame {
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
      <div class="game-wrapper racing-theme">
        <div class="game-header">
          <div class="game-stat"><span>MESAFE</span><b id="race-dist">0 m</b></div>
          <div class="game-stat"><span>HIZ</span><b id="race-speed">0 km/h</b></div>
          <div class="game-stat"><span>NİTRO</span><div class="nitro-bar-container"><div id="race-nitro-bar"></div></div></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="race-highscore">${ticketShop.getHighScore('car_racing')} m</b></div>
          <button class="game-close-btn" id="race-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <canvas id="race-canvas" width="500" height="700"></canvas>
          <div id="race-overlay" class="game-overlay-screen">
            <h2 id="race-overlay-title">NİTRO DRİFT YARIŞI</h2>
            <p id="race-overlay-desc">Trafiğe çarpmadan en uzun mesafeyi git! A/D veya Sol/Sağ ile yön ver, W/Yukarı ile gaz, Space ile NİTRO aç!</p>
            <button id="race-start-btn" class="arcade-btn-primary">GAZA BAS!</button>
          </div>
        </div>
        <div class="mobile-racing-controls">
          <button class="steer-btn" id="race-btn-left">◀ SOL</button>
          <button class="nitro-btn-mobile" id="race-btn-nitro">🔥 NİTRO</button>
          <button class="steer-btn" id="race-btn-right">SAĞ ▶</button>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('race-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.distEl = document.getElementById('race-dist');
    this.speedEl = document.getElementById('race-speed');
    this.nitroBar = document.getElementById('race-nitro-bar');
    this.overlay = document.getElementById('race-overlay');
    this.startBtn = document.getElementById('race-start-btn');
    this.closeBtn = document.getElementById('race-close');
  }

  resetState() {
    this.roadWidth = 380;
    this.roadX = (500 - this.roadWidth) / 2;
    this.player = {
      x: 250,
      y: 560,
      vx: 0,
      width: 44,
      height: 76,
      angle: 0,
      targetAngle: 0,
      color: '#ff0055'
    };

    this.speed = 0;
    this.maxSpeed = 160;
    this.distance = 0;
    this.nitro = 100;
    this.isNitroActive = false;

    this.roadOffset = 0;
    this.traffic = [];
    this.collectibles = [];
    this.skidMarks = [];
    this.smokeParticles = [];

    this.keys = { left: false, right: false, up: false, down: false, space: false };
    this.spawnTimer = 0;
    this.itemTimer = 0;
  }

  bindEvents() {
    this.keyDownHandler = (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = true;
      if (['Space'].includes(e.code)) this.keys.space = true;
    };

    this.keyUpHandler = (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = false;
      if (['Space'].includes(e.code)) this.keys.space = false;
    };

    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);

    this.startBtn.addEventListener('click', () => this.start());
    this.closeBtn.addEventListener('click', () => this.stop());

    // Mobile buttons
    const btnLeft = document.getElementById('race-btn-left');
    const btnRight = document.getElementById('race-btn-right');
    const btnNitro = document.getElementById('race-btn-nitro');

    if (btnLeft && btnRight && btnNitro) {
      btnLeft.addEventListener('pointerdown', () => { this.keys.left = true; });
      btnLeft.addEventListener('pointerup', () => { this.keys.left = false; });
      btnLeft.addEventListener('pointerleave', () => { this.keys.left = false; });

      btnRight.addEventListener('pointerdown', () => { this.keys.right = true; });
      btnRight.addEventListener('pointerup', () => { this.keys.right = false; });
      btnRight.addEventListener('pointerleave', () => { this.keys.right = false; });

      btnNitro.addEventListener('pointerdown', () => { this.keys.space = true; });
      btnNitro.addEventListener('pointerup', () => { this.keys.space = false; });
      btnNitro.addEventListener('pointerleave', () => { this.keys.space = false; });
    }
  }

  start() {
    this.resetState();
    this.running = true;
    this.overlay.style.display = 'none';
    sound.startEngine();
    this.loop();
  }

  stop() {
    this.running = false;
    sound.stopEngine();
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
    // Speed mechanics
    const nitroEngaged = this.keys.space && this.nitro > 5;
    this.isNitroActive = nitroEngaged;

    let targetMax = this.maxSpeed;
    if (nitroEngaged) {
      targetMax = 230;
      this.nitro = Math.max(0, this.nitro - 0.7);
    } else {
      this.nitro = Math.min(100, this.nitro + 0.15);
    }

    if (this.keys.up || this.running) {
      // Auto accelerate smoothly + boost with W
      const accel = this.keys.up ? 1.4 : 0.8;
      this.speed = Math.min(targetMax, this.speed + accel);
    }
    if (this.keys.down) {
      this.speed = Math.max(30, this.speed - 2.5);
    }

    this.distance += Math.round(this.speed * 0.04);
    this.distEl.textContent = `${this.distance} m`;
    this.speedEl.textContent = `${Math.round(this.speed)} km/h`;
    this.nitroBar.style.width = `${this.nitro}%`;

    // Engine Audio update
    sound.updateEngine(this.speed / 230, Math.abs(this.player.vx) > 3.5);

    // Steering Physics with Inertia
    const steerSpeed = (this.speed / 120) * 4.5;
    if (this.keys.left) {
      this.player.vx -= 0.6;
      this.player.targetAngle = -0.18;
    } else if (this.keys.right) {
      this.player.vx += 0.6;
      this.player.targetAngle = 0.18;
    } else {
      this.player.vx *= 0.82;
      this.player.targetAngle = 0;
    }

    this.player.vx = Math.max(-6, Math.min(6, this.player.vx));
    this.player.x += this.player.vx;
    this.player.angle += (this.player.targetAngle - this.player.angle) * 0.2;

    // Road bounds & grass friction
    const minX = this.roadX + 25;
    const maxX = this.roadX + this.roadWidth - 25;
    if (this.player.x < minX) {
      this.player.x = minX;
      this.speed = Math.max(40, this.speed - 3);
    }
    if (this.player.x > maxX) {
      this.player.x = maxX;
      this.speed = Math.max(40, this.speed - 3);
    }

    // Road scroll
    this.roadOffset = (this.roadOffset + this.speed * 0.15) % 80;

    // Drift Skid marks & smoke
    if (Math.abs(this.player.vx) > 2.8 || nitroEngaged) {
      this.skidMarks.push({
        x1: this.player.x - 14,
        y1: this.player.y + 24,
        x2: this.player.x + 14,
        y2: this.player.y + 24,
        alpha: 0.6
      });

      this.smokeParticles.push({
        x: this.player.x + (Math.random() * 16 - 8),
        y: this.player.y + 35,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        size: 4 + Math.random() * 6,
        alpha: 0.8,
        color: nitroEngaged ? '#00f2fe' : '#ffffff'
      });
    }

    // Update skid marks
    for (let i = this.skidMarks.length - 1; i >= 0; i--) {
      const s = this.skidMarks[i];
      s.y1 += this.speed * 0.15;
      s.y2 += this.speed * 0.15;
      s.alpha -= 0.008;
      if (s.alpha <= 0 || s.y1 > 720) {
        this.skidMarks.splice(i, 1);
      }
    }

    // Update smoke
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.x += p.vx;
      p.y += p.vy + this.speed * 0.08;
      p.size += 0.3;
      p.alpha -= 0.03;
      if (p.alpha <= 0 || p.y > 720) {
        this.smokeParticles.splice(i, 1);
      }
    }

    // Spawn Traffic
    this.spawnTimer++;
    if (this.spawnTimer > Math.max(35, 75 - Math.floor(this.distance / 200))) {
      this.spawnTimer = 0;
      this.spawnTrafficCar();
    }

    // Spawn Collectibles (Nitro canisters, Tickets)
    this.itemTimer++;
    if (this.itemTimer > 120) {
      this.itemTimer = 0;
      this.spawnItem();
    }

    // Update Traffic
    for (let i = this.traffic.length - 1; i >= 0; i--) {
      const car = this.traffic[i];
      const relativeSpeed = (this.speed - car.speed) * 0.15;
      car.y += relativeSpeed;

      // Check collision with player
      if (this.checkCollision(this.player, car)) {
        this.handleCrash();
        return;
      }

      if (car.y > 750 || car.y < -300) {
        this.traffic.splice(i, 1);
      }
    }

    // Update Collectibles
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const item = this.collectibles[i];
      item.y += this.speed * 0.15;

      if (Math.hypot(this.player.x - item.x, this.player.y - item.y) < 36) {
        if (item.type === 'nitro') {
          this.nitro = Math.min(100, this.nitro + 45);
          sound.playPowerup();
        } else if (item.type === 'ticket') {
          ticketShop.addTickets(1);
          sound.playTicket();
        }
        this.collectibles.splice(i, 1);
        continue;
      }

      if (item.y > 750) {
        this.collectibles.splice(i, 1);
      }
    }
  }

  spawnTrafficCar() {
    const lanes = [this.roadX + 50, this.roadX + 135, this.roadX + 225, this.roadX + 310];
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    const colors = ['#00e5ff', '#ffbe0b', '#70e000', '#9d4edd', '#ffffff'];

    this.traffic.push({
      x: laneX,
      y: -100,
      width: 42,
      height: 72,
      speed: 60 + Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  spawnItem() {
    const lanes = [this.roadX + 60, this.roadX + 140, this.roadX + 220, this.roadX + 300];
    this.collectibles.push({
      x: lanes[Math.floor(Math.random() * lanes.length)],
      y: -50,
      type: Math.random() < 0.6 ? 'nitro' : 'ticket',
      angle: 0
    });
  }

  checkCollision(p, c) {
    return (
      Math.abs(p.x - c.x) < (p.width + c.width) * 0.42 &&
      Math.abs(p.y - c.y) < (p.height + c.height) * 0.42
    );
  }

  handleCrash() {
    this.running = false;
    sound.stopEngine();
    sound.playNoise(0.6, 0.4, 300);
    sound.playGameOver();

    // Reward tickets based on distance (1 ticket per 100m)
    const earnedTickets = Math.floor(this.distance / 100);
    if (earnedTickets > 0) {
      ticketShop.addTickets(earnedTickets);
    }
    const isNewHigh = ticketShop.setHighScore('car_racing', this.distance);

    document.getElementById('race-overlay-title').textContent = 'KAZA YAPTIN!';
    document.getElementById('race-overlay-desc').innerHTML = `
      Gidilen Mesafe: <b>${this.distance} m</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
      Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
    `;
    this.startBtn.textContent = 'YENİDEN YARIŞ';
    this.overlay.style.display = 'flex';
  }

  render() {
    const ctx = this.ctx;

    // Grass / Ground
    ctx.fillStyle = '#0a1913';
    ctx.fillRect(0, 0, 500, 700);

    // Asphalt Road
    ctx.fillStyle = '#1e1e24';
    ctx.fillRect(this.roadX, 0, this.roadWidth, 700);

    // Neon Curbs (Kerbs)
    const curbStep = 40;
    for (let y = -curbStep; y < 700 + curbStep; y += curbStep) {
      const isRed = Math.floor((y + this.roadOffset) / curbStep) % 2 === 0;
      ctx.fillStyle = isRed ? '#ff0055' : '#ffffff';
      ctx.fillRect(this.roadX - 10, y + (this.roadOffset % curbStep), 10, curbStep);
      ctx.fillRect(this.roadX + this.roadWidth, y + (this.roadOffset % curbStep), 10, curbStep);
    }

    // Lane Dividers
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 25]);
    ctx.lineDashOffset = -this.roadOffset;

    const lane1 = this.roadX + this.roadWidth * 0.33;
    const lane2 = this.roadX + this.roadWidth * 0.66;

    ctx.beginPath();
    ctx.moveTo(lane1, 0);
    ctx.lineTo(lane1, 700);
    ctx.moveTo(lane2, 0);
    ctx.lineTo(lane2, 700);
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    // Draw Skid Marks
    this.skidMarks.forEach(s => {
      ctx.strokeStyle = `rgba(0, 0, 0, ${s.alpha})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x1, s.y1 + 10);
      ctx.moveTo(s.x2, s.y2);
      ctx.lineTo(s.x2, s.y2 + 10);
      ctx.stroke();
    });

    // Draw Smoke & Flames
    this.smokeParticles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Collectibles
    this.collectibles.forEach(item => {
      ctx.save();
      ctx.translate(item.x, item.y);
      if (item.type === 'nitro') {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00f2fe';
        ctx.fillStyle = '#00f2fe';
        ctx.fillRect(-10, -14, 20, 28);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('N₂O', 0, 4);
      } else {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffd700';
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-12, -8, 24, 16);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎟️', 0, 4);
      }
      ctx.restore();
    });

    // Draw Traffic Cars
    this.traffic.forEach(car => {
      this.drawCar(ctx, car.x, car.y, car.width, car.height, car.color, 0, false);
    });

    // Draw Player Car
    this.drawCar(ctx, this.player.x, this.player.y, this.player.width, this.player.height, this.player.color, this.player.angle, this.isNitroActive);
  }

  drawCar(ctx, x, y, w, h, color, angle, hasNitro) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Car Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(-w / 2 + 3, -h / 2 + 5, w, h);

    // Tires
    ctx.fillStyle = '#111';
    ctx.fillRect(-w / 2 - 2, -h / 2 + 8, 4, 14); // Front L
    ctx.fillRect(w / 2 - 2, -h / 2 + 8, 4, 14);  // Front R
    ctx.fillRect(-w / 2 - 2, h / 2 - 22, 4, 14);  // Rear L
    ctx.fillRect(w / 2 - 2, h / 2 - 22, 4, 14);   // Rear R

    // Car Body
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, [8, 8, 4, 4]);
    ctx.fill();

    // Windshield & Windows
    ctx.fillStyle = '#111827';
    ctx.fillRect(-w / 2 + 6, -h / 2 + 18, w - 12, 16); // Front glass
    ctx.fillRect(-w / 2 + 6, h / 2 - 24, w - 12, 12);  // Rear glass

    // Roof
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2 + 7, -h / 2 + 26, w - 14, 20);

    // Headlights
    ctx.fillStyle = '#fffce0';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffffaa';
    ctx.fillRect(-w / 2 + 4, -h / 2 + 2, 8, 4);
    ctx.fillRect(w / 2 - 12, -h / 2 + 2, 8, 4);

    // Taillights
    ctx.fillStyle = '#ff1100';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff0000';
    ctx.fillRect(-w / 2 + 4, h / 2 - 4, 8, 3);
    ctx.fillRect(w / 2 - 12, h / 2 - 4, 8, 3);

    // Nitro Flames
    if (hasNitro) {
      ctx.fillStyle = '#00f2fe';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f2fe';
      ctx.beginPath();
      ctx.moveTo(-8, h / 2);
      ctx.lineTo(0, h / 2 + 22 + Math.random() * 8);
      ctx.lineTo(8, h / 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
