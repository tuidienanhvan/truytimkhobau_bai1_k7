// Audio Context Singleton
let audioCtx: AudioContext | null = null;
let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let lfoOsc: OscillatorNode | null = null;

// Export for visibility handler
export const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Audio Context Unlocker
export const unlockAudioContext = () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
            console.log("Audio Context Resumed");
        });
    }
};

export const toggleAmbientSound = (shouldPlay: boolean) => {
    try {
        const ctx = getAudioContext();
        
        if (shouldPlay) {
            if (ctx.state === 'suspended') ctx.resume();
            if (ambientOsc) return;

            // Engine Drone
            ambientOsc = ctx.createOscillator();
            ambientGain = ctx.createGain();
            lfoOsc = ctx.createOscillator();
            const lfoGain = ctx.createGain();

            ambientOsc.type = 'sawtooth';
            ambientOsc.frequency.value = 60;
            lfoOsc.type = 'sine';
            lfoOsc.frequency.value = 0.5;
            lfoGain.gain.value = 20;

            ambientGain.gain.value = 0.05;

            lfoOsc.connect(lfoGain);
            lfoGain.connect(ambientOsc.frequency);
            ambientOsc.connect(ambientGain);
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            ambientGain.connect(filter);
            filter.connect(ctx.destination);

            ambientOsc.start();
            lfoOsc.start();
        } else {
            if (ambientOsc) {
                ambientGain?.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
                const oscToStop = ambientOsc;
                const lfoToStop = lfoOsc;
                setTimeout(() => {
                    oscToStop?.stop();
                    lfoToStop?.stop();
                    oscToStop?.disconnect();
                }, 600);
            }
            ambientOsc = null;
            ambientGain = null;
            lfoOsc = null;
        }
    } catch (e) {
        console.warn("Ambient sound error:", e);
    }
};

export const playSound = (type: 'correct' | 'wrong' | 'start' | 'select' | 'tick' | 'win' | 'lose' | 'lifeline' | 'click' | 'heartbeat') => {
  try {
    const ctx = getAudioContext();
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
        // Tiếng tim đập trầm, mạnh (Cinematic Heartbeat)
        osc.type = 'triangle'; // Tam giác để có chút gai góc nhưng vẫn trầm
        osc.frequency.setValueAtTime(60, now); // Bắt đầu ở 60Hz
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15); // Tụt nhanh xuống 30Hz
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.8, now + 0.02); // Attack nhanh
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4); // Decay dài hơn chút để tạo độ vang
        
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      default:
        // Simple blip
        osc.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    }
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};