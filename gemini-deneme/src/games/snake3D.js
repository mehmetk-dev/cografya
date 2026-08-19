// 5. 3D Cyber Slither Dragon Snake (Three.js) - Complete Free-Slither Overhaul
import * as THREE from 'three';
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class Snake3D {
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
      <div class="game-wrapper snake-theme">
        <div class="game-header">
          <div class="game-stat"><span>SKOR</span><b id="snake-score">0</b></div>
          <div class="game-stat"><span>UZUNLUK</span><b id="snake-length">10</b></div>
          <div class="game-stat"><span>KOMBO</span><b id="snake-combo" class="highlight">x1</b></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="snake-highscore">${ticketShop.getHighScore('snake')}</b></div>
          <button class="game-close-btn" id="snake-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <div id="snake-3d-viewport" style="width: 700px; height: 500px; max-width: 90vw; max-height: 60vh; cursor: crosshair;"></div>
          <div id="snake-overlay" class="game-overlay-screen">
            <h2 id="snake-overlay-title">3D SİBER YILAN ARENASI</h2>
            <p id="snake-overlay-desc">Fareyi veya parmağını hareket ettirerek yılanı 360° serbestçe yönlendir! Parlayan şekerleri topla, SPACE veya sol tık ile NİTRO hızlan!</p>
            <button id="snake-start-btn" class="arcade-btn-primary">ARENAYA GİR</button>
          </div>
        </div>
        <div class="game-footer-hint">
          🐍 Fareyi gezdirerek yön ver, SPACE veya basılı tutarak NİTRO hızlan!
        </div>
      </div>
    `;

    this.viewport = document.getElementById('snake-3d-viewport');
    this.scoreEl = document.getElementById('snake-score');
    this.lengthEl = document.getElementById('snake-length');
    this.comboEl = document.getElementById('snake-combo');
    this.overlay = document.getElementById('snake-overlay');
    this.startBtn = document.getElementById('snake-start-btn');
    this.closeBtn = document.getElementById('snake-close');
  }

  initThree() {
    const w = this.viewport.clientWidth || 700;
    const h = this.viewport.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a091d);
    this.scene.fog = new THREE.FogExp2(0x0a091d, 0.006);

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.5, 200);
    this.camera.position.set(0, 36, 26);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.viewport.appendChild(this.renderer.domElement);

    // Lighting
    const amb = new THREE.AmbientLight(0x4a3b70, 1.4);
    this.scene.add(amb);

    const dir = new THREE.DirectionalLight(0x00ff88, 2.0);
    dir.position.set(20, 40, 20);
    this.scene.add(dir);

    // Arena Floor (Circular Cyber Platform, Radius = 24m)
    this.arenaRadius = 24;
    const arenaGeo = new THREE.CylinderGeometry(this.arenaRadius, this.arenaRadius + 1, 1, 48);
    const arenaMat = new THREE.MeshStandardMaterial({
      color: 0x120e26,
      roughness: 0.7,
      metalness: 0.2
    });
    const arena = new THREE.Mesh(arenaGeo, arenaMat);
    arena.position.y = -0.5;
    this.scene.add(arena);

    // Neon Barrier Rim
    const rimGeo = new THREE.TorusGeometry(this.arenaRadius, 0.5, 12, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x008844,
      emissiveIntensity: 1.2
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.5;
    this.scene.add(rim);

    // Snake Meshes Group
    this.snakeGroup = new THREE.Group();
    this.scene.add(this.snakeGroup);

    // Food Meshes Group
    this.foodGroup = new THREE.Group();
    this.scene.add(this.foodGroup);
  }

  resetState() {
    this.score = 0;
    this.combo = 1;
    this.comboTimer = 0;
    this.isTurbo = false;

    // Free Slither Physics
    this.head = { x: 0, z: 0, angle: 0, targetAngle: 0, speed: 0.18 };
    this.bodyPositions = [];
    this.numSegments = 12;
    this.segmentSpacing = 0.65;

    for (let i = 0; i < this.numSegments; i++) {
      this.bodyPositions.push(new THREE.Vector3(-i * this.segmentSpacing, 0.6, 0));
    }

    this.foods = [];
    this.particles = [];
    this.pointerPos = new THREE.Vector2(0, 0);

    this.initSnakeMeshes();
    this.spawnMultipleFoods(16);
  }

  initSnakeMeshes() {
    // Clear old meshes
    while (this.snakeGroup.children.length > 0) {
      const c = this.snakeGroup.children[0];
      this.snakeGroup.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    }

    this.segmentMeshes = [];

    // Dragon Head
    const headGroup = new THREE.Group();
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00aa55,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const headGeo = new THREE.SphereGeometry(0.85, 16, 16);
    headGeo.scale(1.2, 0.9, 1.4);
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.castShadow = true;

    // Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.22, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffff00, emissiveIntensity: 2.0 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.45, 0.45, 0.6);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.45, 0.45, 0.6);

    headGroup.add(headMesh, eyeL, eyeR);
    this.snakeGroup.add(headGroup);
    this.headMeshGroup = headGroup;

    // Body Segment Spheres
    const segGeo = new THREE.SphereGeometry(0.7, 14, 14);
    for (let i = 1; i < this.numSegments; i++) {
      const t = i / this.numSegments;
      const segMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.38 - t * 0.15, 1.0, 0.5),
        emissive: new THREE.Color().setHSL(0.38 - t * 0.15, 1.0, 0.25),
        emissiveIntensity: 0.6,
        roughness: 0.3
      });

      const sMesh = new THREE.Mesh(segGeo, segMat);
      const scale = THREE.MathUtils.lerp(1.0, 0.45, t);
      sMesh.scale.set(scale, scale, scale);
      sMesh.castShadow = true;

      this.snakeGroup.add(sMesh);
      this.segmentMeshes.push(sMesh);
    }
  }

  spawnMultipleFoods(count) {
    while (this.foodGroup.children.length > 0) {
      const c = this.foodGroup.children[0];
      this.foodGroup.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    }
    this.foods = [];

    const foodColors = [0xff0055, 0x00f2fe, 0xffdd00, 0xff9900, 0x9d4edd];
    const foodGeo = new THREE.SphereGeometry(0.45, 12, 12);

    for (let i = 0; i < count; i++) {
      const r = Math.random() * (this.arenaRadius - 3.5);
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const col = foodColors[Math.floor(Math.random() * foodColors.length)];

      const fMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 1.4,
        roughness: 0.2
      });
      const fMesh = new THREE.Mesh(foodGeo, fMat);
      fMesh.position.set(x, 0.6, z);

      this.foodGroup.add(fMesh);
      this.foods.push({ mesh: fMesh, x, z, color: col });
    }
  }

  bindEvents() {
    this.onPointerMove = (e) => {
      if (!this.running) return;
      const rect = this.viewport.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Project onto ground plane to find mouse direction from snake head
      this.pointerPos.set(nx * 20, ny * 15);
      const dx = this.pointerPos.x - this.head.x;
      const dz = this.pointerPos.y - this.head.z;
      this.head.targetAngle = Math.atan2(dx, dz);
    };

    this.onKeyDown = (e) => {
      if (['Space', 'ShiftLeft'].includes(e.code)) this.isTurbo = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.head.targetAngle -= 0.35;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.head.targetAngle += 0.35;
    };

    this.onKeyUp = (e) => {
      if (['Space', 'ShiftLeft'].includes(e.code)) this.isTurbo = false;
    };

    this.onPointerDown = () => { this.isTurbo = true; };
    this.onPointerUp = () => { this.isTurbo = false; };

    this.viewport.addEventListener('pointermove', this.onPointerMove);
    this.viewport.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

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
    this.viewport.removeEventListener('pointermove', this.onPointerMove);
    this.viewport.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    if (this.onGameOver) this.onGameOver();
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    // 1. Smooth Steering
    let diff = this.head.targetAngle - this.head.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.head.angle += diff * 0.12;

    // 2. Velocity
    const currentSpeed = this.isTurbo ? 0.36 : 0.20;
    this.head.x += Math.sin(this.head.angle) * currentSpeed;
    this.head.z += Math.cos(this.head.angle) * currentSpeed;

    // Boundary Check (Circular arena wall)
    const distFromCenter = Math.hypot(this.head.x, this.head.z);
    if (distFromCenter >= this.arenaRadius - 1.0) {
      this.handleDeath();
      return;
    }

    // 3. Inverse Kinematics Body Trailing
    this.bodyPositions[0].set(this.head.x, 0.6, this.head.z);

    for (let i = 1; i < this.bodyPositions.length; i++) {
      const prev = this.bodyPositions[i - 1];
      const curr = this.bodyPositions[i];
      const dir = curr.clone().sub(prev);
      const dist = dir.length();

      if (dist > this.segmentSpacing) {
        dir.normalize().multiplyScalar(this.segmentSpacing);
        curr.copy(prev).add(dir);
      }
    }

    // Update 3D Head Mesh
    this.headMeshGroup.position.set(this.head.x, 0.6, this.head.z);
    this.headMeshGroup.rotation.y = this.head.angle;

    // Update 3D Segment Meshes
    for (let i = 0; i < this.segmentMeshes.length; i++) {
      const pos = this.bodyPositions[i + 1];
      if (pos) {
        this.segmentMeshes[i].position.copy(pos);
      }
    }

    // 4. Food Collisions & Growth
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i];
      const distToFood = Math.hypot(this.head.x - f.x, this.head.z - f.z);

      if (distToFood < 1.4) {
        // Collect Food!
        this.score += 25 * this.combo * (this.isTurbo ? 2 : 1);
        this.combo = Math.min(5, this.combo + 1);
        this.comboTimer = 60;
        this.scoreEl.textContent = this.score;
        this.comboEl.textContent = `x${this.combo}`;

        sound.playTone(500 + this.combo * 100, 'sine', 0.08, 0.15);

        // Add 2 new segments
        this.addSegments(2);
        this.lengthEl.textContent = this.numSegments;

        // Respawn Food
        const r = Math.random() * (this.arenaRadius - 3.5);
        const theta = Math.random() * Math.PI * 2;
        f.x = Math.cos(theta) * r;
        f.z = Math.sin(theta) * r;
        f.mesh.position.set(f.x, 0.6, f.z);
      }
    }

    // Combo Timer Decay
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.combo = 1;
        this.comboEl.textContent = 'x1';
      }
    }

    // Camera follow snake smoothly
    this.camera.position.x += (this.head.x * 0.4 - this.camera.position.x) * 0.08;
    this.camera.position.z += (this.head.z * 0.4 + 26 - this.camera.position.z) * 0.08;
    this.camera.lookAt(this.head.x * 0.3, 0, this.head.z * 0.3);
  }

  addSegments(count) {
    const lastPos = this.bodyPositions[this.bodyPositions.length - 1];
    const segGeo = new THREE.SphereGeometry(0.7, 14, 14);

    for (let c = 0; c < count; c++) {
      this.numSegments++;
      const newPos = lastPos.clone();
      this.bodyPositions.push(newPos);

      const t = this.numSegments / (this.numSegments + 10);
      const segMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.38 - t * 0.15, 1.0, 0.5),
        emissive: new THREE.Color().setHSL(0.38 - t * 0.15, 1.0, 0.25),
        emissiveIntensity: 0.6,
        roughness: 0.3
      });

      const sMesh = new THREE.Mesh(segGeo, segMat);
      sMesh.scale.set(0.65, 0.65, 0.65);
      sMesh.position.copy(newPos);

      this.snakeGroup.add(sMesh);
      this.segmentMeshes.push(sMesh);
    }
  }

  handleDeath() {
    this.running = false;
    sound.playGameOver();

    const earnedTickets = Math.floor(this.score / 40);
    if (earnedTickets > 0) ticketShop.addTickets(earnedTickets);
    const isNewHigh = ticketShop.setHighScore('snake', this.score);

    document.getElementById('snake-overlay-title').textContent = 'ARENADAN ÇIKTIN! 💥';
    document.getElementById('snake-overlay-desc').innerHTML = `
      Toplam Skor: <b>${this.score}</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
      Ulaşılan Uzunluk: <b>${this.numSegments} Segment</b><br>
      Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
    `;
    this.startBtn.textContent = 'YENİDEN BAŞLA';
    this.overlay.style.display = 'flex';
  }
}
