/* ──────────────────────────────────────────────────────
   SoundEngine  –  Procedural audio via Web Audio API
   No external files needed – everything is synthesized.
   ────────────────────────────────────────────────────── */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.ambientNode = null;
        this.masterGain = null;
        this._resumed = false;
    }

    /** Call once after a user gesture (click / keydown) */
    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.45;
        this.masterGain.connect(this.ctx.destination);
    }

    /** Resume AudioContext (browsers require user gesture) */
    resume() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this._resumed = true;
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) this.stopAmbient();
        return this.enabled;
    }

    /* ── helpers ────────────────────────────────────────── */

    _osc(type, freq, startTime, duration, gainVal = 0.25) {
        if (!this.ctx || !this.enabled) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gainVal, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(g).connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    _noise(startTime, duration, gainVal = 0.06) {
        if (!this.ctx || !this.enabled) return;
        const bufLen = this.ctx.sampleRate * duration;
        const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(gainVal, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        src.connect(g).connect(this.masterGain);
        src.start(startTime);
        src.stop(startTime + duration);
    }

    /* ── public sounds ─────────────────────────────────── */

    click() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 1800, t, 0.06, 0.10);
    }

    correct() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 523, t, 0.15, 0.22);
        this._osc('sine', 659, t + 0.10, 0.15, 0.22);
        this._osc('sine', 784, t + 0.20, 0.25, 0.25);
    }

    wrong() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sawtooth', 180, t, 0.20, 0.12);
        this._osc('sawtooth', 140, t + 0.12, 0.25, 0.12);
        this._noise(t, 0.30, 0.04);
    }

    levelUp() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        const notes = [523, 587, 659, 784, 880, 1047];
        notes.forEach((f, i) => {
            this._osc('sine', f, t + i * 0.09, 0.18, 0.18);
            this._osc('triangle', f * 2, t + i * 0.09, 0.12, 0.06);
        });
    }

    npcArrive() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 880, t, 0.08, 0.12);
        this._osc('sine', 1100, t + 0.08, 0.12, 0.12);
    }

    gameOver() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 440, t, 0.35, 0.18);
        this._osc('sine', 350, t + 0.30, 0.35, 0.18);
        this._osc('sine', 262, t + 0.60, 0.60, 0.20);
        this._noise(t + 0.50, 0.50, 0.03);
    }

    victory() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        const fanfare = [523, 659, 784, 1047, 784, 1047];
        fanfare.forEach((f, i) => {
            this._osc('sine', f, t + i * 0.12, 0.22, 0.20);
            this._osc('triangle', f * 1.5, t + i * 0.12, 0.16, 0.06);
        });
    }

    typing() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        for (let i = 0; i < 5; i++) {
            this._osc('square', 2400 + Math.random() * 600, t + i * 0.06, 0.03, 0.03);
        }
    }

    tick() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 1000, t, 0.04, 0.08);
    }

    /* ── NEW: Discovery sound (finding tips/collectibles) ── */
    discover() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 660, t, 0.10, 0.15);
        this._osc('sine', 880, t + 0.08, 0.12, 0.15);
        this._osc('triangle', 1320, t + 0.16, 0.18, 0.10);
    }

    /* ── NEW: Tension sound (cyber attack events) ── */
    tension() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sawtooth', 100, t, 0.8, 0.08);
        this._osc('sawtooth', 95, t + 0.1, 0.7, 0.08);
        this._noise(t, 0.6, 0.03);
        // Descending ominous tone
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.8);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
        osc.connect(g).connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 1.0);
    }

    /* ── NEW: Consequence reveal sound ── */
    consequence() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        // Dramatic reveal chord
        this._osc('sine', 262, t, 0.4, 0.12);
        this._osc('sine', 330, t + 0.05, 0.35, 0.12);
        this._osc('sine', 392, t + 0.10, 0.30, 0.10);
        this._osc('triangle', 524, t + 0.20, 0.40, 0.08);
    }

    /* ── NEW: Email red flag click sound ── */
    emailClick() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 1400, t, 0.05, 0.12);
        this._osc('sine', 1800, t + 0.04, 0.06, 0.10);
    }

    /* ── NEW: Pop sound for speech bubbles ── */
    pop() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 400, t, 0.06, 0.12);
        this._osc('sine', 600, t + 0.03, 0.04, 0.08);
    }

    /* ── NEW: Branching choice reveal ── */
    branchReveal() {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        this._osc('sine', 440, t, 0.12, 0.10);
        this._osc('triangle', 550, t + 0.08, 0.15, 0.08);
        this._osc('sine', 660, t + 0.16, 0.20, 0.10);
    }

    /* ── ambient loop ──────────────────────────────────── */

    startAmbient() {
        if (!this.ctx || !this.enabled || this.ambientNode) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 85;
        g.gain.value = 0.025;
        // subtle LFO modulation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 8;
        lfo.connect(lfoGain).connect(osc.frequency);
        lfo.start();
        osc.connect(g).connect(this.masterGain);
        osc.start();
        this.ambientNode = { osc, lfo, g };
    }

    stopAmbient() {
        if (this.ambientNode) {
            try { this.ambientNode.osc.stop(); } catch (e) { }
            try { this.ambientNode.lfo.stop(); } catch (e) { }
            this.ambientNode = null;
        }
    }
}

// Global singleton
window.soundEngine = new SoundEngine();
