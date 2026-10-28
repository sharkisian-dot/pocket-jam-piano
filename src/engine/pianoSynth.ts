export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class PianoSynth {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playNote(midi: number, duration = 0.85, velocity = 0.22, delaySec = 0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySec;
    const freq = midiToFrequency(midi);

    // Warm electric/acoustic hybrid piano voice
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.18, now);
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 5.5, 4200), now);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(freq * 1.6, 400),
      now + duration
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(velocity, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(velocity * 0.35, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.03);
    osc2.stop(now + duration + 0.03);
  }

  public playChord(midiNotes: number[], strumMs = 24) {
    if (this.isMuted) return;
    midiNotes.forEach((midi, idx) => {
      this.playNote(midi, 1.25, 0.17, (idx * strumMs) / 1000);
    });
  }

  public playScaleRun(midiNotes: number[], stepMs = 135) {
    if (this.isMuted) return;
    midiNotes.forEach((midi, idx) => {
      this.playNote(midi, 0.45, 0.2, (idx * stepMs) / 1000);
    });
  }
}

export const pianoSynth = new PianoSynth();
