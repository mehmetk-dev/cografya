// Procedural Web Audio API Sound Synthesizer for Lunapark Arcade
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.thrustOsc = null;
    this.thrustGain = null;

    // Coaster Audio
    this.coasterNoise = null;
    this.coasterGain = null;
    this.coasterFilter = null;
    this.chainTimer = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
      this.stopEngine();
      this.stopThrust();
      this.stopCoasterAudio();
    }
    return this.isMuted;
  }

  // Generic note tone generator
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, pitchBend = 0) {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (pitchBend !== 0) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, freq + pitchBend), now + duration);
    }

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Noise generator
  playNoise(duration = 0.3, gainVal = 0.15, bandpassFreq = 800) {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(bandpassFreq, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Coaster track rumble audio
  startCoasterAudio() {
    if (this.isMuted || this.coasterNoise) return;
    this.init();
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.coasterNoise = this.ctx.createBufferSource();
    this.coasterNoise.buffer = buffer;
    this.coasterNoise.loop = true;

    this.coasterFilter = this.ctx.createBiquadFilter();
    this.coasterFilter.type = 'lowpass';
    this.coasterFilter.frequency.setValueAtTime(300, now);

    this.coasterGain = this.ctx.createGain();
    this.coasterGain.gain.setValueAtTime(0.01, now);

    this.coasterNoise.connect(this.coasterFilter);
    this.coasterFilter.connect(this.coasterGain);
    this.coasterGain.connect(this.ctx.destination);

    this.coasterNoise.start(now);
  }

  updateCoasterAudio(speedRatio = 0, isChainLift = false) {
    if (!this.coasterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const targetFreq = 200 + speedRatio * 1600;
    const targetGain = Math.min(0.22, 0.02 + speedRatio * 0.2);

    this.coasterFilter.frequency.setTargetAtTime(targetFreq, now, 0.05);
    this.coasterGain.gain.setTargetAtTime(targetGain, now, 0.05);

    // Chain lift ratchet sound
    if (isChainLift) {
      this.chainTimer++;
      if (this.chainTimer > 8) {
        this.chainTimer = 0;
        this.playTone(600, 'triangle', 0.03, 0.08, -200);
      }
    }
  }

  stopCoasterAudio() {
    if (this.coasterNoise) {
      try {
        this.coasterNoise.stop();
        this.coasterNoise.disconnect();
      } catch (e) {}
      this.coasterNoise = null;
      this.coasterGain = null;
      this.coasterFilter = null;
    }
  }

  // Train steam whistle: two tones
  playTrainWhistle() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const dur = 0.8;

    [698.46, 880.00].forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.linearRampToValueAtTime(f * 1.05, now + 0.3);
      osc.frequency.linearRampToValueAtTime(f * 0.98, now + dur);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    });
  }

  // Firework launch and explosion
  playFirework() {
    if (this.isMuted) return;
    this.playTone(300, 'triangle', 0.25, 0.08, 600);
    setTimeout(() => {
      this.playNoise(0.5, 0.35, 400);
      this.playTone(80, 'sine', 0.4, 0.25, -50);
      setTimeout(() => {
        this.playNoise(0.2, 0.1, 1500);
      }, 100);
    }, 220);
  }

  // Coin / Ticket pickup
  playTicket() {
    this.playTone(987.77, 'sine', 0.1, 0.12);
    setTimeout(() => {
      this.playTone(1318.51, 'sine', 0.2, 0.12);
    }, 80);
  }

  playClick() {
    this.playTone(800, 'sine', 0.04, 0.08, -300);
  }

  playPowerup() {
    const notes = [440, 554, 659, 880];
    notes.forEach((f, idx) => {
      setTimeout(() => {
        this.playTone(f, 'square', 0.08, 0.06);
      }, idx * 45);
    });
  }

  playBumper() {
    this.playTone(520, 'sine', 0.18, 0.18, 200);
    this.playTone(260, 'triangle', 0.15, 0.12, -80);
  }

  playFlipper() {
    this.playTone(300, 'triangle', 0.05, 0.1, -150);
  }

  playCannon() {
    this.playNoise(0.3, 0.3, 300);
    this.playTone(120, 'sine', 0.25, 0.25, -90);
  }

  playHit() {
    this.playNoise(0.18, 0.2, 1200);
    this.playTone(700, 'triangle', 0.1, 0.1, -400);
  }

  // Car Engine loop
  startEngine() {
    if (this.isMuted || this.engineOsc) return;
    this.init();
    const now = this.ctx.currentTime;
    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();

    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(55, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    this.engineGain.gain.setValueAtTime(0.04, now);

    this.engineOsc.connect(filter);
    filter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineOsc.start(now);
  }

  updateEngine(speedRatio = 0, isDrifting = false) {
    if (!this.engineOsc || this.isMuted) return;
    const targetFreq = 50 + speedRatio * 160;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
    if (isDrifting && Math.random() < 0.25) {
      this.playTireSkid();
    }
  }

  stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch (e) {}
      this.engineOsc = null;
      this.engineGain = null;
    }
  }

  playTireSkid() {
    this.playNoise(0.1, 0.08, 1400);
  }

  // Rocket Thruster sound
  startThrust() {
    if (this.isMuted || this.thrustOsc) return;
    this.init();
    const now = this.ctx.currentTime;
    this.thrustOsc = this.ctx.createOscillator();
    this.thrustGain = this.ctx.createGain();

    this.thrustOsc.type = 'triangle';
    this.thrustOsc.frequency.setValueAtTime(90, now);

    this.thrustGain.gain.setValueAtTime(0.08, now);

    this.thrustOsc.connect(this.thrustGain);
    this.thrustGain.connect(this.ctx.destination);
    this.thrustOsc.start(now);
  }

  stopThrust() {
    if (this.thrustOsc) {
      try {
        this.thrustOsc.stop();
        this.thrustOsc.disconnect();
      } catch (e) {}
      this.thrustOsc = null;
      this.thrustGain = null;
    }
  }

  playGameOver() {
    const notes = [392, 349, 329, 261];
    notes.forEach((f, idx) => {
      setTimeout(() => {
        this.playTone(f, 'sawtooth', 0.2, 0.1, -10);
      }, idx * 130);
    });
  }

  playVictory() {
    const notes = [261.6, 329.6, 392.0, 523.2, 659.2, 784.0];
    notes.forEach((f, idx) => {
      setTimeout(() => {
        this.playTone(f, 'triangle', 0.15, 0.12);
      }, idx * 90);
    });
  }

  // Carnival Organ Background Music
  startBGM() {
    if (this.bgmPlaying || this.isMuted) return;
    this.init();
    this.bgmPlaying = true;

    const melody = [
      { f: 523.25, d: 0.25 },
      { f: 587.33, d: 0.25 },
      { f: 659.25, d: 0.25 },
      { f: 698.46, d: 0.25 },
      { f: 784.00, d: 0.4 },
      { f: 659.25, d: 0.25 },
      { f: 784.00, d: 0.4 },
      { f: 1046.5, d: 0.5 },
      { f: 880.00, d: 0.25 },
      { f: 784.00, d: 0.25 },
      { f: 659.25, d: 0.25 },
      { f: 587.33, d: 0.25 },
      { f: 523.25, d: 0.5 },
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.bgmPlaying) return;
      const note = melody[noteIdx % melody.length];
      this.playTone(note.f, 'triangle', note.d * 0.9, 0.04);
      noteIdx++;
      this.bgmTimer = setTimeout(playNext, note.d * 1000 * 1.3);
    };

    playNext();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleBGM() {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }
}

export const sound = new SoundManager();
