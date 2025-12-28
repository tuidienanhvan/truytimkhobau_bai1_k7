
// 50, 52. AudioManager Singleton
class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private wasRunningBeforeHidden = false;

  getContext(): AudioContext {
    if (!this.context || this.context.state === 'closed') {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
    }
    return this.context;
  }

  // 51. Unlock
  async unlock(): Promise<void> {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
      console.log("[Audio] Context Resumed");
    }
  }

  // 50. Pause/Resume logic
  async pause(): Promise<void> {
    if (this.context && this.context.state === 'running') {
      this.wasRunningBeforeHidden = true;
      await this.context.suspend();
    }
  }

  async resume(): Promise<void> {
    if (this.context && this.wasRunningBeforeHidden && this.context.state === 'suspended') {
      await this.context.resume();
      this.wasRunningBeforeHidden = false;
    }
  }

  destroy(): void {
    if (this.context && this.context.state !== 'closed') {
      this.context.close();
    }
    this.context = null;
  }

  // --- Logic cũ chuyển vào Class ---
  toggleAmbient(shouldPlay: boolean) {
     try {
        const ctx = this.getContext();
        
        if (shouldPlay) {
            if (ctx.state === 'suspended') ctx.resume();
            if (this.ambientOsc) return;

            this.ambientOsc = ctx.createOscillator();
            this.ambientGain = ctx.createGain();
            this.lfoOsc = ctx.createOscillator();
            const lfoGain = ctx.createGain();

            this.ambientOsc.type = 'sawtooth';
            this.ambientOsc.frequency.value = 60;
            this.lfoOsc.type = 'sine';
            this.lfoOsc.frequency.value = 0.5;
            lfoGain.gain.value = 20;

            this.ambientGain.gain.value = 0.05;

            this.lfoOsc.connect(lfoGain);
            lfoGain.connect(this.ambientOsc.frequency);
            this.ambientOsc.connect(this.ambientGain);
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            this.ambientGain.connect(filter);
            filter.connect(ctx.destination); // Connect to ctx destination (bypass master for ambient if wanted, or masterGain)

            this.ambientOsc.start();
            this.lfoOsc.start();
        } else {
            if (this.ambientOsc) {
                this.ambientGain?.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
                const oscToStop = this.ambientOsc;
                const lfoToStop = this.lfoOsc;
                setTimeout(() => {
                    oscToStop?.stop();
                    lfoToStop?.stop();
                    oscToStop?.disconnect();
                }, 600);
            }
            this.ambientOsc = null;
            this.ambientGain = null;
            this.lfoOsc = null;
        }
    } catch (e) {
        console.warn("Ambient sound error:", e);
    }
  }

  play(type: 'correct' | 'wrong' | 'start' | 'select' | 'tick' | 'win' | 'lose' | 'lifeline' | 'click' | 'heartbeat') {
    try {
        const ctx = this.getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
        case 'start':
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.5);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
            osc.start(now);
            osc.stop(now + 1.5);
            break;
        case 'correct':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
        case 'wrong':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.5);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
        case 'win':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.5);
            gainNode.gain.setValueAtTime(0.3, now);
            osc.start(now);
            osc.stop(now + 2);
            break;
        case 'lose':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(100, now + 1);
            gainNode.gain.setValueAtTime(0.3, now);
            osc.start(now);
            osc.stop(now + 1);
            break;
        case 'heartbeat':
            osc.type = 'triangle'; 
            osc.frequency.setValueAtTime(60, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.8, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
        default:
            osc.frequency.setValueAtTime(800, now);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    } catch (e) {
        console.warn("Audio play failed", e);
    }
  }
}

export const audioManager = new AudioManager();

// Wrapper functions for backward compatibility
export const unlockAudioContext = () => audioManager.unlock();
export const toggleAmbientSound = (shouldPlay: boolean) => audioManager.toggleAmbient(shouldPlay);
export const playSound = (type: any) => audioManager.play(type);
