// 3. 3D Rocket Acrobat: Gravity Lander (Three.js) - Fixed Launchpad & Intuitive Flying Overhaul
import * as THREE from 'three';
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class RocketLander3D {
  constructor(container, onGameOver) {
    this.container = container;
    this.onGameOver = onGameOver;
    this.running = false;
    this.animationId = null;

    this.initDOM();
    this.initThree();
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
          <div id="rocket-3d-viewport" style="width: 700px; height: 500px; max-width: 90vw; max-height: 60vh; cursor: pointer;"></div>
          <div id="rocket-overlay" class="game-overlay-screen">
            <h2 id="rocket-overlay-title">3D YERÇEKİMİ ROKETİ</h2>
            <p id="rocket-overlay-desc">Fırlatma rampasındasın! SPACE, W veya ekrana basılı tutarak ANA ROKETİ ateşle ve havalan. A / D ile yön verip yeşil platformlara yumuşak iniş yap!</p>
            <button id="rocket-start-btn" class="arcade-btn-primary">RAMPADAN KALK</button>
          </div>
        </div>
        <div class="mobile-rocket-controls">
          <button class="rocket-steer-btn" id="rocket-btn-left">↶ SOL</button>
          <button class="rocket-main-btn" id="rocket-btn-thrust">🔥 BAS VE ATEŞLE</button>
          <button class="rocket-steer-btn" id="rocket-btn-right">SAĞ ↷</button>
        </div>
      </div>
    `;

    this.viewport = document.getElementById('rocket-3d-viewport');
    this.scoreEl = document.getElementById('rocket-score');
    this.fuelBar = document.getElementById('rocket-fuel-bar');
    this.vSpeedEl = document.getElementById('rocket-vspeed');
    this.overlay = document.getElementById('rocket-overlay');
    this.startBtn = document.getElementById('rocket-start-btn');
    this.closeBtn = document.getElementById('rocket-close');
  }

  initThree() {
    const w = this.viewport.clientWidth || 700;
    const h = this.viewport.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a081e);
    this.scene.fog = new THREE.FogExp2(0x0a081e, 0.005);

    this.camera = new THREE.PerspectiveCamera(52, w / h, 0.5, 400);
    this.camera.position.set(0, 16, 38);
    this.camera.lookAt(0, 12, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.viewport.appendChild(this.renderer.domElement);

    // Lighting
    const amb = new THREE.AmbientLight(0x4a3b70, 1.4);
    this.scene.add(amb);

    const dir = new THREE.DirectionalLight(0x8a9bff, 2.0);
    dir.position.set(20, 60, 30);
    this.scene.add(dir);

    // Build 3D Rocket
    this.initRocketMesh();

    // Build Launchpad and Landing Platforms
    this.initPlatforms();
  }

  initRocketMesh() {
    this.rocketGroup = new THREE.Group();

    // Fuselage
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf0f3f8, metalness: 0.7, roughness: 0.2 });
    const bodyGeo = new THREE.CylinderGeometry(1.1, 1.4, 4.8, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2.4;

    const noseGeo = new THREE.ConeGeometry(1.1, 2.4, 16);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xff0055, metalness: 0.5, roughness: 0.3 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.y = 6.0;

    // Cockpit Window
    const winGeo = new THREE.SphereGeometry(0.55, 12, 12);
    const winMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.9 });
    const win = new THREE.Mesh(winGeo, winMat);
    win.position.set(0, 3.8, 1.0);

    // Landing Legs
    const legGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.2, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222, metalness: 0.8 });

    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-1.6, 0.6, 0);
    legL.rotation.z = -0.35;

    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(1.6, 0.6, 0);
    legR.rotation.z = 0.35;

    // Twin Exhaust Bells at Bottom
    const exGeo = new THREE.ConeGeometry(0.4, 0.8, 12, 1, true);
    const exMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 });
    const ex1 = new THREE.Mesh(exGeo, exMat);
    ex1.position.set(-0.4, 0.2, 0);
    const ex2 = new THREE.Mesh(exGeo, exMat);
    ex2.position.set(0.4, 0.2, 0);

    this.rocketGroup.add(body, nose, win, legL, legR, ex1, ex2);
    this.scene.add(this.rocketGroup);
  }

  initPlatforms() {
    this.platforms = [
      { id: 'launchpad', x: -16, y: 1.5, z: 0, width: 8, mult: 1, name: 'FIRLATMA RAMPASI', vx: 0, minX: -16, maxX: -16, isLaunch: true },
      { id: 'p1', x: 0, y: 4.5, z: 0, width: 9, mult: 2, name: '2X GÜVENLİ', vx: 0.05, minX: -4, maxX: 4, isLaunch: false },
      { id: 'p2', x: 16, y: 8.0, z: 0, width: 7, mult: 3, name: '3X HAREKETLİ', vx: -0.09, minX: 10, maxX: 20, isLaunch: false }
    ];

    this.platformMeshes = [];
    this.platforms.forEach(p => {
      const pGroup = new THREE.Group();
      const padGeo = new THREE.BoxGeometry(p.width, 1.4, 7);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x1f1938, roughness: 0.6 });
      const pad = new THREE.Mesh(padGeo, padMat);

      // Neon Top strip
      const stripGeo = new THREE.BoxGeometry(p.width - 0.4, 0.3, 6.6);
      const stripMat = new THREE.MeshStandardMaterial({
        color: p.isLaunch ? 0xffdd00 : 0x00ff88,
        emissive: p.isLaunch ? 0xffaa00 : 0x00aa44,
        emissiveIntensity: 1.2
      });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.y = 0.75;

      pGroup.add(pad, strip);
      pGroup.position.set(p.x, p.y, p.z);
      this.scene.add(pGroup);
      this.platformMeshes.push(pGroup);
    });

    // Floor terrain
    const floorGeo = new THREE.PlaneGeometry(120, 60);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a0815, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.scene.add(floor);
  }

  resetState() {
    // Starts SAFELY parked on Launchpad at x = -16, y = 2.2
    this.rocket = {
      x: -16,
      y: 2.2,
      vx: 0,
      vy: 0,
      angle: 0,
      angVel: 0,
      fuel: 100,
      launched: false, // True once player ignites thruster
      landed: false,
      crashed: false
    };

    this.gravity = -0.010;
    this.mainThrust = 0.026;
    this.keys = { up: false, left: false, right: false };
    this.particles = [];
  }

  bindEvents() {
    this.keyDownHandler = (e) => {
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        this.keys.up = true;
        this.rocket.launched = true;
      }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
    };

    this.keyUpHandler = (e) => {
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) this.keys.up = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
    };

    this.onViewportDown = (e) => {
      if (!this.running) return;
      this.keys.up = true;
      this.rocket.launched = true;
    };

    this.onViewportUp = () => {
      this.keys.up = false;
    };

    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
    this.viewport.addEventListener('pointerdown', this.onViewportDown);
    window.addEventListener('pointerup', this.onViewportUp);

    this.startBtn.addEventListener('click', () => this.start());
    this.closeBtn.addEventListener('click', () => this.stop());

    const btnLeft = document.getElementById('rocket-btn-left');
    const btnRight = document.getElementById('rocket-btn-right');
    const btnThrust = document.getElementById('rocket-btn-thrust');

    if (btnLeft && btnRight && btnThrust) {
      btnLeft.addEventListener('pointerdown', () => { this.keys.left = true; });
      btnLeft.addEventListener('pointerup', () => { this.keys.left = false; });
      btnRight.addEventListener('pointerdown', () => { this.keys.right = true; });
      btnRight.addEventListener('pointerup', () => { this.keys.right = false; });
      btnThrust.addEventListener('pointerdown', () => { this.keys.up = true; this.rocket.launched = true; });
      btnThrust.addEventListener('pointerup', () => { this.keys.up = false; });
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
    this.viewport.removeEventListener('pointerdown', this.onViewportDown);
    window.removeEventListener('pointerup', this.onViewportUp);
    if (this.onGameOver) this.onGameOver();
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const r = this.rocket;
    if (r.crashed || r.landed) return;

    // Before launch: Rocket rests peacefully on Launchpad
    if (!r.launched) {
      r.x = -16;
      r.y = 2.2;
      r.vx = 0;
      r.vy = 0;
      r.angle = 0;
      this.rocketGroup.position.set(r.x, r.y, 0);
      this.rocketGroup.rotation.z = 0;
      this.fuelBar.style.width = '100%';
      this.vSpeedEl.textContent = '0.0 m/s';
      this.vSpeedEl.style.color = '#00ff88';
      return;
    }

    // Rotation Control with Natural Gyro Damping
    if (this.keys.left && r.fuel > 0) {
      r.angVel += 0.0025;
      r.fuel = Math.max(0, r.fuel - 0.05);
    }
    if (this.keys.right && r.fuel > 0) {
      r.angVel -= 0.0025;
      r.fuel = Math.max(0, r.fuel - 0.05);
    }

    r.angVel *= 0.90; // Natural gyro stabilization
    r.angle += r.angVel;
    r.angle = THREE.MathUtils.clamp(r.angle, -0.65, 0.65); // Prevent upside down spinning

    // Main Engine Ignition
    if (this.keys.up && r.fuel > 0) {
      const thrustX = -Math.sin(r.angle) * this.mainThrust;
      const thrustY = Math.cos(r.angle) * this.mainThrust;
      r.vx += thrustX;
      r.vy += thrustY;
      r.fuel = Math.max(0, r.fuel - 0.18);

      sound.startThrust();
      this.spawnThrustParticles(r.x, r.y, r.angle);
    } else {
      sound.stopThrust();
    }

    // Atmospheric Gravity & Drag
    r.vy += this.gravity;
    r.vx *= 0.99;

    r.x += r.vx;
    r.y += r.vy;

    // Boundaries
    if (r.x < -24) { r.x = -24; r.vx = 0; }
    if (r.x > 24) { r.x = 24; r.vx = 0; }

    // Update Rocket Mesh Position
    this.rocketGroup.position.set(r.x, r.y, 0);
    this.rocketGroup.rotation.z = r.angle;

    // Update HUD Meters
    this.fuelBar.style.width = `${r.fuel}%`;
    const vspeed = Math.round(r.vy * 40) / 10;
    this.vSpeedEl.textContent = `${vspeed >= 0 ? '↑' : '↓'} ${Math.abs(vspeed)} m/s`;
    this.vSpeedEl.style.color = (r.vy < -0.45) ? '#ff0055' : '#00ff88';

    // Camera smoothly frames the rocket
    this.camera.position.x += (r.x * 0.45 - this.camera.position.x) * 0.1;
    this.camera.position.y += (r.y * 0.5 + 10 - this.camera.position.y) * 0.1;
    this.camera.lookAt(r.x * 0.3, r.y * 0.4 + 4, 0);

    // Update Moving Platforms & Check Landing Touchdown
    this.platforms.forEach((p, idx) => {
      p.x += p.vx;
      if (p.x < p.minX || p.x > p.maxX) p.vx = -p.vx;
      this.platformMeshes[idx].position.x = p.x;

      if (!p.isLaunch) {
        // Landing Check on destination platforms
        const onPlatformX = (r.x >= p.x - p.width / 2 && r.x <= p.x + p.width / 2);
        const onPlatformY = (r.y <= p.y + 0.9 && r.y >= p.y - 0.6);

        if (onPlatformX && onPlatformY && r.vy < 0) {
          this.evaluateLanding(p);
        }
      }
    });

    // Ground crash (Touching surface outside platforms)
    if (r.y < 0.5) {
      this.handleCrash();
    }
  }

  spawnThrustParticles(rx, ry, angle) {
    const flameX = rx + Math.sin(angle) * 0.4;
    const flameY = ry - 0.2;

    for (let i = 0; i < 3; i++) {
      const pGeo = new THREE.SphereGeometry(0.25 + Math.random() * 0.2, 6, 6);
      const pMat = new THREE.MeshBasicMaterial({
        color: ['#ff0055', '#ffaa00', '#00f2fe'][Math.floor(Math.random() * 3)],
        transparent: true,
        opacity: 0.9
      });
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set(
        flameX + (Math.random() - 0.5) * 0.5,
        flameY - (Math.random() * 0.6),
        0
      );
      this.scene.add(p);
      setTimeout(() => {
        this.scene.remove(p);
        pGeo.dispose();
        pMat.dispose();
      }, 90);
    }
  }

  evaluateLanding(platform) {
    const r = this.rocket;
    const isSpeedSafe = Math.abs(r.vy) < 0.55 && Math.abs(r.vx) < 0.35;
    const isAngleSafe = Math.abs(r.angle) < 0.35; // ~20 degrees

    if (isSpeedSafe && isAngleSafe) {
      r.landed = true;
      r.vy = 0;
      r.vx = 0;
      sound.stopThrust();
      sound.playVictory();

      const fuelBonus = Math.round(r.fuel * 4);
      const totalScore = (250 + fuelBonus) * platform.mult;
      this.scoreEl.textContent = totalScore;

      const earnedTickets = Math.floor(totalScore / 40);
      if (earnedTickets > 0) ticketShop.addTickets(earnedTickets);
      const isNewHigh = ticketShop.setHighScore('rocket_lander', totalScore);

      document.getElementById('rocket-overlay-title').textContent = 'MÜKEMMEL İNİŞ! 🚀';
      document.getElementById('rocket-overlay-desc').innerHTML = `
        İniş Yeri: <b>${platform.name}</b><br>
        Yakıt Bonusu: <b>+${fuelBonus}</b><br>
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

    document.getElementById('rocket-overlay-title').textContent = 'ROKET ÇARPTI! 💥';
    document.getElementById('rocket-overlay-desc').innerHTML = `
      İniş hızı çok yüksekti veya roket dik değildi!<br>
      Platforma yaklaşırken W / SPACE ile kısa itkiler vererek hızını yeşilde tut.
    `;
    this.startBtn.textContent = 'TEKRAR DENE';
    this.overlay.style.display = 'flex';
  }
}
