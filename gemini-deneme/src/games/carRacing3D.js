// 1. Full 3D Nitro Drift Highway Car Racing Game (Three.js) - Fixed & Enhanced
import * as THREE from 'three';
import { sound } from '../audio/soundManager.js';
import { ticketShop } from '../hub/ticketShop.js';

export class CarRacing3D {
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
      <div class="game-wrapper racing-theme">
        <div class="game-header">
          <div class="game-stat"><span>MESAFE</span><b id="race-dist">0 m</b></div>
          <div class="game-stat"><span>HIZ</span><b id="race-speed">0 km/h</b></div>
          <div class="game-stat"><span>NİTRO</span><div class="nitro-bar-container"><div id="race-nitro-bar"></div></div></div>
          <div class="game-stat"><span>EN YÜKSEK</span><b id="race-highscore">${ticketShop.getHighScore('car_racing')} m</b></div>
          <button class="game-close-btn" id="race-close">✕ ÇIKIŞ</button>
        </div>
        <div class="canvas-container">
          <div id="race-3d-viewport" style="width: 700px; height: 500px; max-width: 90vw; max-height: 60vh;"></div>
          <div id="race-overlay" class="game-overlay-screen">
            <h2 id="race-overlay-title">3D NİTRO DRİFT YARIŞI</h2>
            <p id="race-overlay-desc">A / D veya Sol / Sağ: Direksiyon ve Drift. W / Yukarı: Gaz ver. S: Fren. SPACE: NİTRO ATEŞLEMESİ!</p>
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

