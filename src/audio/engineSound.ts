/**
 * Web Audio API procedural sound synthesizer for AURA SPECTRE V12
 * Features:
 * - Sub-harmonic V12 cylinder firing simulation
 * - Dynamic RPM ramp on throttle/rev
 * - Twin-turbo blow-off & spool bandpass noise
 * - 800V electric inverter harmonic whine
 */

class EngineSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;

  // Oscillators & Filters
  private v12Osc1: OscillatorNode | null = null;
  private v12Osc2: OscillatorNode | null = null;
  private v12Osc3: OscillatorNode | null = null;
  private v12Gain: GainNode | null = null;
  private electricWhine: OscillatorNode | null = null;
  private electricGain: GainNode | null = null;
  private turboNoiseNode: AudioBufferSourceNode | null = null;
  private turboFilter: BiquadFilterNode | null = null;
  private turboGain: GainNode | null = null;

  private currentRpm: number = 950; // idle 950 RPM
  private targetRpm: number = 950;
  private animFrameId: number | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupV12Engine();
      this.setupElectricMotor();
      this.setupTurboSpool();

      this.startRpmLoop();
      this.isRunning = true;
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  private setupV12Engine() {
    if (!this.ctx || !this.masterGain) return;

    // V12 fundamental tones: 12 cylinders = 6 firing pulses per crankshaft revolution
    // 950 RPM / 60 * 6 = ~95 Hz base firing freq
    this.v12Osc1 = this.ctx.createOscillator();
    this.v12Osc1.type = 'sawtooth';
    this.v12Osc1.frequency.setValueAtTime(45, this.ctx.currentTime);

    this.v12Osc2 = this.ctx.createOscillator();
    this.v12Osc2.type = 'triangle';
    this.v12Osc2.frequency.setValueAtTime(90, this.ctx.currentTime);

    this.v12Osc3 = this.ctx.createOscillator();
    this.v12Osc3.type = 'sine';
    this.v12Osc3.frequency.setValueAtTime(135, this.ctx.currentTime);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(320, this.ctx.currentTime);
    lowpass.Q.setValueAtTime(2.5, this.ctx.currentTime);

    this.v12Gain = this.ctx.createGain();
    this.v12Gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    this.v12Osc1.connect(lowpass);
    this.v12Osc2.connect(lowpass);
    this.v12Osc3.connect(lowpass);
    lowpass.connect(this.v12Gain);
    this.v12Gain.connect(this.masterGain);

    this.v12Osc1.start();
    this.v12Osc2.start();
    this.v12Osc3.start();
  }

  private setupElectricMotor() {
    if (!this.ctx || !this.masterGain) return;

    this.electricWhine = this.ctx.createOscillator();
    this.electricWhine.type = 'sine';
    this.electricWhine.frequency.setValueAtTime(800, this.ctx.currentTime);

    this.electricGain = this.ctx.createGain();
    this.electricGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

    this.electricWhine.connect(this.electricGain);
    this.electricGain.connect(this.masterGain);

    this.electricWhine.start();
  }

  private setupTurboSpool() {
    if (!this.ctx || !this.masterGain) return;

    // White noise buffer for turbo airflow
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.turboFilter = this.ctx.createBiquadFilter();
    this.turboFilter.type = 'bandpass';
    this.turboFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    this.turboFilter.Q.setValueAtTime(8, this.ctx.currentTime);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

    whiteNoise.connect(this.turboFilter);
    this.turboFilter.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);

    whiteNoise.start();
    this.turboNoiseNode = whiteNoise;
  }

  private lastRpm: number = 950;

  private startRpmLoop() {
    const update = () => {
      // Smoothly approach target RPM
      const diff = this.targetRpm - this.currentRpm;
      this.currentRpm += diff * (this.targetRpm > this.currentRpm ? 0.08 : 0.05);

      // Check if throttle just dropped from high RPM -> trigger blow-off valve
      if (this.lastRpm > 5500 && this.targetRpm <= 1200 && this.currentRpm > 4000) {
        this.playBlowOffValve();
      }
      this.lastRpm = this.currentRpm;

      if (this.ctx && this.ctx.state === 'running') {
        const time = this.ctx.currentTime;
        const normalizedRpm = Math.min(1, Math.max(0, (this.currentRpm - 900) / 8300)); // 0 to 1

        // Base frequency calculation (V12 cylinder firing frequency)
        const baseFreq = 38 + (this.currentRpm / 60) * 1.8;
        if (this.v12Osc1) this.v12Osc1.frequency.setTargetAtTime(baseFreq, time, 0.05);
        if (this.v12Osc2) this.v12Osc2.frequency.setTargetAtTime(baseFreq * 1.8, time, 0.05);
        if (this.v12Osc3) this.v12Osc3.frequency.setTargetAtTime(baseFreq * 3.1, time, 0.05);

        // Electric motor pitch ramps with rpm
        if (this.electricWhine) {
          this.electricWhine.frequency.setTargetAtTime(600 + normalizedRpm * 3800, time, 0.05);
        }
        if (this.electricGain) {
          this.electricGain.gain.setTargetAtTime(0.01 + normalizedRpm * 0.1, time, 0.05);
        }

        // Turbo filter frequency & volume ramps with RPM (spool sound)
        if (this.turboFilter && this.turboGain) {
          this.turboFilter.frequency.setTargetAtTime(1400 + normalizedRpm * 4800, time, 0.05);
          this.turboGain.gain.setTargetAtTime(0.005 + Math.pow(normalizedRpm, 1.4) * 0.14, time, 0.05);
        }

        // V12 gain increases under load
        if (this.v12Gain) {
          this.v12Gain.gain.setTargetAtTime(0.2 + normalizedRpm * 0.4, time, 0.05);
        }
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    this.animFrameId = requestAnimationFrame(update);
  }

  public setThrottle(isRevving: boolean) {
    this.targetRpm = isRevving ? 8200 : 950;
  }

  public setNitro(isNitro: boolean) {
    this.targetRpm = isNitro ? 9200 : 950;
    if (isNitro) {
      this.playNitroWhoosh();
    }
  }

  public toggleMute(): boolean {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime, 0.05);
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getRpm(): number {
    return Math.round(this.currentRpm);
  }

  /**
   * Procedural Blow-Off Valve (Twin-turbo pneumatic release psshhhh)
   */
  public playBlowOffValve() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // White noise buffer for pneumatic discharge
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.55);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.4);
      filter.Q.setValueAtTime(3.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.52);
    } catch {
      // ignore
    }
  }

  /**
   * Procedural Door Hydraulics & Pneumatic Actuator Sound
   */
  public playDoorHydraulics(isOpen: boolean) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 0.65;

      // 1. Pneumatic Air Hiss
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(isOpen ? 2200 : 1800, now);
      bandpass.frequency.linearRampToValueAtTime(isOpen ? 1200 : 2400, now + duration);
      bandpass.Q.setValueAtTime(4.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.masterGain || this.ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + duration);

      // 2. Mechanical Servo / Hydraulic Whirr
      const servoOsc = this.ctx.createOscillator();
      servoOsc.type = 'sawtooth';
      servoOsc.frequency.setValueAtTime(isOpen ? 140 : 220, now);
      servoOsc.frequency.exponentialRampToValueAtTime(isOpen ? 240 : 110, now + duration);

      const servoFilter = this.ctx.createBiquadFilter();
      servoFilter.type = 'lowpass';
      servoFilter.frequency.setValueAtTime(380, now);

      const servoGain = this.ctx.createGain();
      servoGain.gain.setValueAtTime(0.04, now);
      servoGain.gain.linearRampToValueAtTime(0.06, now + duration * 0.5);
      servoGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      servoOsc.connect(servoFilter);
      servoFilter.connect(servoGain);
      servoGain.connect(this.masterGain || this.ctx.destination);
      servoOsc.start(now);
      servoOsc.stop(now + duration);
    } catch {
      // ignore
    }
  }

  /**
   * Nitro Overboost Ignition & Whoosh
   */
  public playNitroWhoosh() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.35);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // ignore
    }
  }

  /**
   * UI Sound: Click
   */
  public playUiClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // ignore
    }
  }

  /**
   * UI Sound: Feature Activation
   */
  public playUiActivation() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.09); // D6

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }

  /**
   * UI Sound: Confirmation Chime
   */
  public playUiConfirm() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // High-grade twin chime: E5 (659.25Hz) -> B5 (987.77Hz)
      [659.25, 987.77].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  public playClickBeep() {
    this.playUiClick();
  }

  public playActivationChime() {
    this.playUiActivation();
  }

  public playConfirmationBeep() {
    this.playUiConfirm();
  }

  public triggerNitro() {
    this.setNitro(true);
    setTimeout(() => {
      this.setNitro(false);
    }, 1200);
  }

  public playStartupChime() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  public destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const engineSound = new EngineSoundSynthesizer();
