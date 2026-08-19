// Lunapark Theme Park 2D Canvas Engine
import { sound } from '../audio/soundManager.js';
import { FireworksManager } from './fireworks.js';

export class CarnivalCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fireworks = new FireworksManager();
    this.isNight = true; // Default to night carnival for stunning neon visuals
    this.time = 0;

    // Train state
    this.trainT = 0; // Position along curve [0, 1]
    this.trainSpeed = 0.0018;
    this.trainSmoke = [];
    this.whistleCooldown = 0;

    // Ferris Wheel state
    this.wheelAngle = 0;

    // Hot air balloons
    this.balloons = [
      { x: 120, y: 150, targetY: 150, color1: '#ff3366', color2: '#ffcc00', floatOffset: 0 },
      { x: 580, y: 200, targetY: 200, color1: '#33ccff', color2: '#cc66ff', floatOffset: 2.5 }
    ];

    // Searchlights for night festival
    this.searchlights = [
      { x: 0.25, baseAngle: -0.2, speed: 0.015, color: 'rgba(255, 230, 100, 0.22)' },
      { x: 0.75, baseAngle: 0.2, speed: -0.018, color: 'rgba(100, 220, 255, 0.22)' }
    ];

    // Stars
    this.stars = [];
    this.initStars();

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Click on canvas = firework
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if click near train
      const trainPos = this.getTrackPoint(this.trainT);
      if (Math.hypot(x - trainPos.x, y - trainPos.y) < 60) {
        sound.playTrainWhistle();
        this.addSmokeBurst(trainPos.x, trainPos.y);
      } else {
        this.fireworks.launch(x, y);
      }
    });
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.65,
        size: Math.random() * 2 + 0.8,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setTheme(isNight) {
    this.isNight = isNight;
  }

  toggleTheme() {
    this.isNight = !this.isNight;
    return this.isNight;
  }

  // Spline math for rollercoaster track
  getTrackPoint(t) {
    const w = this.width;
    const h = this.height;
    // Track points across the screen
    const p0 = { x: -80, y: h * 0.65 };
    const p1 = { x: w * 0.22, y: h * 0.32 };
    const p2 = { x: w * 0.45, y: h * 0.72 };
    const p3 = { x: w * 0.68, y: h * 0.38 };
    const p4 = { x: w * 0.88, y: h * 0.62 };
    const p5 = { x: w + 80, y: h * 0.48 };

    // Multi-segment Catmull-Rom or cubic Bezier
    // We break t into 3 segments: 0..0.33, 0.33..0.66, 0.66..1.0
    if (t < 0.333) {
      const segT = t / 0.333;
      return this.bezier2D(p0, { x: w * 0.1, y: h * 0.3 }, { x: w * 0.18, y: h * 0.32 }, p1, segT);
    } else if (t < 0.666) {
      const segT = (t - 0.333) / 0.333;
      return this.bezier2D(p1, { x: w * 0.3, y: h * 0.75 }, { x: w * 0.4, y: h * 0.72 }, p3, segT);
    } else {
      const segT = (t - 0.666) / 0.334;
      return this.bezier2D(p3, { x: w * 0.78, y: h * 0.65 }, { x: w * 0.88, y: h * 0.6 }, p5, segT);
    }
  }

  bezier2D(p0, p1, p2, p3, t) {
    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const x = ax * t * t * t + bx * t * t + cx * t + p0.x;
    const y = ay * t * t * t + by * t * t + cy * t + p0.y;
    return { x, y };
  }

  addSmokeBurst(x, y) {
    for (let i = 0; i < 15; i++) {
      this.trainSmoke.push({
        x: x + (Math.random() * 10 - 5),
        y: y - 10,
        vx: (Math.random() - 0.5) * 1.5 - 1,
        vy: -Math.random() * 2 - 1,
        size: 5 + Math.random() * 8,
        alpha: 0.8,
        maxLife: 40 + Math.random() * 30,
        life: 0
      });
    }
  }

  update() {
    this.time += 0.02;
    this.wheelAngle += 0.008;

    // Track dynamics: faster downhill, slower uphill
    const pCurrent = this.getTrackPoint(this.trainT);
    const pNext = this.getTrackPoint((this.trainT + 0.01) % 1);
    const slope = (pNext.y - pCurrent.y); // Positive = downhill
    const dynamicSpeed = this.trainSpeed * (1 + slope * 0.008);

    this.trainT = (this.trainT + dynamicSpeed) % 1.0;

    // Train smoke
    if (Math.random() < 0.35) {
      this.trainSmoke.push({
        x: pCurrent.x,
        y: pCurrent.y - 12,
        vx: (Math.random() - 0.5) * 0.8 - 0.8,
        vy: -Math.random() * 1.2 - 0.8,
        size: 4 + Math.random() * 6,
        alpha: 0.7,
        maxLife: 35 + Math.random() * 20,
        life: 0
      });
    }

    // Update smoke
    for (let i = this.trainSmoke.length - 1; i >= 0; i--) {
      const s = this.trainSmoke[i];
      s.x += s.vx;
      s.y += s.vy;
      s.size += 0.3;
      s.life++;
      s.alpha = 0.7 * (1 - s.life / s.maxLife);
      if (s.life >= s.maxLife) {
        this.trainSmoke.splice(i, 1);
      }
    }

    // Auto train whistle occasionally
    this.whistleCooldown++;
    if (this.whistleCooldown > 700) {
      this.whistleCooldown = 0;
      if (Math.random() < 0.4) {
        sound.playTrainWhistle();
      }
    }

    // Update fireworks
    this.fireworks.update(this.isNight);
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Sky & Atmosphere
    this.drawSky(ctx, w, h);

    // 2. Stars / Clouds & Celestial Bodies
    if (this.isNight) {
      this.drawStars(ctx, w, h);
      this.drawMoon(ctx, w * 0.85, h * 0.18);
      this.drawSearchlights(ctx, w, h);
    } else {
      this.drawSun(ctx, w * 0.85, h * 0.18);
      this.drawClouds(ctx, w, h);
    }

    // 3. Distant Mountains and Hot Air Balloons
    this.drawHills(ctx, w, h);
    this.drawBalloons(ctx);

    // 4. Ferris Wheel
    this.drawFerrisWheel(ctx, w * 0.14, h * 0.58, Math.min(w * 0.12, 130));

    // 5. Circus Big Top & Carnival Tents
    this.drawCarnivalTents(ctx, w, h);

    // 6. Rollercoaster Tracks & Supports
    this.drawRollercoasterTracks(ctx, w, h);

    // 7. Animated Train
    this.drawTrain(ctx);

    // 8. Festive Light Strings (Bunting / Garlands)
    this.drawLightGarlands(ctx, w, h);

    // 9. Fireworks
    this.fireworks.draw(ctx);
  }

  drawSky(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    if (this.isNight) {
      grad.addColorStop(0, '#0a091d');
      grad.addColorStop(0.5, '#141238');
      grad.addColorStop(1, '#2c154d');
    } else {
      grad.addColorStop(0, '#4facfe');
      grad.addColorStop(0.5, '#00f2fe');
      grad.addColorStop(1, '#e0f7fa');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  drawStars(ctx, w, h) {
    ctx.save();
    this.stars.forEach(star => {
      const alpha = 0.4 + 0.6 * Math.sin(this.time * star.twinkleSpeed * 10 + star.twinkleOffset);
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawMoon(ctx, x, y) {
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = 'rgba(255, 245, 180, 0.8)';
    ctx.fillStyle = '#fffce0';
    ctx.beginPath();
    ctx.arc(x, y, 38, 0, Math.PI * 2);
    ctx.fill();

    // Moon shadow for crescent
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#141238';
    ctx.beginPath();
    ctx.arc(x + 14, y - 10, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawSun(ctx, x, y) {
    ctx.save();
    ctx.shadowBlur = 40;
    ctx.shadowColor = '#ffea79';
    ctx.fillStyle = '#ffde59';
    ctx.beginPath();
    ctx.arc(x, y, 42, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays
    ctx.strokeStyle = 'rgba(255, 222, 89, 0.4)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i + this.time * 0.1;
      const r1 = 52;
      const r2 = 68;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * r1, y + Math.sin(angle) * r1);
      ctx.lineTo(x + Math.cos(angle) * r2, y + Math.sin(angle) * r2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawClouds(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    const clouds = [
      { x: (w * 0.2 + this.time * 15) % (w + 200) - 100, y: h * 0.18, scale: 1 },
      { x: (w * 0.65 + this.time * 10) % (w + 200) - 100, y: h * 0.28, scale: 1.3 }
    ];

    clouds.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 30 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 25 * c.scale, c.y - 12 * c.scale, 26 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 55 * c.scale, c.y, 28 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 30 * c.scale, c.y + 10 * c.scale, 20 * c.scale, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawSearchlights(ctx, w, h) {
    ctx.save();
    this.searchlights.forEach(sl => {
      const sx = sl.x * w;
      const sy = h;
      const angle = sl.baseAngle + Math.sin(this.time * sl.speed * 10) * 0.45;
      const len = h * 1.2;
      const endX = sx + Math.sin(angle) * len;
      const endY = sy - Math.cos(angle) * len;
      const beamWidth = 70;

      const grad = ctx.createLinearGradient(sx, sy, endX, endY);
      grad.addColorStop(0, sl.color);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(sx - 10, sy);
      ctx.lineTo(endX - beamWidth, endY);
      ctx.lineTo(endX + beamWidth, endY);
      ctx.lineTo(sx + 10, sy);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  drawHills(ctx, w, h) {
    ctx.save();
    // Distant layer
    ctx.fillStyle = this.isNight ? '#1b1138' : '#69b47e';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.quadraticCurveTo(w * 0.25, h * 0.55, w * 0.5, h * 0.72);
    ctx.quadraticCurveTo(w * 0.75, h * 0.6, w, h * 0.78);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Foreground layer
    ctx.fillStyle = this.isNight ? '#120b26' : '#4ba363';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.88);
    ctx.quadraticCurveTo(w * 0.35, h * 0.75, w * 0.7, h * 0.86);
    ctx.quadraticCurveTo(w * 0.88, h * 0.8, w, h * 0.9);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
    ctx.restore();
  }

  drawBalloons(ctx) {
    ctx.save();
    this.balloons.forEach(b => {
      const by = b.targetY + Math.sin(this.time + b.floatOffset) * 12;
      const bx = b.x;

      // Balloon body
      const grad = ctx.createLinearGradient(bx - 20, by - 30, bx + 20, by + 30);
      grad.addColorStop(0, b.color1);
      grad.addColorStop(1, b.color2);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(bx, by, 22, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Basket
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx - 8, by + 26);
      ctx.lineTo(bx - 6, by + 36);
      ctx.moveTo(bx + 8, by + 26);
      ctx.lineTo(bx + 6, by + 36);
      ctx.stroke();

      ctx.fillStyle = '#c68a4c';
      ctx.fillRect(bx - 7, by + 36, 14, 8);
    });
    ctx.restore();
  }

  drawFerrisWheel(ctx, cx, cy, radius) {
    ctx.save();
    // Base A-frame stand
    ctx.strokeStyle = this.isNight ? '#3b3a6d' : '#8c9eff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - radius * 0.65, cy + radius * 1.25);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * 0.65, cy + radius * 1.25);
    ctx.moveTo(cx - radius * 0.35, cy + radius * 0.7);
    ctx.lineTo(cx + radius * 0.35, cy + radius * 0.7);
    ctx.stroke();

    // Wheel Ring
    ctx.strokeStyle = this.isNight ? '#ff3388' : '#ff4081';
    ctx.lineWidth = 4;
    ctx.shadowBlur = this.isNight ? 14 : 0;
    ctx.shadowColor = '#ff3388';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
    ctx.stroke();

    // Spokes & Cabins
    const cabinCount = 10;
    const colors = ['#ffdd00', '#00f2fe', '#ff3366', '#33ff99', '#ff9933'];

    for (let i = 0; i < cabinCount; i++) {
      const angle = this.wheelAngle + (Math.PI * 2 / cabinCount) * i;
      const spokeX = cx + Math.cos(angle) * radius;
      const spokeY = cy + Math.sin(angle) * radius;

      // Spoke line
      ctx.strokeStyle = this.isNight ? 'rgba(255, 255, 255, 0.4)' : '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(spokeX, spokeY);
      ctx.stroke();

      // Cabin (always upright)
      ctx.fillStyle = colors[i % colors.length];
      ctx.shadowBlur = this.isNight ? 10 : 0;
      ctx.shadowColor = colors[i % colors.length];
      ctx.beginPath();
      ctx.roundRect(spokeX - 8, spokeY, 16, 14, [2, 2, 4, 4]);
      ctx.fill();

      // Cabin window
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(spokeX - 5, spokeY + 3, 10, 6);
    }

    // Hub center
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawCarnivalTents(ctx, w, h) {
    ctx.save();
    // Big top circus tent on right-hand side
    const tx = w * 0.82;
    const ty = h * 0.72;
    const tw = 160;
    const th = 90;

    // Tent walls
    ctx.fillStyle = this.isNight ? '#8b1e4f' : '#e91e63';
    ctx.fillRect(tx - tw / 2, ty, tw, 50);

    // Striped Roof
    const roofTipX = tx;
    const roofTipY = ty - th;

    const slices = 8;
    for (let i = 0; i < slices; i++) {
      const x1 = (tx - tw / 2) + (tw / slices) * i;
      const x2 = (tx - tw / 2) + (tw / slices) * (i + 1);

      ctx.fillStyle = (i % 2 === 0) ? (this.isNight ? '#ffcc00' : '#ffe082') : (this.isNight ? '#e6005c' : '#f06292');
      ctx.beginPath();
      ctx.moveTo(roofTipX, roofTipY);
      ctx.lineTo(x1, ty);
      ctx.lineTo(x2, ty);
      ctx.closePath();
      ctx.fill();
    }

    // Flag at top
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(roofTipX, roofTipY);
    ctx.lineTo(roofTipX, roofTipY - 20);
    ctx.stroke();

    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.moveTo(roofTipX, roofTipY - 20);
    ctx.lineTo(roofTipX + 18, roofTipY - 14 + Math.sin(this.time * 4) * 3);
    ctx.lineTo(roofTipX, roofTipY - 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawRollercoasterTracks(ctx, w, h) {
    ctx.save();
    const steps = 120;
    const trackPoints = [];

    for (let i = 0; i <= steps; i++) {
      trackPoints.push(this.getTrackPoint(i / steps));
    }

    // Support pillars
    ctx.strokeStyle = this.isNight ? 'rgba(90, 85, 140, 0.45)' : 'rgba(100, 100, 120, 0.4)';
    ctx.lineWidth = 3;
    for (let i = 4; i < steps; i += 6) {
      const pt = trackPoints[i];
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x, h);
      ctx.stroke();

      // Crossbars
      ctx.beginPath();
      ctx.moveTo(pt.x - 12, pt.y + 20);
      ctx.lineTo(pt.x + 12, pt.y + 40);
      ctx.stroke();
    }

    // Main Rails (Top & Bottom neon rails)
    ctx.strokeStyle = this.isNight ? '#00f2fe' : '#0288d1';
    ctx.lineWidth = 4;
    ctx.shadowBlur = this.isNight ? 12 : 0;
    ctx.shadowColor = '#00f2fe';

    ctx.beginPath();
    ctx.moveTo(trackPoints[0].x, trackPoints[0].y);
    for (let i = 1; i <= steps; i++) {
      ctx.lineTo(trackPoints[i].x, trackPoints[i].y);
    }
    ctx.stroke();

    // Secondary lower rail
    ctx.strokeStyle = this.isNight ? '#ff00aa' : '#c2185b';
    ctx.shadowColor = '#ff00aa';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(trackPoints[0].x, trackPoints[0].y + 10);
    for (let i = 1; i <= steps; i++) {
      ctx.lineTo(trackPoints[i].x, trackPoints[i].y + 10);
    }
    ctx.stroke();

    // Sleepers (Ties connecting rails)
    ctx.strokeStyle = this.isNight ? '#ffe600' : '#455a64';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    for (let i = 0; i <= steps; i += 2) {
      const pt = trackPoints[i];
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x, pt.y + 10);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawTrain(ctx) {
    ctx.save();
    // Draw smoke
    this.trainSmoke.forEach(s => {
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = this.isNight ? 'rgba(230, 240, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Train Cars: 1 Engine + 3 carriages
    const carOffsets = [0, -0.024, -0.046, -0.068];
    const carColors = ['#ff2a6d', '#05d9e8', '#f8d210', '#ff007f'];

    for (let i = carOffsets.length - 1; i >= 0; i--) {
      const offsetT = (this.trainT + carOffsets[i] + 1) % 1;
      const pt = this.getTrackPoint(offsetT);
      const ptNext = this.getTrackPoint((offsetT + 0.008) % 1);
      const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x);

      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(angle);

      const isEngine = (i === 0);
      const color = carColors[i % carColors.length];

      // Wheels
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(-10, -2, 5, 0, Math.PI * 2);
      ctx.arc(10, -2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Car Body
      ctx.fillStyle = color;
      ctx.shadowBlur = this.isNight ? 10 : 0;
      ctx.shadowColor = color;
      ctx.beginPath();
      if (isEngine) {
        // Engine body with chimney & cab
        ctx.roundRect(-16, -22, 32, 18, [6, 6, 2, 2]);
        ctx.fill();

        // Chimney
        ctx.fillStyle = '#333';
        ctx.fillRect(6, -30, 6, 10);

        // Headlight
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffff00';
        ctx.beginPath();
        ctx.arc(16, -14, 4, 0, Math.PI * 2);
        ctx.fill();

        // Light beam
        if (this.isNight) {
          const grad = ctx.createRadialGradient(16, -14, 2, 70, -14, 70);
          grad.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
          grad.addColorStop(1, 'rgba(255, 255, 200, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(16, -14);
          ctx.lineTo(80, -35);
          ctx.lineTo(80, 7);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        // Passenger carriage
        ctx.roundRect(-14, -18, 28, 14, [4, 4, 2, 2]);
        ctx.fill();

        // Happy silhouette riders
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5, -21, 3.5, 0, Math.PI * 2);
        ctx.arc(5, -21, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  drawLightGarlands(ctx, w, h) {
    ctx.save();
    // Drooping light strings at the top
    const sw = w / 4;
    const bulbColors = ['#ff0055', '#ffe600', '#00ffcc', '#ff00ff', '#00e5ff'];
    const timeShift = Math.floor(this.time * 6);

    for (let s = 0; s < 4; s++) {
      const x1 = s * sw;
      const x2 = (s + 1) * sw;
      const y1 = 15;
      const y2 = 15;
      const dropY = 45;

      ctx.strokeStyle = this.isNight ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo((x1 + x2) / 2, dropY, x2, y2);
      ctx.stroke();

      // Bulbs
      const bulbCount = 6;
      for (let b = 1; b < bulbCount; b++) {
        const t = b / bulbCount;
        const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * ((x1 + x2) / 2) + t * t * x2;
        const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * dropY + t * t * y2;
        const color = bulbColors[(b + s + timeShift) % bulbColors.length];

        ctx.fillStyle = color;
        ctx.shadowBlur = this.isNight ? 12 : 3;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
