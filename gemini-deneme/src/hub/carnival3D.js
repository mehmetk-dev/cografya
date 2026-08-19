// 3D Lunapark Theme Park Engine with Realistic Tubular Truss Track & Exact Newtonian Physics
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { sound } from '../audio/soundManager.js';

export class Carnival3D {
  constructor(container, onSelectGame) {
    this.container = container;
    this.onSelectGame = onSelectGame;
    this.isNight = true;
    this.cameraMode = 'orbit'; // 'orbit', 'coaster_pov', 'follow', 'overview'
    this.time = 0;
    this.clock = new THREE.Clock();

    // TRUE NEWTONIAN COASTER PHYSICS STATE
    this.trainDistance = 0;
    this.trainVelocity = 4.2; // Starts at mechanical lift speed (4.2 m/s = 15 km/h)
    this.totalTrackLength = 400; // Updated dynamically from spline
    this.liftStartDist = 40;     // Start of chain lift hill
    this.liftEndDist = 145;      // Crest of chain lift hill (Peak)
    this.brakeStartDist = 360;   // Station approach brake run

    this.wheelAngle = 0;
    this.carouselAngle = 0;

    this.smokeParticles = [];
    this.fireworks = [];
    this.interactiveBooths = [];
    this.hoveredBooth = null;

    // HUD Elements
    this.hudEl = document.getElementById('coaster-telemetry-hud');
    this.hudKmh = document.getElementById('coaster-kmh');
    this.hudSection = document.getElementById('coaster-section');
    this.hudGForce = document.getElementById('coaster-gforce');

    this.initScene();
    this.initLighting();
    this.initLandscape();
    this.initRealisticRollercoaster();
    this.initFerrisWheel();
    this.initCarousel();
    this.initCircusTent();
    this.initGameBooths();
    this.initSearchlights();
    this.initStarField();
    this.initRaycaster();

    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a091d);
    this.scene.fog = new THREE.FogExp2(0x0a091d, 0.0028);

