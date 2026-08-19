// 2. 3D Carnival Cannon Knockdown (Three.js) - Complete Physics Overhaul
import * as THREE from 'three';
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class CannonTarget3D {
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
      <div class="game-wrapper cannon-theme">
        <div class="game-header">
          <div class="game-stat"><span>SKOR</span><b id="cannon-score">0</b></div>
          <div class="game-stat"><span>TOP HAKKI</span><b id="cannon-ammo">3 / 3</b></div>
          <div class="game-stat"><span>DEVİRİLEN</span><b id="cannon-knocked">0 / 6</b></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="cannon-highscore">${ticketShop.getHighScore('cannon_target')}</b></div>
          <button class="game-close-btn" id="cannon-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <div id="cannon-3d-viewport" style="width: 700px; height: 500px; max-width: 90vw; max-height: 60vh; cursor: crosshair;"></div>
          <div id="cannon-overlay" class="game-overlay-screen">
            <h2 id="cannon-overlay-title">3D FESTİVAL TOPU</h2>
            <p id="cannon-overlay-desc">Fareyi hareket ettirerek nişan al, tıkla ve teneke kutu piramidini devir! Hareketli ördek ve balonları vurarak ekstra puan kazan.</p>
            <button id="cannon-start-btn" class="arcade-btn-primary">ATIŞA BAŞLA</button>
          </div>
        </div>
        <div class="game-footer-hint">
          🎯 Nişan almak için fareyi gezdir, ATEŞ ETMEK için tıkla!
        </div>
      </div>
    `;

    this.viewport = document.getElementById('cannon-3d-viewport');
    this.scoreEl = document.getElementById('cannon-score');
    this.ammoEl = document.getElementById('cannon-ammo');
    this.knockedEl = document.getElementById('cannon-knocked');
    this.overlay = document.getElementById('cannon-overlay');
    this.startBtn = document.getElementById('cannon-start-btn');
    this.closeBtn = document.getElementById('cannon-close');
  }

  initThree() {
    const w = this.viewport.clientWidth || 700;
    const h = this.viewport.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x180f0c);
    this.scene.fog = new THREE.FogExp2(0x180f0c, 0.008);

    // Fixed first-person camera looking straight into carnival shooting booth
    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.5, 120);
    this.camera.position.set(0, 3.8, -13);
    this.camera.lookAt(0, 4.2, 16);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.viewport.appendChild(this.renderer.domElement);

    // Warm Carnival Booth Lighting
    const amb = new THREE.AmbientLight(0xffeedd, 1.4);
    this.scene.add(amb);

    const spot = new THREE.SpotLight(0xfffae0, 3.0, 50, Math.PI / 3.5, 0.2);
    spot.position.set(0, 14, -6);
    spot.target.position.set(0, 4, 16);
    spot.castShadow = true;
    this.scene.add(spot, spot.target);

    // Build 3D Carnival Booth Environment
    this.initBoothEnvironment();

    // Build 3D Cannon with Muzzle Flash & Recoil
    this.initCannon();

    // Build 3D Aim Reticle & Trajectory Guide
    this.initAimHelper();
  }

  initBoothEnvironment() {
    // Wooden Counter Front
    const counterGeo = new THREE.BoxGeometry(26, 2.4, 4);
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.7 });
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.set(0, 1.2, -9);
    counter.receiveShadow = true;
    this.scene.add(counter);

    // Main Target Shelf at Back
    const shelfGeo = new THREE.BoxGeometry(22, 1.0, 5);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x5c3318, roughness: 0.6 });
    this.shelf = new THREE.Mesh(shelfGeo, shelfMat);
    this.shelf.position.set(0, 3.2, 16);
    this.shelf.receiveShadow = true;
    this.shelf.castShadow = true;
    this.scene.add(this.shelf);

    // Upper Duck Rail Shelf
    const upperShelfGeo = new THREE.BoxGeometry(22, 0.5, 2.5);
    const upperShelf = new THREE.Mesh(upperShelfGeo, shelfMat);
    upperShelf.position.set(0, 8.5, 16);
    this.scene.add(upperShelf);

    // Back Wood Wall
    const wallGeo = new THREE.BoxGeometry(26, 18, 1);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x22120b, roughness: 0.9 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 8, 19);
    this.scene.add(wall);

    // Striped Awning at Top
    const awningGeo = new THREE.BoxGeometry(26, 1.2, 8);
    const awningMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0x440011, emissiveIntensity: 0.5 });
    const awning = new THREE.Mesh(awningGeo, awningMat);
    awning.position.set(0, 12.5, 14);
    this.scene.add(awning);
  }

  initCannon() {
    this.cannonGroup = new THREE.Group();
    this.cannonGroup.position.set(0, 2.4, -9);

    // Heavy Brass Turret Pivot
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 1.2, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.3 });
    const base = new THREE.Mesh(baseGeo, baseMat);

    // Elevation Barrel assembly
    this.barrelElevation = new THREE.Group();
    this.barrelElevation.position.set(0, 0.8, 0);

    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x004466,
      emissiveIntensity: 0.4
    });

    const barrelGeo = new THREE.CylinderGeometry(0.7, 0.95, 4.5, 16);
    this.barrelMesh = new THREE.Mesh(barrelGeo, barrelMat);
    this.barrelMesh.rotation.x = Math.PI / 2;
    this.barrelMesh.position.set(0, 0, 1.8);
    this.barrelMesh.castShadow = true;

    // Brass Rings around barrel
    const ringGeo = new THREE.TorusGeometry(0.85, 0.1, 8, 16);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, metalness: 0.9 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.position.set(0, 0, 0.6);
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.position.set(0, 0, 2.8);

    this.barrelElevation.add(this.barrelMesh, ring1, ring2);
    this.cannonGroup.add(base, this.barrelElevation);
    this.scene.add(this.cannonGroup);
  }

  initAimHelper() {
    // 3D Glowing Reticle on back target plane
    const retGeo = new THREE.RingGeometry(0.7, 0.9, 24);
    const retMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    this.aimReticle = new THREE.Mesh(retGeo, retMat);
    this.aimReticle.position.set(0, 5, 15.5);
    this.scene.add(this.aimReticle);
  }

  resetState() {
    this.score = 0;
    this.ammo = 3;
    this.targetAim = { x: 0, y: 5 };
    this.recoil = 0;

    this.balls = [];
    this.cans = [];
    this.ducks = [];
    this.balloons = [];
    this.particles = [];

    this.initCansPyramid();
    this.initGalleryTargets();
  }

  initCansPyramid() {
    // Clear old cans
    this.cans.forEach(c => this.scene.remove(c.mesh));
    this.cans = [];

    const canGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.0, 16);
    const canMat = new THREE.MeshStandardMaterial({
      color: 0xffbe0b,
      metalness: 0.6,
      roughness: 0.25,
      emissive: 0x332200,
      emissiveIntensity: 0.2
    });

    const startX = -2.4;
    const shelfTopY = 3.7;
    const canH = 2.0;
    const canSpacing = 2.4;

    // Row 1 (Bottom 3 cans)
    for (let i = 0; i < 3; i++) {
      this.createCan(canGeo, canMat, startX + i * canSpacing, shelfTopY + canH / 2, 16);
    }
    // Row 2 (Middle 2 cans)
    for (let i = 0; i < 2; i++) {
      this.createCan(canGeo, canMat, startX + 1.2 + i * canSpacing, shelfTopY + canH + canH / 2, 16);
    }
    // Row 3 (Top 1 can)
    this.createCan(canGeo, canMat, startX + 2.4, shelfTopY + canH * 2 + canH / 2, 16);
  }

  createCan(geo, mat, x, y, z) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    this.cans.push({
      mesh,
      initPos: new THREE.Vector3(x, y, z),
      vel: new THREE.Vector3(0, 0, 0),
      rotVel: new THREE.Vector3(0, 0, 0),
      knocked: false
    });
  }

  initGalleryTargets() {
    // Moving Ducks on Upper Shelf
    this.ducks.forEach(d => this.scene.remove(d.mesh));
    this.ducks = [];

    const duckGroup = new THREE.Group();
    const dBodyGeo = new THREE.SphereGeometry(0.8, 12, 12);
    const dBodyMat = new THREE.MeshStandardMaterial({ color: 0xffd166 });
    const dBody = new THREE.Mesh(dBodyGeo, dBodyMat);
    dBody.scale.set(1.4, 1.0, 1.0);

    const dHeadGeo = new THREE.SphereGeometry(0.5, 10, 10);
    const dHead = new THREE.Mesh(dHeadGeo, dBodyMat);
    dHead.position.set(0.8, 0.6, 0);

    const dBeakGeo = new THREE.ConeGeometry(0.25, 0.6, 8);
    const dBeakMat = new THREE.MeshStandardMaterial({ color: 0xf77f00 });
    const dBeak = new THREE.Mesh(dBeakGeo, dBeakMat);
    dBeak.rotation.z = -Math.PI / 2;
    dBeak.position.set(1.4, 0.6, 0);

    duckGroup.add(dBody, dHead, dBeak);
    duckGroup.position.set(-8, 9.5, 16);
    this.scene.add(duckGroup);

    this.ducks.push({
      mesh: duckGroup,
      vx: 0.12,
      minX: -8,
      maxX: 8,
      alive: true
    });

    // Floating Balloon Targets
    this.balloons.forEach(b => this.scene.remove(b.mesh));
    this.balloons = [];

    const balColors = [0xff007f, 0x00f2fe];
    [-6, 6].forEach((bx, idx) => {
      const bGroup = new THREE.Group();
      const bGeo = new THREE.SphereGeometry(1.2, 16, 16);
      bGeo.scale(1, 1.3, 1);
      const bMat = new THREE.MeshStandardMaterial({
        color: balColors[idx],
        emissive: balColors[idx],
        emissiveIntensity: 0.5,
        roughness: 0.2
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);

      bGroup.add(bMesh);
      bGroup.position.set(bx, 6.5, 16);
      this.scene.add(bGroup);

      this.balloons.push({
        mesh: bGroup,
        baseY: 6.5,
        phase: idx * 2,
        color: balColors[idx],
        alive: true
      });
    });
  }

  bindEvents() {
    this.onPointerMove = (e) => {
      if (!this.running) return;
      const rect = this.viewport.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Aim target point on back target wall (z = 16)
      this.targetAim.x = nx * 8.5;
      this.targetAim.y = THREE.MathUtils.clamp(ny * 4.5 + 4.8, 1.5, 10.5);

      this.aimReticle.position.set(this.targetAim.x, this.targetAim.y, 15.5);

      // Rotate Cannon to point precisely at aim target
      const muzzleStart = new THREE.Vector3(0, 2.8, -9);
      const targetVec = new THREE.Vector3(this.targetAim.x, this.targetAim.y, 16);
      const aimDir = targetVec.clone().sub(muzzleStart).normalize();

      const yaw = Math.atan2(-aimDir.x, aimDir.z);
      const pitch = Math.asin(aimDir.y);

      this.cannonGroup.rotation.y = yaw;
      this.barrelElevation.rotation.x = -pitch;
    };

    this.onPointerDown = (e) => {
      if (!this.running || this.ammo <= 0) return;
      this.fireBall();
    };

    this.viewport.addEventListener('pointermove', this.onPointerMove);
    this.viewport.addEventListener('pointerdown', this.onPointerDown);

    this.startBtn.addEventListener('click', () => this.start());
    this.closeBtn.addEventListener('click', () => this.stop());
  }

  fireBall() {
    // 3D Muzzle Origin
    const muzzlePos = new THREE.Vector3(0, 2.8, -6.5);
    const targetPos = new THREE.Vector3(this.targetAim.x, this.targetAim.y, 16);

    // Initial Velocity Vector aimed straight at the target with slight gravity arc
    const flightTime = 0.55; // 0.55 seconds flight time
    const vx = (targetPos.x - muzzlePos.x) / flightTime;
    const vz = (targetPos.z - muzzlePos.z) / flightTime;
    const vy = (targetPos.y - muzzlePos.y + 0.5 * 18.0 * (flightTime * flightTime)) / flightTime;

    const ballGeo = new THREE.SphereGeometry(0.85, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x007799,
      emissiveIntensity: 0.6
    });

    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.position.copy(muzzlePos);
    ballMesh.castShadow = true;
    this.scene.add(ballMesh);

    this.balls.push({
      mesh: ballMesh,
      vel: new THREE.Vector3(vx, vy, vz),
      bounces: 0,
      active: true
    });

    // Barrel Recoil
    this.recoil = 0.8;

    this.ammo--;
    this.ammoEl.textContent = `${this.ammo} / 3`;
    sound.playCannon();

    // Muzzle flash particles
    this.spawnMuzzleFlash(muzzlePos);
  }

  spawnMuzzleFlash(pos) {
    for (let i = 0; i < 15; i++) {
      const pGeo = new THREE.SphereGeometry(0.3 + Math.random() * 0.3, 6, 6);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.9 });
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set(
        pos.x + (Math.random() - 0.5) * 0.8,
        pos.y + (Math.random() - 0.5) * 0.8,
        pos.z + (Math.random() - 0.5) * 0.8
      );
      this.scene.add(p);
      setTimeout(() => {
        this.scene.remove(p);
        pGeo.dispose();
        pMat.dispose();
      }, 70);
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
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.viewport.removeEventListener('pointermove', this.onPointerMove);
    this.viewport.removeEventListener('pointerdown', this.onPointerDown);
    this.cans.forEach(c => this.scene.remove(c.mesh));
    this.balls.forEach(b => this.scene.remove(b.mesh));
    this.ducks.forEach(d => this.scene.remove(d.mesh));
    this.balloons.forEach(b => this.scene.remove(b.mesh));
    if (this.onGameOver) this.onGameOver();
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const dt = 0.016;
    const gravity = -18.0; // Realistic gravity in m/s^2

    // Recoil spring recovery
    if (this.recoil > 0) {
      this.recoil *= 0.85;
      this.barrelMesh.position.z = 1.8 - this.recoil;
    }

    // 1. Update Projectile Cannonballs
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      b.vel.y += gravity * dt;
      b.mesh.position.addScaledVector(b.vel, dt);

      // Floor collision
      if (b.mesh.position.y < 0.85) {
        b.mesh.position.y = 0.85;
        b.vel.y = -b.vel.y * 0.45;
        b.vel.x *= 0.8;
        b.vel.z *= 0.8;
        b.bounces++;
      }

      // Ball vs Cans Collision (Direct Impact)
      this.cans.forEach(can => {
        const dist = b.mesh.position.distanceTo(can.mesh.position);
        if (dist < 1.75) {
          // Transfer momentum to can
          can.vel.x += b.vel.x * 0.4 + (Math.random() - 0.5) * 6;
          can.vel.y += b.vel.y * 0.3 + 5.0;
          can.vel.z += b.vel.z * 0.5 + 4.0;
          can.rotVel.set(Math.random() * 8, Math.random() * 8, Math.random() * 8);

          b.vel.multiplyScalar(0.4);
          sound.playHit();

          if (!can.knocked) {
            can.knocked = true;
            this.score += 50;
            this.scoreEl.textContent = this.score;
          }
        }
      });

      // Ball vs Ducks
      this.ducks.forEach(duck => {
        if (duck.alive && b.mesh.position.distanceTo(duck.mesh.position) < 2.0) {
          duck.alive = false;
          this.scene.remove(duck.mesh);
          this.score += 100;
          this.scoreEl.textContent = this.score;
          sound.playVictory();
        }
      });

      // Ball vs Balloons
      this.balloons.forEach(bal => {
        if (bal.alive && b.mesh.position.distanceTo(bal.mesh.position) < 2.0) {
          bal.alive = false;
          this.scene.remove(bal.mesh);
          this.score += 80;
          this.scoreEl.textContent = this.score;
          sound.playPowerup();
        }
      });

      if (b.mesh.position.z > 24 || b.mesh.position.y < 0.5 || b.bounces > 4) {
        this.scene.remove(b.mesh);
        this.balls.splice(i, 1);
      }
    }

    // 2. Update 3D Cans Rigid-Body Physics & Chain Reactions
    let knockedCount = 0;
    this.cans.forEach(can => {
      // Check if can was displaced from its initial spot
      const distFromHome = can.mesh.position.distanceTo(can.initPos);
      if (distFromHome > 1.2 || Math.abs(can.mesh.rotation.z) > 0.4 || Math.abs(can.mesh.rotation.x) > 0.4) {
        if (!can.knocked) {
          can.knocked = true;
          this.score += 50;
          this.scoreEl.textContent = this.score;
        }
      }

      if (can.knocked) {
        can.vel.y += gravity * dt;
        can.mesh.position.addScaledVector(can.vel, dt);

        can.mesh.rotation.x += can.rotVel.x * dt;
        can.mesh.rotation.y += can.rotVel.y * dt;
        can.mesh.rotation.z += can.rotVel.z * dt;

        // Shelf / Floor Bounce
        if (can.mesh.position.y < 0.6) {
          can.mesh.position.y = 0.6;
          can.vel.y = -can.vel.y * 0.25;
          can.vel.x *= 0.85;
          can.vel.z *= 0.85;
          can.rotVel.multiplyScalar(0.85);
        }

        // Chain-reaction: Falling can hits other cans!
        this.cans.forEach(otherCan => {
          if (otherCan !== can && !otherCan.knocked) {
            if (can.mesh.position.distanceTo(otherCan.mesh.position) < 1.6) {
              otherCan.vel.copy(can.vel).multiplyScalar(0.6);
              otherCan.vel.y += 3.0;
              otherCan.rotVel.set(Math.random() * 4, Math.random() * 4, Math.random() * 4);
              otherCan.knocked = true;
              this.score += 50;
              this.scoreEl.textContent = this.score;
              sound.playHit();
            }
          }
        });

        knockedCount++;
      }
    });

    this.knockedEl.textContent = `${knockedCount} / ${this.cans.length}`;

    // 3. Update Moving Ducks
    this.ducks.forEach(duck => {
      if (duck.alive) {
        duck.mesh.position.x += duck.vx;
        if (duck.mesh.position.x > duck.maxX || duck.mesh.position.x < duck.minX) {
          duck.vx = -duck.vx;
          duck.mesh.scale.x = Math.sign(duck.vx);
        }
      }
    });

    // 4. Update Floating Balloons
    this.balloons.forEach(bal => {
      if (bal.alive) {
        bal.mesh.position.y = bal.baseY + Math.sin(performance.now() * 0.004 + bal.phase) * 0.4;
      }
    });

    // 5. Check Game Over (When no ammo left and all fired balls have landed)
    if (this.ammo === 0 && this.balls.length === 0) {
      setTimeout(() => this.handleGameOver(knockedCount), 600);
    }
  }

  handleGameOver(knocked) {
    if (!this.running) return;
    this.running = false;

    if (knocked === this.cans.length) {
      this.score += 250; // All clear bonus
      this.scoreEl.textContent = this.score;
      sound.playVictory();
    }

    const earnedTickets = Math.floor(this.score / 50);
    if (earnedTickets > 0) ticketShop.addTickets(earnedTickets);
    const isNewHigh = ticketShop.setHighScore('cannon_target', this.score);

    document.getElementById('cannon-overlay-title').textContent = (knocked === this.cans.length) ? 'TAM İSABET! 🎯' : 'ATIŞLAR BİTTİ!';
    document.getElementById('cannon-overlay-desc').innerHTML = `
      Toplam Skor: <b>${this.score}</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
      Devrilen Kutular: <b>${knocked} / ${this.cans.length}</b><br>
      Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
    `;
    this.startBtn.textContent = 'YENİDEN DENE';
    this.overlay.style.display = 'flex';
  }
}
