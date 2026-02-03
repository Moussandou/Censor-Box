// Sound generation using Web Audio API with more realistic mechanical sounds
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
}

function playNoise(duration: number, volume: number = 0.1) {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    oscillator.stop(ctx.currentTime + duration);
}

export const sounds = {
    correct: () => {
        // Satisfying ding
        playTone(880, 0.08, 'sine', 0.25);
        setTimeout(() => playTone(1320, 0.12, 'sine', 0.2), 50);
    },
    wrong: () => {
        // Buzzer
        playTone(150, 0.15, 'sawtooth', 0.15);
        playNoise(0.1, 0.15);
    },
    skip: () => {
        // Whoosh/slide
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    },
    keyPress: () => {
        // Mechanical click
        playNoise(0.03, 0.2);
        playTone(1200, 0.02, 'square', 0.05);
    },
    gameOver: () => {
        // Descending sad tones
        playTone(440, 0.2, 'sine', 0.25);
        setTimeout(() => playTone(349, 0.2, 'sine', 0.25), 150);
        setTimeout(() => playTone(262, 0.4, 'sine', 0.25), 300);
    },
    tick: () => {
        playTone(800, 0.02, 'sine', 0.08);
    },
    start: () => {
        // Start game sound
        playTone(523, 0.1, 'sine', 0.2);
        setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 80);
        setTimeout(() => playTone(784, 0.15, 'sine', 0.2), 160);
    }
};
