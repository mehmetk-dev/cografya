// Particle Fireworks & Confetti Engine
import { sound } from '../audio/soundManager.js';

export class FireworkParticle {
  constructor(x, y, color, angle, speed, decay, size = 3) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = decay || (0.015 + Math.random() * 0.02);
    this.gravity = 0.06;
    this.friction = 0.98;
    this.size = size;
    this.trail = [];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
    if (this.trail.length > 4) this.trail.shift();

    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    // Draw trail
    ctx.save();
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      ctx.globalAlpha = p.alpha * 0.4;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class FireworkRocket {
  constructor(startX, startY, targetX, targetY, color) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    const angle = Math.atan2(targetY - startY, targetX - startX);
    const dist = Math.hypot(targetX - startX, targetY - startY);
    this.speed = 10 + Math.random() * 4;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.dead = false;
    this.distanceTraveled = 0;
    this.totalDistance = dist;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.distanceTraveled += this.speed;
    if (this.distanceTraveled >= this.totalDistance || this.y <= this.targetY) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class FireworksManager {
  constructor() {
    this.rockets = [];
    this.particles = [];
    this.colors = ['#ff3366', '#33ccff', '#ffdd00', '#33ff99', '#ff9933', '#cc66ff', '#ffffff'];
    this.autoTimer = 0;
  }

  launch(targetX, targetY, color = null) {
    const startX = targetX + (Math.random() * 80 - 40);
    const startY = window.innerHeight;
    const c = color || this.colors[Math.floor(Math.random() * this.colors.length)];
    this.rockets.push(new FireworkRocket(startX, startY, targetX, targetY, c));
    sound.playFirework();
  }

  explode(x, y, color) {
    const count = 50 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.2 - 0.1);
      const speed = 2 + Math.random() * 6;
      const decay = 0.012 + Math.random() * 0.018;
      this.particles.push(new FireworkParticle(x, y, color, angle, speed, decay));
    }
  }

  update(isNight = true) {
    // Auto launch fireworks at night periodically
    if (isNight) {
      this.autoTimer++;
      if (this.autoTimer > 180) { // ~3 seconds
        this.autoTimer = 0;
        const tx = window.innerWidth * (0.15 + Math.random() * 0.7);
        const ty = window.innerHeight * (0.1 + Math.random() * 0.35);
        this.launch(tx, ty);
      }
    }

    // Update rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.update();
      if (r.dead) {
        this.explode(r.x, r.y, r.color);
        this.rockets.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.rockets.forEach(r => r.draw(ctx));
    this.particles.forEach(p => p.draw(ctx));
  }
}
