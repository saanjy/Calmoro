// Simple synthesizer for White Noise and Brown Noise
let audioCtx: AudioContext | null = null;
let noiseSource: AudioBufferSourceNode | null = null;
let gainNode: GainNode | null = null;

export const initAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playNotificationSound = () => {
  initAudioContext();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
  oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5); // Drop to A4
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
};

export const stopBackgroundNoise = () => {
  if (noiseSource) {
    noiseSource.stop();
    noiseSource.disconnect();
    noiseSource = null;
  }
};

export const playBackgroundNoise = (type: 'white' | 'brown') => {
  initAudioContext();
  if (!audioCtx) return;

  // Stop existing noise first
  stopBackgroundNoise();

  const bufferSize = audioCtx.sampleRate * 2; // 2 seconds buffer
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'brown') {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Compensate for gain
    }
  }

  noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  gainNode = audioCtx.createGain();
  // Low volume for background
  gainNode.gain.value = 0.05; 

  noiseSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  noiseSource.start();
};
