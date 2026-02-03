import { useRef, useCallback, useState, useEffect } from 'react';
import { Screen } from '../Screen/Screen';
import { Keyboard } from '../Keyboard/Keyboard';
import { BootSequence } from '../BootSequence/BootSequence';
import './Device.css';

export const Device = () => {
    const inputHandlerRef = useRef<((keyId: number) => void) | null>(null);

    // Power State: 'on' | 'off'
    // 'boot' logic is now handled by showBoot content state
    const [powerState, setPowerState] = useState<'on' | 'off'>('on');
    const [showBoot, setShowBoot] = useState(true);

    const [resetKey, setResetKey] = useState(0);
    // Initialize mute state from localStorage
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('gameMuted');
        return saved ? JSON.parse(saved) : false;
    });
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element for background music
        audioRef.current = new Audio('/src/assets/Investigation Music Background  Suspenseful Tension Criminal Background Music Royalty Free.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        // Apply initial mute state
        audioRef.current.muted = isMuted;

        // Autoplay logic
        const startMusic = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(() => { });
            }
            document.removeEventListener('click', startMusic);
            document.removeEventListener('keydown', startMusic);
        };

        document.addEventListener('click', startMusic);
        document.addEventListener('keydown', startMusic);

        return () => {
            document.removeEventListener('click', startMusic);
            document.removeEventListener('keydown', startMusic);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
        localStorage.setItem('gameMuted', JSON.stringify(isMuted));
    }, [isMuted]);

    const handleKeyPress = useCallback((keyId: number) => {
        if (inputHandlerRef.current) {
            inputHandlerRef.current(keyId);
        }
    }, []);

    const setInputHandler = useCallback((handler: (keyId: number) => void) => {
        inputHandlerRef.current = handler;
    }, []);

    const handleReset = () => {
        // Trigger CRT OFF animation
        setPowerState('off');

        // Wait for animation, then Reboot
        setTimeout(() => {
            setResetKey(prev => prev + 1);
            setShowBoot(true); // Go back to boot
            setPowerState('on'); // Animates back in
        }, 600);
    };

    const toggleMute = () => {
        setIsMuted((prev: boolean) => !prev);
    };

    const handleBootComplete = () => {
        setShowBoot(false);
    };

    return (
        <div className="scene">
            <div className="bg-elements">
                <div className="bg-folder f1">TOP SECRET</div>
                <div className="bg-folder f2">CONFIDENTIAL</div>
                <div className="bg-item pen"></div>
            </div>

            <div className="rdctd-console">
                <div className="post-it p1">DO NOT<br />LEAK</div>
                <div className="post-it p2">EYES<br />ONLY</div>

                <div className="console-body">
                    <div className="brand-header">
                        <img src="/src/assets/logo.png" alt="" className="brand-logo" />
                        <span className="brand-text">CENSOR BOX <span className="tm">™</span></span>

                        <button
                            className="control-keycap kbc-button kbc-button-dark"
                            onClick={toggleMute}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? '✕' : '♪'}
                        </button>
                        <button
                            className="control-keycap kbc-button kbc-button-dark"
                            onClick={handleReset}
                            title="Reset"
                        >
                            ↻
                        </button>
                    </div>

                    <div className="screen-housing">
                        {/* 
                            CRT Wrapper now surrounds BOTH Boot and Screen.
                            The 'key' on the wrapper triggers the 'on' animation when powerState changes to 'on'.
                             - When resetting: powerState -> 'off' (animates out).
                             - On timeout: powerState -> 'on', showBoot -> true. Wrapper re-renders/animates in, revealing Boot.
                        */}
                        <div
                            className={`crt-wrapper ${powerState === 'off' ? 'crt-off' : 'crt-on'}`}
                            style={{ width: '100%', height: '100%' }}
                            key={powerState === 'on' ? 'crt-on' : 'crt-off'}
                        >
                            {/* Inner content switcher */}
                            {powerState === 'on' && showBoot ? (
                                <BootSequence onComplete={handleBootComplete} />
                            ) : (
                                <Screen key={resetKey} onInputRef={setInputHandler} />
                            )}
                        </div>
                    </div>
                    <div className="control-deck">
                        <Keyboard onKeyPress={handleKeyPress} />
                    </div>
                </div>

                {/* 3D Sides/Thickness - purely decorative if needed or managed by CSS on rdctd-console */}
                <div className="chassis-side left"></div>
                <div className="chassis-side right"></div>
                <div className="chassis-side bottom"></div>
                <div className="chassis-side top"></div>
            </div>
        </div>
    );
};