    this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.5, 1800);
    this.camera.position.set(0, 70, 140);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
    this.controls.minDistance = 15;
    this.controls.maxDistance = 350;
    this.controls.target.set(0, 12, 0);
  }

  initLighting() {
    this.ambientLight = new THREE.AmbientLight(0x3a3560, 1.3);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0x8a9bff, 2.0);
    this.dirLight.position.set(80, 160, 70);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 400;
    const d = 160;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    this.hemiLight = new THREE.HemisphereLight(0x2a1b4e, 0x050410, 0.9);
    this.scene.add(this.hemiLight);
  }

  initLandscape() {
    const groundGeo = new THREE.CylinderGeometry(180, 185, 8, 54);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x120e24,
      roughness: 0.85,
      metalness: 0.1
    });
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.position.y = -4;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    const plazaGeo = new THREE.CircleGeometry(50, 36);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x1f1938, roughness: 0.75 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.05;
    plaza.receiveShadow = true;
    this.scene.add(plaza);

    this.initFountain();
    this.initParkDecorations();
  }

  initFountain() {
    const fBaseGeo = new THREE.CylinderGeometry(8, 9.5, 1.8, 24);
    const fBaseMat = new THREE.MeshStandardMaterial({ color: 0x382e5e, roughness: 0.5 });
    const fBase = new THREE.Mesh(fBaseGeo, fBaseMat);
    fBase.position.set(0, 0.9, 0);
    fBase.receiveShadow = true;
    fBase.castShadow = true;
    this.scene.add(fBase);

    const waterGeo = new THREE.CircleGeometry(7.8, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x005577,
      emissiveIntensity: 0.4
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 1.7, 0);
    this.scene.add(water);

    const spireGeo = new THREE.ConeGeometry(2, 7, 16);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, metalness: 0.7, roughness: 0.2 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(0, 5.2, 0);
    spire.castShadow = true;
    this.scene.add(spire);

    const fLight = new THREE.PointLight(0x00f2fe, 2.5, 30);
    fLight.position.set(0, 5, 0);
    this.scene.add(fLight);
  }

  initParkDecorations() {
    const treeGeo = new THREE.ConeGeometry(3.4, 8.0, 7);
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 3, 6);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x1a4530, roughness: 0.9 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });

    const treePositions = [
      [-18, 38], [18, 38], [-38, 22], [38, 22],
      [-52, -10], [52, -10], [-45, -42], [45, -42],
      [0, 55], [-55, 35], [55, 35]
    ];

    treePositions.forEach(([x, z]) => {
      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.5;
      trunk.castShadow = true;

      const crown = new THREE.Mesh(treeGeo, treeMat);
      crown.position.y = 6.2;
      crown.castShadow = true;

      treeGroup.add(trunk, crown);
      treeGroup.position.set(x, 0, z);
      this.scene.add(treeGroup);
    });

    const lampPositions = [
      [-16, 16], [16, 16], [-16, -16], [16, -16],
      [-30, 0], [30, 0], [0, 30]
    ];

    lampPositions.forEach(([x, z]) => {
      const lampGroup = new THREE.Group();
      const poleGeo = new THREE.CylinderGeometry(0.2, 0.3, 7.5, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x222, metalness: 0.8 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 3.75;
      pole.castShadow = true;

      const bulbGeo = new THREE.SphereGeometry(0.8, 12, 12);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xffdd88,
        emissive: 0xffaa22,
        emissiveIntensity: 1.6
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.y = 7.5;

      const lampLight = new THREE.PointLight(0xffaa44, 1.4, 20);
      lampLight.position.y = 7.5;

      lampGroup.add(pole, bulb, lampLight);
      lampGroup.position.set(x, 0, z);
      this.scene.add(lampGroup);
    });
  }

  initRealisticRollercoaster() {
    const trackPoints = [
      new THREE.Vector3(60, 6, 20),      // Station Loading Platform
      new THREE.Vector3(70, 6, -10),     // Curve into Lift Hill
      new THREE.Vector3(65, 18, -45),    // Chain Lift Ascent (30 deg)
      new THREE.Vector3(35, 36, -72),    // Approaching Summit
      new THREE.Vector3(0, 44, -84),     // THE CREST SUMMIT (44m elevation)
      new THREE.Vector3(-38, 22, -76),   // First Drop Plunge
      new THREE.Vector3(-68, 6.5, -45),  // Valley Point (Max Speed > 80 km/h)
      new THREE.Vector3(-82, 26, 0),     // Camelback Airtime Hill
      new THREE.Vector3(-72, 10, 48),    // Valley 2
      new THREE.Vector3(-35, 20, 78),    // Banked Carousel Turn
      new THREE.Vector3(15, 14, 82),     // Turn apex
      new THREE.Vector3(52, 8, 60),      // Brake run deceleration
      new THREE.Vector3(58, 6, 35)       // Station return
    ];

    this.trackCurve = new THREE.CatmullRomCurve3(trackPoints, true, 'centripetal', 0.5);
    this.totalTrackLength = this.trackCurve.getLength();

    const trackSamples = 400;
    const trackGroup = new THREE.Group();

    const railMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x003355,
      emissiveIntensity: 0.5
    });

    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x3d2b63,
      metalness: 0.8,
      roughness: 0.3
    });

    const tieMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.7,
      roughness: 0.3
    });

    const gauge = 1.6;
    const spineDrop = 0.7;

    const leftRailPoints = [];
    const rightRailPoints = [];
    const spinePoints = [];

    for (let i = 0; i <= trackSamples; i++) {
      const u = i / trackSamples;
      const pt = this.trackCurve.getPointAt(u);
      const tangent = this.trackCurve.getTangentAt(u).normalize();

      const worldUp = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, worldUp).normalize();
      const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

      const leftPt = pt.clone().add(binormal.clone().multiplyScalar(-gauge / 2));
      const rightPt = pt.clone().add(binormal.clone().multiplyScalar(gauge / 2));
      const spinePt = pt.clone().add(normal.clone().multiplyScalar(-spineDrop));

      leftRailPoints.push(leftPt);
      rightRailPoints.push(rightPt);
      spinePoints.push(spinePt);

      if (i % 4 === 0) {
        const tieGeo = new THREE.CylinderGeometry(0.08, 0.08, gauge, 6);
        const tie = new THREE.Mesh(tieGeo, tieMat);
        tie.position.copy(leftPt).add(rightPt).multiplyScalar(0.5);
        tie.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), binormal);
        trackGroup.add(tie);

        const strutGeo = new THREE.CylinderGeometry(0.06, 0.06, Math.hypot(gauge / 2, spineDrop), 6);

        const strutL = new THREE.Mesh(strutGeo, tieMat);
        strutL.position.copy(leftPt).add(spinePt).multiplyScalar(0.5);
        const dirL = spinePt.clone().sub(leftPt).normalize();
        strutL.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirL);

        const strutR = new THREE.Mesh(strutGeo, tieMat);
        strutR.position.copy(rightPt).add(spinePt).multiplyScalar(0.5);
        const dirR = spinePt.clone().sub(rightPt).normalize();
        strutR.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirR);

        trackGroup.add(strutL, strutR);
      }

      if (i % 16 === 0 && pt.y > 4) {
        const pillarHeight = pt.y - 0.2;
        const pillarGeo = new THREE.CylinderGeometry(0.6, 0.9, pillarHeight, 8);
        const pillar = new THREE.Mesh(pillarGeo, spineMat);
        pillar.position.set(pt.x, pillarHeight / 2, pt.z);
        pillar.castShadow = true;
        trackGroup.add(pillar);

        const footGeo = new THREE.BoxGeometry(2.4, 0.8, 2.4);
        const footMat = new THREE.MeshStandardMaterial({ color: 0x555566, roughness: 0.9 });
        const foot = new THREE.Mesh(footGeo, footMat);
        foot.position.set(pt.x, 0.4, pt.z);
        trackGroup.add(foot);
      }
    }

    const leftCurve = new THREE.CatmullRomCurve3(leftRailPoints, true);
    const rightCurve = new THREE.CatmullRomCurve3(rightRailPoints, true);
    const spineCurve = new THREE.CatmullRomCurve3(spinePoints, true);

    const leftTube = new THREE.Mesh(new THREE.TubeGeometry(leftCurve, 320, 0.18, 8, true), railMat);
    const rightTube = new THREE.Mesh(new THREE.TubeGeometry(rightCurve, 320, 0.18, 8, true), railMat);
    const spineTube = new THREE.Mesh(new THREE.TubeGeometry(spineCurve, 320, 0.32, 8, true), spineMat);

    leftTube.castShadow = true;
    rightTube.castShadow = true;
    spineTube.castShadow = true;

    trackGroup.add(leftTube, rightTube, spineTube);
    this.scene.add(trackGroup);

    this.initStationPlatform();
    this.initTrainCars(gauge);
  }

  initStationPlatform() {
    const platGroup = new THREE.Group();
    platGroup.position.set(59, 0, 28);

    const deckGeo = new THREE.BoxGeometry(16, 5.2, 28);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x2d1f18, roughness: 0.8 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 2.6;
    deck.receiveShadow = true;

    const roofGeo = new THREE.BoxGeometry(18, 0.6, 30);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0x440015, emissiveIntensity: 0.6 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 10;

    const postMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
    [-7, 7].forEach(px => {
      [-12, 0, 12].forEach(pz => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 8), postMat);
        post.position.set(px, 7.5, pz);
        platGroup.add(post);
      });
    });

    platGroup.add(deck, roof);
    this.scene.add(platGroup);
  }

  initTrainCars(gauge) {
    this.trainGroup = new THREE.Group();
    this.trainCars = [];

    const carColors = [0xff0055, 0x00f2fe, 0xffdd00];

    for (let c = 0; c < 3; c++) {
      const carGroup = new THREE.Group();
      const isEngine = (c === 0);
      const color = carColors[c];

      const bodyMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.25,
        metalness: 0.6
      });

      const bodyGeo = new THREE.BoxGeometry(2.2, 1.4, 3.8);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.9;
      body.castShadow = true;

      const seatGeo = new THREE.BoxGeometry(1.8, 0.8, 1.2);
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x151520 });
      const seat1 = new THREE.Mesh(seatGeo, seatMat);
      seat1.position.set(0, 1.0, 0.7);
      const seat2 = new THREE.Mesh(seatGeo, seatMat);
      seat2.position.set(0, 1.0, -0.7);

      const headGeo = new THREE.SphereGeometry(0.38, 8, 8);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
      const p1 = new THREE.Mesh(headGeo, headMat);
      p1.position.set(-0.45, 2.0, 0.7);
      const p2 = new THREE.Mesh(headGeo, headMat);
      p2.position.set(0.45, 2.0, 0.7);

      carGroup.add(body, seat1, seat2, p1, p2);

      if (isEngine) {
        const cabGeo = new THREE.BoxGeometry(2.4, 1.8, 1.6);
        const cab = new THREE.Mesh(cabGeo, bodyMat);
        cab.position.set(0, 1.8, -0.9);

        const chimGeo = new THREE.CylinderGeometry(0.35, 0.25, 1.2, 12);
        const chim = new THREE.Mesh(chimGeo, new THREE.MeshStandardMaterial({ color: 0xffdd00, metalness: 0.8 }));
        chim.position.set(0, 2.2, 1.2);

        const lampGeo = new THREE.SphereGeometry(0.45, 12, 12);
        const lampMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffaa, emissiveIntensity: 2.5 });
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(0, 1.4, 2.0);

        this.headSpotlight = new THREE.SpotLight(0xfffae0, 6, 60, Math.PI / 4, 0.25);
        this.headSpotlight.position.set(0, 1.4, 2.1);
        this.headSpotTarget = new THREE.Object3D();
        this.headSpotTarget.position.set(0, 1.4, 25);
        carGroup.add(this.headSpotTarget);
        this.headSpotlight.target = this.headSpotTarget;
        carGroup.add(this.headSpotlight);

        carGroup.add(cab, chim, lamp);
      }

      const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.2, 16);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
      const wheels = [];

      const wheelOffsets = [
        [-gauge / 2, 0.2, 1.2],
        [gauge / 2, 0.2, 1.2],
        [-gauge / 2, 0.2, -1.2],
        [gauge / 2, 0.2, -1.2]
      ];

      wheelOffsets.forEach(pos => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(...pos);
        carGroup.add(w);
        wheels.push(w);
      });

      carGroup.userData = { wheels, isEngine };
      this.trainCars.push(carGroup);
      this.trainGroup.add(carGroup);
    }

    this.scene.add(this.trainGroup);
  }

  initFerrisWheel() {
    this.ferrisGroup = new THREE.Group();
    this.ferrisGroup.position.set(-28, 0, -8);
    this.ferrisGroup.rotation.y = Math.PI / 3;

    const radius = 22;

    const standMat = new THREE.MeshStandardMaterial({ color: 0x3d2b63, metalness: 0.7, roughness: 0.3 });
    const leg1Geo = new THREE.CylinderGeometry(0.65, 0.9, 30, 8);
    const leg1 = new THREE.Mesh(leg1Geo, standMat);
    leg1.position.set(-7.5, 13.5, 0);
    leg1.rotation.z = -0.25;

    const leg2 = new THREE.Mesh(leg1Geo, standMat);
    leg2.position.set(7.5, 13.5, 0);
    leg2.rotation.z = 0.25;

    this.ferrisGroup.add(leg1, leg2);

    this.wheelRotationGroup = new THREE.Group();
    this.wheelRotationGroup.position.set(0, 25, 0);

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0x880033,
      emissiveIntensity: 0.8,
      metalness: 0.5
    });

    const rimGeo = new THREE.TorusGeometry(radius, 0.5, 12, 48);
    const rim1 = new THREE.Mesh(rimGeo, rimMat);
    rim1.position.z = -2.0;
    const rim2 = new THREE.Mesh(rimGeo, rimMat);
    rim2.position.z = 2.0;
    this.wheelRotationGroup.add(rim1, rim2);

    this.ferrisCabins = [];
    const spokeCount = 12;
    const cabinColors = [0xff0055, 0x00f2fe, 0xffdd00, 0x00ff88, 0x9d4edd, 0xff9900];

    for (let i = 0; i < spokeCount; i++) {
      const angle = (Math.PI * 2 / spokeCount) * i;

      const spokeGeo = new THREE.CylinderGeometry(0.16, 0.16, radius * 2, 6);
      const spokeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 });
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.z = angle;
      this.wheelRotationGroup.add(spoke);

      const cabinGroup = new THREE.Group();
      cabinGroup.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);

      const cMat = new THREE.MeshStandardMaterial({
        color: cabinColors[i % cabinColors.length],
        emissive: cabinColors[i % cabinColors.length],
        emissiveIntensity: 0.3,
        roughness: 0.3
      });

      const cGeo = new THREE.BoxGeometry(2.8, 3.4, 3.0);
      const cBox = new THREE.Mesh(cGeo, cMat);

      const winGeo = new THREE.BoxGeometry(2.9, 1.3, 2.3);
      const winMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
      const win = new THREE.Mesh(winGeo, winMat);
      win.position.y = 0.45;

      cabinGroup.add(cBox, win);
      this.ferrisCabins.push(cabinGroup);
      this.wheelRotationGroup.add(cabinGroup);
    }

    this.ferrisGroup.add(this.wheelRotationGroup);
    this.scene.add(this.ferrisGroup);
  }

  initCarousel() {
    this.carouselGroup = new THREE.Group();
    this.carouselGroup.position.set(28, 0, -8);

    const podGeo = new THREE.CylinderGeometry(13, 14, 1.5, 24);
    const podMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, roughness: 0.4 });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.y = 0.75;
    this.carouselGroup.add(pod);

    this.carouselRotateGroup = new THREE.Group();
    this.carouselRotateGroup.position.y = 0.75;

    const colGeo = new THREE.CylinderGeometry(2.0, 2.0, 12, 16);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x9d4edd, metalness: 0.6 });
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.y = 6;
    this.carouselRotateGroup.add(col);

    const roofGeo = new THREE.ConeGeometry(14, 6, 24);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0xff0055,
      emissive: 0x660022,
      emissiveIntensity: 0.5,
      roughness: 0.3
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 13;
    this.carouselRotateGroup.add(roof);

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const poleGeo = new THREE.CylinderGeometry(0.15, 0.15, 9, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, metalness: 0.9, roughness: 0.1 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(Math.cos(angle) * 9.5, 5.5, Math.sin(angle) * 9.5);

      const mountGeo = new THREE.BoxGeometry(1.6, 1.4, 2.8);
      const mountMat = new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x00f2fe : 0xff00aa });
      const mount = new THREE.Mesh(mountGeo, mountMat);
      mount.position.set(Math.cos(angle) * 9.5, 4.0, Math.sin(angle) * 9.5);
      mount.rotation.y = angle + Math.PI / 2;

      this.carouselRotateGroup.add(pole, mount);
    }

    this.carouselGroup.add(this.carouselRotateGroup);
    this.scene.add(this.carouselGroup);
  }

  initCircusTent() {
    this.tentGroup = new THREE.Group();
    this.tentGroup.position.set(0, 0, -32);

    const wallGeo = new THREE.CylinderGeometry(16, 17, 9, 32, 1, true);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xff0055, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = 4.5;

    const roofGeo = new THREE.ConeGeometry(19, 13, 32);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0xffdd00,
      emissive: 0x886600,
      emissiveIntensity: 0.3,
      roughness: 0.4
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 15.5;

    const flagPoleGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
    const pole = new THREE.Mesh(flagPoleGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    pole.position.y = 23.5;

    this.tentGroup.add(wall, roof, pole);
    this.scene.add(this.tentGroup);
  }

  initGameBooths() {
    const boothConfigs = [
      { id: 'snake', title: 'NEON YILAN', icon: '🐉', color: 0x00ff88, pos: [-24, 0, 18], rot: 0.25 },
      { id: 'car_racing', title: 'NITRO DRIFT', icon: '🏎️', color: 0xff0055, pos: [-12, 0, 24], rot: 0.1 },
      { id: 'cannon_target', title: 'HEDEF TOPU', icon: '🎯', color: 0xffaa00, pos: [0, 0, 26], rot: 0 },
      { id: 'pinball', title: 'PINBALL', icon: '🕹️', color: 0x9d4edd, pos: [12, 0, 24], rot: -0.1 },
      { id: 'rocket_lander', title: 'ROKET INIŞI', icon: '🚀', color: 0x00f2fe, pos: [24, 0, 18], rot: -0.25 }
    ];

    this.interactiveBooths = [];

    boothConfigs.forEach(cfg => {
      const bGroup = new THREE.Group();
      bGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      bGroup.rotation.y = cfg.rot;
      bGroup.userData = { gameId: cfg.id, title: cfg.title, originalScale: 1.0 };

      const counterGeo = new THREE.BoxGeometry(6.4, 3.2, 4.4);
      const counterMat = new THREE.MeshStandardMaterial({ color: 0x2b1c14, roughness: 0.7 });
      const counter = new THREE.Mesh(counterGeo, counterMat);
      counter.position.y = 1.6;
      counter.castShadow = true;

      const awningGeo = new THREE.ConeGeometry(4.6, 2.4, 4);
      const awningMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.5,
        roughness: 0.3
      });
      const awning = new THREE.Mesh(awningGeo, awningMat);
      awning.position.y = 5.0;
      awning.rotation.y = Math.PI / 4;

      const signGeo = new THREE.BoxGeometry(4.8, 1.4, 0.6);
      const signMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 1.2
      });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(0, 6.4, 0);

      const bLight = new THREE.PointLight(cfg.color, 1.8, 15);
      bLight.position.set(0, 4.4, 2.2);

      bGroup.add(counter, awning, sign, bLight);
      this.interactiveBooths.push(bGroup);
      this.scene.add(bGroup);
    });
  }

  initSearchlights() {
    this.searchlights = [];
    const slData = [
      { x: -35, z: -35, color: 0x00f2fe, speed: 0.015, phase: 0 },
      { x: 35, z: -35, color: 0xff00aa, speed: -0.018, phase: 1.5 }
    ];

    slData.forEach(data => {
      const coneGeo = new THREE.ConeGeometry(13, 140, 16, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.20,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(data.x, 70, data.z);
      this.scene.add(cone);
      this.searchlights.push({ mesh: cone, ...data });
    });
  }

  initStarField() {
    const starCount = 700;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 700;
      positions[i + 1] = 40 + Math.random() * 300;
      positions[i + 2] = (Math.random() - 0.5) * 700;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.9, transparent: true, opacity: 0.9 });
    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);
  }

  initRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.onPointerMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.cameraMode === 'orbit') {
        this.checkBoothHover();
      }
    };

    this.onPointerDown = (e) => {
      if (this.hoveredBooth && this.onSelectGame) {
        sound.playClick();
        this.onSelectGame(this.hoveredBooth.userData.gameId);
      } else {
        this.spawn3DFirework();
      }
    };

    window.addEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
  }

  checkBoothHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveBooths, true);

    if (intersects.length > 0) {
      let root = intersects[0].object;
      while (root.parent && !root.userData.gameId) {
        root = root.parent;
      }

      if (root.userData && root.userData.gameId) {
        if (this.hoveredBooth !== root) {
          if (this.hoveredBooth) this.hoveredBooth.scale.set(1, 1, 1);
          this.hoveredBooth = root;
          this.hoveredBooth.scale.set(1.08, 1.08, 1.08);
          document.body.style.cursor = 'pointer';
        }
        return;
      }
    }

    if (this.hoveredBooth) {
      this.hoveredBooth.scale.set(1, 1, 1);
      this.hoveredBooth = null;
      document.body.style.cursor = 'default';
    }
  }

  spawn3DFirework() {
    const fx = (Math.random() - 0.5) * 90;
    const fy = 55 + Math.random() * 35;
    const fz = (Math.random() - 0.5) * 90;
    const colors = [0xff0055, 0x00f2fe, 0xffdd00, 0x00ff88, 0xff9900, 0x9d4edd];
    const col = colors[Math.floor(Math.random() * colors.length)];

    const pCount = 55;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const velocities = [];

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = fx;
      positions[i * 3 + 1] = fy;
      positions[i * 3 + 2] = fz;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.9 + Math.random() * 1.8;

      velocities.push({
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.cos(phi) * speed,
        vz: Math.sin(phi) * Math.sin(theta) * speed
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: col,
      size: 2.3,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });

    const pSystem = new THREE.Points(pGeo, pMat);
    this.scene.add(pSystem);
    this.fireworks.push({ system: pSystem, velocities, life: 60, maxLife: 60 });
    sound.playFirework();
  }

  setCameraMode(mode) {
    this.cameraMode = mode;

    if (this.hudEl) {
      this.hudEl.style.display = (mode === 'coaster_pov' || mode === 'follow') ? 'flex' : 'none';
    }

    if (mode === 'orbit') {
      this.controls.enabled = true;
      this.camera.position.set(0, 70, 140);
      this.controls.target.set(0, 12, 0);
      this.camera.fov = 52;
      this.camera.updateProjectionMatrix();
      sound.stopCoasterAudio();
    } else if (mode === 'overview') {
      this.controls.enabled = true;
      this.camera.position.set(0, 160, 0.1);
      this.controls.target.set(0, 0, 0);
      this.camera.fov = 52;
      this.camera.updateProjectionMatrix();
      sound.stopCoasterAudio();
    } else if (mode === 'coaster_pov') {
      this.controls.enabled = false;
      sound.playTrainWhistle();
      sound.startCoasterAudio();
    } else if (mode === 'follow') {
      this.controls.enabled = false;
      sound.startCoasterAudio();
    }
  }

  toggleTheme() {
    this.isNight = !this.isNight;
    if (this.isNight) {
      this.scene.background.setHex(0x0a091d);
      this.scene.fog.color.setHex(0x0a091d);
      this.ambientLight.color.setHex(0x3a3560);
      this.dirLight.color.setHex(0x8a9bff);
      this.dirLight.intensity = 2.0;
      this.stars.visible = true;
    } else {
      this.scene.background.setHex(0x6ec5ff);
      this.scene.fog.color.setHex(0x6ec5ff);
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 1.6;
      this.dirLight.color.setHex(0xfff3b0);
      this.dirLight.intensity = 2.6;
      this.stars.visible = false;
    }
    return this.isNight;
  }

  update() {
    const delta = Math.min(0.05, this.clock.getDelta());
    this.time += delta;

    // -------------------------------------------------------------
    // EXACT NEWTONIAN COASTER PHYSICS (Arc-Length Distance Integration)
    // -------------------------------------------------------------
    const u = (this.trainDistance / this.totalTrackLength) % 1.0;
    const pt = this.trackCurve.getPointAt(u);
    const tangent = this.trackCurve.getTangentAt(u).normalize();
    const slope = tangent.y;

    const isChainLift = (this.trainDistance >= this.liftStartDist && this.trainDistance <= this.liftEndDist);

    let sectionName = 'SEYİR TURU';
    let gForce = 1.0;

    if (isChainLift) {
      sectionName = '⚙️ ZİNCİRLİ TIRMANIŞ';
      const targetSpeed = 4.2;
      this.trainVelocity += (targetSpeed - this.trainVelocity) * 2.5 * delta;
      gForce = 1.0 + Math.abs(slope) * 0.2;
    } else {
      if (slope < -0.15) {
        sectionName = '⚡ ÇILGIN İNİŞ (DROP)';
        gForce = 1.0 + Math.abs(slope) * 1.8;
      } else if (slope > 0.15) {
        sectionName = '🎢 TEPE ÇIKIŞI (AIRTIME)';
        gForce = Math.max(0.2, 1.0 - slope * 1.2);
      } else {
        sectionName = '🌀 VİRAJ SEYRİ';
        gForce = 1.0 + (this.trainVelocity / 20.0) * 0.8;
      }

      const gravityAcc = -9.81 * slope;
      const friction = 0.08 * this.trainVelocity;
      const drag = 0.0008 * (this.trainVelocity * this.trainVelocity);

      const netAcc = gravityAcc - friction - drag;
      this.trainVelocity += netAcc * delta;

      this.trainVelocity = Math.max(3.5, Math.min(22.5, this.trainVelocity));

      if (this.trainDistance >= this.brakeStartDist || this.trainDistance < this.liftStartDist) {
        sectionName = '🛑 İSTASYON FRENİ';
        this.trainVelocity += (3.8 - this.trainVelocity) * 1.8 * delta;
        gForce = 1.0;
      }
    }

    this.trainDistance = (this.trainDistance + this.trainVelocity * delta) % this.totalTrackLength;

    const speedKmh = Math.round(this.trainVelocity * 3.6);
    const speedRatio = Math.min(1.0, (this.trainVelocity - 3.5) / 19.0);
    sound.updateCoasterAudio(speedRatio, isChainLift);

    // Update Telemetry HUD
    if (this.hudKmh && (this.cameraMode === 'coaster_pov' || this.cameraMode === 'follow')) {
      this.hudKmh.textContent = `${speedKmh} km/s`;
      this.hudSection.textContent = sectionName;
      this.hudGForce.textContent = `${(Math.round(gForce * 10) / 10).toFixed(1)} G`;
    }

    // Position and Orient Train Cars
    const carDistanceSpacing = 4.4;
    this.trainCars.forEach((car, idx) => {
      const carDist = (this.trainDistance - idx * carDistanceSpacing + this.totalTrackLength) % this.totalTrackLength;
      const carU = carDist / this.totalTrackLength;

      const pos = this.trackCurve.getPointAt(carU);
      const tang = this.trackCurve.getTangentAt(carU).normalize();

      const nextU = (carU + 0.004) % 1.0;
      const nextTang = this.trackCurve.getTangentAt(nextU).normalize();
      const curvatureX = (nextTang.x - tang.x);
      const bankAngle = -curvatureX * 4.0;

      car.position.copy(pos);
      car.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tang);
      car.rotateZ(bankAngle);

      const wheelSpin = (this.trainVelocity / 0.38) * delta;
      car.userData.wheels.forEach(w => {
        w.rotation.x += wheelSpin;
      });
    });

    // 2. Camera Modes Management
    if (this.cameraMode === 'coaster_pov') {
      const enginePos = this.trainCars[0].position;
      const engineU = (this.trainDistance / this.totalTrackLength) % 1.0;
      const engineTang = this.trackCurve.getTangentAt(engineU).normalize();

      const eyePos = enginePos.clone()
        .add(engineTang.clone().multiplyScalar(1.4))
        .add(new THREE.Vector3(0, 2.2, 0));

      if (speedRatio > 0.4) {
        const jitter = (speedRatio - 0.4) * 0.05;
        eyePos.x += (Math.random() - 0.5) * jitter;
        eyePos.y += (Math.random() - 0.5) * jitter;
      }

      this.camera.position.copy(eyePos);
      const lookTarget = enginePos.clone().add(engineTang.clone().multiplyScalar(28));
      this.camera.lookAt(lookTarget);

      const targetFOV = 52 + speedRatio * 16;
      this.camera.fov += (targetFOV - this.camera.fov) * 0.1;
      this.camera.updateProjectionMatrix();
    } else if (this.cameraMode === 'follow') {
      // Follow train from smooth elevated chase perspective
      const enginePos = this.trainCars[0].position;
      const engineU = (this.trainDistance / this.totalTrackLength) % 1.0;
      const engineTang = this.trackCurve.getTangentAt(engineU).normalize();

      const targetCamPos = enginePos.clone()
        .sub(engineTang.clone().multiplyScalar(18))
        .add(new THREE.Vector3(0, 9, 0));

      this.camera.position.lerp(targetCamPos, 0.08);
      this.camera.lookAt(enginePos.clone().add(new THREE.Vector3(0, 2, 0)));
    } else {
      this.controls.update();
    }

    // 3. Ferris Wheel Rotation
    this.wheelAngle += 0.004;
    this.wheelRotationGroup.rotation.z = this.wheelAngle;
    this.ferrisCabins.forEach(cab => {
      cab.rotation.z = -this.wheelAngle;
    });

    // 4. Carousel Rotation
    this.carouselAngle += 0.008;
    this.carouselRotateGroup.rotation.y = this.carouselAngle;

    // 5. Searchlights Animation
    this.searchlights.forEach(sl => {
      sl.mesh.rotation.x = Math.sin(this.time * 0.8 + sl.phase) * 0.45;
      sl.mesh.rotation.z = Math.cos(this.time * 0.6 + sl.phase) * 0.45;
    });

    // 6. 3D Fireworks Update
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      const posAttr = fw.system.geometry.attributes.position;
      const arr = posAttr.array;

      for (let p = 0; p < fw.velocities.length; p++) {
        arr[p * 3] += fw.velocities[p].vx;
        arr[p * 3 + 1] += fw.velocities[p].vy;
        arr[p * 3 + 2] += fw.velocities[p].vz;
        fw.velocities[p].vy -= 0.035;
      }

      posAttr.needsUpdate = true;
      fw.life--;
      fw.system.material.opacity = fw.life / fw.maxLife;

      if (fw.life <= 0) {
        this.scene.remove(fw.system);
        fw.system.geometry.dispose();
        fw.system.material.dispose();
        this.fireworks.splice(i, 1);
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    sound.stopCoasterAudio();
  }
}
