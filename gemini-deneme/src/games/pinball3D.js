// 4. 3D Neon Pinball Machine (Three.js)
import * as THREE from 'three';
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class Pinball3D {
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
      <div class="game-wrapper pinball-theme">
        <div class="game-header">
          <div class="game-stat"><span>SKOR</span><b id="pinball-score">0</b></div>
          <div class="game-stat"><span>TOP</span><b id="pinball-balls">3 / 3</b></div>
          <div class="game-stat"><span>KOMBO</span><b id="pinball-combo" class="highlight">x1</b></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="pinball-highscore">${ticketShop.getHighScore('pinball')}</b></div>
          <button class="game-close-btn" id="pinball-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <div id="pinball-3d-viewport" style="width: 550px; height: 600px; max-width: 90vw; max-height: 60vh;"></div>
          <div id="pinball-overlay" class="game-overlay-screen">
            <h2 id="pinball-overlay-title">3D NEON PİNBALL</h2>
            <p id="pinball-overlay-desc">A / D veya Sol / Sağ: Paletleri vur! SPACE: Top Fırlatıcıyı geriye çek ve bırak!</p>
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

    this.viewport = document.getElementById('pinball-3d-viewport');
    this.scoreEl = document.getElementById('pinball-score');
    this.ballsEl = document.getElementById('pinball-balls');
    this.comboEl = document.getElementById('pinball-combo');
    this.overlay = document.getElementById('pinball-overlay');
    this.startBtn = document.getElementById('pinball-start-btn');
    this.closeBtn = document.getElementById('pinball-close');
  }

  initThree() {
    const w = this.viewport.clientWidth || 550;
    const h = this.viewport.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e0b1d);

    this.camera = new THREE.PerspectiveCamera(48, w / h, 0.5, 100);
    this.camera.position.set(0, 36, -26);
    this.camera.lookAt(0, 5, 4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.viewport.appendChild(this.renderer.domElement);

    // Lighting
    const amb = new THREE.AmbientLight(0x504080, 1.5);
    this.scene.add(amb);

    const spot = new THREE.SpotLight(0xffffff, 2.5, 60, Math.PI / 4, 0.2);
    spot.position.set(0, 40, -10);
    this.scene.add(spot);

    // Build 3D Cabinet Table
    this.initCabinet();

    // Build 3D Chrome Ball
    const bGeo = new THREE.SphereGeometry(0.9, 24, 24);
    const bMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x222222
    });
    this.ballMesh = new THREE.Mesh(bGeo, bMat);
    this.scene.add(this.ballMesh);

    // Build 3D Flippers
    this.initFlippers();

    // Build 3D Bumpers
    this.initBumpers();
  }

  initCabinet() {
    this.tableWidth = 24;
    this.tableLength = 38;

    // Angled Playfield Table Plane
    const tableGeo = new THREE.BoxGeometry(this.tableWidth, 1, this.tableLength);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x120d28, roughness: 0.4 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0, 0);
    this.scene.add(table);

    // Neon Side Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xff00aa, emissive: 0x880055, emissiveIntensity: 0.8 });
    const wallGeo = new THREE.BoxGeometry(1, 3, this.tableLength);

    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.position.set(-this.tableWidth / 2 + 0.5, 1.5, 0);

    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.position.set(this.tableWidth / 2 - 0.5, 1.5, 0);

    const topWallGeo = new THREE.BoxGeometry(this.tableWidth, 3, 1);
    const topWall = new THREE.Mesh(topWallGeo, wallMat);
    topWall.position.set(0, 1.5, this.tableLength / 2 - 0.5);

    this.scene.add(leftWall, rightWall, topWall);
  }

  initFlippers() {
    const fMatL = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.6 });
    const fMatR = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.6 });
    const fGeo = new THREE.BoxGeometry(1.2, 1.6, 5.2);

    this.leftFlipperMesh = new THREE.Mesh(fGeo, fMatL);
    this.rightFlipperMesh = new THREE.Mesh(fGeo, fMatR);

    this.leftFlipperGroup = new THREE.Group();
    this.leftFlipperGroup.position.set(-5, 1, -12);
    this.leftFlipperMesh.position.set(0, 0, 2.4);
    this.leftFlipperGroup.add(this.leftFlipperMesh);

    this.rightFlipperGroup = new THREE.Group();
    this.rightFlipperGroup.position.set(5, 1, -12);
    this.rightFlipperMesh.position.set(0, 0, 2.4);
    this.rightFlipperGroup.add(this.rightFlipperMesh);

    this.scene.add(this.leftFlipperGroup, this.rightFlipperGroup);
  }

  initBumpers() {
    this.bumpers = [
      { x: -5, z: 8, radius: 2.2, color: 0xff007f },
      { x: 5, z: 8, radius: 2.2, color: 0x00f2fe },
      { x: 0, z: 14, radius: 2.5, color: 0xffdd00 }
    ];

    this.bumperMeshes = [];
    this.bumpers.forEach(bm => {
      const bGeo = new THREE.CylinderGeometry(bm.radius, bm.radius, 1.8, 16);
      const bMat = new THREE.MeshStandardMaterial({
        color: bm.color,
        emissive: bm.color,
        emissiveIntensity: 1.2
      });
      const mesh = new THREE.Mesh(bGeo, bMat);
      mesh.position.set(bm.x, 1.2, bm.z);
      this.scene.add(mesh);
      this.bumperMeshes.push(mesh);
    });
  }

  resetState() {
    this.score = 0;
    this.ballsLeft = 3;
    this.combo = 1;
    this.comboTimer = 0;

    this.inShooterLane = true;
    this.plungerCharge = 0;
    this.isChargingPlunger = false;

    this.ball = { x: 9.5, z: -14, vx: 0, vz: 0 };
    this.leftFlipperUp = false;
    this.rightFlipperUp = false;
  }

  bindEvents() {
    this.keyDownHandler = (e) => {
      if (!this.running) return;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        if (!this.leftFlipperUp) sound.playFlipper();
        this.leftFlipperUp = true;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        if (!this.rightFlipperUp) sound.playFlipper();
        this.rightFlipperUp = true;
      }
      if (['Space'].includes(e.code) && this.inShooterLane) {
        this.isChargingPlunger = true;
      }
    };

    this.keyUpHandler = (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.leftFlipperUp = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.rightFlipperUp = false;
      if (['Space'].includes(e.code) && this.isChargingPlunger) {
        this.releasePlunger();
      }
    };

    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);

    this.startBtn.addEventListener('click', () => this.start());
    this.closeBtn.addEventListener('click', () => this.stop());

    const btnLeft = document.getElementById('pinball-btn-left');
    const btnRight = document.getElementById('pinball-btn-right');
    const btnLaunch = document.getElementById('pinball-btn-launch');

    if (btnLeft && btnRight && btnLaunch) {
      btnLeft.addEventListener('pointerdown', () => { sound.playFlipper(); this.leftFlipperUp = true; });
      btnLeft.addEventListener('pointerup', () => { this.leftFlipperUp = false; });
      btnRight.addEventListener('pointerdown', () => { sound.playFlipper(); this.rightFlipperUp = true; });
      btnRight.addEventListener('pointerup', () => { this.rightFlipperUp = false; });
      btnLaunch.addEventListener('pointerdown', () => { if (this.inShooterLane) this.isChargingPlunger = true; });
      btnLaunch.addEventListener('pointerup', () => { if (this.isChargingPlunger) this.releasePlunger(); });
    }
  }

  releasePlunger() {
    this.isChargingPlunger = false;
    if (this.plungerCharge > 8) {
      this.ball.vz = Math.min(1.4, this.plungerCharge * 0.03 + 0.5);
      this.ball.vx = -0.15;
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
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    if (this.isChargingPlunger) {
      this.plungerCharge = Math.min(40, this.plungerCharge + 0.8);
    }

    // Flippers Angle
    const targetL = this.leftFlipperUp ? -0.6 : 0.4;
    const targetR = this.rightFlipperUp ? 0.6 : -0.4;
    this.leftFlipperGroup.rotation.y += (targetL - this.leftFlipperGroup.rotation.y) * 0.35;
    this.rightFlipperGroup.rotation.y += (targetR - this.rightFlipperGroup.rotation.y) * 0.35;

    // Ball Physics
    const gravity = -0.018; // Downwards along Z
    const b = this.ball;

    if (!this.inShooterLane) {
      b.vz += gravity;
      b.x += b.vx;
      b.z += b.vz;

      b.vx *= 0.995;
      b.vz *= 0.995;

      // Outer Walls
      if (b.x < -this.tableWidth / 2 + 1.8) {
        b.x = -this.tableWidth / 2 + 1.8;
        b.vx = -b.vx * 0.7;
      }
      if (b.x > this.tableWidth / 2 - 1.8) {
        b.x = this.tableWidth / 2 - 1.8;
        b.vx = -b.vx * 0.7;
      }
      if (b.z > this.tableLength / 2 - 1.8) {
        b.z = this.tableLength / 2 - 1.8;
        b.vz = -b.vz * 0.7;
      }

      // Bumpers Collision
      this.bumpers.forEach(bm => {
        const dist = Math.hypot(b.x - bm.x, b.z - bm.z);
        if (dist < bm.radius + 0.9) {
          const angle = Math.atan2(b.z - bm.z, b.x - bm.x);
          const force = 0.65;
          b.vx = Math.cos(angle) * force;
          b.vz = Math.sin(angle) * force;

          this.score += 50 * this.combo;
          this.combo = Math.min(6, this.combo + 1);
          this.comboTimer = 60;
          this.comboEl.textContent = `x${this.combo}`;
          this.scoreEl.textContent = this.score;

          sound.playBumper();
        }
      });

      // Flipper hit check
      if (b.z < -10 && b.z > -14) {
        if (b.x < 0 && Math.abs(b.x - (-4)) < 4.5) {
          b.vz = Math.abs(b.vz) * 0.8 + (this.leftFlipperUp ? 0.8 : 0.3);
          b.vx = (b.x - (-5)) * 0.15;
          sound.playFlipper();
        }
        if (b.x > 0 && Math.abs(b.x - 4) < 4.5) {
          b.vz = Math.abs(b.vz) * 0.8 + (this.rightFlipperUp ? 0.8 : 0.3);
          b.vx = (b.x - 5) * 0.15;
          sound.playFlipper();
        }
      }

      // Drain
      if (b.z < -18) {
        this.handleDrain();
      }
    }

    // Update Ball Mesh
    this.ballMesh.position.set(b.x, 1.4, b.z);
  }

  handleDrain() {
    this.ballsLeft--;
    this.ballsEl.textContent = `${this.ballsLeft} / 3`;
    sound.playGameOver();

    if (this.ballsLeft <= 0) {
      this.handleGameOver();
    } else {
      this.inShooterLane = true;
      this.ball.x = 9.5;
      this.ball.z = -14;
      this.ball.vx = 0;
      this.ball.vz = 0;
    }
  }

  handleGameOver() {
    this.running = false;
    const earnedTickets = Math.floor(this.score / 70);
    if (earnedTickets > 0) ticketShop.addTickets(earnedTickets);
    const isNewHigh = ticketShop.setHighScore('pinball', this.score);

    document.getElementById('pinball-overlay-title').textContent = '3D PİNBALL BİTTİ!';
    document.getElementById('pinball-overlay-desc').innerHTML = `
      Toplam Skor: <b>${this.score}</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
      Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
    `;
    this.startBtn.textContent = 'YENİDEN OYNA';
    this.overlay.style.display = 'flex';
  }
}