    this.viewport = document.getElementById('race-3d-viewport');
    this.distEl = document.getElementById('race-dist');
    this.speedEl = document.getElementById('race-speed');
    this.nitroBar = document.getElementById('race-nitro-bar');
    this.overlay = document.getElementById('race-overlay');
    this.startBtn = document.getElementById('race-start-btn');
    this.closeBtn = document.getElementById('race-close');
  }

  initThree() {
    const w = this.viewport.clientWidth || 700;
    const h = this.viewport.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060614);
    this.scene.fog = new THREE.FogExp2(0x060614, 0.005);

    // Camera positioned BEHIND player car looking FORWARD into +Z
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.5, 700);
    this.camera.position.set(0, 4.5, -9);
    this.camera.lookAt(0, 1.5, 18);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.viewport.appendChild(this.renderer.domElement);

    // Lighting
    const amb = new THREE.AmbientLight(0x4a4a75, 1.4);
    this.scene.add(amb);

    const dir = new THREE.DirectionalLight(0xffffff, 1.8);
    dir.position.set(30, 50, -20);
    dir.castShadow = true;
    this.scene.add(dir);

    // Build 3D Road with moving lane dashes & neon side barriers
    this.initRoad();

    // Build Player 3D Car
    this.playerCar = this.createCar(0xff0055, true);
    this.scene.add(this.playerCar);

    // Particle system for tire smoke and nitro flames
    this.initParticles();
  }

  initRoad() {
    this.roadWidth = 26;
    this.roadLength = 600;

    // Asphalt Ground Plane
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.roadLength, 1, 100);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x14141e, roughness: 0.85 });
    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.rotation.x = -Math.PI / 2;
    this.roadMesh.position.z = this.roadLength / 2 - 20;
    this.roadMesh.receiveShadow = true;
    this.scene.add(this.roadMesh);

    // Roadside Ground (Grass / Dark Shoulder)
    const shoulderGeo = new THREE.PlaneGeometry(160, this.roadLength);
    const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x080811, roughness: 0.95 });
    const shoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulder.rotation.x = -Math.PI / 2;
    shoulder.position.set(0, -0.05, this.roadLength / 2 - 20);
    this.scene.add(shoulder);

    // Moving Dashed Lane Markers (2 lane dividers, 30 dashes each)
    this.laneDashes = [];
    const dashGeo = new THREE.BoxGeometry(0.35, 0.08, 6);
    const dashMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x888888, emissiveIntensity: 0.5 });

    const lanePositionsX = [-this.roadWidth / 6, this.roadWidth / 6];
    lanePositionsX.forEach(lx => {
      for (let z = 0; z < this.roadLength; z += 18) {
        const dash = new THREE.Mesh(dashGeo, dashMat);
        dash.position.set(lx, 0.06, z);
        this.scene.add(dash);
        this.laneDashes.push(dash);
      }
    });

    // Neon Guardrails
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x005577,
      emissiveIntensity: 0.8,
      metalness: 0.6
    });
    const railGeo = new THREE.BoxGeometry(0.8, 1.2, this.roadLength);

    this.leftRail = new THREE.Mesh(railGeo, railMat);
    this.leftRail.position.set(-this.roadWidth / 2 - 0.4, 0.6, this.roadLength / 2 - 20);
    this.rightRail = new THREE.Mesh(railGeo, railMat);
    this.rightRail.position.set(this.roadWidth / 2 + 0.4, 0.6, this.roadLength / 2 - 20);
    this.scene.add(this.leftRail, this.rightRail);

    // Roadside Streetlights & Neon Arches
    this.arches = [];
    for (let i = 0; i < 10; i++) {
      const archGroup = new THREE.Group();
      const archGeo = new THREE.TorusGeometry(this.roadWidth / 2 + 2.5, 0.5, 8, 24, Math.PI);
      const archMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xff007f : 0x00f2fe,
        emissive: i % 2 === 0 ? 0xff007f : 0x00f2fe,
        emissiveIntensity: 1.4
      });
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.rotation.z = Math.PI;
      arch.position.y = 0;
      archGroup.add(arch);

      archGroup.position.set(0, 0, i * 60);
      this.arches.push(archGroup);
      this.scene.add(archGroup);
    }
  }

  createCar(color, isPlayer = false) {
    const carGroup = new THREE.Group();

    // Car Body Chassis
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.2,
      metalness: 0.7
    });

    // Lower Chassis
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.8, 4.8);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.7;
    body.castShadow = true;

    // Aerodynamic Cockpit Cabin
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x101018, roughness: 0.1, metalness: 0.9 });
    const roofGeo = new THREE.BoxGeometry(1.9, 0.7, 2.4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 1.35, -0.2);

    // Rear Racing Spoiler
    const spMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
    const spGeo = new THREE.BoxGeometry(2.5, 0.12, 0.7);
    const spoiler = new THREE.Mesh(spGeo, spMat);
    spoiler.position.set(0, 1.55, -2.1);

    const spLegGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const spLegL = new THREE.Mesh(spLegGeo, spMat);
    spLegL.position.set(-0.9, 1.3, -2.1);
    const spLegR = new THREE.Mesh(spLegGeo, spMat);
    spLegR.position.set(0.9, 1.3, -2.1);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.42, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const wheels = [];
    const wheelPositions = [
      [-1.3, 0.48, 1.4], [1.3, 0.48, 1.4],   // Front Wheels (+Z is front)
      [-1.3, 0.48, -1.4], [1.3, 0.48, -1.4]  // Rear Wheels (-Z is rear)
    ];

    wheelPositions.forEach((pos, idx) => {
      const wGroup = new THREE.Group();
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.castShadow = true;
      wGroup.add(w);
      wGroup.position.set(...pos);
      carGroup.add(wGroup);
      wheels.push({ group: wGroup, mesh: w, isFront: idx < 2 });
    });

    // Front Headlights (+Z is front)
    const hlGeo = new THREE.SphereGeometry(0.22, 8, 8);
    const hlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffcc, emissiveIntensity: 2.5 });
    const hlL = new THREE.Mesh(hlGeo, hlMat);
    hlL.position.set(-0.85, 0.75, 2.4);
    const hlR = new THREE.Mesh(hlGeo, hlMat);
    hlR.position.set(0.85, 0.75, 2.4);

    // Rear Taillights (-Z is rear, faces player camera!)
    const tlGeo = new THREE.BoxGeometry(0.5, 0.18, 0.1);
    const tlMat = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0022, emissiveIntensity: 2.0 });
    const tlL = new THREE.Mesh(tlGeo, tlMat);
    tlL.position.set(-0.85, 0.75, -2.4);
    const tlR = new THREE.Mesh(tlGeo, tlMat);
    tlR.position.set(0.85, 0.75, -2.4);

    // Twin Exhaust Pipes (-Z rear)
    const exGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 8);
    const exMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.9 });
    const exL = new THREE.Mesh(exGeo, exMat);
    exL.rotation.x = Math.PI / 2;
    exL.position.set(-0.45, 0.4, -2.4);
    const exR = new THREE.Mesh(exGeo, exMat);
    exR.rotation.x = Math.PI / 2;
    exR.position.set(0.45, 0.4, -2.4);

    carGroup.add(body, roof, spoiler, spLegL, spLegR, hlL, hlR, tlL, tlR, exL, exR);
    carGroup.userData = { wheels, isPlayer, tlL, tlR };

    return carGroup;
  }

  initParticles() {
    this.particles = [];
  }

  resetState() {
    this.speed = 0;
    this.maxSpeed = 180;
    this.distance = 0;
    this.nitro = 100;
    this.carPos = { x: 0, z: 0, vx: 0, yaw: 0, roll: 0 };
    this.keys = { left: false, right: false, up: false, down: false, space: false };
    this.trafficCars = [];
    this.spawnTimer = 0;
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

    const btnLeft = document.getElementById('race-btn-left');
    const btnRight = document.getElementById('race-btn-right');
    const btnNitro = document.getElementById('race-btn-nitro');

    if (btnLeft && btnRight && btnNitro) {
      btnLeft.addEventListener('pointerdown', () => { this.keys.left = true; });
      btnLeft.addEventListener('pointerup', () => { this.keys.left = false; });
      btnRight.addEventListener('pointerdown', () => { this.keys.right = true; });
      btnRight.addEventListener('pointerup', () => { this.keys.right = false; });
      btnNitro.addEventListener('pointerdown', () => { this.keys.space = true; });
      btnNitro.addEventListener('pointerup', () => { this.keys.space = false; });
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

    this.trafficCars.forEach(t => this.scene.remove(t.mesh));
    this.trafficCars = [];

    if (this.onGameOver) this.onGameOver();
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const isNitro = this.keys.space && this.nitro > 5;
    let targetSpeed = isNitro ? 260 : this.maxSpeed;

    if (isNitro) {
      this.nitro = Math.max(0, this.nitro - 0.8);
      // Spawn Nitro Blue Plasma Flame from rear
      this.spawnFlameParticles(0x00f2fe, 3);
    } else {
      this.nitro = Math.min(100, this.nitro + 0.15);
      if (this.keys.up && Math.random() < 0.3) {
        this.spawnFlameParticles(0xff6600, 1);
      }
    }

    // Acceleration and Braking
    if (this.keys.up || this.running) {
      this.speed = Math.min(targetSpeed, this.speed + 1.4);
    }
    if (this.keys.down) {
      this.speed = Math.max(30, this.speed - 4.5);
    }

    this.distance += Math.round(this.speed * 0.05);
    this.distEl.textContent = `${this.distance} m`;
    this.speedEl.textContent = `${Math.round(this.speed)} km/h`;
    this.nitroBar.style.width = `${this.nitro}%`;

    const isDrifting = Math.abs(this.carPos.vx) > 0.35;
    sound.updateEngine(this.speed / 260, isDrifting);

    // Steering Physics:
    // When pressing LEFT: vx becomes NEGATIVE (moves left), yaw becomes POSITIVE (+Y in Three.js turns left), front wheels turn left
    // When pressing RIGHT: vx becomes POSITIVE (moves right), yaw becomes NEGATIVE (-Y in Three.js turns right), front wheels turn right
    const steerResponsiveness = 0.065;
    if (this.keys.left) {
      this.carPos.vx -= steerResponsiveness;
      this.carPos.yaw = Math.min(0.24, this.carPos.yaw + 0.04);
      this.carPos.roll = Math.min(0.08, this.carPos.roll + 0.02);
    } else if (this.keys.right) {
      this.carPos.vx += steerResponsiveness;
      this.carPos.yaw = Math.max(-0.24, this.carPos.yaw - 0.04);
      this.carPos.roll = Math.max(-0.08, this.carPos.roll - 0.02);
    } else {
      this.carPos.vx *= 0.85;
      this.carPos.yaw *= 0.82;
      this.carPos.roll *= 0.82;
    }

    this.carPos.vx = Math.max(-0.65, Math.min(0.65, this.carPos.vx));
    this.carPos.x += this.carPos.vx * (this.speed / 120);

    // Road limits
    const limit = this.roadWidth / 2 - 2.2;
    if (this.carPos.x < -limit) {
      this.carPos.x = -limit;
      this.speed = Math.max(35, this.speed - 5);
    }
    if (this.carPos.x > limit) {
      this.carPos.x = limit;
      this.speed = Math.max(35, this.speed - 5);
    }

    // Update Player Car Mesh Position & Rotations
    this.playerCar.position.set(this.carPos.x, 0, 0);
    this.playerCar.rotation.y = this.carPos.yaw;
    this.playerCar.rotation.z = this.carPos.roll;

    // Rotate Wheels with forward velocity and front steer
    const wheelSpinSpeed = (this.speed * 0.05);
    this.playerCar.userData.wheels.forEach(w => {
      w.mesh.rotation.x += wheelSpinSpeed;
      if (w.isFront) {
        w.group.rotation.y = this.carPos.yaw * 1.5;
      }
    });

    // Update Chase Camera (Dynamic behind player car, looking forward)
    const targetFOV = isNitro ? 74 : 60;
    this.camera.fov += (targetFOV - this.camera.fov) * 0.1;
    this.camera.updateProjectionMatrix();

    // Camera sways slightly with steering and follows player car
    const targetCamX = this.carPos.x * 0.55;
    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.15;
    this.camera.position.y = 4.6 + (isNitro ? -0.2 : 0);
    this.camera.position.z = -9;
    this.camera.lookAt(this.carPos.x * 0.35, 1.4, 20);

    // Scroll Lane Dashes towards camera (Moving forward in +Z means road moves towards -Z)
    const scrollStep = this.speed * 0.045;
    this.laneDashes.forEach(dash => {
      dash.position.z -= scrollStep;
      if (dash.position.z < -20) {
        dash.position.z += this.roadLength;
      }
    });

    // Scroll Overhead Arches
    this.arches.forEach(arch => {
      arch.position.z -= scrollStep;
      if (arch.position.z < -30) {
        arch.position.z += 600;
      }
    });

    // Spawn 3D Traffic
    this.spawnTimer++;
    if (this.spawnTimer > Math.max(28, 75 - Math.floor(this.distance / 250))) {
      this.spawnTimer = 0;
      this.spawnTraffic();
    }

    // Update Traffic Cars (Moving in same direction at slower speed, relative distance closes)
    for (let i = this.trafficCars.length - 1; i >= 0; i--) {
      const t = this.trafficCars[i];
      const relSpeed = (this.speed - t.speed) * 0.045;
      t.mesh.position.z -= relSpeed;

      // Spin traffic wheels
      t.mesh.userData.wheels.forEach(w => {
        w.mesh.rotation.x += t.speed * 0.05;
      });

      // Check 3D Box Collision with Player
      const dx = Math.abs(t.mesh.position.x - this.playerCar.position.x);
      const dz = Math.abs(t.mesh.position.z - this.playerCar.position.z);
      if (dx < 2.2 && dz < 4.2) {
        this.handleCrash();
        return;
      }

      if (t.mesh.position.z < -35 || t.mesh.position.z > 400) {
        this.scene.remove(t.mesh);
        this.trafficCars.splice(i, 1);
      }
    }
  }

  spawnFlameParticles(color, count = 2) {
    // Twin exhaust locations at rear of player car
    const exOffsets = [-0.45, 0.45];
    exOffsets.forEach(ox => {
      for (let i = 0; i < count; i++) {
        const pGeo = new THREE.SphereGeometry(0.18 + Math.random() * 0.15, 6, 6);
        const pMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
        const p = new THREE.Mesh(pGeo, pMat);

        p.position.set(
          this.playerCar.position.x + ox + (Math.random() - 0.5) * 0.2,
          0.4 + (Math.random() - 0.5) * 0.1,
          -2.4 - Math.random() * 0.8
        );

        this.scene.add(p);
        setTimeout(() => {
          this.scene.remove(p);
          pGeo.dispose();
          pMat.dispose();
        }, 80);
      }
    });
  }

  spawnTraffic() {
    const lanes = [-8.5, -3.0, 3.0, 8.5];
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    const colors = [0x00f2fe, 0xffdd00, 0x00ff88, 0xff9900, 0xffffff, 0x9d4edd];
    const carColor = colors[Math.floor(Math.random() * colors.length)];

    const tCar = this.createCar(carColor, false);
    tCar.position.set(laneX, 0, 260);
    this.scene.add(tCar);

    this.trafficCars.push({
      mesh: tCar,
      speed: 65 + Math.random() * 45
    });
  }

  handleCrash() {
    this.running = false;
    sound.stopEngine();
    sound.playNoise(0.7, 0.4, 250);
    sound.playGameOver();

    const earnedTickets = Math.floor(this.distance / 100);
    if (earnedTickets > 0) ticketShop.addTickets(earnedTickets);
    const isNewHigh = ticketShop.setHighScore('car_racing', this.distance);

    document.getElementById('race-overlay-title').textContent = '3D KAZA YAPTIN!';
    document.getElementById('race-overlay-desc').innerHTML = `
      Gidilen Mesafe: <b>${this.distance} m</b> ${isNewHigh ? '🏆 <span style="color:#ffe600">YENİ REKOR!</span>' : ''}<br>
      Kazanılan Bilet: <b>🎟️ +${earnedTickets}</b>
    `;
    this.startBtn.textContent = 'YENİDEN YARIŞ';
    this.overlay.style.display = 'flex';
  }
}
