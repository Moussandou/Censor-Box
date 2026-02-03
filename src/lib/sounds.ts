// Typewriter sound effects using Web Audio API
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
}

// Create typewriter key strike sound
function typewriterKey(volume: number = 0.3) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Click noise (hammer hitting paper)
    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        // Sharp attack, quick decay
        const envelope = Math.exp(-i / (bufferSize * 0.08));
        output[i] = (Math.random() * 2 - 1) * envelope;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass for mechanical click
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2500;
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.05);

    // Metallic resonance
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 3000 + Math.random() * 500;
    oscGain.gain.setValueAtTime(volume * 0.15, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
}

// Typewriter carriage return / ding
function typewriterDing(volume: number = 0.25) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 2000;

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
}

// Error buzz
function typewriterJam(volume: number = 0.2) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 80;

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
}

// Paper slide sound
function paperSlide(volume: number = 0.15) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.1);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        // Soft friction noise
        const envelope = Math.sin((i / bufferSize) * Math.PI);
        output[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1500;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
}

export const sounds = {
    correct: () => {
        typewriterKey(0.25);
        setTimeout(() => typewriterDing(0.2), 50);
    },
    wrong: () => {
        typewriterJam(0.2);
    },
    skip: () => {
        paperSlide(0.15);
    },
    keyPress: () => {
        typewriterKey(0.3);
    },
    gameOver: () => {
        // Multiple keys jammed
        typewriterJam(0.25);
        setTimeout(() => typewriterJam(0.2), 100);
        setTimeout(() => typewriterJam(0.15), 200);
    },
    tick: () => {
        typewriterKey(0.08);
    },
    start: () => {
        // Carriage return sound
        paperSlide(0.2);
        setTimeout(() => typewriterDing(0.25), 150);
    }
};
